-- Apply AFTER 20260930_company_logos.sql. Reapply this migration last if older
-- request or directory migrations are ever rerun. No old migration is needed now.
begin;

-- Equipment requests are distinct from stone and service requests.
-- An earlier service-flow version added request_kind and service_application_id.
-- Keep targeted old requests private to their selected service company.
alter table public.mb_purchase_requests
  add column if not exists request_kind text not null default 'product',
  add column if not exists service_application_id uuid
    references public.mb_company_applications(id) on delete restrict;
alter table public.mb_purchase_requests drop constraint if exists mb_requests_kind_check;
alter table public.mb_purchase_requests drop constraint if exists mb_purchase_requests_format_check;
alter table public.mb_purchase_requests add constraint mb_purchase_requests_format_check
  check (format in ('slab', 'block', 'cut', 'machine', 'supplies', 'service'));
update public.mb_purchase_requests
set request_kind = case when format = 'service' then 'service' else 'product' end
where request_kind is distinct from case when format = 'service' then 'service' else 'product' end;
alter table public.mb_purchase_requests add constraint mb_requests_kind_check
  check (request_kind = case when format = 'service' then 'service' else 'product' end
    and (format = 'service' or service_application_id is null));
grant insert(request_kind, service_application_id) on public.mb_purchase_requests to authenticated;

drop policy if exists mb_requests_read on public.mb_purchase_requests;
create policy mb_requests_read on public.mb_purchase_requests for select to authenticated
using (
  buyer_id = (select auth.uid()) or
  (status = 'open' and (
    (format in ('slab', 'block', 'cut', 'machine', 'supplies') and (select public.mb_active_supplier(null))) or
    (format = 'service' and
      (select public.mb_active_service(service_application_id)))
  ))
);

drop policy if exists mb_requests_insert on public.mb_purchase_requests;
create policy mb_requests_insert on public.mb_purchase_requests for insert to authenticated
with check (
  (select public.mb_is_email_confirmed()) and buyer_id = (select auth.uid()) and status = 'open'
  and request_kind = case when format = 'service' then 'service' else 'product' end
  and service_application_id is null and (
    (format in ('slab', 'block', 'cut') and exists (
      select 1 from public.mb_profiles p
      where p.user_id = (select auth.uid()) and p.account_role = 'buyer'
    )) or
    (format in ('machine', 'supplies') and (
      exists (select 1 from public.mb_profiles p
              where p.user_id = (select auth.uid()) and p.account_role = 'buyer')
      or (select public.mb_active_supplier(null))
      or (select public.mb_active_service(null))
    )) or
    (format = 'service' and (select public.mb_active_supplier(null)))
  )
);

drop policy if exists mb_offers_insert on public.mb_offers;
create policy mb_offers_insert on public.mb_offers for insert to authenticated
with check (
  (select public.mb_is_email_confirmed()) and supplier_id = (select auth.uid()) and
  exists (
    select 1 from public.mb_purchase_requests r
    where r.id = request_id and r.status = 'open' and r.buyer_id <> (select auth.uid())
      and (
        (r.format <> 'service' and (select public.mb_active_supplier(application_id))) or
        (r.format = 'service' and
          (r.service_application_id is null or r.service_application_id = application_id)
          and (select public.mb_active_service(application_id)))
      )
  )
);

-- The older acceptance endpoint used request_kind and a target company.
-- Validate the current format while preserving the target on older records.
create or replace function mb_private.mb_accept_offer(p_offer_id uuid)
returns void language plpgsql security definer set search_path = ''
as $$
declare offer_row public.mb_offers%rowtype;
declare request_row public.mb_purchase_requests%rowtype;
begin
  select * into offer_row from public.mb_offers where id = p_offer_id for update;
  if offer_row.id is null then raise exception 'Offer not found'; end if;
  select * into request_row from public.mb_purchase_requests r
  where r.id = offer_row.request_id and r.buyer_id = auth.uid() and r.status = 'open';
  if request_row.id is null then raise exception 'Request not found'; end if;
  if not exists (
    select 1 from public.mb_company_applications a
    join public.mb_company_verifications v on v.application_id = a.id and v.verified
    join public.mb_company_memberships m on m.application_id = a.id
    where a.id = offer_row.application_id and a.owner_id = offer_row.supplier_id
      and a.account_role = case when request_row.format = 'service' then 'service' else 'supplier' end
      and (request_row.format <> 'service' or request_row.service_application_id is null
        or request_row.service_application_id = a.id)
      and m.started_at <= now() and m.ends_at > now()
  ) then raise exception 'Company membership is not active'; end if;
  if offer_row.accepted_at is null then
    update public.mb_offers set accepted_at = now() where id = p_offer_id;
  end if;
end;
$$;
revoke all on function mb_private.mb_accept_offer(uuid) from public, anon;
grant execute on function mb_private.mb_accept_offer(uuid) to authenticated;

-- Public catalogue assets contain marketing images and optional PDF brochures.
-- Official company verification files remain in their private bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('mb-catalog-assets', 'mb-catalog-assets', true, 10485760,
        array['image/png', 'image/jpeg', 'image/webp', 'application/pdf'])
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists mb_catalog_asset_owner_insert on storage.objects;
create policy mb_catalog_asset_owner_insert on storage.objects for insert to authenticated
with check (
  bucket_id = 'mb-catalog-assets'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and array_length(storage.foldername(name), 1) = 2
  and (storage.foldername(name))[2] ~ '^[0-9a-f-]{36}$'
  and storage.filename(name) ~ '^(photo-[0-9a-f-]{36}[.](png|jpg|jpeg|webp)|catalog-[0-9a-f-]{36}[.]pdf)$'
  and ((select public.mb_active_supplier(null)) or (select public.mb_active_service(null)))
);
drop policy if exists mb_catalog_asset_owner_select on storage.objects;
create policy mb_catalog_asset_owner_select on storage.objects for select to authenticated
using (bucket_id = 'mb-catalog-assets' and
       (storage.foldername(name))[1] = (select auth.uid()::text));
drop policy if exists mb_catalog_asset_owner_delete on storage.objects;
create policy mb_catalog_asset_owner_delete on storage.objects for delete to authenticated
using (bucket_id = 'mb-catalog-assets' and
       (storage.foldername(name))[1] = (select auth.uid()::text));

create or replace function mb_private.mb_valid_catalog_paths(
  p_owner uuid, p_item uuid, p_photos text[], p_pdf text)
returns boolean language sql immutable set search_path = ''
as $$
  select cardinality(p_photos) between 3 and 10
    and not exists (
      select 1 from unnest(p_photos) path
      where path is null or path !~ ('^' || p_owner::text || '/' || p_item::text ||
        '/photo-[0-9a-f-]{36}[.](png|jpg|jpeg|webp)$')
    )
    and (p_pdf is null or p_pdf ~ ('^' || p_owner::text || '/' || p_item::text ||
      '/catalog-[0-9a-f-]{36}[.]pdf$'));
$$;
revoke all on function mb_private.mb_valid_catalog_paths(uuid, uuid, text[], text) from public, anon;
grant execute on function mb_private.mb_valid_catalog_paths(uuid, uuid, text[], text) to authenticated;

create table if not exists public.mb_catalog_items (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.mb_company_applications(id) on delete cascade,
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 3 and 100),
  category text not null check (category in ('stone', 'machine', 'supplies', 'service')),
  description text not null check (char_length(trim(description)) between 20 and 1500),
  image_paths text[] not null,
  pdf_path text,
  video_url text check (video_url is null or (char_length(video_url) <= 300 and video_url ~ '^https://[^[:space:]]+$')),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  constraint mb_catalog_assets_valid check
    (mb_private.mb_valid_catalog_paths(owner_id, id, image_paths, pdf_path))
);
create index if not exists mb_catalog_application on public.mb_catalog_items(application_id, created_at desc);
alter table public.mb_catalog_items enable row level security;
revoke all on public.mb_catalog_items from anon, authenticated;
grant select on public.mb_catalog_items to authenticated;
grant insert(id, application_id, title, category, description, image_paths, pdf_path, video_url)
  on public.mb_catalog_items to authenticated;
grant update(title, description, video_url, is_published)
  on public.mb_catalog_items to authenticated;

drop policy if exists mb_catalog_owner_read on public.mb_catalog_items;
create policy mb_catalog_owner_read on public.mb_catalog_items for select to authenticated
using (owner_id = (select auth.uid()) or (select public.mb_is_admin()));
drop policy if exists mb_catalog_owner_insert on public.mb_catalog_items;
create policy mb_catalog_owner_insert on public.mb_catalog_items for insert to authenticated
with check (
  owner_id = (select auth.uid()) and (select public.mb_is_email_confirmed())
  and exists (
    select 1 from public.mb_company_applications a
    where a.id = application_id and a.owner_id = (select auth.uid())
      and ((a.account_role = 'supplier' and category <> 'service' and
            (category = 'stone' or a.company_details->>'activity_type' in ('machine', 'supplies', 'trader')))
           or (a.account_role = 'service' and category = 'service'))
  )
  and ((select public.mb_active_supplier(application_id)) or (select public.mb_active_service(application_id)))
);
drop policy if exists mb_catalog_owner_update on public.mb_catalog_items;
create policy mb_catalog_owner_update on public.mb_catalog_items for update to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

-- Return only publishable items, even if a company stores a private draft.
create or replace function public.mb_list_catalog_items()
returns table (id uuid, company_id uuid, title text, category text, description text,
               image_paths text[], pdf_path text, video_url text, created_at timestamptz)
language sql stable security definer set search_path = ''
as $$
  select i.id, a.id, i.title, i.category, i.description,
         i.image_paths, i.pdf_path, i.video_url, i.created_at
  from public.mb_catalog_items i
  join public.mb_company_applications a on a.id = i.application_id and a.owner_id = i.owner_id
  join auth.users u on u.id = a.owner_id and u.email_confirmed_at is not null
  join public.mb_company_verifications v on v.application_id = a.id and v.verified
  where i.is_published and u.raw_user_meta_data->>'directory_consent' = 'true'
    and exists (
      select 1 from public.mb_company_memberships m
      where m.application_id = a.id and m.started_at <= now() and m.ends_at > now()
    )
  order by i.created_at desc
  limit 500;
$$;
revoke all on function public.mb_list_catalog_items() from public, anon, authenticated;
grant execute on function public.mb_list_catalog_items() to anon, authenticated;

-- The directory now carries an application id so its catalogue can be opened.
drop function if exists public.mb_list_directory_companies();
create function public.mb_list_directory_companies()
returns table (company_id uuid, name text, city text, activity_type text, section text, logo_path text)
language sql stable security definer set search_path = ''
as $$
  select a.id, a.company_name,
         left(coalesce(a.company_details->>'city', ''), 80),
         a.company_details->>'activity_type', listing.section, logo.name
  from public.mb_company_applications a
  join auth.users u on u.id = a.owner_id
  join public.mb_company_verifications v on v.application_id = a.id and v.verified
  cross join lateral (values
    ('companies'::text, a.account_role = 'supplier'),
    ('machines'::text, a.account_role = 'supplier' and a.company_details->>'activity_type' in ('machine', 'supplies')),
    ('services'::text, a.account_role = 'service')
  ) as listing(section, visible)
  left join lateral (
    select o.name from storage.objects o
    where o.bucket_id = 'mb-company-logos'
      and (storage.foldername(o.name))[1] = a.owner_id::text
      and o.name ~ '^[0-9a-f-]{36}/logo-[0-9]{13}-[0-9a-f-]{36}[.](png|jpg|jpeg|webp)$'
    order by o.created_at desc limit 1
  ) logo on true
  where listing.visible and u.email_confirmed_at is not null
    and u.raw_user_meta_data->>'directory_consent' = 'true'
    and exists (
      select 1 from public.mb_company_memberships m
      where m.application_id = a.id and m.started_at <= now() and m.ends_at > now()
    )
  order by a.company_name, a.id, listing.section
  limit 1000;
$$;
revoke all on function public.mb_list_directory_companies() from public, anon, authenticated;
grant execute on function public.mb_list_directory_companies() to anon, authenticated;

commit;

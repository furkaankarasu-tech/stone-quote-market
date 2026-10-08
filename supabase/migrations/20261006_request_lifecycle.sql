-- Run once in Supabase SQL Editor before deploying this release.
-- Repeat-safe. Preserves records; only the request owner can change status.
begin;
create or replace function mb_private.mb_set_request_status(p_request_id uuid, p_status text)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null or not mb_private.mb_is_email_confirmed() then
    raise exception 'Confirmed account required' using errcode = '42501';
  end if;
  if p_status is null or p_status not in ('open','closed') then
    raise exception 'Invalid request status' using errcode = '22023';
  end if;
  perform 1 from public.mb_purchase_requests
  where id = p_request_id and buyer_id = auth.uid() for update;
  if not found then raise exception 'Request not found' using errcode = '42501'; end if;
  update public.mb_purchase_requests set status = p_status where id = p_request_id;
end;
$$;
revoke all on function mb_private.mb_set_request_status(uuid,text) from public, anon;
grant execute on function mb_private.mb_set_request_status(uuid,text) to authenticated;
create or replace function public.mb_set_request_status(p_request_id uuid, p_status text)
returns void language sql security invoker set search_path = ''
as $$ select mb_private.mb_set_request_status(p_request_id,p_status) $$;
revoke all on function public.mb_set_request_status(uuid,text) from public, anon;
grant execute on function public.mb_set_request_status(uuid,text) to authenticated;

-- Serialize new offers with closing/reopening; RLS still validates the supplier.
create or replace function mb_private.mb_require_open_request()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  perform 1 from public.mb_purchase_requests where id = new.request_id and status = 'open' for update;
  if not found then raise exception 'Request is closed' using errcode = '42501'; end if;
  return new;
end;
$$;
revoke all on function mb_private.mb_require_open_request() from public, anon, authenticated;
drop trigger if exists mb_offer_open_request on public.mb_offers;
create trigger mb_offer_open_request before insert on public.mb_offers
for each row execute function mb_private.mb_require_open_request();
create or replace function mb_private.mb_accept_offer(p_offer_id uuid)
returns void language plpgsql security definer set search_path = ''
as $$
declare offer_row public.mb_offers%rowtype;
declare request_row public.mb_purchase_requests%rowtype;
begin
  select * into offer_row from public.mb_offers where id = p_offer_id;
  if offer_row.id is null then raise exception 'Offer not found'; end if;
  select * into request_row from public.mb_purchase_requests r
  where r.id = offer_row.request_id and r.buyer_id = auth.uid() and r.status = 'open' for update;
  if request_row.id is null then raise exception 'Request not found'; end if;
  select * into offer_row from public.mb_offers where id = p_offer_id for update;
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



-- ADMIN ADVERTISING (repeat-safe; apply this entire file in SQL Editor).
create table if not exists public.mb_advertisements (
  id uuid primary key default gen_random_uuid(),
  company_name text not null check (char_length(btrim(company_name)) between 2 and 100),
  title text not null check (char_length(btrim(title)) between 2 and 100),
  description text not null default '' check (char_length(description) <= 220),
  target_url text not null check (char_length(target_url) <= 2000 and target_url ~ '^https://[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?(:[0-9]{1,5})?([/?#][^[:space:]]*)?$'),
  image_path text not null check (image_path ~ '^[0-9a-f-]{36}/ad-[0-9a-f-]{36}\.(png|jpg|jpeg|webp)$'),
  sections text[] not null default array['home']::text[] check (cardinality(sections) between 1 and 5 and sections <@ array['home','stone','companies','machine','services']::text[] and array_position(sections,null) is null),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  sort_order integer not null default 10 check (sort_order between 0 and 9999),
  is_active boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid not null default auth.uid() references auth.users(id),
  updated_at timestamptz not null default now(),
  updated_by uuid not null default auth.uid() references auth.users(id),
  check (ends_at is null or ends_at > starts_at)
);
alter table public.mb_advertisements enable row level security;
revoke all on public.mb_advertisements from anon, authenticated;
grant select on public.mb_advertisements to authenticated;
grant insert(company_name,title,description,target_url,image_path,sections,starts_at,ends_at,sort_order,is_active)
  on public.mb_advertisements to authenticated;
grant update(company_name,title,description,target_url,image_path,sections,starts_at,ends_at,sort_order,is_active,archived_at)
  on public.mb_advertisements to authenticated;
drop policy if exists mb_ads_admin_read on public.mb_advertisements;
create policy mb_ads_admin_read on public.mb_advertisements for select to authenticated
using ((select public.mb_is_admin()) and (select public.mb_is_email_confirmed()));
drop policy if exists mb_ads_admin_insert on public.mb_advertisements;
create policy mb_ads_admin_insert on public.mb_advertisements for insert to authenticated
with check ((select public.mb_is_admin()) and (select public.mb_is_email_confirmed()));
drop policy if exists mb_ads_admin_update on public.mb_advertisements;
create policy mb_ads_admin_update on public.mb_advertisements for update to authenticated
using ((select public.mb_is_admin()) and (select public.mb_is_email_confirmed()))
with check ((select public.mb_is_admin()) and (select public.mb_is_email_confirmed()));

create or replace function mb_private.mb_ad_stamp()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.updated_at := now(); new.updated_by := auth.uid();
  if tg_op = 'INSERT' then new.created_at := now(); new.created_by := auth.uid(); end if;
  return new;
end; $$;
revoke all on function mb_private.mb_ad_stamp() from public, anon, authenticated;
drop trigger if exists mb_ad_stamp on public.mb_advertisements;
create trigger mb_ad_stamp before insert or update on public.mb_advertisements
for each row execute function mb_private.mb_ad_stamp();
create index if not exists mb_ads_public_schedule on public.mb_advertisements(sort_order,starts_at,ends_at)
where is_active and archived_at is null;

-- Repeat-safe placement upgrade; existing campaigns remain in the sidebar.
alter table public.mb_advertisements add column if not exists placement text not null default 'sidebar'
  check (placement in ('top','sidebar','bottom'));
grant insert(placement), update(placement) on public.mb_advertisements to authenticated;
drop function if exists public.mb_list_advertisements(text);
-- Only safe public ad fields leave the database; drafts and audit IDs are private.
create or replace function public.mb_list_advertisements(p_section text)
returns table(id uuid,company_name text,title text,description text,target_url text,image_path text,starts_at timestamptz,ends_at timestamptz,sort_order integer,placement text)
language sql stable security definer set search_path = '' as $$
  select a.id,a.company_name,a.title,a.description,a.target_url,a.image_path,a.starts_at,a.ends_at,a.sort_order,a.placement
  from public.mb_advertisements a
  where p_section in ('home','stone','companies','machine','services')
    and p_section = any(a.sections) and a.is_active and a.archived_at is null
    and a.starts_at <= now() and (a.ends_at is null or a.ends_at > now())
    and a.id in (
      select ranked.id from (
        select b.id,row_number() over(partition by b.placement order by b.sort_order,b.created_at desc,b.id) as priority,b.placement
        from public.mb_advertisements b where p_section = any(b.sections) and b.is_active and b.archived_at is null
          and b.starts_at <= now() and (b.ends_at is null or b.ends_at > now())
      ) ranked where ranked.priority <= case when ranked.placement='top' then 1 else 3 end
    )
  order by a.sort_order asc,a.created_at desc,a.id asc;
$$;
revoke all on function public.mb_list_advertisements(text) from public;
grant execute on function public.mb_list_advertisements(text) to anon, authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('mb-ad-assets','mb-ad-assets',true,3145728,array['image/png','image/jpeg','image/webp'])
on conflict(id) do update set public=true,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists mb_ad_assets_admin_insert on storage.objects;
create policy mb_ad_assets_admin_insert on storage.objects for insert to authenticated
with check (bucket_id='mb-ad-assets' and (select public.mb_is_admin()) and (select public.mb_is_email_confirmed())
  and name ~ '^[0-9a-f-]{36}/ad-[0-9a-f-]{36}\.(png|jpg|jpeg|webp)$'
  and (storage.foldername(name))[1]=(select auth.uid()::text));
drop policy if exists mb_ad_assets_admin_read on storage.objects;
create policy mb_ad_assets_admin_read on storage.objects for select to authenticated
using (bucket_id='mb-ad-assets' and (select public.mb_is_admin()) and (select public.mb_is_email_confirmed()));
-- No overwrite/delete policy: use a new image path. Old campaign images remain recoverable.
commit;

-- Synchronize with the published legal documents; preserve acknowledgement checks.
do $legal_version_sync$
declare
  function_sql text;
begin
  function_sql := pg_get_functiondef('mb_private.mb_capture_signup()'::regprocedure);
  if strpos(function_sql, 'version_value <> ''2026-09-25''') > 0 then
    execute replace(function_sql, 'version_value <> ''2026-09-25''',
                                 'version_value <> ''2026-10-06''');
  elsif strpos(function_sql, 'version_value <> ''2026-10-06''') = 0 then
    raise exception 'Unexpected signup legal version; review mb_capture_signup before deployment';
  end if;
end;
$legal_version_sync$;

-- ADMIN PERMANENT DELETION: run this section alone for this release.
-- Deletes records, not Auth accounts or Storage files. No public DELETE grants.
begin;
create or replace function mb_private.mb_admin_delete_company(p_application_id uuid, p_confirmation text)
returns void language plpgsql security definer set search_path = '' as $$
declare company_row public.mb_company_applications%rowtype;
begin
  if auth.uid() is null or not coalesce(public.mb_is_admin(),false)
    or not coalesce(public.mb_is_email_confirmed(),false) then
    raise exception 'Yalnızca e-postası doğrulanmış yönetici silebilir.' using errcode='42501';
  end if;
  select * into company_row from public.mb_company_applications where id=p_application_id for update;
  if not found then raise exception 'Firma bulunamadı. Listeyi yenileyin.'; end if;
  if company_row.owner_id = auth.uid() then
    raise exception 'Kendi yönetici hesabınızı bu işlemle kapatamazsınız.' using errcode='42501';
  end if;
  if p_confirmation is distinct from company_row.company_name then
    raise exception 'Firma adı onayı eşleşmiyor.' using errcode='22023';
  end if;
  lock table public.mb_payment_confirmations in share row exclusive mode;
  delete from public.mb_offers where application_id=p_application_id or supplier_id=company_row.owner_id
    or request_id in (select id from public.mb_purchase_requests where buyer_id=company_row.owner_id);
  update public.mb_purchase_requests set service_application_id=null where service_application_id=p_application_id;
  delete from public.mb_purchase_requests where buyer_id=company_row.owner_id;
  delete from public.mb_catalog_items where application_id=p_application_id;
  delete from public.mb_company_memberships where application_id=p_application_id;
  delete from public.mb_company_verifications where application_id=p_application_id;
  delete from public.mb_review_events where application_id=p_application_id;
  delete from public.mb_payment_confirmations where application_id=p_application_id;
  delete from public.mb_company_applications where id=p_application_id;
  -- Keep the Auth row for identity references, but prevent future sign-in.
  update auth.users set banned_until = '9999-12-31 23:59:59+00'::timestamptz
    where id = company_row.owner_id;
  delete from auth.sessions where user_id = company_row.owner_id;

end;
$$;
revoke all on function mb_private.mb_admin_delete_company(uuid,text) from public,anon;
grant execute on function mb_private.mb_admin_delete_company(uuid,text) to authenticated;
create or replace function public.mb_admin_delete_company(p_application_id uuid,p_confirmation text)
returns void language sql security invoker set search_path = '' as $$
  select mb_private.mb_admin_delete_company(p_application_id,p_confirmation);
$$;
revoke all on function public.mb_admin_delete_company(uuid,text) from public,anon;
grant execute on function public.mb_admin_delete_company(uuid,text) to authenticated;

create or replace function mb_private.mb_admin_delete_advertisement(p_ad_id uuid,p_confirmation text)
returns void language plpgsql security definer set search_path = '' as $$
declare title_value text;
begin
  if auth.uid() is null or not coalesce(public.mb_is_admin(),false)
    or not coalesce(public.mb_is_email_confirmed(),false) then
    raise exception 'Yalnızca e-postası doğrulanmış yönetici silebilir.' using errcode='42501';
  end if;
  select title into title_value from public.mb_advertisements where id=p_ad_id for update;
  if not found then raise exception 'Reklam bulunamadı. Listeyi yenileyin.'; end if;
  if p_confirmation is distinct from title_value then
    raise exception 'Reklam başlığı onayı eşleşmiyor.' using errcode='22023';
  end if;
  delete from public.mb_advertisements where id=p_ad_id;
end;
$$;
revoke all on function mb_private.mb_admin_delete_advertisement(uuid,text) from public,anon;
grant execute on function mb_private.mb_admin_delete_advertisement(uuid,text) to authenticated;
create or replace function public.mb_admin_delete_advertisement(p_ad_id uuid,p_confirmation text)
returns void language sql security invoker set search_path = '' as $$
  select mb_private.mb_admin_delete_advertisement(p_ad_id,p_confirmation);
$$;
revoke all on function public.mb_admin_delete_advertisement(uuid,text) from public,anon;
grant execute on function public.mb_admin_delete_advertisement(uuid,text) to authenticated;
commit;

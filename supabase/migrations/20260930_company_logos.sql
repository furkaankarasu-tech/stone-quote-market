-- Run after 20260930_supplier_directory_service_requests.sql.
-- Only authenticated company owners can upload logos. The public directory
-- exposes logo paths only for verified, active, opted-in companies.
begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'mb-company-logos', 'mb-company-logos', true, 2097152,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists mb_logo_owner_insert on storage.objects;
create policy mb_logo_owner_insert on storage.objects for insert to authenticated
with check (
  bucket_id = 'mb-company-logos'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and array_length(storage.foldername(name), 1) = 1
  and storage.filename(name) ~ '^logo-[0-9]{13}-[0-9a-f-]{36}[.](png|jpg|jpeg|webp)$'
  and exists (
    select 1 from public.mb_company_applications a
    where a.owner_id = (select auth.uid()) and a.account_role in ('supplier', 'service')
  )
);

drop policy if exists mb_logo_owner_select on storage.objects;
create policy mb_logo_owner_select on storage.objects for select to authenticated
using (
  bucket_id = 'mb-company-logos'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists mb_logo_owner_delete on storage.objects;
create policy mb_logo_owner_delete on storage.objects for delete to authenticated
using (
  bucket_id = 'mb-company-logos'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- The return shape gains logo_path; PostgreSQL requires recreating the function.
drop function if exists public.mb_list_directory_companies();
create function public.mb_list_directory_companies()
returns table (name text, city text, activity_type text, section text, logo_path text)
language sql stable security definer set search_path = ''
as $$
  select a.company_name,
         left(coalesce(a.company_details->>'city', ''), 80),
         a.company_details->>'activity_type',
         listing.section,
         logo.name
  from public.mb_company_applications a
  join auth.users u on u.id = a.owner_id
  join public.mb_company_verifications v on v.application_id = a.id and v.verified = true
  cross join lateral (values
    ('companies'::text, a.account_role = 'supplier'),
    ('machines'::text, a.account_role = 'supplier' and a.company_details->>'activity_type' in ('machine', 'supplies')),
    ('services'::text, a.account_role = 'service')
  ) as listing(section, visible)
  left join lateral (
    select o.name
    from storage.objects o
    where o.bucket_id = 'mb-company-logos'
      and (storage.foldername(o.name))[1] = a.owner_id::text
      and o.name ~ '^[0-9a-f-]{36}/logo-[0-9]{13}-[0-9a-f-]{36}[.](png|jpg|jpeg|webp)$'
    order by o.created_at desc
    limit 1
  ) logo on true
  where listing.visible
    and u.email_confirmed_at is not null
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

-- Run after the 20260925 membership and 20260926 directory migrations.
-- Real suppliers appear in Firms after verification, active membership and opt-in.
-- Active suppliers may request services; active service companies may quote them.
begin;

create or replace function public.mb_list_directory_companies()
returns table (name text, city text, activity_type text, section text)
language sql stable security definer set search_path = ''
as $$
  select a.company_name,
         left(coalesce(a.company_details->>'city', ''), 80),
         a.company_details->>'activity_type',
         listing.section
  from public.mb_company_applications a
  join auth.users u on u.id = a.owner_id
  join public.mb_company_verifications v on v.application_id = a.id and v.verified = true
  cross join lateral (values
    ('companies'::text, a.account_role = 'supplier'),
    ('machines'::text, a.account_role = 'supplier' and a.company_details->>'activity_type' in ('machine', 'supplies')),
    ('services'::text, a.account_role = 'service')
  ) as listing(section, visible)
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

create or replace function mb_private.mb_active_service(p_application_id uuid default null)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.mb_company_applications a
    join public.mb_company_verifications v on v.application_id = a.id and v.verified
    join public.mb_company_memberships m on m.application_id = a.id
    where a.owner_id = (select auth.uid()) and a.account_role = 'service'
      and (p_application_id is null or a.id = p_application_id)
      and m.started_at <= now() and m.ends_at > now()
  );
$$;
revoke all on function mb_private.mb_active_service(uuid) from public, anon;
grant execute on function mb_private.mb_active_service(uuid) to authenticated;
create or replace function public.mb_active_service(p_application_id uuid default null)
returns boolean language sql stable security invoker set search_path = ''
as $$ select mb_private.mb_active_service(p_application_id) $$;
revoke all on function public.mb_active_service(uuid) from public, anon;
grant execute on function public.mb_active_service(uuid) to authenticated;

alter table public.mb_purchase_requests drop constraint if exists mb_purchase_requests_format_check;
alter table public.mb_purchase_requests add constraint mb_purchase_requests_format_check
  check (format in ('slab', 'block', 'cut', 'service'));

drop policy if exists mb_requests_read on public.mb_purchase_requests;
create policy mb_requests_read on public.mb_purchase_requests for select to authenticated
using (buyer_id = (select auth.uid()) or
  (status = 'open' and (
    (format <> 'service' and (select public.mb_active_supplier(null))) or
    (format = 'service' and (select public.mb_active_service(null)))
  )));
drop policy if exists mb_requests_insert on public.mb_purchase_requests;
create policy mb_requests_insert on public.mb_purchase_requests for insert to authenticated
with check ((select public.mb_is_email_confirmed()) and buyer_id = (select auth.uid()) and status = 'open' and (
  (format <> 'service' and exists (
    select 1 from public.mb_profiles p where p.user_id = (select auth.uid()) and p.account_role = 'buyer'
  )) or
  (format = 'service' and (select public.mb_active_supplier(null)))
));
drop policy if exists mb_offers_insert on public.mb_offers;
create policy mb_offers_insert on public.mb_offers for insert to authenticated
with check ((select public.mb_is_email_confirmed()) and supplier_id = (select auth.uid()) and exists (
  select 1 from public.mb_purchase_requests r where r.id = request_id
    and r.status = 'open' and r.buyer_id <> (select auth.uid())
    and (
      (r.format <> 'service' and (select public.mb_active_supplier(application_id))) or
      (r.format = 'service' and (select public.mb_active_service(application_id)))
    )
));

create or replace function mb_private.mb_accept_offer(p_offer_id uuid)
returns void language plpgsql security definer set search_path = ''
as $$
declare offer_row public.mb_offers%rowtype;
declare request_format text;
begin
  select * into offer_row from public.mb_offers where id = p_offer_id for update;
  if offer_row.id is null then raise exception 'Offer not found'; end if;
  select r.format into request_format from public.mb_purchase_requests r
  where r.id = offer_row.request_id and r.buyer_id = auth.uid() and r.status = 'open';
  if request_format is null then raise exception 'Request not found'; end if;
  if not exists (
    select 1 from public.mb_company_applications a
    join public.mb_company_verifications v on v.application_id = a.id and v.verified
    join public.mb_company_memberships m on m.application_id = a.id
    where a.id = offer_row.application_id and a.owner_id = offer_row.supplier_id
      and a.account_role = case when request_format = 'service' then 'service' else 'supplier' end
      and m.started_at <= now() and m.ends_at > now()
  ) then raise exception 'Company membership is not active'; end if;
  if offer_row.accepted_at is null then
    update public.mb_offers set accepted_at = now() where id = p_offer_id;
  end if;
end;
$$;
revoke all on function mb_private.mb_accept_offer(uuid) from public, anon;
grant execute on function mb_private.mb_accept_offer(uuid) to authenticated;

commit;

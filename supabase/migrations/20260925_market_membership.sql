-- Run AFTER 20260925_company_verification.sql in the same Supabase project.
-- Public API tables are protected by RLS. No service key is sent to the browser.
-- One company application per Auth user in this first release.
-- Do not add mb_private to the API's Exposed schemas.
begin;
create schema if not exists mb_private;
revoke all on schema mb_private from public, anon;
grant usage on schema mb_private to authenticated;

create table if not exists public.mb_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  account_role text not null check (account_role in ('buyer', 'supplier', 'service')),
  full_name text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.mb_company_applications (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  account_role text not null check (account_role in ('supplier', 'service')),
  company_name text not null,
  company_details jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now()
);

create table if not exists public.mb_legal_acknowledgements (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  document text not null check (document in ('terms', 'privacy', 'kvkk_notice', 'marketing')),
  legal_version text not null,
  recorded_at timestamptz not null default now(),
  source text not null default 'signup_metadata',
  unique(user_id, document, legal_version)
);

create table if not exists public.mb_company_verifications (
  application_id uuid primary key references public.mb_company_applications(id) on delete cascade,
  verified boolean not null default false,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);

create table if not exists public.mb_payment_confirmations (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.mb_company_applications(id) on delete restrict,
  amount_try numeric(14,2) not null check (amount_try > 0),
  bank_reference text not null check (char_length(trim(bank_reference)) between 3 and 180),
  bank_received_at timestamptz not null,
  confirmed_at timestamptz not null default now(),
  confirmed_by uuid not null references auth.users(id)
);

create table if not exists public.mb_company_memberships (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.mb_company_applications(id) on delete restrict,
  payment_id uuid not null unique references public.mb_payment_confirmations(id) on delete restrict,
  started_at timestamptz not null default now(),
  ends_at timestamptz not null,
  activated_by uuid not null references auth.users(id),
  check (ends_at > started_at)
);

create table if not exists public.mb_review_events (
  id bigint generated always as identity primary key,
  application_id uuid not null references public.mb_company_applications(id) on delete restrict,
  actor_id uuid not null references auth.users(id),
  action text not null check (action in ('verified', 'verification_revoked', 'payment_confirmed', 'activated')),
  details jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

-- Bootstrap an administrator only through SQL Editor, never through user metadata.
create table if not exists public.mb_admin_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function mb_private.mb_is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (
  select 1 from public.mb_admin_accounts a
  join auth.users u on u.id=a.user_id
  where a.user_id = (select auth.uid()) and u.email_confirmed_at is not null
) $$;
revoke all on function mb_private.mb_is_admin() from public, anon;
grant execute on function mb_private.mb_is_admin() to authenticated;
create or replace function public.mb_is_admin()
returns boolean language sql stable security invoker set search_path = ''
as $$ select mb_private.mb_is_admin() $$;
revoke all on function public.mb_is_admin() from public, anon;
grant execute on function public.mb_is_admin() to authenticated;

create or replace function mb_private.mb_active_supplier(p_application_id uuid default null)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.mb_company_applications a
    join public.mb_company_verifications v on v.application_id = a.id and v.verified
    join public.mb_company_memberships m on m.application_id = a.id
    where a.owner_id = (select auth.uid()) and a.account_role = 'supplier'
      and (p_application_id is null or a.id = p_application_id)
      and m.started_at <= now() and m.ends_at > now()
  );
$$;
revoke all on function mb_private.mb_active_supplier(uuid) from public, anon;
grant execute on function mb_private.mb_active_supplier(uuid) to authenticated;
create or replace function public.mb_active_supplier(p_application_id uuid default null)
returns boolean language sql stable security invoker set search_path = ''
as $$ select mb_private.mb_active_supplier(p_application_id) $$;
revoke all on function public.mb_active_supplier(uuid) from public, anon;
grant execute on function public.mb_active_supplier(uuid) to authenticated;

create or replace function mb_private.mb_capture_signup()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  role_value text := case when meta->>'role' in ('buyer','supplier','service') then meta->>'role' else 'buyer' end;
  version_value text := left(coalesce(nullif(meta->>'legal_version',''), 'unknown'), 80);
begin
  if version_value <> '2026-09-25' or not (meta ? 'terms_accepted_at')
     or not (meta ? 'privacy_accepted_at') or not (meta ? 'kvkk_notice_read_at') then
    raise exception 'Terms, privacy and KVKK notice acknowledgement required';
  end if;
  insert into public.mb_profiles(user_id, account_role, full_name)
  values(new.id, role_value, left(coalesce(meta->>'full_name',''), 90))
  on conflict(user_id) do nothing;

  if role_value in ('supplier','service') then
    insert into public.mb_company_applications(owner_id, account_role, company_name, company_details)
    values (
      new.id, role_value, left(coalesce(nullif(meta->>'company_name',''), 'Başvuru bilgisi eksik'), 160),
      jsonb_build_object(
        'legal_type', meta->>'legal_type', 'activity_type', meta->>'activity_type',
        'tax_no', meta->>'tax_no', 'tax_office', meta->>'tax_office',
        'mersis_no', meta->>'mersis_no', 'registry_no', meta->>'registry_no',
        'country', meta->>'country', 'city', meta->>'city',
        'company_address', meta->>'company_address',
        'authorized_name', meta->>'authorized_name',
        'authorized_title', meta->>'authorized_title',
        'corporate_email', meta->>'corporate_email',
        'phone', meta->>'phone', 'website', meta->>'website'
      )
    ) on conflict(owner_id) do nothing;
  end if;

  if meta ? 'terms_accepted_at' then
    insert into public.mb_legal_acknowledgements(user_id, document, legal_version)
    values(new.id, 'terms', version_value) on conflict do nothing;
  end if;
  if meta ? 'privacy_accepted_at' then
    insert into public.mb_legal_acknowledgements(user_id, document, legal_version)
    values(new.id, 'privacy', version_value) on conflict do nothing;
  end if;
  if meta ? 'kvkk_notice_read_at' then
    insert into public.mb_legal_acknowledgements(user_id, document, legal_version)
    values(new.id, 'kvkk_notice', version_value) on conflict do nothing;
  end if;
  if meta->>'marketing_consent' = 'true' then
    insert into public.mb_legal_acknowledgements(user_id, document, legal_version)
    values(new.id, 'marketing', version_value) on conflict do nothing;
  end if;
  return new;
end;
$$;
revoke all on function mb_private.mb_capture_signup() from public, anon, authenticated;

drop trigger if exists mb_on_auth_user_created on auth.users;
create trigger mb_on_auth_user_created after insert on auth.users
for each row execute function mb_private.mb_capture_signup();

-- Existing demo-era Auth accounts receive pending applications, never active access.
insert into public.mb_profiles(user_id, account_role, full_name, created_at)
select id,
       case when raw_user_meta_data->>'role' in ('buyer','supplier','service') then raw_user_meta_data->>'role' else 'buyer' end,
       left(coalesce(raw_user_meta_data->>'full_name',''),90), created_at
from auth.users on conflict(user_id) do nothing;

insert into public.mb_company_applications(owner_id, account_role, company_name, company_details, submitted_at)
select u.id, p.account_role,
       left(coalesce(nullif(u.raw_user_meta_data->>'company_name',''), 'Başvuru bilgisi eksik'), 160),
       jsonb_build_object('legal_type',u.raw_user_meta_data->>'legal_type','activity_type',u.raw_user_meta_data->>'activity_type',
         'tax_no',u.raw_user_meta_data->>'tax_no','tax_office',u.raw_user_meta_data->>'tax_office',
         'mersis_no',u.raw_user_meta_data->>'mersis_no','registry_no',u.raw_user_meta_data->>'registry_no',
         'country',u.raw_user_meta_data->>'country','city',u.raw_user_meta_data->>'city',
         'company_address',u.raw_user_meta_data->>'company_address','authorized_name',u.raw_user_meta_data->>'authorized_name',
         'authorized_title',u.raw_user_meta_data->>'authorized_title','corporate_email',u.raw_user_meta_data->>'corporate_email',
         'phone',u.raw_user_meta_data->>'phone','website',u.raw_user_meta_data->>'website'), u.created_at
from auth.users u join public.mb_profiles p on p.user_id=u.id
where p.account_role in ('supplier','service') on conflict(owner_id) do nothing;

insert into public.mb_legal_acknowledgements(user_id, document, legal_version, source)
select u.id, d.document, left(coalesce(nullif(u.raw_user_meta_data->>'legal_version',''),'unknown'),80), 'legacy_signup_metadata'
from auth.users u
cross join lateral (values ('terms','terms_accepted_at'),('privacy','privacy_accepted_at'),
                           ('kvkk_notice','kvkk_notice_read_at'),('marketing','marketing_consent')) d(document,meta_key)
where case when d.document='marketing' then u.raw_user_meta_data->>'marketing_consent'='true'
           else u.raw_user_meta_data ? d.meta_key end
on conflict do nothing;

create table if not exists public.mb_purchase_requests (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null default auth.uid() references auth.users(id) on delete restrict,
  item text not null check (char_length(trim(item)) between 2 and 90),
  format text not null check (format in ('slab','block','cut')),
  quantity numeric(14,2) not null check (quantity > 0 and quantity <= 999999),
  unit text not null check (unit in ('m²','ton','adet')),
  destination text not null check (char_length(trim(destination)) between 2 and 80),
  notes text not null default '' check (char_length(notes) <= 500),
  status text not null default 'open' check (status in ('open','closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.mb_offers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.mb_purchase_requests(id) on delete restrict,
  application_id uuid not null references public.mb_company_applications(id) on delete restrict,
  supplier_id uuid not null default auth.uid() references auth.users(id) on delete restrict,
  unit_price numeric(14,2) not null check (unit_price > 0 and unit_price <= 999999999),
  currency text not null check (currency in ('TRY','USD','EUR')),
  contact_email text not null check (char_length(contact_email) between 5 and 180 and position('@' in contact_email) > 1),
  notes text not null default '' check (char_length(notes) <= 500),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  unique(request_id, application_id)
);

create index if not exists mb_membership_lookup on public.mb_company_memberships(application_id, ends_at desc);
create index if not exists mb_requests_recent on public.mb_purchase_requests(created_at desc) where status='open';
create index if not exists mb_offers_request on public.mb_offers(request_id);

alter table public.mb_profiles enable row level security;
alter table public.mb_company_applications enable row level security;
alter table public.mb_legal_acknowledgements enable row level security;
alter table public.mb_company_verifications enable row level security;
alter table public.mb_payment_confirmations enable row level security;
alter table public.mb_company_memberships enable row level security;
alter table public.mb_review_events enable row level security;
alter table public.mb_admin_accounts enable row level security;
alter table public.mb_purchase_requests enable row level security;
alter table public.mb_offers enable row level security;

revoke all on public.mb_profiles, public.mb_company_applications, public.mb_legal_acknowledgements,
  public.mb_company_verifications, public.mb_payment_confirmations, public.mb_company_memberships,
  public.mb_review_events, public.mb_admin_accounts, public.mb_purchase_requests, public.mb_offers
from anon, authenticated;
grant select on public.mb_profiles, public.mb_company_applications, public.mb_legal_acknowledgements,
  public.mb_company_verifications, public.mb_payment_confirmations, public.mb_company_memberships,
  public.mb_review_events, public.mb_admin_accounts, public.mb_purchase_requests, public.mb_offers to authenticated;
-- Server-owned identifiers, owners and timestamps cannot be submitted by clients.
grant insert(item,format,quantity,unit,destination,notes) on public.mb_purchase_requests to authenticated;
grant insert(request_id,application_id,unit_price,currency,contact_email,notes) on public.mb_offers to authenticated;

drop policy if exists mb_profiles_read on public.mb_profiles;
-- Re-runs replace only this migration's named policies inside the transaction.
create policy mb_profiles_read on public.mb_profiles for select to authenticated
using (user_id = (select auth.uid()) or (select public.mb_is_admin()));
drop policy if exists mb_applications_read on public.mb_company_applications;
create policy mb_applications_read on public.mb_company_applications for select to authenticated
using (owner_id = (select auth.uid()) or (select public.mb_is_admin()));
drop policy if exists mb_legal_read on public.mb_legal_acknowledgements;
create policy mb_legal_read on public.mb_legal_acknowledgements for select to authenticated
using (user_id = (select auth.uid()) or (select public.mb_is_admin()));
drop policy if exists mb_verifications_read on public.mb_company_verifications;
create policy mb_verifications_read on public.mb_company_verifications for select to authenticated
using ((select public.mb_is_admin()) or exists (
  select 1 from public.mb_company_applications a where a.id=application_id and a.owner_id=(select auth.uid())));
drop policy if exists mb_payments_read on public.mb_payment_confirmations;
create policy mb_payments_read on public.mb_payment_confirmations for select to authenticated
using ((select public.mb_is_admin()));
drop policy if exists mb_memberships_read on public.mb_company_memberships;
create policy mb_memberships_read on public.mb_company_memberships for select to authenticated
using ((select public.mb_is_admin()) or exists (
  select 1 from public.mb_company_applications a where a.id=application_id and a.owner_id=(select auth.uid())));
drop policy if exists mb_events_read on public.mb_review_events;
create policy mb_events_read on public.mb_review_events for select to authenticated
using ((select public.mb_is_admin()));
drop policy if exists mb_admin_self_read on public.mb_admin_accounts;
create policy mb_admin_self_read on public.mb_admin_accounts for select to authenticated
using (user_id=(select auth.uid()));
drop policy if exists mb_requests_read on public.mb_purchase_requests;
create policy mb_requests_read on public.mb_purchase_requests for select to authenticated
using (buyer_id=(select auth.uid()) or (status='open' and (select public.mb_active_supplier(null))));
drop policy if exists mb_requests_insert on public.mb_purchase_requests;
create policy mb_requests_insert on public.mb_purchase_requests for insert to authenticated
with check (buyer_id=(select auth.uid()) and status='open'
  and exists(select 1 from public.mb_profiles p where p.user_id=(select auth.uid()) and p.account_role='buyer'));
drop policy if exists mb_offers_read on public.mb_offers;
create policy mb_offers_read on public.mb_offers for select to authenticated
using (supplier_id=(select auth.uid()) or exists (
  select 1 from public.mb_purchase_requests r where r.id=request_id and r.buyer_id=(select auth.uid())));
drop policy if exists mb_offers_insert on public.mb_offers;
create policy mb_offers_insert on public.mb_offers for insert to authenticated
with check (supplier_id=(select auth.uid()) and (select public.mb_active_supplier(application_id))
  and exists (select 1 from public.mb_purchase_requests r where r.id=request_id
    and r.status='open' and r.buyer_id<>(select auth.uid())));

-- Admin document access is read-only; owners retain their existing upload policy.
drop policy if exists "mb_company_document_owner_select" on storage.objects;
create policy "mb_company_document_owner_select"
on storage.objects for select to authenticated
using (bucket_id='mb-company-documents-private' and
  ((storage.foldername(name))[1]=(select auth.uid()::text) or (select public.mb_is_admin())));

create or replace function mb_private.mb_set_company_verification(p_application_id uuid, p_verified boolean)
returns void language plpgsql security definer set search_path = ''
as $$
declare owner_value uuid;
begin
  if not mb_private.mb_is_admin() then raise exception 'Administrator required'; end if;
  select owner_id into owner_value from public.mb_company_applications where id=p_application_id;
  if owner_value is null then raise exception 'Application not found'; end if;
  if p_verified and not exists (select 1 from storage.objects o where o.bucket_id='mb-company-documents-private'
    and o.name like owner_value::text || '/company-document/%') then
    raise exception 'Verification document is missing';
  end if;
  insert into public.mb_company_verifications(application_id,verified,reviewed_at,reviewed_by)
  values(p_application_id,p_verified,now(),auth.uid())
  on conflict(application_id) do update set verified=excluded.verified,reviewed_at=excluded.reviewed_at,reviewed_by=excluded.reviewed_by;
  insert into public.mb_review_events(application_id,actor_id,action)
  values(p_application_id,auth.uid(),case when p_verified then 'verified' else 'verification_revoked' end);
end;
$$;
revoke all on function mb_private.mb_set_company_verification(uuid,boolean) from public, anon;
grant execute on function mb_private.mb_set_company_verification(uuid,boolean) to authenticated;
create or replace function public.mb_set_company_verification(p_application_id uuid, p_verified boolean)
returns void language sql security invoker set search_path = ''
as $$ select mb_private.mb_set_company_verification(p_application_id, p_verified) $$;
revoke all on function public.mb_set_company_verification(uuid,boolean) from public, anon;
grant execute on function public.mb_set_company_verification(uuid,boolean) to authenticated;

create or replace function mb_private.mb_confirm_bank_payment(p_application_id uuid, p_amount_try numeric,
  p_bank_reference text, p_bank_received_at timestamptz)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare payment_value uuid; minimum_amount numeric;
begin
  if not mb_private.mb_is_admin() then raise exception 'Administrator required'; end if;
  select case account_role when 'supplier' then 25000 else 15000 end
  into minimum_amount from public.mb_company_applications where id=p_application_id;
  if minimum_amount is null then
    raise exception 'Application not found'; end if;
  if p_amount_try is null or p_amount_try<minimum_amount or char_length(trim(coalesce(p_bank_reference,'')))<3
     or p_bank_received_at is null or p_bank_received_at>now() then
    raise exception 'Bank transaction reference, date and plan amount required (plus VAT)'; end if;
  insert into public.mb_payment_confirmations(application_id,amount_try,bank_reference,bank_received_at,confirmed_by)
  values(p_application_id,p_amount_try,trim(p_bank_reference),p_bank_received_at,auth.uid()) returning id into payment_value;
  insert into public.mb_review_events(application_id,actor_id,action,details)
  values(p_application_id,auth.uid(),'payment_confirmed',jsonb_build_object('payment_id',payment_value));
  return payment_value;
end;
$$;
revoke all on function mb_private.mb_confirm_bank_payment(uuid,numeric,text,timestamptz) from public, anon;
grant execute on function mb_private.mb_confirm_bank_payment(uuid,numeric,text,timestamptz) to authenticated;
create or replace function public.mb_confirm_bank_payment(p_application_id uuid, p_amount_try numeric,
  p_bank_reference text, p_bank_received_at timestamptz)
returns uuid language sql security invoker set search_path = ''
as $$ select mb_private.mb_confirm_bank_payment(p_application_id,p_amount_try,p_bank_reference,p_bank_received_at) $$;
revoke all on function public.mb_confirm_bank_payment(uuid,numeric,text,timestamptz) from public, anon;
grant execute on function public.mb_confirm_bank_payment(uuid,numeric,text,timestamptz) to authenticated;

create or replace function mb_private.mb_activate_membership(p_application_id uuid, p_payment_id uuid)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare member_value uuid; owner_value uuid; start_value timestamptz := now();
begin
  if not mb_private.mb_is_admin() then raise exception 'Administrator required'; end if;
  select owner_id into owner_value from public.mb_company_applications where id=p_application_id for update;
  if owner_value is null then raise exception 'Application not found'; end if;
  if not exists(select 1 from public.mb_company_verifications where application_id=p_application_id and verified) then
    raise exception 'Company verification required'; end if;
  if not exists(select 1 from storage.objects o where o.bucket_id='mb-company-documents-private'
    and o.name like owner_value::text || '/company-document/%') then raise exception 'Verification document is missing'; end if;
  if not exists(select 1 from auth.users u where u.id=owner_value and u.email_confirmed_at is not null) then
    raise exception 'Email confirmation required'; end if;
  if not exists(select 1 from public.mb_payment_confirmations p where p.id=p_payment_id and p.application_id=p_application_id) then
    raise exception 'Confirmed payment for this company required'; end if;
  if exists(select 1 from public.mb_company_memberships m where m.application_id=p_application_id and m.ends_at>start_value) then
    raise exception 'Membership already active'; end if;
  insert into public.mb_company_memberships(application_id,payment_id,started_at,ends_at,activated_by)
  values(p_application_id,p_payment_id,start_value,start_value+interval '12 months',auth.uid()) returning id into member_value;
  insert into public.mb_review_events(application_id,actor_id,action,details)
  values(p_application_id,auth.uid(),'activated',jsonb_build_object('membership_id',member_value,'payment_id',p_payment_id));
  return member_value;
end;
$$;
revoke all on function mb_private.mb_activate_membership(uuid,uuid) from public, anon;
grant execute on function mb_private.mb_activate_membership(uuid,uuid) to authenticated;
create or replace function public.mb_activate_membership(p_application_id uuid, p_payment_id uuid)
returns uuid language sql security invoker set search_path = ''
as $$ select mb_private.mb_activate_membership(p_application_id,p_payment_id) $$;
revoke all on function public.mb_activate_membership(uuid,uuid) from public, anon;
grant execute on function public.mb_activate_membership(uuid,uuid) to authenticated;

create or replace function mb_private.mb_accept_offer(p_offer_id uuid)
returns void language plpgsql security definer set search_path = ''
as $$
declare offer_row public.mb_offers%rowtype;
begin
  select * into offer_row from public.mb_offers where id=p_offer_id for update;
  if offer_row.id is null or not exists (
    select 1 from public.mb_purchase_requests r
    where r.id=offer_row.request_id and r.buyer_id=auth.uid() and r.status='open'
  ) then raise exception 'Buyer request not found'; end if;
  -- An expired or revoked supplier cannot enter a new acceptance transaction.
  if not exists (
    select 1 from public.mb_company_applications a
    join public.mb_company_verifications v on v.application_id=a.id and v.verified
    join public.mb_company_memberships m on m.application_id=a.id
    where a.id=offer_row.application_id and a.owner_id=offer_row.supplier_id
      and a.account_role='supplier' and m.started_at<=now() and m.ends_at>now()
  ) then raise exception 'Supplier membership is not active'; end if;
  if offer_row.accepted_at is null then
    update public.mb_offers set accepted_at=now() where id=p_offer_id;
  end if;
end;
$$;
revoke all on function mb_private.mb_accept_offer(uuid) from public, anon;
grant execute on function mb_private.mb_accept_offer(uuid) to authenticated;
create or replace function public.mb_accept_offer(p_offer_id uuid)
returns void language sql security invoker set search_path = ''
as $$ select mb_private.mb_accept_offer(p_offer_id) $$;
revoke all on function public.mb_accept_offer(uuid) from public, anon;
grant execute on function public.mb_accept_offer(uuid) to authenticated;

commit;

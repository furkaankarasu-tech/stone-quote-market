-- Run once after 20260925_market_membership.sql.
-- Keep the pending Auth user so Supabase can deliver and verify the email.
-- Create its marketplace profile/application only after email confirmation.
begin;

drop trigger if exists mb_on_auth_user_created on auth.users;
drop trigger if exists mb_on_auth_user_confirmed on auth.users;
create trigger mb_on_auth_user_confirmed
after update of email_confirmed_at on auth.users
for each row
when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
execute function mb_private.mb_capture_signup();

-- An old, unconfirmed profile may predate this migration. It still must not
-- create purchase requests, even if an unexpected session is issued.
create or replace function mb_private.mb_is_email_confirmed()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from auth.users u
    where u.id = (select auth.uid()) and u.email_confirmed_at is not null
  );
$$;
revoke all on function mb_private.mb_is_email_confirmed() from public, anon;
grant execute on function mb_private.mb_is_email_confirmed() to authenticated;

create or replace function public.mb_is_email_confirmed()
returns boolean language sql stable security invoker set search_path = ''
as $$ select mb_private.mb_is_email_confirmed() $$;
revoke all on function public.mb_is_email_confirmed() from public, anon;
grant execute on function public.mb_is_email_confirmed() to authenticated;

drop policy if exists mb_requests_insert on public.mb_purchase_requests;
create policy mb_requests_insert on public.mb_purchase_requests for insert to authenticated
with check (
  (select public.mb_is_email_confirmed())
  and buyer_id = (select auth.uid()) and status = 'open'
  and exists (
    select 1 from public.mb_profiles p
    where p.user_id = (select auth.uid()) and p.account_role = 'buyer'
  )
);

drop policy if exists mb_offers_insert on public.mb_offers;
create policy mb_offers_insert on public.mb_offers for insert to authenticated
with check (
  (select public.mb_is_email_confirmed())
  and supplier_id = (select auth.uid())
  and (select public.mb_active_supplier(application_id))
  and exists (
    select 1 from public.mb_purchase_requests r
    where r.id = request_id and r.status = 'open'
      and r.buyer_id <> (select auth.uid())
  )
);

commit;

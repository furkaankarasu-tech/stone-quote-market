-- Run after 20260925_market_membership.sql and 20260925_email_confirmation_gate.sql.
-- Only a firm's approved public name, city and activity reach this endpoint.
-- Publication also requires the firm's explicit, revocable directory choice.
begin;

create or replace function public.mb_list_directory_companies()
returns table (
  name text,
  city text,
  activity_type text,
  section text
)
language sql stable security definer set search_path = ''
as $$
  select a.company_name,
         left(coalesce(a.company_details->>'city', ''), 80),
         a.company_details->>'activity_type',
         case when a.account_role = 'service' then 'services' else 'machines' end
  from public.mb_company_applications a
  join auth.users u on u.id = a.owner_id
  join public.mb_company_verifications v on v.application_id = a.id and v.verified = true
  where u.email_confirmed_at is not null
    and u.raw_user_meta_data->>'directory_consent' = 'true'
    and (
      a.account_role = 'service'
      or (a.account_role = 'supplier'
          and a.company_details->>'activity_type' in ('machine', 'supplies'))
    )
    and exists (
      select 1 from public.mb_company_memberships m
      where m.application_id = a.id
        and m.started_at <= now() and m.ends_at > now()
    )
  order by a.company_name, a.id
  limit 500;
$$;

revoke all on function public.mb_list_directory_companies() from public, anon, authenticated;
grant execute on function public.mb_list_directory_companies() to anon, authenticated;

commit;

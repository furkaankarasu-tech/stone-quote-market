-- Run after 20260925_market_membership.sql and 20260925_email_confirmation_gate.sql.
-- An application appears after email confirmation. Only administrators can update contact status.
begin;

alter table public.mb_company_applications
  add column if not exists contacted_at timestamptz,
  add column if not exists contacted_by uuid references auth.users(id) on delete set null;

alter table public.mb_review_events
  drop constraint if exists mb_review_events_action_check;
alter table public.mb_review_events
  add constraint mb_review_events_action_check
  check (action in ('verified', 'verification_revoked', 'payment_confirmed', 'activated',
                   'contacted', 'contact_reset'));

create or replace function mb_private.mb_set_application_contacted(
  p_application_id uuid, p_contacted boolean
)
returns void language plpgsql security definer set search_path = ''
as $$
declare was_contacted boolean;
begin
  if not mb_private.mb_is_admin() then
    raise exception 'Administrator required';
  end if;
  if p_application_id is null or p_contacted is null then
    raise exception 'Application and contact state are required';
  end if;

  select contacted_at is not null into was_contacted
  from public.mb_company_applications
  where id = p_application_id for update;
  if not found then raise exception 'Application not found'; end if;
  if was_contacted = p_contacted then return; end if;

  update public.mb_company_applications
  set contacted_at = case when p_contacted then now() else null end,
      contacted_by = case when p_contacted then auth.uid() else null end
  where id = p_application_id;

  insert into public.mb_review_events(application_id, actor_id, action)
  values (p_application_id, auth.uid(), case when p_contacted then 'contacted' else 'contact_reset' end);
end;
$$;
revoke all on function mb_private.mb_set_application_contacted(uuid,boolean) from public, anon;
grant execute on function mb_private.mb_set_application_contacted(uuid,boolean) to authenticated;

create or replace function public.mb_set_application_contacted(
  p_application_id uuid, p_contacted boolean
)
returns void language sql security invoker set search_path = ''
as $$ select mb_private.mb_set_application_contacted(p_application_id, p_contacted) $$;
revoke all on function public.mb_set_application_contacted(uuid,boolean) from public, anon;
grant execute on function public.mb_set_application_contacted(uuid,boolean) to authenticated;

commit;

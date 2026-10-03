-- Marble Borsa: transactional email alerts for newly inserted offers.
-- Run ONCE in Supabase SQL Editor. Does not change mb_offers or its RLS.
-- Configure a Supabase Database Webhook for INSERT on public.mb_offers separately.

begin;

create schema if not exists mb_private;

create table if not exists mb_private.mb_offer_email_notifications (
  offer_id uuid primary key references public.mb_offers(id) on delete cascade,
  status text not null default 'sending' check (status in ('sending', 'sent', 'failed')),
  attempts integer not null default 1 check (attempts between 1 and 10),
  claimed_at timestamptz not null default now(),
  completed_at timestamptz,
  provider_id text
);

alter table mb_private.mb_offer_email_notifications enable row level security;
revoke all on mb_private.mb_offer_email_notifications from public, anon, authenticated;
revoke all on schema mb_private from anon;

-- Resolve the destination ONLY on the server. No client can query this function.
create or replace function public.mb_offer_notification_recipient(p_offer_id uuid)
returns table(item text, buyer_email text)
language sql stable
security definer
set search_path = ''
as $$
  select r.item, u.email
  from public.mb_offers o
  join public.mb_purchase_requests r on r.id = o.request_id
  join auth.users u on u.id = r.buyer_id
  where o.id = p_offer_id and u.email_confirmed_at is not null and u.email is not null;
$$;

create or replace function public.mb_claim_offer_email_notification(p_offer_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected integer := 0;
begin
  insert into mb_private.mb_offer_email_notifications (offer_id, status, attempts, claimed_at)
  values (p_offer_id, 'sending', 1, now())
  on conflict (offer_id) do update
    set status = 'sending',
        attempts = mb_private.mb_offer_email_notifications.attempts + 1,
        claimed_at = now()
  where mb_private.mb_offer_email_notifications.attempts < 10
    and (
      mb_private.mb_offer_email_notifications.status = 'failed'
      or (mb_private.mb_offer_email_notifications.status = 'sending'
          and mb_private.mb_offer_email_notifications.claimed_at < now() - interval '5 minutes')
    );
  get diagnostics affected = row_count;
  return affected > 0;
end;
$$;

create or replace function public.mb_finish_offer_email_notification(
  p_offer_id uuid,
  p_sent boolean,
  p_provider_id text default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected integer := 0;
begin
  update mb_private.mb_offer_email_notifications
     set status = case when p_sent then 'sent' else 'failed' end,
         completed_at = now(),
         provider_id = case when p_sent then left(p_provider_id, 200) else null end
   where offer_id = p_offer_id and status = 'sending';
  get diagnostics affected = row_count;
  return affected > 0;
end;
$$;

revoke all on function public.mb_offer_notification_recipient(uuid) from public, anon, authenticated;
revoke all on function public.mb_claim_offer_email_notification(uuid) from public, anon, authenticated;
revoke all on function public.mb_finish_offer_email_notification(uuid,boolean,text) from public, anon, authenticated;
grant execute on function public.mb_offer_notification_recipient(uuid) to service_role;
grant execute on function public.mb_claim_offer_email_notification(uuid) to service_role;
grant execute on function public.mb_finish_offer_email_notification(uuid,boolean,text) to service_role;

commit;

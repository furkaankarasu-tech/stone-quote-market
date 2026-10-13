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

-- ALL MEMBERS / REQUEST ADMINISTRATION (2026-10-12, repeat-safe).
-- Install functions only. This migration does NOT cancel any live requests.
begin;
create or replace function public.mb_admin_list_users(p_search text default '',p_role text default '',p_offset integer default 0)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare result jsonb; search_value text := left(coalesce(p_search,''),120);
begin
  if auth.uid() is null or not public.mb_is_admin() or not public.mb_is_email_confirmed() then
    raise exception 'Administrator required' using errcode='42501';
  end if;
  if p_offset is null or p_offset < 0 or coalesce(p_role,'') not in ('','buyer','supplier','service') then
    raise exception 'Invalid filter' using errcode='22023';
  end if;
  with filtered as (
    select u.id as user_id,coalesce(p.full_name,'') as full_name,u.email,
      coalesce(p.account_role,'buyer') as account_role,u.created_at,u.last_sign_in_at,
      u.email_confirmed_at,coalesce(u.banned_until > now(),false) as blocked
    from auth.users u left join public.mb_profiles p on p.user_id=u.id
    where (coalesce(p_role,'')='' or p.account_role=p_role)
      and (search_value='' or strpos(lower(coalesce(u.email,'')||' '||coalesce(p.full_name,'')),lower(search_value))>0)
  ), page as (select * from filtered order by created_at desc,user_id limit 50 offset p_offset)
  select jsonb_build_object('viewer_id',auth.uid(),'total',(select count(*) from filtered),'rows',coalesce((select jsonb_agg(to_jsonb(page)||jsonb_build_object('is_admin',mb_private.mb_user_is_admin(page.user_id)) order by created_at desc,user_id) from page),'[]'::jsonb)) into result;
  return result;
end; $$;
revoke all on function public.mb_admin_list_users(text,text,integer) from public,anon;
grant execute on function public.mb_admin_list_users(text,text,integer) to authenticated;

create or replace function public.mb_admin_list_requests(p_offset integer default 0)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare result jsonb; snapshot_at timestamptz := now();
begin
  if auth.uid() is null or not public.mb_is_admin() or not public.mb_is_email_confirmed() then
    raise exception 'Administrator required' using errcode='42501';
  end if;
  if p_offset is null or p_offset < 0 then raise exception 'Invalid offset' using errcode='22023'; end if;
  with page as (
    select r.id,r.item,r.quantity,r.unit,r.destination,r.status,r.created_at,
      coalesce(p.full_name,'') as buyer_name,u.email as buyer_email
    from public.mb_purchase_requests r
    left join public.mb_profiles p on p.user_id=r.buyer_id
    left join auth.users u on u.id=r.buyer_id
    order by r.created_at desc,r.id limit 50 offset p_offset
  )
  select jsonb_build_object('total',(select count(*) from public.mb_purchase_requests),
    'open_count',(select count(*) from public.mb_purchase_requests where status='open' and created_at<=snapshot_at),
    'snapshot_at',snapshot_at,'rows',coalesce((select jsonb_agg(to_jsonb(page) order by created_at desc,id) from page),'[]'::jsonb)) into result;
  return result;
end; $$;
revoke all on function public.mb_admin_list_requests(integer) from public,anon;
grant execute on function public.mb_admin_list_requests(integer) to authenticated;

create table if not exists public.mb_request_admin_events (
  id uuid primary key default gen_random_uuid(),actor_id uuid not null references auth.users(id),
  occurred_at timestamptz not null default now(),closed_request_ids uuid[] not null
);
alter table public.mb_request_admin_events enable row level security;
revoke all on public.mb_request_admin_events from anon,authenticated;

create or replace function public.mb_admin_close_requests(p_snapshot_at timestamptz,p_expected_count integer)
returns integer language plpgsql security definer set search_path = '' as $$
declare request_ids uuid[]; changed integer;
begin
  if auth.uid() is null or not public.mb_is_admin() or not public.mb_is_email_confirmed() then
    raise exception 'Administrator required' using errcode='42501';
  end if;
  if p_snapshot_at is null or p_snapshot_at>now() or p_expected_count is null or p_expected_count<1 then
    raise exception 'Invalid confirmation' using errcode='22023';
  end if;
  -- Lock in UUID order, matching the existing offer insertion row lock.
  select array_agg(locked.id) into request_ids from (
    select id from public.mb_purchase_requests where status='open' and created_at<=p_snapshot_at
    order by id for update
  ) locked;
  if coalesce(cardinality(request_ids),0)<>p_expected_count then
    raise exception 'Requests changed; refresh before confirming' using errcode='40001';
  end if;
  update public.mb_purchase_requests set status='closed' where id=any(request_ids);
  get diagnostics changed=row_count;
  insert into public.mb_request_admin_events(actor_id,closed_request_ids) values(auth.uid(),request_ids);
  return changed;
end; $$;
revoke all on function public.mb_admin_close_requests(timestamptz,integer) from public,anon;
grant execute on function public.mb_admin_close_requests(timestamptz,integer) to authenticated;
commit;

-- MEMBER ACTIONS AND SINGLE REQUEST CLOSING (2026-10-12, repeat-safe).
begin;
create table if not exists mb_private.mb_admin_overrides (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null,changed_at timestamptz not null default now(),changed_by uuid not null
);
alter table mb_private.mb_admin_overrides enable row level security;
revoke all on mb_private.mb_admin_overrides from public,anon,authenticated;

-- Copy the installed admin predicate once, then keep its original OID for RLS.
do $capture_admin_predicate$
declare definition text;
begin
  if to_regprocedure('mb_private.mb_is_admin_original()') is null then
    if to_regprocedure('mb_private.mb_is_admin()') is null then
      raise exception 'Existing mb_private.mb_is_admin() is required. No admin policies changed.';
    end if;
    select pg_get_functiondef(to_regprocedure('mb_private.mb_is_admin()')) into definition;
    execute regexp_replace(definition,'^CREATE OR REPLACE FUNCTION mb_private\.mb_is_admin\(',
      'CREATE OR REPLACE FUNCTION mb_private.mb_is_admin_original(');
  end if;
end;
$capture_admin_predicate$;
revoke all on function mb_private.mb_is_admin_original() from public,anon,authenticated;
create or replace function mb_private.mb_is_admin()
returns boolean language sql stable security definer set search_path='' as $$
  select auth.uid() is not null
    and exists(select 1 from auth.users u where u.id=auth.uid() and coalesce(u.banned_until <= now(),true))
    and coalesce((select o.enabled from mb_private.mb_admin_overrides o where o.user_id=auth.uid()),
      mb_private.mb_is_admin_original(),false);
$$;
create or replace function public.mb_is_admin()
returns boolean language sql stable security invoker set search_path='' as $$ select mb_private.mb_is_admin() $$;
revoke all on function mb_private.mb_is_admin() from public,anon;
grant execute on function mb_private.mb_is_admin() to authenticated;
revoke all on function public.mb_is_admin() from public,anon;
grant execute on function public.mb_is_admin() to authenticated;

-- Internal only: evaluate the existing per-user predicate without exposing claims.
create or replace function mb_private.mb_user_is_admin(p_user_id uuid)
returns boolean language plpgsql security definer set search_path='' as $$
declare old_sub text := current_setting('request.jwt.claim.sub',true);
declare old_claims text := current_setting('request.jwt.claims',true);
declare result boolean;
begin
  perform set_config('request.jwt.claim.sub',p_user_id::text,true);
  perform set_config('request.jwt.claims',jsonb_set(coalesce(nullif(old_claims,'')::jsonb,'{}'::jsonb),'{sub}',to_jsonb(p_user_id::text))::text,true);
  result := mb_private.mb_is_admin();
  perform set_config('request.jwt.claim.sub',coalesce(old_sub,''),true);
  perform set_config('request.jwt.claims',coalesce(old_claims,''),true);
  return coalesce(result,false);
exception when others then
  perform set_config('request.jwt.claim.sub',coalesce(old_sub,''),true);
  perform set_config('request.jwt.claims',coalesce(old_claims,''),true);
  raise;
end; $$;
revoke all on function mb_private.mb_user_is_admin(uuid) from public,anon,authenticated;

create or replace function public.mb_admin_set_user_admin(p_user_id uuid,p_enabled boolean,p_confirmation text)
returns void language plpgsql security definer set search_path='' as $$
declare target auth.users%rowtype; actor uuid:=auth.uid();
begin
  lock table mb_private.mb_admin_overrides in share row exclusive mode;
  if actor is null or not coalesce(public.mb_is_admin(),false) or not coalesce(public.mb_is_email_confirmed(),false) then
    raise exception 'Administrator required' using errcode='42501';
  end if;
  if actor=p_user_id then raise exception 'Self administration is not allowed' using errcode='42501'; end if;
  select * into target from auth.users where id=p_user_id for update;
  if not found or p_enabled is null then raise exception 'User not found' using errcode='22023'; end if;
  if p_confirmation is distinct from target.email then raise exception 'Email confirmation mismatch' using errcode='22023'; end if;
  if p_enabled and (target.email_confirmed_at is null or coalesce(target.banned_until>now(),false)) then
    raise exception 'Confirm email and enable account before granting administration' using errcode='42501';
  end if;
  insert into mb_private.mb_admin_overrides(user_id,enabled,changed_by)
    values(p_user_id,p_enabled,actor)
    on conflict(user_id) do update set enabled=excluded.enabled,changed_at=now(),changed_by=excluded.changed_by;
end; $$;
revoke all on function public.mb_admin_set_user_admin(uuid,boolean,text) from public,anon;
grant execute on function public.mb_admin_set_user_admin(uuid,boolean,text) to authenticated;

create or replace function public.mb_admin_close_request(p_request_id uuid)
returns void language plpgsql security definer set search_path='' as $$
declare target public.mb_purchase_requests%rowtype;
begin
  if auth.uid() is null or not coalesce(public.mb_is_admin(),false) or not coalesce(public.mb_is_email_confirmed(),false) then
    raise exception 'Administrator required' using errcode='42501';
  end if;
  select * into target from public.mb_purchase_requests where id=p_request_id for update;
  if not found then raise exception 'Request not found' using errcode='22023'; end if;
  if target.status='closed' then return; end if;
  update public.mb_purchase_requests set status='closed' where id=p_request_id;
  insert into public.mb_request_admin_events(actor_id,closed_request_ids) values(auth.uid(),array[p_request_id]);
end; $$;
revoke all on function public.mb_admin_close_request(uuid) from public,anon;
grant execute on function public.mb_admin_close_request(uuid) to authenticated;

create or replace function public.mb_admin_delete_user(p_user_id uuid,p_confirmation text)
returns void language plpgsql security definer set search_path='' as $$
declare target auth.users%rowtype; company record;
begin
  lock table mb_private.mb_admin_overrides in share row exclusive mode;
  if auth.uid() is null or not coalesce(public.mb_is_admin(),false) or not coalesce(public.mb_is_email_confirmed(),false) then
    raise exception 'Administrator required' using errcode='42501';
  end if;
  if p_user_id=auth.uid() then raise exception 'Self deletion is not allowed' using errcode='42501'; end if;
  select * into target from auth.users where id=p_user_id for update;
  if not found then raise exception 'User not found' using errcode='22023'; end if;
  if p_confirmation is distinct from target.email then raise exception 'Email confirmation mismatch' using errcode='22023'; end if;
  if mb_private.mb_user_is_admin(p_user_id) then raise exception 'Remove administration before deleting this user' using errcode='42501'; end if;
  -- Storage objects must be removed through Storage API, not SQL metadata deletion.
  if exists(select 1 from storage.objects o where coalesce(to_jsonb(o)->>'owner_id',to_jsonb(o)->>'owner')=p_user_id::text) then
    raise exception 'Storage files must be removed before deleting this account' using errcode='23503';
  end if;
  if exists(select 1 from public.mb_request_admin_events where actor_id=p_user_id) then
    raise exception 'This account has administration audit records and cannot be permanently deleted' using errcode='23503';
  end if;
  for company in select id,company_name from public.mb_company_applications where owner_id=p_user_id order by id for update loop
    perform mb_private.mb_admin_delete_company(company.id,company.company_name);
  end loop;
  delete from public.mb_offers where supplier_id=p_user_id or request_id in (select id from public.mb_purchase_requests where buyer_id=p_user_id);
  delete from public.mb_purchase_requests where buyer_id=p_user_id;
  delete from public.mb_legal_acknowledgements where user_id=p_user_id;
  delete from public.mb_profiles where user_id=p_user_id;
  delete from auth.users where id=p_user_id;
end; $$;
revoke all on function public.mb_admin_delete_user(uuid,text) from public,anon;
grant execute on function public.mb_admin_delete_user(uuid,text) to authenticated;
commit;


-- CATALOGUE PHOTO COUNT AND STONE SUPPLIER GATE (2026-10-13)
begin;
-- Keep the existing publication, membership and visibility rules.
-- Only published stone-to-supplier associations are gated; company directory remains public.
create or replace function mb_private.mb_catalog_viewer_verified()
returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from auth.users u where u.id=auth.uid() and u.email_confirmed_at is not null and (u.banned_until is null or u.banned_until<=now()))
$$;
revoke all on function mb_private.mb_catalog_viewer_verified() from public,anon,authenticated;
do $migration$
declare f oid; definition text; result_type text; projections text; c record; expression text; replaced text;
begin
 f:=to_regprocedure('public.mb_list_catalog_items()');
 if f is null then raise exception 'mb_list_catalog_items() not found. Install the existing catalogue schema first.'; end if;
 -- Restrict changes to catalogue routines and image-array counts. Other validations stay intact.
 for c in select p.oid from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname in ('public','mb_private') and p.prokind='f'
  and p.proname like 'mb_%catalog%' and p.proname not in ('mb_catalog_viewer_verified') loop
  definition:=pg_get_functiondef(c.oid);
  replaced:=regexp_replace(definition,'((?:cardinality|array_length)\([^)]*image_paths[^)]*\)[[:space:]]*(?:>=|<)[[:space:]]*)3\M','\1 1','gi');
  replaced:=regexp_replace(replaced,'((?:cardinality|array_length)\([^)]*image_paths[^)]*\)[[:space:]]+between[[:space:]]+)3\M','\1 1','gi');
  replaced:=regexp_replace(replaced,'((?:cardinality|array_length)\([^)]*image_paths[^)]*\)[[:space:]]*(?:<=|>)[[:space:]]*)2\M','\1 0','gi');
  if replaced<>definition then execute replaced; end if;
 end loop;
 if to_regprocedure('mb_private.mb_catalog_listing_before_gate()') is null then
  definition:=pg_get_functiondef(f);
  definition:=regexp_replace(definition,'CREATE OR REPLACE FUNCTION public\.mb_list_catalog_items\(', 'CREATE OR REPLACE FUNCTION mb_private.mb_catalog_listing_before_gate(');
  -- Preserve the original business rules while lowering image-count filters.

  execute definition;
 end if;
 result_type:=pg_get_function_result(f);
 if result_type not like 'TABLE(%' then raise exception 'Unexpected catalogue RPC return type: %',result_type; end if;
 select string_agg(case when name not in ('id','title','category','image_paths') then
  format('case when c.category = ''stone'' and not mb_private.mb_catalog_viewer_verified() then null::%s else c.%I end as %I',format_type(typ,null),name,name)
 else format('c.%I',name) end,', ' order by ord)
 into projections
 from pg_proc p cross join lateral unnest(p.proallargtypes,p.proargmodes,p.proargnames) with ordinality as a(typ,mode,name,ord)
 where p.oid=f and mode in ('t','o');
 execute format('create or replace function public.mb_list_catalog_items() returns %s language sql stable security definer set search_path = '''' as $body$ select %s from mb_private.mb_catalog_listing_before_gate() c $body$',result_type,projections);
 -- Lower only image-count CHECK constraints, keeping other validations intact.
 for c in select conname,pg_get_expr(conbin,conrelid) expr from pg_constraint where conrelid='public.mb_catalog_items'::regclass and contype='c' loop
  expression:=c.expr;
  if expression like '%image_paths%' then
   replaced:=regexp_replace(expression,'((?:cardinality|array_length)\([^)]*image_paths[^)]*\)[[:space:]]*>=[[:space:]]*)3\M','\1 1','gi');
   replaced:=regexp_replace(replaced,'((?:cardinality|array_length)\([^)]*image_paths[^)]*\)[[:space:]]*>[[:space:]]*)2\M','\1 0','gi');
   if replaced<>expression then
    execute format('alter table public.mb_catalog_items drop constraint %I',c.conname);
    execute format('alter table public.mb_catalog_items add constraint %I check (%s)',c.conname,replaced);
   end if;
  end if;
 end loop;
 -- The public redacting RPC is the only anonymous catalogue function.
 for c in select p.oid from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='mb_private' and p.prokind='f' and p.proname like 'mb_%catalog%' loop
  execute format('revoke all on function %s from public, anon',c.oid::regprocedure);
 end loop;
 if to_regprocedure('mb_private.mb_list_catalog_items()') is not null then
  execute 'revoke all on function mb_private.mb_list_catalog_items() from authenticated';
 end if;
end
$migration$;
revoke all on function mb_private.mb_catalog_listing_before_gate() from public,anon,authenticated;
revoke all on function public.mb_list_catalog_items() from public;
grant execute on function public.mb_list_catalog_items() to anon,authenticated;
commit;

-- ADMIN DOCUMENT ACCESS AND CONTACT TRACKING (2026-10-13)
begin;
-- Admin contact tracking; existing applications and uploaded files are preserved.
alter table public.mb_company_applications
 add column if not exists contacted_at timestamptz,
 add column if not exists contacted_by uuid;

create table if not exists public.mb_application_contact_events (
 id uuid primary key default gen_random_uuid(),
 application_id uuid not null references public.mb_company_applications(id) on delete cascade,
 actor_id uuid not null,
 action text not null check (action in ('contacted','contact_reset')),
 occurred_at timestamptz not null default now()
);
alter table public.mb_application_contact_events enable row level security;
revoke all on table public.mb_application_contact_events from public, anon, authenticated;
grant select on table public.mb_application_contact_events to authenticated;
drop policy if exists mb_contact_events_admin_read on public.mb_application_contact_events;
create policy mb_contact_events_admin_read on public.mb_application_contact_events
 for select to authenticated using (
  (select public.mb_is_admin()) and (select public.mb_is_email_confirmed())
 );

create or replace function mb_private.mb_set_application_contacted(p_application_id uuid,p_contacted boolean)
returns void language plpgsql security definer set search_path='' as $$
declare application_row public.mb_company_applications%rowtype;
begin
 if auth.uid() is null or not coalesce(public.mb_is_admin(),false)
  or not coalesce(public.mb_is_email_confirmed(),false) then
  raise exception 'Admin access required' using errcode='42501';
 end if;
 if p_contacted is null then raise exception 'Contact status required' using errcode='22023'; end if;
 select * into application_row from public.mb_company_applications where id=p_application_id for update;
 if not found then raise exception 'Application not found' using errcode='P0002'; end if;
 -- Repeated clicks preserve the first contact timestamp and do not create duplicate events.
 if (application_row.contacted_at is not null)=p_contacted then return; end if;
 update public.mb_company_applications set
 contacted_at=case when p_contacted then now() else null end,
 contacted_by=case when p_contacted then auth.uid() else null end
 where id=p_application_id;
 insert into public.mb_application_contact_events(application_id,actor_id,action)
 values(p_application_id,auth.uid(),case when p_contacted then 'contacted' else 'contact_reset' end);
end;
$$;
revoke all on function mb_private.mb_set_application_contacted(uuid,boolean) from public,anon;
grant execute on function mb_private.mb_set_application_contacted(uuid,boolean) to authenticated;
create or replace function public.mb_set_application_contacted(p_application_id uuid,p_contacted boolean)
returns void language sql security invoker set search_path='' as $$
 select mb_private.mb_set_application_contacted(p_application_id,p_contacted)
$$;
revoke all on function public.mb_set_application_contacted(uuid,boolean) from public,anon;
grant execute on function public.mb_set_application_contacted(uuid,boolean) to authenticated;

-- Lookup runs under an explicit admin gate: an RLS-filtered empty Storage list
-- must not be mistaken for a missing document.
create or replace function mb_private.mb_admin_company_document(p_owner_id uuid)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare document_name text;
begin
 if auth.uid() is null or not coalesce(public.mb_is_admin(),false)
  or not coalesce(public.mb_is_email_confirmed(),false) then
  raise exception 'Admin access required' using errcode='42501';
 end if;
 if not exists(select 1 from public.mb_company_applications where owner_id=p_owner_id) then
  raise exception 'Application not found' using errcode='P0002';
 end if;
 select o.name into document_name from storage.objects o
 where o.bucket_id='mb-company-documents-private'
  and o.name like p_owner_id::text || '/company-document/%'
  and o.name ~* '^[0-9a-f-]{36}/company-document/[^/]+\.(pdf|png|jpe?g)$'
 order by coalesce(o.updated_at,o.created_at) desc,o.id desc limit 1;
 if document_name is null then return null; end if;
 return jsonb_build_object('path',document_name);
end;
$$;
revoke all on function mb_private.mb_admin_company_document(uuid) from public,anon;
grant execute on function mb_private.mb_admin_company_document(uuid) to authenticated;
create or replace function public.mb_admin_company_document(p_owner_id uuid)
returns jsonb language sql stable security invoker set search_path='' as $$
 select mb_private.mb_admin_company_document(p_owner_id)
$$;
revoke all on function public.mb_admin_company_document(uuid) from public,anon;
grant execute on function public.mb_admin_company_document(uuid) to authenticated;

-- Preserve private storage. Grant admins only SELECT so signed URLs can be created.
do $$ begin
 if not exists(select 1 from storage.buckets where id='mb-company-documents-private') then
  raise exception 'Company documents bucket is missing; install the company verification schema first.';
 end if;
end $$;
update storage.buckets set public=false where id='mb-company-documents-private';
drop policy if exists mb_company_documents_admin_read_v2 on storage.objects;
create policy mb_company_documents_admin_read_v2 on storage.objects
 for select to authenticated using (
  bucket_id='mb-company-documents-private'
  and (select public.mb_is_admin()) and (select public.mb_is_email_confirmed())
 );
notify pgrst,'reload schema';
commit;

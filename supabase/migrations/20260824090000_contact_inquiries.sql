-- Stage 9: secure public inquiries, newsletter consent, and database-backed rate limits.
-- Run this migration in the connected Supabase project before enabling submissions.

create table if not exists public.services (
  id uuid primary key,
  slug text not null unique,
  title text not null,
  is_active boolean not null default true,
  sort_order smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint services_sort_order_positive check (sort_order > 0)
);

insert into public.services (id, slug, title, sort_order)
values
  ('8f40a393-06f3-49c6-9d98-350a278f6c03', 'video-editing', 'Video Editing', 1),
  ('42e81676-4c0e-421b-abce-fcc8304fb249', '2d-and-3d-animation', '2D & 3D Animation', 2),
  ('4c29dc24-07cf-4812-92b3-a80317b34da1', 'saas-video', 'SaaS Video', 3),
  ('08016a2d-beff-4d52-8423-8fcbca37aecb', 'graphic-design', 'Graphic Design', 4),
  ('16459520-5f00-4673-8f8d-60559a9fdb25', 'ai-animation', 'AI Animation', 5),
  ('4531277e-0d26-4994-b632-13f3245ee328', 'web-development', 'Web Development', 6),
  ('e1738033-c5ab-4fa2-8da4-71e6a6e8bfac', 'ai-automation', 'AI Automation', 7),
  ('bef5495e-b88a-4c97-b2a6-3bb370e6a962', 'facebook-and-meta-ads', 'Facebook & Meta Ads', 8),
  ('e3e68584-f56c-4225-9077-863b798f67be', 'cgi-and-vfx', 'CGI & VFX', 9)
on conflict (id) do update
set
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  updated_at = now();

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  inquiry_type text not null,
  name text not null,
  email text not null,
  contact_number text,
  company_brand text,
  preferred_timeline text,
  brief text,
  specialty text,
  portfolio_url text,
  availability text,
  collaboration_message text,
  privacy_consent boolean not null,
  newsletter_consent boolean not null default false,
  status text not null default 'new',
  is_read boolean not null default false,
  notification_status text not null default 'pending',
  submitted_from text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inquiries_type_allowed check (inquiry_type in ('client', 'partner')),
  constraint inquiries_name_length check (char_length(name) between 2 and 100),
  constraint inquiries_email_length check (char_length(email) between 3 and 254),
  constraint inquiries_privacy_required check (privacy_consent is true),
  constraint inquiries_status_allowed check (status in ('new', 'in_progress', 'closed', 'spam')),
  constraint inquiries_notification_status_allowed check (
    notification_status in ('pending', 'sent', 'failed', 'skipped')
  ),
  constraint inquiries_type_fields check (
    (
      inquiry_type = 'client'
      and preferred_timeline in (
        'as-soon-as-practical',
        'within-one-month',
        'one-to-three-months',
        'more-than-three-months',
        'flexible'
      )
      and char_length(brief) between 20 and 5000
      and specialty is null
      and portfolio_url is null
      and availability is null
      and collaboration_message is null
    )
    or
    (
      inquiry_type = 'partner'
      and char_length(specialty) between 2 and 120
      and portfolio_url ~ '^https?://'
      and availability in (
        'available-now',
        'within-one-month',
        'future-projects',
        'project-dependent'
      )
      and char_length(collaboration_message) between 20 and 5000
      and company_brand is null
      and preferred_timeline is null
      and brief is null
    )
  )
);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);
create index if not exists inquiries_type_status_idx
  on public.inquiries (inquiry_type, status, is_read);
create index if not exists inquiries_email_lower_idx
  on public.inquiries (lower(email));

create table if not exists public.inquiry_services (
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (inquiry_id, service_id)
);

create index if not exists inquiry_services_service_id_idx
  on public.inquiry_services (service_id, created_at desc);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  email_normalized text generated always as (lower(btrim(email))) stored,
  status text not null default 'subscribed',
  consent_granted boolean not null,
  consent_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  last_source text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_email_length check (char_length(email) between 3 and 254),
  constraint newsletter_consent_required check (consent_granted is true),
  constraint newsletter_status_allowed check (status in ('subscribed', 'unsubscribed')),
  constraint newsletter_email_unique unique (email_normalized)
);

create table if not exists public.submission_rate_limits (
  scope text not null,
  identifier_hash text not null,
  window_started_at timestamptz not null,
  request_count integer not null default 1,
  updated_at timestamptz not null default now(),
  primary key (scope, identifier_hash),
  constraint submission_rate_scope_length check (char_length(scope) between 1 and 40),
  constraint submission_rate_hash_format check (identifier_hash ~ '^[a-f0-9]{64}$'),
  constraint submission_rate_count_positive check (request_count > 0)
);

create index if not exists submission_rate_limits_updated_at_idx
  on public.submission_rate_limits (updated_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create or replace trigger inquiries_set_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

create or replace trigger newsletter_subscribers_set_updated_at
before update on public.newsletter_subscribers
for each row execute function public.set_updated_at();

create or replace function public.consume_submission_rate_limit(
  p_scope text,
  p_identifier_hash text,
  p_max_requests integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_request_count integer;
  v_window_started_at timestamptz;
begin
  if p_max_requests < 1 or p_window_seconds < 1 then
    raise exception 'Invalid rate-limit configuration';
  end if;

  -- These pseudonymous identifiers are operational, not inquiry history.
  delete from public.submission_rate_limits
  where updated_at < clock_timestamp() - interval '24 hours';

  insert into public.submission_rate_limits (
    scope,
    identifier_hash,
    window_started_at,
    request_count,
    updated_at
  )
  values (p_scope, p_identifier_hash, clock_timestamp(), 1, clock_timestamp())
  on conflict (scope, identifier_hash) do update
  set
    window_started_at = case
      when public.submission_rate_limits.window_started_at
        <= clock_timestamp() - make_interval(secs => p_window_seconds)
      then clock_timestamp()
      else public.submission_rate_limits.window_started_at
    end,
    request_count = case
      when public.submission_rate_limits.window_started_at
        <= clock_timestamp() - make_interval(secs => p_window_seconds)
      then 1
      else public.submission_rate_limits.request_count + 1
    end,
    updated_at = clock_timestamp()
  returning request_count, window_started_at
  into v_request_count, v_window_started_at;

  return v_request_count <= p_max_requests;
end;
$$;

create or replace function public.subscribe_newsletter(
  p_email text,
  p_source text,
  p_consent_granted boolean
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_subscriber_id uuid;
begin
  if p_consent_granted is not true then
    raise exception 'Newsletter consent is required';
  end if;

  insert into public.newsletter_subscribers (
    email,
    status,
    consent_granted,
    consent_at,
    unsubscribed_at,
    last_source
  )
  values (lower(btrim(p_email)), 'subscribed', true, now(), null, p_source)
  on conflict (email_normalized) do update
  set
    email = excluded.email,
    status = 'subscribed',
    consent_granted = excluded.consent_granted,
    consent_at = excluded.consent_at,
    unsubscribed_at = null,
    last_source = excluded.last_source,
    updated_at = now()
  returning id into v_subscriber_id;

  return v_subscriber_id;
end;
$$;

create or replace function public.create_inquiry(
  p_payload jsonb,
  p_service_ids uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_inquiry_id uuid;
  v_inquiry_type text := p_payload ->> 'type';
  v_newsletter_consent boolean := coalesce(
    (p_payload ->> 'newsletterConsent')::boolean,
    false
  );
  v_selected_service_count integer;
begin
  if coalesce(cardinality(p_service_ids), 0) < 1 then
    raise exception 'At least one service is required';
  end if;

  select count(*)
  into v_selected_service_count
  from public.services
  where id = any(p_service_ids)
    and is_active is true;

  if v_selected_service_count <> cardinality(p_service_ids) then
    raise exception 'One or more services are unavailable';
  end if;

  insert into public.inquiries (
    inquiry_type,
    name,
    email,
    contact_number,
    company_brand,
    preferred_timeline,
    brief,
    specialty,
    portfolio_url,
    availability,
    collaboration_message,
    privacy_consent,
    newsletter_consent,
    submitted_from
  )
  values (
    v_inquiry_type,
    btrim(p_payload ->> 'name'),
    lower(btrim(p_payload ->> 'email')),
    nullif(btrim(p_payload ->> 'contactNumber'), ''),
    case when v_inquiry_type = 'client'
      then nullif(btrim(p_payload ->> 'companyBrand'), '')
      else null
    end,
    case when v_inquiry_type = 'client'
      then p_payload ->> 'preferredTimeline'
      else null
    end,
    case when v_inquiry_type = 'client'
      then btrim(p_payload ->> 'brief')
      else null
    end,
    case when v_inquiry_type = 'partner'
      then btrim(p_payload ->> 'specialty')
      else null
    end,
    case when v_inquiry_type = 'partner'
      then btrim(p_payload ->> 'portfolioUrl')
      else null
    end,
    case when v_inquiry_type = 'partner'
      then p_payload ->> 'availability'
      else null
    end,
    case when v_inquiry_type = 'partner'
      then btrim(p_payload ->> 'collaborationMessage')
      else null
    end,
    (p_payload ->> 'privacyConsent')::boolean,
    v_newsletter_consent,
    'website'
  )
  returning id into v_inquiry_id;

  insert into public.inquiry_services (inquiry_id, service_id)
  select v_inquiry_id, selected_service_id
  from unnest(p_service_ids) as selected_service_id;

  if v_newsletter_consent then
    perform public.subscribe_newsletter(
      p_payload ->> 'email',
      'inquiry-' || v_inquiry_type,
      v_newsletter_consent
    );
  end if;

  return v_inquiry_id;
end;
$$;

alter table public.services enable row level security;
alter table public.inquiries enable row level security;
alter table public.inquiry_services enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.submission_rate_limits enable row level security;

-- Public browser roles receive no table policies and cannot call privileged functions.
revoke all on table public.services from anon, authenticated;
revoke all on table public.inquiries from anon, authenticated;
revoke all on table public.inquiry_services from anon, authenticated;
revoke all on table public.newsletter_subscribers from anon, authenticated;
revoke all on table public.submission_rate_limits from anon, authenticated;
revoke all on function public.set_updated_at()
  from public, anon, authenticated;
revoke all on function public.consume_submission_rate_limit(text, text, integer, integer)
  from public, anon, authenticated;
revoke all on function public.subscribe_newsletter(text, text, boolean)
  from public, anon, authenticated;
revoke all on function public.create_inquiry(jsonb, uuid[])
  from public, anon, authenticated;

-- The server-only Supabase secret key executes as service_role.
grant select, insert, update, delete on table public.services to service_role;
grant select, insert, update, delete on table public.inquiries to service_role;
grant select, insert, update, delete on table public.inquiry_services to service_role;
grant select, insert, update, delete on table public.newsletter_subscribers to service_role;
grant select, insert, update, delete on table public.submission_rate_limits to service_role;
grant execute on function public.consume_submission_rate_limit(text, text, integer, integer)
  to service_role;
grant execute on function public.subscribe_newsletter(text, text, boolean) to service_role;
grant execute on function public.create_inquiry(jsonb, uuid[]) to service_role;

-- Stage 10: Supabase Auth, role-restricted CMS, media storage, inquiry operations, and audit history.
-- Apply after 20260825100000_add_social_media_marketing_service.sql.

begin;

-- Extend the Stage 9 service records into complete editable public content.
alter table public.services
  alter column id set default gen_random_uuid(),
  add column if not exists description text,
  add column if not exists hero_title text,
  add column if not exists meta_description text,
  add column if not exists image_path text,
  add column if not exists image_alt text,
  add column if not exists disciplines jsonb not null default '[]'::jsonb,
  add column if not exists useful_for jsonb not null default '[]'::jsonb,
  add column if not exists approach jsonb not null default '[]'::jsonb,
  add column if not exists related_slugs text[] not null default '{}'::text[],
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null;

-- Keep JSON-based CMS fields structurally safe even for direct API or SQL writes.
create or replace function public.cms_jsonb_is_string_array(value jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select case
    when jsonb_typeof(value) is distinct from 'array' then false
    else not exists (
      select 1
      from jsonb_array_elements(value) as entries(element)
      where jsonb_typeof(element) is distinct from 'string'
        or btrim(element #>> '{}') = ''
    )
  end;
$$;

create or replace function public.cms_jsonb_is_approach_array(value jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select case
    when jsonb_typeof(value) is distinct from 'array' then false
    else not exists (
      select 1
      from jsonb_array_elements(value) as entries(element)
      where jsonb_typeof(element) is distinct from 'object'
        or jsonb_typeof(element -> 'title') is distinct from 'string'
        or jsonb_typeof(element -> 'description') is distinct from 'string'
        or btrim(element ->> 'title') = ''
        or btrim(element ->> 'description') = ''
    )
  end;
$$;

create or replace function public.cms_jsonb_is_palette_array(value jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select case
    when jsonb_typeof(value) is distinct from 'array' then false
    else not exists (
      select 1
      from jsonb_array_elements(value) as entries(element)
      where jsonb_typeof(element) is distinct from 'object'
        or jsonb_typeof(element -> 'name') is distinct from 'string'
        or jsonb_typeof(element -> 'hex') is distinct from 'string'
        or btrim(element ->> 'name') = ''
        or (element ->> 'hex') !~ '^#[0-9A-Fa-f]{6}$'
    )
  end;
$$;

alter table public.services
  add constraint services_disciplines_shape
    check (public.cms_jsonb_is_string_array(disciplines)),
  add constraint services_useful_for_shape
    check (public.cms_jsonb_is_string_array(useful_for)),
  add constraint services_approach_shape
    check (public.cms_jsonb_is_approach_array(approach));

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null,
  is_active boolean not null default true,
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_profiles_display_name_length check (char_length(display_name) between 2 and 100),
  constraint admin_profiles_role_allowed check (role in ('owner', 'admin', 'editor'))
);

create or replace function public.current_admin_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select profile.role
  from public.admin_profiles as profile
  where profile.user_id = auth.uid()
    and profile.is_active is true
  limit 1;
$$;

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.current_admin_role() is not null;
$$;

create or replace function public.has_admin_role(allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_admin_role() = any(allowed_roles), false);
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  format_label text not null,
  description text not null,
  meta_description text not null,
  image_path text not null,
  image_alt text not null,
  premise_question text not null,
  premise_context text not null,
  direction text not null,
  system text not null,
  experience text not null,
  explores jsonb not null default '[]'::jsonb,
  principle text not null,
  tone jsonb not null default '[]'::jsonb,
  palette jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  featured boolean not null default false,
  sort_order smallint not null default 1,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint projects_status_allowed check (status in ('draft', 'published', 'archived')),
  constraint projects_sort_order_positive check (sort_order > 0),
  constraint projects_explores_shape check (public.cms_jsonb_is_string_array(explores)),
  constraint projects_tone_shape check (public.cms_jsonb_is_string_array(tone)),
  constraint projects_palette_shape check (public.cms_jsonb_is_palette_array(palette))
);

create table if not exists public.project_services (
  project_id uuid not null references public.projects(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete restrict,
  sort_order smallint not null default 1,
  primary key (project_id, service_id),
  constraint project_services_sort_order_positive check (sort_order > 0)
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  excerpt text not null,
  meta_description text not null,
  author text not null default 'AY Media Work',
  body text not null,
  image_path text not null,
  image_alt text not null,
  tags jsonb not null default '[]'::jsonb,
  takeaways jsonb not null default '[]'::jsonb,
  reading_minutes smallint not null default 1,
  status text not null default 'draft',
  featured boolean not null default false,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint blog_posts_status_allowed check (status in ('draft', 'published', 'archived')),
  constraint blog_posts_reading_minutes_positive check (reading_minutes between 1 and 120),
  constraint blog_posts_tags_shape check (public.cms_jsonb_is_string_array(tags)),
  constraint blog_posts_takeaways_shape check (public.cms_jsonb_is_string_array(takeaways))
);

create unique index if not exists blog_posts_one_featured_published_idx
  on public.blog_posts (featured)
  where featured is true and status = 'published';

create table if not exists public.blog_post_services (
  blog_post_id uuid not null references public.blog_posts(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete restrict,
  sort_order smallint not null default 1,
  primary key (blog_post_id, service_id),
  constraint blog_post_services_sort_order_positive check (sort_order > 0)
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  attribution_name text not null,
  attribution_role text,
  attribution_organisation text,
  project_context text,
  project_id uuid references public.projects(id) on delete set null,
  permission_confirmed_at timestamptz,
  status text not null default 'draft',
  sort_order smallint not null default 1,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint testimonials_quote_length check (char_length(quote) between 10 and 2000),
  constraint testimonials_attribution_name_length check (char_length(attribution_name) between 2 and 100),
  constraint testimonials_status_allowed check (status in ('draft', 'published', 'archived')),
  constraint testimonials_sort_order_positive check (sort_order > 0),
  constraint testimonials_permission_before_publish check (
    status <> 'published' or permission_confirmed_at is not null
  )
);

create table if not exists public.client_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_path text not null,
  image_alt text not null,
  destination_url text,
  permission_confirmed_at timestamptz,
  status text not null default 'draft',
  sort_order smallint not null default 1,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint client_logos_status_allowed check (status in ('draft', 'published', 'archived')),
  constraint client_logos_sort_order_positive check (sort_order > 0),
  constraint client_logos_permission_before_publish check (
    status <> 'published' or permission_confirmed_at is not null
  ),
  constraint client_logos_destination_http check (
    destination_url is null
    or (
      destination_url ~ '^https?://'
      and destination_url !~ '^https?://[^/]*@'
    )
  )
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  is_public boolean not null default false,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_settings_key_format check (key ~ '^[a-z0-9]+(?:[._-][a-z0-9]+)*$')
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'admin-media',
  path text not null,
  alt_text text,
  mime_type text not null,
  size_bytes bigint not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint media_assets_bucket_path_unique unique (bucket, path),
  constraint media_assets_size_allowed check (size_bytes > 0 and size_bytes <= 10485760),
  constraint media_assets_mime_allowed check (
    mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/avif')
  )
);

create table if not exists public.admin_audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists projects_status_sort_idx
  on public.projects (status, sort_order, published_at desc);
create index if not exists blog_posts_status_published_idx
  on public.blog_posts (status, published_at desc);
create index if not exists testimonials_status_sort_idx
  on public.testimonials (status, sort_order);
create index if not exists client_logos_status_sort_idx
  on public.client_logos (status, sort_order);
create index if not exists admin_audit_logs_created_idx
  on public.admin_audit_logs (created_at desc);
create index if not exists admin_audit_logs_actor_idx
  on public.admin_audit_logs (actor_user_id, created_at desc);

create or replace function public.set_cms_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.set_publication_timestamp()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' then
    if tg_op = 'INSERT' or old.status is distinct from 'published' or new.published_at is null then
      new.published_at := coalesce(new.published_at, now());
    end if;
  else
    new.published_at := null;
  end if;
  return new;
end;
$$;

create or replace function public.protect_newsletter_consent()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.role() = 'authenticated'
    and old.status = 'unsubscribed'
    and new.status = 'subscribed'
  then
    raise exception 'Fresh explicit consent is required to resubscribe.';
  end if;
  return new;
end;
$$;

create or replace function public.protect_last_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  active_owner_count integer;
begin
  perform pg_advisory_xact_lock(hashtext('aymediawork-active-owner'));

  if old.role = 'owner' and old.is_active is true then
    if tg_op = 'DELETE' then
      select count(*) into active_owner_count
      from public.admin_profiles
      where role = 'owner' and is_active is true;

      if active_owner_count <= 1 then
        raise exception 'The final active owner cannot be removed or suspended.';
      end if;
    elsif new.role <> 'owner' or new.is_active is false then
      select count(*) into active_owner_count
      from public.admin_profiles
      where role = 'owner' and is_active is true;

      if active_owner_count <= 1 then
        raise exception 'The final active owner cannot be removed or suspended.';
      end if;
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create or replace function public.write_admin_audit_log()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_data jsonb;
  entity_identifier text;
begin
  if auth.uid() is null then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  row_data := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  entity_identifier := coalesce(
    row_data ->> 'id',
    row_data ->> 'user_id',
    row_data ->> 'key',
    row_data ->> 'path',
    row_data ->> 'inquiry_id'
  );

  insert into public.admin_audit_logs (
    actor_user_id,
    action,
    entity_type,
    entity_id,
    details
  ) values (
    auth.uid(),
    lower(tg_op),
    tg_table_name,
    entity_identifier,
    jsonb_strip_nulls(jsonb_build_object(
      'status', row_data ->> 'status',
      'slug', row_data ->> 'slug',
      'title', row_data ->> 'title',
      'role', row_data ->> 'role'
    ))
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create or replace function public.bootstrap_first_owner(
  p_user_id uuid,
  p_display_name text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pg_advisory_xact_lock(hashtext('aymediawork-active-owner'));

  if exists (
    select 1 from public.admin_profiles
    where role = 'owner' and is_active is true
  ) then
    raise exception 'An active owner already exists.';
  end if;

  if not exists (select 1 from auth.users where id = p_user_id) then
    raise exception 'The supplied Supabase Auth user does not exist.';
  end if;

  insert into public.admin_profiles (user_id, display_name, role, is_active)
  values (p_user_id, btrim(p_display_name), 'owner', true)
  on conflict (user_id) do update
  set display_name = excluded.display_name,
      role = 'owner',
      is_active = true,
      updated_at = now();

  insert into public.admin_audit_logs (
    actor_user_id, action, entity_type, entity_id, details
  ) values (
    p_user_id, 'bootstrap', 'admin_profiles', p_user_id::text,
    jsonb_build_object('role', 'owner')
  );
end;
$$;

-- Register an invited profile and its audit entry atomically after Auth creates the user.
create or replace function public.register_admin_invitation(
  p_user_id uuid,
  p_display_name text,
  p_role text,
  p_invited_by uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  invited_email text;
begin
  if not exists (
    select 1
    from public.admin_profiles
    where user_id = p_invited_by
      and role = 'owner'
      and is_active is true
  ) then
    raise exception 'An active owner is required to register an invitation.';
  end if;

  if p_role not in ('owner', 'admin', 'editor') then
    raise exception 'The supplied admin role is invalid.';
  end if;

  select email into invited_email
  from auth.users
  where id = p_user_id;

  if not found then
    raise exception 'The invited Supabase Auth user does not exist.';
  end if;

  insert into public.admin_profiles (
    user_id, display_name, role, is_active, invited_by
  ) values (
    p_user_id, btrim(p_display_name), p_role, true, p_invited_by
  );

  insert into public.admin_audit_logs (
    actor_user_id, action, entity_type, entity_id, details
  ) values (
    p_invited_by,
    'invite',
    'admin_profiles',
    p_user_id::text,
    jsonb_strip_nulls(jsonb_build_object(
      'email', invited_email,
      'role', p_role
    ))
  );
end;
$$;

-- Save each parent record and its service relationships in one transaction.
create or replace function public.save_admin_project(
  p_project jsonb,
  p_service_ids uuid[] default '{}'::uuid[]
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  saved_project_id uuid;
  requested_id uuid := nullif(p_project ->> 'id', '')::uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required.';
  end if;

  if requested_id is null then
    insert into public.projects (
      slug, title, category, description, meta_description, image_path, image_alt,
      format_label, premise_question, premise_context, direction, system,
      experience, explores, principle, tone, palette, status, featured,
      sort_order, created_by, updated_by
    ) values (
      p_project ->> 'slug', p_project ->> 'title', p_project ->> 'category',
      p_project ->> 'description', p_project ->> 'meta_description',
      p_project ->> 'image_path', p_project ->> 'image_alt',
      p_project ->> 'format_label', p_project ->> 'premise_question',
      p_project ->> 'premise_context', p_project ->> 'direction',
      p_project ->> 'system', p_project ->> 'experience',
      p_project -> 'explores', p_project ->> 'principle', p_project -> 'tone',
      p_project -> 'palette', p_project ->> 'status',
      (p_project ->> 'featured')::boolean,
      (p_project ->> 'sort_order')::smallint, auth.uid(), auth.uid()
    )
    returning id into saved_project_id;
  else
    update public.projects
    set slug = p_project ->> 'slug',
        title = p_project ->> 'title',
        category = p_project ->> 'category',
        description = p_project ->> 'description',
        meta_description = p_project ->> 'meta_description',
        image_path = p_project ->> 'image_path',
        image_alt = p_project ->> 'image_alt',
        format_label = p_project ->> 'format_label',
        premise_question = p_project ->> 'premise_question',
        premise_context = p_project ->> 'premise_context',
        direction = p_project ->> 'direction',
        system = p_project ->> 'system',
        experience = p_project ->> 'experience',
        explores = p_project -> 'explores',
        principle = p_project ->> 'principle',
        tone = p_project -> 'tone',
        palette = p_project -> 'palette',
        status = p_project ->> 'status',
        featured = (p_project ->> 'featured')::boolean,
        sort_order = (p_project ->> 'sort_order')::smallint,
        updated_by = auth.uid()
    where id = requested_id
    returning id into saved_project_id;

    if saved_project_id is null then
      raise exception 'Project not found or unavailable.';
    end if;
  end if;

  delete from public.project_services where project_id = saved_project_id;
  insert into public.project_services (project_id, service_id, sort_order)
  select saved_project_id, selected_services.service_id, selected_services.service_order::smallint
  from unnest(coalesce(p_service_ids, '{}'::uuid[]))
    with ordinality as selected_services(service_id, service_order);

  return saved_project_id;
end;
$$;

create or replace function public.save_admin_blog_post(
  p_post jsonb,
  p_service_ids uuid[] default '{}'::uuid[]
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  saved_post_id uuid;
  requested_id uuid := nullif(p_post ->> 'id', '')::uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required.';
  end if;

  if requested_id is null then
    insert into public.blog_posts (
      slug, title, category, excerpt, meta_description, author, body, image_path,
      image_alt, tags, takeaways, reading_minutes, status, featured, created_by,
      updated_by
    ) values (
      p_post ->> 'slug', p_post ->> 'title', p_post ->> 'category',
      p_post ->> 'excerpt', p_post ->> 'meta_description', p_post ->> 'author',
      p_post ->> 'body', p_post ->> 'image_path', p_post ->> 'image_alt',
      p_post -> 'tags', p_post -> 'takeaways',
      (p_post ->> 'reading_minutes')::smallint, p_post ->> 'status',
      (p_post ->> 'featured')::boolean, auth.uid(), auth.uid()
    )
    returning id into saved_post_id;
  else
    update public.blog_posts
    set slug = p_post ->> 'slug',
        title = p_post ->> 'title',
        category = p_post ->> 'category',
        excerpt = p_post ->> 'excerpt',
        meta_description = p_post ->> 'meta_description',
        author = p_post ->> 'author',
        body = p_post ->> 'body',
        image_path = p_post ->> 'image_path',
        image_alt = p_post ->> 'image_alt',
        tags = p_post -> 'tags',
        takeaways = p_post -> 'takeaways',
        reading_minutes = (p_post ->> 'reading_minutes')::smallint,
        status = p_post ->> 'status',
        featured = (p_post ->> 'featured')::boolean,
        updated_by = auth.uid()
    where id = requested_id
    returning id into saved_post_id;

    if saved_post_id is null then
      raise exception 'Blog post not found or unavailable.';
    end if;
  end if;

  delete from public.blog_post_services where blog_post_id = saved_post_id;
  insert into public.blog_post_services (blog_post_id, service_id, sort_order)
  select saved_post_id, selected_services.service_id, selected_services.service_order::smallint
  from unnest(coalesce(p_service_ids, '{}'::uuid[]))
    with ordinality as selected_services(service_id, service_order);

  return saved_post_id;
end;
$$;

-- RLS is the final authorization boundary.
alter table public.admin_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_services enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_services enable row level security;
alter table public.testimonials enable row level security;
alter table public.client_logos enable row level security;
alter table public.site_settings enable row level security;
alter table public.media_assets enable row level security;
alter table public.admin_audit_logs enable row level security;

-- Replace policies safely when a migration is replayed in a controlled test database.
drop policy if exists "public reads published services" on public.services;
create policy "public reads published services"
on public.services for select
to anon
using (is_active is true);

drop policy if exists "active admins read services" on public.services;
create policy "active admins read services"
on public.services for select
to authenticated
using (public.is_active_admin());

drop policy if exists "admins create services" on public.services;
create policy "admins create services"
on public.services for insert
to authenticated
with check (
  public.has_admin_role(array['owner', 'admin'])
  or (public.current_admin_role() = 'editor' and is_active is false)
);

drop policy if exists "admins update services" on public.services;
create policy "admins update services"
on public.services for update
to authenticated
using (
  public.has_admin_role(array['owner', 'admin'])
  or (public.current_admin_role() = 'editor' and is_active is false)
)
with check (
  public.has_admin_role(array['owner', 'admin'])
  or (public.current_admin_role() = 'editor' and is_active is false)
);

drop policy if exists "senior admins delete services" on public.services;
create policy "senior admins delete services"
on public.services for delete
to authenticated
using (public.has_admin_role(array['owner', 'admin']));

drop policy if exists "admins read profiles" on public.admin_profiles;
create policy "admins read profiles"
on public.admin_profiles for select
to authenticated
using (public.is_active_admin());

drop policy if exists "owners create profiles" on public.admin_profiles;
create policy "owners create profiles"
on public.admin_profiles for insert
to authenticated
with check (public.current_admin_role() = 'owner');

drop policy if exists "owners update profiles" on public.admin_profiles;
create policy "owners update profiles"
on public.admin_profiles for update
to authenticated
using (public.current_admin_role() = 'owner')
with check (public.current_admin_role() = 'owner');

drop policy if exists "owners delete profiles" on public.admin_profiles;
create policy "owners delete profiles"
on public.admin_profiles for delete
to authenticated
using (public.current_admin_role() = 'owner');

drop policy if exists "public reads published projects" on public.projects;
create policy "public reads published projects"
on public.projects for select
to anon
using (status = 'published');

drop policy if exists "active admins read projects" on public.projects;
create policy "active admins read projects"
on public.projects for select
to authenticated
using (public.is_active_admin());

drop policy if exists "admins create projects" on public.projects;
create policy "admins create projects"
on public.projects for insert
to authenticated
with check (
  public.has_admin_role(array['owner', 'admin'])
  or (public.current_admin_role() = 'editor' and status = 'draft')
);

drop policy if exists "admins update projects" on public.projects;
create policy "admins update projects"
on public.projects for update
to authenticated
using (
  public.has_admin_role(array['owner', 'admin'])
  or (public.current_admin_role() = 'editor' and status = 'draft')
)
with check (
  public.has_admin_role(array['owner', 'admin'])
  or (public.current_admin_role() = 'editor' and status = 'draft')
);

drop policy if exists "senior admins delete projects" on public.projects;
create policy "senior admins delete projects"
on public.projects for delete
to authenticated
using (public.has_admin_role(array['owner', 'admin']));

drop policy if exists "public reads project relationships" on public.project_services;
create policy "public reads project relationships"
on public.project_services for select
to anon
using (
  exists (
    select 1 from public.projects
    where projects.id = project_services.project_id
      and projects.status = 'published'
  )
);

drop policy if exists "admins manage project relationships" on public.project_services;
create policy "admins manage project relationships"
on public.project_services for all
to authenticated
using (
  public.has_admin_role(array['owner', 'admin'])
  or exists (
    select 1 from public.projects
    where projects.id = project_services.project_id
      and projects.status = 'draft'
      and public.current_admin_role() = 'editor'
  )
)
with check (
  public.has_admin_role(array['owner', 'admin'])
  or exists (
    select 1 from public.projects
    where projects.id = project_services.project_id
      and projects.status = 'draft'
      and public.current_admin_role() = 'editor'
  )
);

drop policy if exists "public reads published blog posts" on public.blog_posts;
create policy "public reads published blog posts"
on public.blog_posts for select
to anon
using (status = 'published');

drop policy if exists "active admins read blog posts" on public.blog_posts;
create policy "active admins read blog posts"
on public.blog_posts for select
to authenticated
using (public.is_active_admin());

drop policy if exists "admins create blog posts" on public.blog_posts;
create policy "admins create blog posts"
on public.blog_posts for insert
to authenticated
with check (
  public.has_admin_role(array['owner', 'admin'])
  or (public.current_admin_role() = 'editor' and status = 'draft')
);

drop policy if exists "admins update blog posts" on public.blog_posts;
create policy "admins update blog posts"
on public.blog_posts for update
to authenticated
using (
  public.has_admin_role(array['owner', 'admin'])
  or (public.current_admin_role() = 'editor' and status = 'draft')
)
with check (
  public.has_admin_role(array['owner', 'admin'])
  or (public.current_admin_role() = 'editor' and status = 'draft')
);

drop policy if exists "senior admins delete blog posts" on public.blog_posts;
create policy "senior admins delete blog posts"
on public.blog_posts for delete
to authenticated
using (public.has_admin_role(array['owner', 'admin']));

drop policy if exists "public reads blog relationships" on public.blog_post_services;
create policy "public reads blog relationships"
on public.blog_post_services for select
to anon
using (
  exists (
    select 1 from public.blog_posts
    where blog_posts.id = blog_post_services.blog_post_id
      and blog_posts.status = 'published'
  )
);

drop policy if exists "admins manage blog relationships" on public.blog_post_services;
create policy "admins manage blog relationships"
on public.blog_post_services for all
to authenticated
using (
  public.has_admin_role(array['owner', 'admin'])
  or exists (
    select 1 from public.blog_posts
    where blog_posts.id = blog_post_services.blog_post_id
      and blog_posts.status = 'draft'
      and public.current_admin_role() = 'editor'
  )
)
with check (
  public.has_admin_role(array['owner', 'admin'])
  or exists (
    select 1 from public.blog_posts
    where blog_posts.id = blog_post_services.blog_post_id
      and blog_posts.status = 'draft'
      and public.current_admin_role() = 'editor'
  )
);

drop policy if exists "public reads approved testimonials" on public.testimonials;
create policy "public reads approved testimonials"
on public.testimonials for select
to anon
using (status = 'published' and permission_confirmed_at is not null);

drop policy if exists "active admins read testimonials" on public.testimonials;
create policy "active admins read testimonials"
on public.testimonials for select
to authenticated
using (public.is_active_admin());

drop policy if exists "admins create testimonials" on public.testimonials;
create policy "admins create testimonials"
on public.testimonials for insert
to authenticated
with check (
  public.has_admin_role(array['owner', 'admin'])
  or (public.current_admin_role() = 'editor' and status = 'draft')
);

drop policy if exists "admins update testimonials" on public.testimonials;
create policy "admins update testimonials"
on public.testimonials for update
to authenticated
using (
  public.has_admin_role(array['owner', 'admin'])
  or (public.current_admin_role() = 'editor' and status = 'draft')
)
with check (
  public.has_admin_role(array['owner', 'admin'])
  or (public.current_admin_role() = 'editor' and status = 'draft')
);

drop policy if exists "senior admins delete testimonials" on public.testimonials;
create policy "senior admins delete testimonials"
on public.testimonials for delete
to authenticated
using (public.has_admin_role(array['owner', 'admin']));

drop policy if exists "public reads approved client logos" on public.client_logos;
create policy "public reads approved client logos"
on public.client_logos for select
to anon
using (status = 'published' and permission_confirmed_at is not null);

drop policy if exists "active admins read client logos" on public.client_logos;
create policy "active admins read client logos"
on public.client_logos for select
to authenticated
using (public.is_active_admin());

drop policy if exists "admins create client logos" on public.client_logos;
create policy "admins create client logos"
on public.client_logos for insert
to authenticated
with check (
  public.has_admin_role(array['owner', 'admin'])
  or (public.current_admin_role() = 'editor' and status = 'draft')
);

drop policy if exists "admins update client logos" on public.client_logos;
create policy "admins update client logos"
on public.client_logos for update
to authenticated
using (
  public.has_admin_role(array['owner', 'admin'])
  or (public.current_admin_role() = 'editor' and status = 'draft')
)
with check (
  public.has_admin_role(array['owner', 'admin'])
  or (public.current_admin_role() = 'editor' and status = 'draft')
);

drop policy if exists "senior admins delete client logos" on public.client_logos;
create policy "senior admins delete client logos"
on public.client_logos for delete
to authenticated
using (public.has_admin_role(array['owner', 'admin']));

drop policy if exists "public reads public settings" on public.site_settings;
create policy "public reads public settings"
on public.site_settings for select
to anon
using (is_public is true);

drop policy if exists "owners manage settings" on public.site_settings;
create policy "owners manage settings"
on public.site_settings for all
to authenticated
using (public.current_admin_role() = 'owner')
with check (public.current_admin_role() = 'owner');

drop policy if exists "admins read media metadata" on public.media_assets;
create policy "admins read media metadata"
on public.media_assets for select
to authenticated
using (public.is_active_admin());

drop policy if exists "admins register media" on public.media_assets;
create policy "admins register media"
on public.media_assets for insert
to authenticated
with check (
  public.is_active_admin()
  and created_by = auth.uid()
  and bucket = 'admin-media'
  and path like auth.uid()::text || '/%'
);

drop policy if exists "senior admins delete media metadata" on public.media_assets;
create policy "senior admins delete media metadata"
on public.media_assets for delete
to authenticated
using (public.has_admin_role(array['owner', 'admin']));

drop policy if exists "admins read audit history" on public.admin_audit_logs;
create policy "admins read audit history"
on public.admin_audit_logs for select
to authenticated
using (public.is_active_admin());

drop policy if exists "admins read inquiries" on public.inquiries;
create policy "admins read inquiries"
on public.inquiries for select
to authenticated
using (public.is_active_admin());

drop policy if exists "admins update inquiries" on public.inquiries;
create policy "admins update inquiries"
on public.inquiries for update
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "admins read inquiry services" on public.inquiry_services;
create policy "admins read inquiry services"
on public.inquiry_services for select
to authenticated
using (public.is_active_admin());

drop policy if exists "admins read subscribers" on public.newsletter_subscribers;
create policy "admins read subscribers"
on public.newsletter_subscribers for select
to authenticated
using (public.is_active_admin());

drop policy if exists "admins update subscribers" on public.newsletter_subscribers;
create policy "admins update subscribers"
on public.newsletter_subscribers for update
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

-- Table privileges work with, never replace, the RLS policies above.
-- Anonymous callers receive only the content fields consumed by the public site.
-- Draft records, actor IDs, and unrelated operational/audit columns remain
-- unavailable through direct API calls.
revoke select on public.services, public.projects, public.project_services,
  public.blog_posts, public.blog_post_services, public.testimonials,
  public.client_logos, public.site_settings from public, anon;

grant select (
  id, slug, title, sort_order, description, hero_title, meta_description,
  image_path, image_alt, disciplines, useful_for, approach, related_slugs
) on public.services to anon;
grant select (
  id, slug, title, sort_order, featured, category, format_label, description,
  meta_description, image_path, image_alt, premise_context, premise_question,
  direction, system, experience, principle, explores, tone, palette, status
) on public.projects to anon;
grant select (project_id, service_id, sort_order)
  on public.project_services to anon;
grant select (
  id, slug, title, excerpt, body, category, author, reading_minutes,
  image_path, image_alt, meta_description, tags, takeaways, featured,
  published_at, created_at, status
) on public.blog_posts to anon;
grant select (blog_post_id, service_id, sort_order)
  on public.blog_post_services to anon;
grant select (
  id, quote, attribution_name, attribution_role, attribution_organisation,
  project_context, project_id, permission_confirmed_at
) on public.testimonials to anon;
grant select (id, name, image_path, image_alt, destination_url)
  on public.client_logos to anon;
grant select (key, value) on public.site_settings to anon;

grant select, insert, update, delete on public.services to authenticated;
grant select, insert, update, delete on public.admin_profiles to authenticated;
grant select, insert, update, delete on public.projects, public.project_services,
  public.blog_posts, public.blog_post_services, public.testimonials, public.client_logos,
  public.site_settings, public.media_assets to authenticated;
grant select on public.admin_audit_logs to authenticated;
grant select on public.inquiries, public.inquiry_services, public.newsletter_subscribers to authenticated;
grant update (status, is_read, updated_at) on public.inquiries to authenticated;
grant update (status, unsubscribed_at, updated_at) on public.newsletter_subscribers to authenticated;
grant usage, select on sequence public.admin_audit_logs_id_seq to authenticated, service_role;

revoke all on function public.cms_jsonb_is_string_array(jsonb) from public, anon;
revoke all on function public.cms_jsonb_is_approach_array(jsonb) from public, anon;
revoke all on function public.cms_jsonb_is_palette_array(jsonb) from public, anon;
revoke all on function public.current_admin_role() from public, anon;
revoke all on function public.is_active_admin() from public, anon;
revoke all on function public.has_admin_role(text[]) from public, anon;
revoke all on function public.save_admin_project(jsonb, uuid[]) from public, anon;
revoke all on function public.save_admin_blog_post(jsonb, uuid[]) from public, anon;
grant execute on function public.cms_jsonb_is_string_array(jsonb) to authenticated, service_role;
grant execute on function public.cms_jsonb_is_approach_array(jsonb) to authenticated, service_role;
grant execute on function public.cms_jsonb_is_palette_array(jsonb) to authenticated, service_role;
grant execute on function public.current_admin_role() to authenticated, service_role;
grant execute on function public.is_active_admin() to anon, authenticated, service_role;
grant execute on function public.has_admin_role(text[]) to authenticated, service_role;
grant execute on function public.save_admin_project(jsonb, uuid[]) to authenticated, service_role;
grant execute on function public.save_admin_blog_post(jsonb, uuid[]) to authenticated, service_role;
revoke all on function public.bootstrap_first_owner(uuid, text) from public, anon, authenticated;
grant execute on function public.bootstrap_first_owner(uuid, text) to service_role;
revoke all on function public.register_admin_invitation(uuid, text, text, uuid)
  from public, anon, authenticated;
grant execute on function public.register_admin_invitation(uuid, text, text, uuid)
  to service_role;

-- Public image bucket: reads are public, writes remain authenticated and role-restricted.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'admin-media',
  'admin-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "active admins read cms media" on storage.objects;
create policy "active admins read cms media"
on storage.objects for select
to authenticated
using (
  bucket_id = 'admin-media'
  and public.is_active_admin()
);

drop policy if exists "active admins upload cms media" on storage.objects;
create policy "active admins upload cms media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'admin-media'
  and public.is_active_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "active admins update cms media" on storage.objects;
create policy "active admins update cms media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'admin-media'
  and public.is_active_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'admin-media'
  and public.is_active_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "controlled cms media deletion" on storage.objects;
drop policy if exists "senior admins delete cms media" on storage.objects;
create policy "controlled cms media deletion"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'admin-media'
  and (
    public.has_admin_role(array['owner', 'admin'])
    or (
      public.is_active_admin()
      and (storage.foldername(name))[1] = auth.uid()::text
      and not exists (
        select 1
        from public.media_assets as asset
        where asset.bucket = storage.objects.bucket_id
          and asset.path = storage.objects.name
      )
    )
  )
);

-- Seed values are appended below from the reviewed typed catalog.

-- Seed the complete reviewed public catalog. Replays update content without changing stable IDs.
update public.services
set title = 'Video Editing',
    description = 'Story-led cuts, intentional pacing, colour, and sound shaped into one clear viewing experience.',
    hero_title = 'Find the story hiding in the footage.',
    meta_description = 'Story-led video editing for branded films, interviews, campaigns, YouTube, and digital content from AY Media Work.',
    image_path = '/images/services/video-editing.jpg',
    image_alt = 'Abstract cobalt film layers flowing through a dark cinematic space',
    disciplines = '["Narrative assembly and story structure","Pacing, selects, and editorial rhythm","Multi-camera and interview editing","Colour finishing and visual consistency","Sound design and mix preparation","Cutdowns and format-specific versions"]'::jsonb,
    useful_for = '["Branded stories and campaign films","Interviews, profiles, and documentaries","YouTube and creator-led episodes","Explainers and internal communications"]'::jsonb,
    approach = '[{"title":"Read the material","description":"Review the footage, brief, references, and audience context before deciding what the edit needs to say."},{"title":"Build the spine","description":"Find the strongest moments and arrange them into a clear narrative structure with purposeful momentum."},{"title":"Shape the experience","description":"Develop pacing, music, sound, graphics, and visual transitions around the central idea."},{"title":"Refine the finish","description":"Polish picture and sound, review with context, and prepare the agreed formats for delivery."}]'::jsonb,
    related_slugs = array['2d-and-3d-animation', 'saas-video', 'cgi-and-vfx']::text[],
    is_active = true,
    sort_order = 1,
    updated_at = now()
where id = '8f40a393-06f3-49c6-9d98-350a278f6c03';

update public.services
set title = '2D & 3D Animation',
    description = 'Illustrated motion and dimensional worlds combined around the visual language each story needs.',
    hero_title = 'Move between graphic clarity and dimensional depth.',
    meta_description = '2D and 3D animation spanning storyboards, styleframes, motion design, look development, lighting, and compositing.',
    image_path = '/images/services/2d-and-3d-animation.jpg',
    image_alt = 'Flat cobalt graphic planes transforming into dimensional glass forms',
    disciplines = '["Concepts, storyboards, and animatics","2D illustration and motion design","3D modelling and scene development","Materials, lighting, and look development","Character, object, and camera animation","Rendering, compositing, and delivery"]'::jsonb,
    useful_for = '["Brand stories and campaign worlds","Product and service explainers","Launch films and title sequences","Ideas that move beyond live-action production"]'::jsonb,
    approach = '[{"title":"Choose the visual language","description":"Translate the brief into references, storyboards, and a clear balance of illustrated and dimensional craft."},{"title":"Design the frames","description":"Develop composition, form, colour, materials, lighting, and movement principles before full production."},{"title":"Build the motion","description":"Animate each scene with timing, continuity, and transitions guided by the central story."},{"title":"Combine and finish","description":"Render, composite, review in context, and prepare the agreed outputs as one coherent visual experience."}]'::jsonb,
    related_slugs = array['ai-animation', 'cgi-and-vfx', 'graphic-design']::text[],
    is_active = true,
    sort_order = 2,
    updated_at = now()
where id = '42e81676-4c0e-421b-abce-fcc8304fb249';

update public.services
set title = 'SaaS Video',
    description = 'Product stories that turn software journeys, features, and workflows into clear visual narratives.',
    hero_title = 'Make the product easier to see, follow, and understand.',
    meta_description = 'SaaS product videos, explainers, demos, launch stories, interface motion, and visual systems from AY Media Work.',
    image_path = '/images/services/saas-video.jpg',
    image_alt = 'Luminous product-story panels connected across a dark digital system',
    disciplines = '["Product story and message structure","Explainer scripts and storyboards","Interface-led motion and visual walkthroughs","Launch, feature, and overview videos","Voiceover, sound, and editorial finishing","Cutdowns for product and campaign channels"]'::jsonb,
    useful_for = '["Product launches and feature releases","Software overviews and guided demos","Sales, onboarding, and education content","Campaigns around complex digital products"]'::jsonb,
    approach = '[{"title":"Understand the product","description":"Map the audience, product context, approved source material, and the journey the video needs to explain."},{"title":"Simplify the story","description":"Turn features and workflows into a focused narrative with a clear sequence and visual hierarchy."},{"title":"Design the experience","description":"Connect interface moments, motion, type, voice, and sound around the chosen creative direction."},{"title":"Review in context","description":"Check clarity with the product team, refine the finish, and prepare the agreed formats for delivery."}]'::jsonb,
    related_slugs = array['video-editing', '2d-and-3d-animation', 'graphic-design']::text[],
    is_active = true,
    sort_order = 3,
    updated_at = now()
where id = '4c29dc24-07cf-4812-92b3-a80317b34da1';

update public.services
set title = 'Graphic Design',
    description = 'Clear, distinctive visual systems crafted across campaigns, content, and everyday brand communication.',
    hero_title = 'Give every visual a clear job and one connected voice.',
    meta_description = 'Graphic design for campaigns, social content, digital assets, presentations, and connected brand communication.',
    image_path = '/images/services/graphic-design.jpg',
    image_alt = 'Cobalt editorial shapes composed across a precise dark graphic grid',
    disciplines = '["Campaign and key-visual development","Social and digital content systems","Layout, hierarchy, and typography","Presentation and document design","Marketing assets and format adaptation","Reusable templates and visual guidelines"]'::jsonb,
    useful_for = '["Campaigns with multiple visual outputs","Brand and social content programmes","Launch assets and digital communication","Teams needing a more consistent visual system"]'::jsonb,
    approach = '[{"title":"Clarify the message","description":"Understand the audience, context, formats, source material, and action each design should support."},{"title":"Set the direction","description":"Explore composition, colour, type, image treatment, and a visual idea that can hold the work together."},{"title":"Build the system","description":"Develop the selected direction across the agreed assets while protecting hierarchy and consistency."},{"title":"Prepare the handoff","description":"Review every format in context and organise the final files, templates, or guidance required for use."}]'::jsonb,
    related_slugs = array['saas-video', 'web-development', 'facebook-and-meta-ads']::text[],
    is_active = true,
    sort_order = 4,
    updated_at = now()
where id = '08016a2d-beff-4d52-8423-8fcbca37aecb';

update public.services
set title = 'AI Animation',
    description = 'AI-assisted visual exploration shaped by human direction, continuity, editing, and finishing.',
    hero_title = 'Use new tools without losing creative direction.',
    meta_description = 'Creatively directed AI animation spanning visual exploration, shot development, continuity, editing, and finishing.',
    image_path = '/images/services/ai-animation.jpg',
    image_alt = 'A luminous cobalt form evolving through cinematic motion states',
    disciplines = '["Concept and visual-language exploration","Prompt direction and reference development","AI-assisted shot and sequence creation","Character and scene continuity planning","Editorial structure and motion refinement","Compositing, sound, and final finishing"]'::jsonb,
    useful_for = '["Concept films and visual experiments","Stylised campaign and social sequences","Music, mood, and narrative-led content","Ideas requiring unusual visual transitions"]'::jsonb,
    approach = '[{"title":"Define the creative rules","description":"Set the story, visual territory, references, boundaries, and production context before generating imagery."},{"title":"Explore with intent","description":"Develop selected visual routes and test how characters, scenes, and movement can remain connected."},{"title":"Direct the sequence","description":"Shape the strongest material into purposeful shots, transitions, rhythm, and a coherent viewing experience."},{"title":"Finish beyond the generation","description":"Refine through edit, compositing, cleanup, sound, and review before preparing the final formats."}]'::jsonb,
    related_slugs = array['2d-and-3d-animation', 'video-editing', 'cgi-and-vfx']::text[],
    is_active = true,
    sort_order = 5,
    updated_at = now()
where id = '16459520-5f00-4673-8f8d-60559a9fdb25';

update public.services
set title = 'Web Development',
    description = 'Responsive digital experiences where structure, interaction, content, and visual craft work together.',
    hero_title = 'Turn the brand into a digital experience people can use.',
    meta_description = 'Responsive web development for business websites, landing pages, campaigns, and content-led digital experiences.',
    image_path = '/images/services/web-development.jpg',
    image_alt = 'Responsive cobalt frames assembling into a structured digital architecture',
    disciplines = '["Website structure and technical planning","Responsive front-end development","Component and design-system implementation","Content and CMS integration","Interaction, accessibility, and performance care","Quality assurance and launch preparation"]'::jsonb,
    useful_for = '["Business and studio websites","Campaign and product landing pages","Content-led marketing experiences","Digital refreshes with a clearer structure"]'::jsonb,
    approach = '[{"title":"Map the experience","description":"Align the audience, content, required functionality, constraints, and path through the website."},{"title":"Design the system","description":"Define responsive layouts, reusable components, interaction rules, and the content model behind them."},{"title":"Build with context","description":"Develop the agreed pages and features while testing behaviour across relevant screens and input methods."},{"title":"Verify and hand over","description":"Review content, accessibility, performance, and launch requirements before documenting the final setup."}]'::jsonb,
    related_slugs = array['graphic-design', 'ai-automation', 'saas-video']::text[],
    is_active = true,
    sort_order = 6,
    updated_at = now()
where id = '4531277e-0d26-4994-b632-13f3245ee328';

update public.services
set title = 'AI Automation',
    description = 'Connected workflows that organise repetitive steps while keeping people in control of key decisions.',
    hero_title = 'Connect the routine work around the decisions that matter.',
    meta_description = 'AI automation for connected business workflows, content operations, handoffs, review steps, and practical integrations.',
    image_path = '/images/services/ai-automation.jpg',
    image_alt = 'Cobalt signals moving through connected glass nodes into an ordered system',
    disciplines = '["Workflow discovery and process mapping","AI-assisted content and operations flows","Tool, API, and data-source connections","Triggers, routing, and handoff logic","Human review and exception checkpoints","Testing, documentation, and team handover"]'::jsonb,
    useful_for = '["Repeated content and marketing operations","Lead, inquiry, and information routing","Internal handoffs across connected tools","Processes with clear rules and review points"]'::jsonb,
    approach = '[{"title":"Find the right workflow","description":"Map the current process, systems, permissions, repeated steps, exceptions, and people responsible for decisions."},{"title":"Design the safeguards","description":"Define the data flow, triggers, approvals, fallbacks, and boundaries before connecting the tools."},{"title":"Build and test","description":"Implement the agreed workflow in controlled steps and test expected paths, failures, and human handoffs."},{"title":"Document the operation","description":"Prepare practical guidance for monitoring, updating, pausing, and reviewing the workflow after handover."}]'::jsonb,
    related_slugs = array['web-development', 'saas-video', 'facebook-and-meta-ads']::text[],
    is_active = true,
    sort_order = 7,
    updated_at = now()
where id = 'e1738033-c5ab-4fa2-8da4-71e6a6e8bfac';

update public.services
set title = 'Social Media Marketing',
    description = 'Organic social systems built around clear strategy, useful content rhythms, and consistent brand participation.',
    hero_title = 'Build a social presence that stays coherent from one post to the next.',
    meta_description = 'Organic social media marketing across strategy, content planning, calendars, publishing coordination, community coordination, reporting, and iteration.',
    image_path = '/images/services/social-media-marketing.jpg',
    image_alt = 'Glass content tiles moving through a connected cobalt publishing system',
    disciplines = '["Organic social strategy","Channel and audience priorities","Content pillars and recurring formats","Editorial calendars and content planning","Publishing and community coordination","Performance reporting and iteration"]'::jsonb,
    useful_for = '["Brands building a consistent organic presence","Teams needing a practical publishing rhythm","Campaigns supported by ongoing social content","Channels ready for clearer learning loops"]'::jsonb,
    approach = '[{"title":"Set the channel direction","description":"Align the audience priorities, channel roles, brand guardrails, available resources, and outcomes organic social should support."},{"title":"Shape the content system","description":"Translate the strategy into useful content pillars, recurring formats, editorial calendars, and a workable approval rhythm."},{"title":"Coordinate the presence","description":"Prepare publishing inputs and community guidance so planned content and audience interactions stay connected to the brand."},{"title":"Learn and refine","description":"Review audience signals and content performance in context, then turn the findings into focused improvements for the next cycle."}]'::jsonb,
    related_slugs = array['graphic-design', 'video-editing', 'facebook-and-meta-ads']::text[],
    is_active = true,
    sort_order = 8,
    updated_at = now()
where id = '4d9b60c4-145b-4fc8-9195-9005dfe33cbf';

update public.services
set title = 'Facebook & Meta Ads',
    description = 'Campaign strategy, creative, setup, and iteration connected around a clear audience and objective.',
    hero_title = 'Connect the campaign idea to the people it needs to reach.',
    meta_description = 'Facebook and Meta advertising support across campaign planning, creative, setup, audience structure, and reporting.',
    image_path = '/images/services/facebook-and-meta-ads.jpg',
    image_alt = 'A focused cobalt campaign signal branching through abstract audience pathways',
    disciplines = '["Campaign objectives and account planning","Audience, placement, and journey structure","Ad concepts, copy, and creative formats","Campaign setup and tracking coordination","Creative variations and controlled testing","Reporting context and iteration planning"]'::jsonb,
    useful_for = '["Brand, product, and service campaigns","Launches and focused promotional periods","Lead and inquiry journeys","Teams needing connected creative and delivery"]'::jsonb,
    approach = '[{"title":"Set the campaign context","description":"Align the audience, objective, offer, destination, available material, and practical account requirements."},{"title":"Build the creative system","description":"Develop messages, visual routes, formats, and variations suited to the agreed campaign structure."},{"title":"Prepare the delivery","description":"Coordinate campaign setup, placements, tracking inputs, review checks, and launch readiness."},{"title":"Learn and refine","description":"Review relevant campaign signals in context and plan deliberate adjustments to creative or delivery."}]'::jsonb,
    related_slugs = array['graphic-design', 'video-editing', 'ai-automation']::text[],
    is_active = true,
    sort_order = 9,
    updated_at = now()
where id = 'bef5495e-b88a-4c97-b2a6-3bb370e6a962';

update public.services
set title = 'CGI & VFX',
    description = 'Crafted digital elements, simulations, and compositing for visuals that need to move beyond the captured frame.',
    hero_title = 'Build what the camera cannot—and make it belong in the frame.',
    meta_description = 'CGI and VFX spanning concept development, 3D integration, tracking, simulations, compositing, cleanup, and finishing.',
    image_path = '/images/services/cgi-and-vfx.jpg',
    image_alt = 'A luminous cobalt energy ribbon composited through sculptural chrome forms',
    disciplines = '["Concept frames and visual-effects planning","CGI objects and environment elements","Camera tracking and 3D integration","Particles, simulations, and atmospheric effects","Cleanup, compositing, and screen treatments","Colour integration and final finishing"]'::jsonb,
    useful_for = '["Product and campaign films","Cinematic brand and launch moments","Footage requiring cleanup or extension","Visual ideas beyond practical production"]'::jsonb,
    approach = '[{"title":"Plan the illusion","description":"Study the brief, plates, references, camera context, and final use before choosing the effects path."},{"title":"Build the elements","description":"Develop the required forms, materials, simulations, tracking, and look with the final frame in mind."},{"title":"Integrate the shot","description":"Composite light, colour, atmosphere, movement, and perspective so the added elements support the scene."},{"title":"Refine the finish","description":"Review each shot in sequence, resolve distracting details, and prepare the agreed outputs for delivery."}]'::jsonb,
    related_slugs = array['2d-and-3d-animation', 'ai-animation', 'video-editing']::text[],
    is_active = true,
    sort_order = 10,
    updated_at = now()
where id = 'e3e68584-f56c-4225-9077-863b798f67be';

alter table public.services
  alter column description set not null,
  alter column hero_title set not null,
  alter column meta_description set not null,
  alter column image_path set not null,
  alter column image_alt set not null;

insert into public.projects (id, slug, title, category, format_label, description, meta_description, image_path, image_alt, premise_question, premise_context, direction, system, experience, explores, principle, tone, palette, status, featured, sort_order, published_at)
values ('bb223549-b166-5655-b0e1-e552f251b29e', 'signal-in-the-noise', 'Signal in the Noise', 'Film & Motion', 'Editorial film system', 'A story-led editing study about turning visual overload into one deliberate line of attention.', 'Signal in the Noise is an original AY Media Work concept exploring editorial rhythm, narrative hierarchy, sound direction, and cinematic finishing.', '/images/work/signal-in-the-noise.jpg', 'Layered film strips converging around a precise cobalt beam in a dark cinematic space', 'How can an edit make a dense stream of information feel focused rather than frantic?', 'The concept begins with fragments: competing frames, interrupted pathways, and visual noise. The central idea is not to remove complexity, but to direct it toward a single readable signal.', 'The visual language uses fractured film layers and strong negative space to create tension between distraction and control. One cobalt line becomes the recurring point of orientation.', 'Frame density, scale, and contrast are treated as editorial tools. Quiet holds create room around compressed passages, while graphic markers help the eye understand where the story is moving.', 'The imagined sequence would move from scattered sound and rapid fragments toward a calmer, resolved rhythm—allowing the finish to feel earned rather than simply decorative.', '["Narrative hierarchy inside information-rich edits","Pacing built through contrast rather than constant speed","A graphic motif that can connect picture and sound","Cinematic finishing that preserves clarity on small screens"]'::jsonb, 'Complexity becomes useful when attention has somewhere to land.', '["Focused","Cinematic","Precise"]'::jsonb, '[{"name":"Deep space","hex":"#06080E"},{"name":"Signal blue","hex":"#377DFF"},{"name":"Cold steel","hex":"#9AA8C0"},{"name":"Marker red","hex":"#E34A50"}]'::jsonb, 'published', true, 1, '2026-08-24T00:00:00Z')
on conflict (id) do update
set slug = excluded.slug, title = excluded.title, category = excluded.category, format_label = excluded.format_label, description = excluded.description, meta_description = excluded.meta_description, image_path = excluded.image_path, image_alt = excluded.image_alt, premise_question = excluded.premise_question, premise_context = excluded.premise_context, direction = excluded.direction, system = excluded.system, experience = excluded.experience, explores = excluded.explores, principle = excluded.principle, tone = excluded.tone, palette = excluded.palette, status = excluded.status, featured = excluded.featured, sort_order = excluded.sort_order, published_at = excluded.published_at, updated_at = now();
insert into public.project_services (project_id, service_id, sort_order) values ('bb223549-b166-5655-b0e1-e552f251b29e', '8f40a393-06f3-49c6-9d98-350a278f6c03', 1) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.project_services (project_id, service_id, sort_order) values ('bb223549-b166-5655-b0e1-e552f251b29e', '08016a2d-beff-4d52-8423-8fcbca37aecb', 2) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.project_services (project_id, service_id, sort_order) values ('bb223549-b166-5655-b0e1-e552f251b29e', 'e3e68584-f56c-4225-9077-863b798f67be', 3) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;

insert into public.projects (id, slug, title, category, format_label, description, meta_description, image_path, image_alt, premise_question, premise_context, direction, system, experience, explores, principle, tone, palette, status, featured, sort_order, published_at)
values ('0e916060-66e3-5906-9382-496ad39cfc96', 'interface-in-motion', 'Interface in Motion', 'Product Stories', 'SaaS product narrative', 'A product-film direction that turns connected features into a guided visual journey instead of a screen recording.', 'Interface in Motion is an original AY Media Work concept for SaaS product storytelling through clear journeys, interface-led motion, and dimensional design.', '/images/work/interface-in-motion.jpg', 'Translucent blue and violet interface panels flowing through a dark product-story environment', 'How can a product story explain connected actions without becoming a tour of every feature?', 'This study treats the interface as a narrative space. Each panel exists only when it advances the viewer through a clear before, action, and after sequence.', 'Floating glass planes create a product world without copying any real software. Depth separates stages in the journey, while cobalt and violet light identify progress and active moments.', 'A modular camera path connects overview, focus, and confirmation states. The same spatial rules could support a main film, feature chapters, or shorter campaign cutdowns.', 'Motion remains measured and legible: elements enter with purpose, related actions stay visually grouped, and the camera pauses whenever the audience needs to understand a change.', '["Product stories organised around user intent","Interface-inspired motion without imitating real software","Reusable scene rules for multiple feature narratives","A balance of dimensional atmosphere and graphic clarity"]'::jsonb, 'Show the journey the product enables—not every control it contains.', '["Clear","Dimensional","Guided"]'::jsonb, '[{"name":"Night navy","hex":"#070A16"},{"name":"Product blue","hex":"#4B7DFF"},{"name":"Glass violet","hex":"#8E6BFF"},{"name":"Interface mist","hex":"#C7D4FF"}]'::jsonb, 'published', false, 2, '2026-08-24T00:00:00Z')
on conflict (id) do update
set slug = excluded.slug, title = excluded.title, category = excluded.category, format_label = excluded.format_label, description = excluded.description, meta_description = excluded.meta_description, image_path = excluded.image_path, image_alt = excluded.image_alt, premise_question = excluded.premise_question, premise_context = excluded.premise_context, direction = excluded.direction, system = excluded.system, experience = excluded.experience, explores = excluded.explores, principle = excluded.principle, tone = excluded.tone, palette = excluded.palette, status = excluded.status, featured = excluded.featured, sort_order = excluded.sort_order, published_at = excluded.published_at, updated_at = now();
insert into public.project_services (project_id, service_id, sort_order) values ('0e916060-66e3-5906-9382-496ad39cfc96', '4c29dc24-07cf-4812-92b3-a80317b34da1', 1) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.project_services (project_id, service_id, sort_order) values ('0e916060-66e3-5906-9382-496ad39cfc96', '42e81676-4c0e-421b-abce-fcc8304fb249', 2) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.project_services (project_id, service_id, sort_order) values ('0e916060-66e3-5906-9382-496ad39cfc96', '08016a2d-beff-4d52-8423-8fcbca37aecb', 3) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;

insert into public.projects (id, slug, title, category, format_label, description, meta_description, image_path, image_alt, premise_question, premise_context, direction, system, experience, explores, principle, tone, palette, status, featured, sort_order, published_at)
values ('cc34786e-2915-5f01-83ed-591a6a2efa6d', 'worlds-between-frames', 'Worlds Between Frames', 'Emerging Visuals', 'AI-assisted visual sequence', 'A surreal motion-world study shaped around continuity, human direction, and a finish beyond image generation.', 'Worlds Between Frames is an original AY Media Work concept exploring directed AI animation, CGI continuity, editorial structure, and compositing.', '/images/work/worlds-between-frames.jpg', 'Surreal cobalt glass landscape with chrome portals and violet cinematic atmosphere', 'What makes an unfamiliar generated world feel like one directed sequence rather than a collection of striking images?', 'The study starts with a simple rule: every transformation must inherit something from the frame before it. Shape, light, movement, or camera direction becomes the thread between worlds.', 'Cobalt glass, chrome arcs, and violet haze create a controlled material vocabulary. Surreal forms can change, but lighting logic and visual weight remain recognisable from scene to scene.', 'Reference frames define the recurring geometry, lens language, palette, and transition anchors. Generated exploration would sit inside those rules before edit, cleanup, and compositing.', 'The sequence is imagined as a slow escalation from intimate reflections to open impossible spaces, using editorial rhythm and sound to make each visual shift feel intentional.', '["Continuity rules for AI-assisted sequences","Human art direction before and after generation","Transitions built from shared material and movement","Edit, cleanup, sound, and compositing as core craft"]'::jsonb, 'New visual tools still need old creative discipline: rules, rhythm, and review.', '["Surreal","Coherent","Atmospheric"]'::jsonb, '[{"name":"Void","hex":"#080714"},{"name":"Cobalt glass","hex":"#303DD9"},{"name":"Violet haze","hex":"#7657BB"},{"name":"Reflective pearl","hex":"#D9D6DF"}]'::jsonb, 'published', false, 3, '2026-08-24T00:00:00Z')
on conflict (id) do update
set slug = excluded.slug, title = excluded.title, category = excluded.category, format_label = excluded.format_label, description = excluded.description, meta_description = excluded.meta_description, image_path = excluded.image_path, image_alt = excluded.image_alt, premise_question = excluded.premise_question, premise_context = excluded.premise_context, direction = excluded.direction, system = excluded.system, experience = excluded.experience, explores = excluded.explores, principle = excluded.principle, tone = excluded.tone, palette = excluded.palette, status = excluded.status, featured = excluded.featured, sort_order = excluded.sort_order, published_at = excluded.published_at, updated_at = now();
insert into public.project_services (project_id, service_id, sort_order) values ('cc34786e-2915-5f01-83ed-591a6a2efa6d', '16459520-5f00-4673-8f8d-60559a9fdb25', 1) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.project_services (project_id, service_id, sort_order) values ('cc34786e-2915-5f01-83ed-591a6a2efa6d', 'e3e68584-f56c-4225-9077-863b798f67be', 2) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.project_services (project_id, service_id, sort_order) values ('cc34786e-2915-5f01-83ed-591a6a2efa6d', '8f40a393-06f3-49c6-9d98-350a278f6c03', 3) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;

insert into public.projects (id, slug, title, category, format_label, description, meta_description, image_path, image_alt, premise_question, premise_context, direction, system, experience, explores, principle, tone, palette, status, featured, sort_order, published_at)
values ('2abbc030-3dea-5110-888c-6648f7318edb', 'identity-in-rhythm', 'Identity in Rhythm', 'Brand & Campaign', 'Modular campaign language', 'A graphic system built to remain recognisable while composition, pace, and format continue to change.', 'Identity in Rhythm is an original AY Media Work concept exploring modular campaign design, hierarchy, motion principles, and format adaptation.', '/images/work/identity-in-rhythm.jpg', 'Rhythmic cobalt paper planes, chrome discs, and violet layers arranged on a dark modular grid', 'How can a campaign feel alive across formats without losing the visual cues that make it recognisable?', 'The concept uses a small kit of parts—angled planes, circular anchors, translucent fields, and one red marker—to create variety inside a repeatable identity.', 'Tactile paper and chrome add contrast to a precise digital grid. Compositions feel energetic, but recurring scale relationships and colour roles keep the system controlled.', 'Each format starts from the same anchor-and-flow rule. The anchor holds recognition; the directional planes adapt to horizontal, vertical, static, and motion-led placements.', 'In motion, shapes would arrive in short rhythmic phrases rather than continuous activity. The result is designed to create distinct moments for message, image, and action.', '["A compact visual kit with room for variation","Hierarchy that survives horizontal and vertical formats","Motion principles derived from the graphic identity","Campaign consistency without template repetition"]'::jsonb, 'Consistency comes from shared rules, not identical layouts.', '["Graphic","Rhythmic","Adaptable"]'::jsonb, '[{"name":"Ink","hex":"#080A10"},{"name":"Electric cobalt","hex":"#2F5BEA"},{"name":"Soft violet","hex":"#9284C9"},{"name":"Accent red","hex":"#F04452"}]'::jsonb, 'published', false, 4, '2026-08-24T00:00:00Z')
on conflict (id) do update
set slug = excluded.slug, title = excluded.title, category = excluded.category, format_label = excluded.format_label, description = excluded.description, meta_description = excluded.meta_description, image_path = excluded.image_path, image_alt = excluded.image_alt, premise_question = excluded.premise_question, premise_context = excluded.premise_context, direction = excluded.direction, system = excluded.system, experience = excluded.experience, explores = excluded.explores, principle = excluded.principle, tone = excluded.tone, palette = excluded.palette, status = excluded.status, featured = excluded.featured, sort_order = excluded.sort_order, published_at = excluded.published_at, updated_at = now();
insert into public.project_services (project_id, service_id, sort_order) values ('2abbc030-3dea-5110-888c-6648f7318edb', '08016a2d-beff-4d52-8423-8fcbca37aecb', 1) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.project_services (project_id, service_id, sort_order) values ('2abbc030-3dea-5110-888c-6648f7318edb', 'bef5495e-b88a-4c97-b2a6-3bb370e6a962', 2) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.project_services (project_id, service_id, sort_order) values ('2abbc030-3dea-5110-888c-6648f7318edb', '8f40a393-06f3-49c6-9d98-350a278f6c03', 3) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;

insert into public.projects (id, slug, title, category, format_label, description, meta_description, image_path, image_alt, premise_question, premise_context, direction, system, experience, explores, principle, tone, palette, status, featured, sort_order, published_at)
values ('74e2f623-fe26-5fd6-8fed-b0e926962d8f', 'connected-by-design', 'Connected by Design', 'Digital Systems', 'Web and workflow concept', 'A digital-experience study where the visible interface and the workflow behind it follow the same clear logic.', 'Connected by Design is an original AY Media Work concept exploring responsive web structure, connected workflows, human checkpoints, and visual feedback.', '/images/work/connected-by-design.jpg', 'Glass digital frames and luminous blue pathways forming a connected workflow in a dark space', 'What changes when the interface and the automated workflow are designed as one experience?', 'This concept maps every visible action to a clear system response. Connections are shown only when they help a person understand progress, responsibility, or the next decision.', 'Responsive glass frames represent user-facing moments while luminous pathways reveal the supporting flow. A brighter node marks places where human judgement remains essential.', 'The proposed structure separates triggers, automated steps, review points, and outcomes. Components reuse the same status language so the experience stays coherent from small screen to wide workspace.', 'Feedback is immediate but restrained. The system communicates what happened, what needs attention, and how to recover—without exposing technical complexity that does not help the user.', '["One information model across interface and workflow","Visible human checkpoints inside connected processes","Responsive components with consistent status language","Graceful feedback for progress, exceptions, and recovery"]'::jsonb, 'Automation feels trustworthy when people can see where they remain in control.', '["Connected","Calm","Legible"]'::jsonb, '[{"name":"System black","hex":"#060A11"},{"name":"Flow blue","hex":"#2580FF"},{"name":"Node cyan","hex":"#56D5FF"},{"name":"Review violet","hex":"#786CFF"}]'::jsonb, 'published', false, 5, '2026-08-24T00:00:00Z')
on conflict (id) do update
set slug = excluded.slug, title = excluded.title, category = excluded.category, format_label = excluded.format_label, description = excluded.description, meta_description = excluded.meta_description, image_path = excluded.image_path, image_alt = excluded.image_alt, premise_question = excluded.premise_question, premise_context = excluded.premise_context, direction = excluded.direction, system = excluded.system, experience = excluded.experience, explores = excluded.explores, principle = excluded.principle, tone = excluded.tone, palette = excluded.palette, status = excluded.status, featured = excluded.featured, sort_order = excluded.sort_order, published_at = excluded.published_at, updated_at = now();
insert into public.project_services (project_id, service_id, sort_order) values ('74e2f623-fe26-5fd6-8fed-b0e926962d8f', '4531277e-0d26-4994-b632-13f3245ee328', 1) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.project_services (project_id, service_id, sort_order) values ('74e2f623-fe26-5fd6-8fed-b0e926962d8f', 'e1738033-c5ab-4fa2-8da4-71e6a6e8bfac', 2) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.project_services (project_id, service_id, sort_order) values ('74e2f623-fe26-5fd6-8fed-b0e926962d8f', '4c29dc24-07cf-4812-92b3-a80317b34da1', 3) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;

insert into public.projects (id, slug, title, category, format_label, description, meta_description, image_path, image_alt, premise_question, premise_context, direction, system, experience, explores, principle, tone, palette, status, featured, sort_order, published_at)
values ('29668268-13f2-5e15-9d09-42da0440146e', 'impossible-made-visible', 'Impossible, Made Visible', 'Emerging Visuals', 'CGI and VFX key sequence', 'A visual-effects study about making one impossible event feel physically present inside a cinematic frame.', 'Impossible, Made Visible is an original AY Media Work concept exploring CGI form, energy simulation, lighting integration, compositing, and cinematic finishing.', '/images/work/impossible-made-visible.jpg', 'Sculptural chrome form split by a controlled ribbon of cobalt energy in a cinematic set', 'How can a physically impossible effect still feel as though it belongs to the photographed world?', 'The concept centres on one event: a controlled energy ribbon passes through a reflective object and changes its structure. Every creative choice supports the weight, light, and consequence of that moment.', 'A grounded industrial set gives the effect something real to interact with. Chrome surfaces expose every lighting decision, while smoke and fine debris make movement visible through the atmosphere.', 'The effect is separated into form, energy, particles, reflected light, contact light, and environmental response. Building these layers independently allows the final composite to be tuned as one believable shot.', 'The imagined sequence holds before the event, accelerates through the split, then allows the environment to settle. That contrast gives scale to the effect without relying on constant spectacle.', '["CGI designed around the photographed environment","Simulation layers with distinct visual responsibilities","Reflected and contact light as integration tools","Editorial restraint before and after a hero effect"]'::jsonb, 'An impossible image feels present when the environment appears to remember it.', '["Physical","Controlled","Cinematic"]'::jsonb, '[{"name":"Set black","hex":"#07090D"},{"name":"Energy blue","hex":"#168BFF"},{"name":"Chrome","hex":"#A9B2BD"},{"name":"Heat red","hex":"#BC343E"}]'::jsonb, 'published', false, 6, '2026-08-24T00:00:00Z')
on conflict (id) do update
set slug = excluded.slug, title = excluded.title, category = excluded.category, format_label = excluded.format_label, description = excluded.description, meta_description = excluded.meta_description, image_path = excluded.image_path, image_alt = excluded.image_alt, premise_question = excluded.premise_question, premise_context = excluded.premise_context, direction = excluded.direction, system = excluded.system, experience = excluded.experience, explores = excluded.explores, principle = excluded.principle, tone = excluded.tone, palette = excluded.palette, status = excluded.status, featured = excluded.featured, sort_order = excluded.sort_order, published_at = excluded.published_at, updated_at = now();
insert into public.project_services (project_id, service_id, sort_order) values ('29668268-13f2-5e15-9d09-42da0440146e', 'e3e68584-f56c-4225-9077-863b798f67be', 1) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.project_services (project_id, service_id, sort_order) values ('29668268-13f2-5e15-9d09-42da0440146e', '42e81676-4c0e-421b-abce-fcc8304fb249', 2) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.project_services (project_id, service_id, sort_order) values ('29668268-13f2-5e15-9d09-42da0440146e', '8f40a393-06f3-49c6-9d98-350a278f6c03', 3) on conflict (project_id, service_id) do update set sort_order = excluded.sort_order;

insert into public.blog_posts (id, slug, title, category, excerpt, meta_description, author, body, image_path, image_alt, tags, takeaways, reading_minutes, status, featured, published_at)
values ('37dffeed-cc48-56e4-b1ec-553ebd33ae0e', 'one-idea-many-outputs', 'One Idea, Many Outputs', 'Creative Direction', 'A practical way to make film, design, motion, and digital touchpoints feel like parts of one story—not separate requests sharing a deadline.', 'Explore a connected creative-direction method for carrying one central idea across film, design, motion, campaigns, and digital experiences.', 'AY Media Work', 'A project can begin as a film and quickly become a landing page, a set of social cutdowns, campaign graphics, motion loops, and a product explanation. The number of outputs grows, but the audience should still feel one clear thought moving through all of them.

That coherence does not come from placing the same colour and logo everywhere. It comes from deciding what must remain recognisable when the format, pace, and level of detail change.

## Start with the idea that must survive

Before discussing deliverables, write the central idea in language that can guide a creative decision. It should be more useful than a slogan and more focused than a list of objectives.

A working idea might describe a tension to resolve, a change the audience should understand, or a feeling the experience should leave behind. The purpose is not to produce finished copy. It is to create a reference point for the many choices that follow.

When the central idea is clear, each discipline can interpret it rather than decorate around it.

> A connected system repeats the logic of the idea, not the surface of one execution.

## Give every output a distinct job

A launch film and a mobile landing page do not hold attention in the same way. A short campaign edit cannot carry the same context as a product walkthrough. Trying to make every asset communicate the full story usually creates crowded work.

Instead, assign a role to each part of the system:

- **Introduce** the tension or possibility.
- **Explain** the change, process, or product.
- **Demonstrate** the experience in a concrete way.
- **Remind** the audience through a recognisable visual or verbal cue.
- **Convert** interest into one clear next action.

These roles can overlap, but naming them prevents duplication and helps the team decide what each format can leave out.

## Build rules that travel

A useful creative system contains a small number of rules that can move between disciplines. Those rules may include:

- A hierarchy for what the audience sees first, second, and last.
- A rhythm that alternates dense information with space to absorb it.
- A recurring visual behaviour, such as convergence, reveal, interruption, or transformation.
- A material or lighting language that can inform graphics, animation, CGI, and interface details.
- A voice that defines how direct, technical, playful, or restrained the words should feel.

The goal is not to make a rigid template. It is to give different makers enough shared logic to create related work without producing identical layouts.

## Let the disciplines influence one another

Connected direction becomes stronger when the flow is not one-way. Editorial rhythm can influence interaction design. Interface hierarchy can clarify a product film. A sound motif can suggest a motion principle. A three-dimensional material can become a graphic texture.

This exchange is easiest when the disciplines meet early. If every team receives a finished answer from another department, the project becomes a chain of adaptations. If the central idea is shared before the answers are fixed, each craft can improve the system.

## Review the journey, not only the assets

Individual outputs are often reviewed in isolation because that is how files arrive. The audience, however, may move from a short video to a landing page, then to a deeper explanation or inquiry.

A connected review asks:

1. What does the audience already know at this point?
2. What new information or feeling does this output add?
3. Which cue confirms that they are still inside the same story?
4. What should they understand or do next?

This sequence can reveal repetition, missing context, and abrupt changes in tone that remain invisible when every asset is judged alone.

## Coherence leaves room for change

The strongest systems do not depend on one fixed composition. They preserve a recognisable centre while allowing format, emphasis, and energy to adapt.

That is the practical value of beginning with one idea: the project can grow without becoming a collection of unrelated requests. Film, design, motion, and technology become different expressions of the same direction—and each expression can focus on the job it does best.', '/images/blog/one-idea-many-outputs.jpg', 'A radiant cobalt glass core connecting film, graphic, dimensional, and interface-inspired forms', '["Creative direction","Content systems","Multidisciplinary craft"]'::jsonb, '["Define the central idea before choosing its formats.","Give every output a role instead of asking every output to say everything.","Build shared rules for voice, rhythm, hierarchy, and visual behaviour.","Review the complete journey as well as each individual asset."]'::jsonb, 4, 'published', true, '2026-08-24T00:00:00Z')
on conflict (id) do update
set slug = excluded.slug, title = excluded.title, category = excluded.category, excerpt = excluded.excerpt, meta_description = excluded.meta_description, author = excluded.author, body = excluded.body, image_path = excluded.image_path, image_alt = excluded.image_alt, tags = excluded.tags, takeaways = excluded.takeaways, reading_minutes = excluded.reading_minutes, status = excluded.status, featured = excluded.featured, published_at = excluded.published_at, updated_at = now();
insert into public.blog_post_services (blog_post_id, service_id, sort_order) values ('37dffeed-cc48-56e4-b1ec-553ebd33ae0e', '8f40a393-06f3-49c6-9d98-350a278f6c03', 1) on conflict (blog_post_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.blog_post_services (blog_post_id, service_id, sort_order) values ('37dffeed-cc48-56e4-b1ec-553ebd33ae0e', '08016a2d-beff-4d52-8423-8fcbca37aecb', 2) on conflict (blog_post_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.blog_post_services (blog_post_id, service_id, sort_order) values ('37dffeed-cc48-56e4-b1ec-553ebd33ae0e', '4531277e-0d26-4994-b632-13f3245ee328', 3) on conflict (blog_post_id, service_id) do update set sort_order = excluded.sort_order;

insert into public.blog_posts (id, slug, title, category, excerpt, meta_description, author, body, image_path, image_alt, tags, takeaways, reading_minutes, status, featured, published_at)
values ('69f93b95-79e1-5858-a767-c4510818368a', 'motion-that-carries-meaning', 'Motion That Carries Meaning', 'Motion & Design', 'Movement becomes useful when pace, direction, and transition help the audience understand what changed—and why it matters.', 'Learn how timing, hierarchy, continuity, and restraint can make animation and motion design clarify a story instead of merely adding activity.', 'AY Media Work', 'Motion can attract attention almost instantly. That does not mean it automatically creates understanding.

When every element moves because movement is available, the audience has to work harder to decide what matters. Useful motion does the opposite: it directs attention, explains relationships, and makes change easier to follow.

## Begin with the change

Before choosing an easing curve or transition style, identify what is changing for the audience.

Is a new idea entering? Is one state becoming another? Are several parts being grouped? Is the viewer moving from overview to detail? The movement should make that change more legible.

A simple test is to finish this sentence: **this moves because…** If the answer is only “to make it dynamic,” the motion may not yet have a clear responsibility.

## Treat timing as hierarchy

Visual hierarchy is often discussed through size, colour, and position. In motion, timing becomes another layer of hierarchy.

The first movement receives attention. A pause creates emphasis. A faster passage can compress repeated actions. A slower transition can signal that the audience is entering a new chapter.

This makes contrast essential. Constant speed feels flat even when it is fast. Constant activity can make important moments disappear inside the same level of energy.

Useful timing often includes:

- A clear lead action.
- Supporting movement that follows rather than competes.
- Holds long enough for the result to be understood.
- Acceleration where repetition no longer needs full explanation.
- A deliberate finish rather than an arbitrary stop.

## Preserve a thread through transitions

A transition feels coherent when something survives the change. It could be direction, shape, colour, scale, position, or a continuing sound.

For example, a circular product detail might expand into a wider system map while keeping its centre and colour role. A camera movement may continue through two different environments. A graphic line can become the path that reveals the next scene.

The scenes do not need to look identical. They need a relationship the audience can follow.

> Continuity is not the absence of change. It is the presence of a readable connection.

## Use restraint to give movement weight

Stillness is part of motion design. Without it, the audience loses the reference needed to feel acceleration, interruption, or impact.

A quiet frame can prepare a reveal. A short hold can let a product state register. A stable element can anchor the eye while supporting information changes around it.

Restraint also protects accessibility and performance. Not every interaction needs a large transition, and not every background needs continuous movement. The most visible motion should belong to the most useful change.

## Design sound and picture as one rhythm

Sound should not be added only after the visual timing is locked. Even a restrained sound direction can influence where a movement begins, how long it holds, and whether a transition feels soft, mechanical, physical, or weightless.

This does not require filling every action with an effect. Silence, room tone, texture, and emphasis can create a clearer rhythm than constant audio punctuation.

A shared timing map for picture and sound helps both disciplines support the same hierarchy.

## Review motion in its real context

A sequence that feels elegant on a large editing monitor may become unclear inside a small mobile card. Fine movement can disappear. Fast type can become unreadable. A subtle transition may be lost when the viewer is also scrolling.

Review should include the intended dimensions, surrounding interface, playback behaviour, and reduced-motion alternative. The question is not only whether the animation looks polished. It is whether the audience can understand it where it actually lives.

Motion earns its place when it carries the story forward. Pace, transition, sound, and stillness become tools for meaning—not decoration added after the direction is already complete.', '/images/blog/motion-that-carries-meaning.jpg', 'A cobalt ribbon moving through suspended chrome frames with alternating tension, space, and rhythm', '["Motion design","Animation","Visual storytelling"]'::jsonb, '["Connect every movement to a change in meaning or attention.","Use contrast in timing instead of keeping everything in motion.","Carry visual properties across transitions to preserve continuity.","Review motion at the size and context where it will be experienced."]'::jsonb, 4, 'published', false, '2026-08-24T00:00:00Z')
on conflict (id) do update
set slug = excluded.slug, title = excluded.title, category = excluded.category, excerpt = excluded.excerpt, meta_description = excluded.meta_description, author = excluded.author, body = excluded.body, image_path = excluded.image_path, image_alt = excluded.image_alt, tags = excluded.tags, takeaways = excluded.takeaways, reading_minutes = excluded.reading_minutes, status = excluded.status, featured = excluded.featured, published_at = excluded.published_at, updated_at = now();
insert into public.blog_post_services (blog_post_id, service_id, sort_order) values ('69f93b95-79e1-5858-a767-c4510818368a', '42e81676-4c0e-421b-abce-fcc8304fb249', 1) on conflict (blog_post_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.blog_post_services (blog_post_id, service_id, sort_order) values ('69f93b95-79e1-5858-a767-c4510818368a', '8f40a393-06f3-49c6-9d98-350a278f6c03', 2) on conflict (blog_post_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.blog_post_services (blog_post_id, service_id, sort_order) values ('69f93b95-79e1-5858-a767-c4510818368a', '4c29dc24-07cf-4812-92b3-a80317b34da1', 3) on conflict (blog_post_id, service_id) do update set sort_order = excluded.sort_order;

insert into public.blog_posts (id, slug, title, category, excerpt, meta_description, author, body, image_path, image_alt, tags, takeaways, reading_minutes, status, featured, published_at)
values ('e4a61721-c8b5-59c2-b82a-07617c8245b3', 'automation-with-a-human-thread', 'Automation With a Human Thread', 'AI & Automation', 'A responsible workflow does more than move information quickly. It makes ownership, review, exceptions, and recovery visible to the people using it.', 'A practical framework for designing AI-assisted automation with clear ownership, human review points, understandable states, and graceful recovery.', 'AY Media Work', 'Automation is often drawn as a clean line: a trigger enters, a series of steps runs, and an outcome appears. Real work contains more texture. Information can be incomplete. Priorities can change. A result may need judgement before it is useful.

A responsible automated workflow accounts for that texture rather than hiding it.

## Map responsibility before speed

Begin with the people and decisions already inside the process. Who supplies the source material? Who can approve a result? Who needs to understand what happened? Who is responsible when the expected path fails?

These questions reveal where automation can remove repetition and where it must preserve human ownership.

A workflow map should distinguish between:

- **Triggers** that begin a process.
- **Transformations** that organise, generate, or move information.
- **Decisions** that affect meaning, quality, permission, or risk.
- **Review points** where a person needs useful context.
- **Outcomes** that are visible to a customer, collaborator, or internal team.

The distinction prevents an automated step from quietly becoming an unreviewed decision.

## Make the system legible

People trust a workflow more easily when they can understand its current state. They do not need every technical detail, but they should be able to answer practical questions:

- Did the process start?
- What information is it using?
- Is anything waiting for review?
- What changed since the last step?
- What happens next?
- Can this action be corrected or reversed?

Clear status language and useful notifications are part of the experience, not secondary interface polish.

## Put review where it can change the result

A human checkpoint is most useful before an outcome becomes expensive or difficult to reverse. Review placed only at the end can turn a fast workflow into a fast way to produce rework.

The reviewer also needs the right context. Showing an output without the source, objective, or highlighted uncertainty forces a person to reconstruct the process before making a decision.

A good review state presents what changed, why attention is required, and which actions are available.

> Human review should be designed as a meaningful step, not an emergency brake.

## Plan for exceptions from the beginning

The ideal path is only one part of the system. Inputs may be missing. A connected service may be unavailable. Generated material may not meet the brief. A duplicate request may arrive.

For each important step, define:

1. What can fail or remain uncertain?
2. How will the system recognise that state?
3. What will the person see?
4. Can the process retry safely?
5. Who receives the unresolved item?

This turns failure from a hidden technical event into a manageable experience.

## Keep generated work inside a creative process

AI-assisted output still needs a brief, references, boundaries, selection, refinement, and approval. Generation can expand exploration or reduce repetitive setup, but it does not remove the need for direction.

For creative workflows, retain the source context and decision trail. Record which material is approved, which output is provisional, and where a person changed or rejected a suggestion. This makes collaboration clearer and future revision more reliable.

## Evaluate the whole experience

The number of automated steps is not a useful measure by itself. A longer workflow may be better if it creates clearer review, safer recovery, and a more understandable outcome.

Evaluate whether the system:

- Reduces repeated manual transfer.
- Preserves important context.
- Makes responsibility visible.
- Helps people notice exceptions sooner.
- Gives users a practical path to correct mistakes.
- Leaves consequential choices with the right person.

Automation becomes valuable when it supports the people inside the process. The human thread is not a limitation to remove. It is the source of context, judgement, and responsibility that gives the workflow a reason to exist.', '/images/blog/automation-with-human-thread.jpg', 'A warm organic light thread passing through a calm network of cobalt glass workflow nodes', '["AI automation","Workflow design","Human review"]'::jsonb, '["Map responsibility before mapping automated steps.","Keep consequential decisions visible and reviewable.","Design exception and recovery paths alongside the ideal flow.","Measure usefulness through the experience, not the number of automated steps."]'::jsonb, 4, 'published', false, '2026-08-24T00:00:00Z')
on conflict (id) do update
set slug = excluded.slug, title = excluded.title, category = excluded.category, excerpt = excluded.excerpt, meta_description = excluded.meta_description, author = excluded.author, body = excluded.body, image_path = excluded.image_path, image_alt = excluded.image_alt, tags = excluded.tags, takeaways = excluded.takeaways, reading_minutes = excluded.reading_minutes, status = excluded.status, featured = excluded.featured, published_at = excluded.published_at, updated_at = now();
insert into public.blog_post_services (blog_post_id, service_id, sort_order) values ('e4a61721-c8b5-59c2-b82a-07617c8245b3', 'e1738033-c5ab-4fa2-8da4-71e6a6e8bfac', 1) on conflict (blog_post_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.blog_post_services (blog_post_id, service_id, sort_order) values ('e4a61721-c8b5-59c2-b82a-07617c8245b3', '4531277e-0d26-4994-b632-13f3245ee328', 2) on conflict (blog_post_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.blog_post_services (blog_post_id, service_id, sort_order) values ('e4a61721-c8b5-59c2-b82a-07617c8245b3', '16459520-5f00-4673-8f8d-60559a9fdb25', 3) on conflict (blog_post_id, service_id) do update set sort_order = excluded.sort_order;

insert into public.blog_posts (id, slug, title, category, excerpt, meta_description, author, body, image_path, image_alt, tags, takeaways, reading_minutes, status, featured, published_at)
values ('d430a5b5-15ae-5ec3-aae1-0770c9ad9d07', 'website-as-a-living-system', 'Designing a Website as a Living System', 'Digital Experience', 'A strong website is not a stack of isolated pages. It is a connected system of content, components, behaviour, performance, and future change.', 'Explore a systems-based approach to web design that connects content structure, reusable components, responsive behaviour, motion, performance, and maintainability.', 'AY Media Work', 'A website may be presented as a set of screens, but people experience it as a changing system. Content grows. Navigation shifts. Images arrive in unexpected proportions. A visitor uses a smaller device, slower connection, keyboard, or reduced-motion preference.

Designing for that reality changes the work from arranging pages to defining relationships and rules.

## Begin with content and journeys

A page list is useful, but it does not explain how information connects. Start by identifying the main questions a visitor brings and the actions the experience should support.

For a creative studio, someone may want to understand the capability, judge the thinking behind the work, learn how collaboration feels, or begin an inquiry. Each journey crosses several content types rather than staying inside one page.

Map the journey through decisions:

- What does the visitor need to understand first?
- Which evidence or explanation supports that understanding?
- What uncertainty might prevent the next step?
- Which action is useful at this moment?

This gives navigation, page structure, and calls to action a shared purpose.

## Model content before styling components

A card is not a content model. It is one way to present information.

Define the stable fields behind the interface: title, summary, category, image, relationship, status, publication date, or destination. Once the content has structure, it can appear in a featured panel, filtered archive, related-content block, or compact navigation result without being copied into each layout.

This separation also prepares the website for a content management system. Editors change the information while presentation rules remain controlled by the application.

## Reuse meaning, not only appearance

A design system becomes more useful when components represent repeated responsibilities. A service card helps someone understand and open a capability. A status message explains what happened and what to do next. A testimonial card preserves quotation and attribution.

Two blocks may look similar but require different semantics, content rules, and accessibility behaviour. Forcing them into one universal component can make the code reusable while making the experience less clear.

> A living system needs shared rules and clear boundaries in equal measure.

## Design responsive behaviour intentionally

Responsive design is not the desktop layout folded into a narrow column. The order, density, interaction, and crop may need to change when space and input method change.

Decide what should happen when:

- A split layout becomes a single reading flow.
- A hover interaction reaches a touch device.
- A wide artwork is viewed inside a portrait screen.
- Navigation contains more items than one line can hold.
- A data table or filter set exceeds the available width.

These decisions belong in design and content review, not only in final implementation.

## Give motion a performance budget

Motion can explain hierarchy and make transitions feel connected, but it also consumes attention and resources. Prioritise movement that helps the user understand an entrance, state change, or relationship.

Use transforms and opacity where possible, avoid continuous effects without a clear role, and provide a reduced-motion path. Load media according to its importance rather than treating every visual as a hero asset.

Performance is part of the creative experience. A beautiful transition that delays the useful content has changed the meaning of the interaction.

## Plan for real states

Polished screens often show the ideal case. A maintainable site also needs rules for:

- Empty archives before content is approved.
- Long titles and summaries.
- Missing optional media.
- Form validation and submission failure.
- Unknown routes.
- Loading, stale data, and unavailable services.
- Restricted admin actions.

Designing these states early keeps them consistent with the rest of the experience and prevents technical messages from becoming the final interface.

## Build for the next edit

Launch is one state of the website, not its finish. Clear content models, typed data boundaries, reusable components, accessible defaults, and documented media requirements make future change safer.

The aim is not to predict every future page. It is to create a system where new content can enter without breaking the hierarchy, performance, or trust established by the current experience.

A living website stays coherent because its rules remain visible—across the interface, the code, the content workflow, and the people responsible for what changes next.', '/images/blog/website-as-living-system.jpg', 'Translucent responsive page frames arranged as a connected architectural design system', '["Web development","Design systems","Performance"]'::jsonb, '["Model the content and user journey before arranging pages.","Build reusable rules around meaning, not visual similarity alone.","Treat responsive behaviour and reduced motion as design decisions.","Plan for editing, failure, and future growth before launch."]'::jsonb, 4, 'published', false, '2026-08-24T00:00:00Z')
on conflict (id) do update
set slug = excluded.slug, title = excluded.title, category = excluded.category, excerpt = excluded.excerpt, meta_description = excluded.meta_description, author = excluded.author, body = excluded.body, image_path = excluded.image_path, image_alt = excluded.image_alt, tags = excluded.tags, takeaways = excluded.takeaways, reading_minutes = excluded.reading_minutes, status = excluded.status, featured = excluded.featured, published_at = excluded.published_at, updated_at = now();
insert into public.blog_post_services (blog_post_id, service_id, sort_order) values ('d430a5b5-15ae-5ec3-aae1-0770c9ad9d07', '4531277e-0d26-4994-b632-13f3245ee328', 1) on conflict (blog_post_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.blog_post_services (blog_post_id, service_id, sort_order) values ('d430a5b5-15ae-5ec3-aae1-0770c9ad9d07', '08016a2d-beff-4d52-8423-8fcbca37aecb', 2) on conflict (blog_post_id, service_id) do update set sort_order = excluded.sort_order;
insert into public.blog_post_services (blog_post_id, service_id, sort_order) values ('d430a5b5-15ae-5ec3-aae1-0770c9ad9d07', 'e1738033-c5ab-4fa2-8da4-71e6a6e8bfac', 3) on conflict (blog_post_id, service_id) do update set sort_order = excluded.sort_order;

insert into public.site_settings (key, value, is_public)
values
  ('brand.name', '"AY Media Work"'::jsonb, true),
  ('brand.line', '"Ideas in motion. Stories that stay."'::jsonb, true),
  ('social.instagram', '"https://www.instagram.com/aymediawork_/"'::jsonb, true),
  ('social.ytjobs', '"https://ytjobs.co/talent/profile/439676?r=253"'::jsonb, true),
  ('social.linkedin_status', '"coming_soon"'::jsonb, true)
on conflict (key) do nothing;

-- Keep edit timestamps, publication timestamps, owner safety, and audit entries automatic.
drop trigger if exists services_set_updated_at on public.services;
drop trigger if exists inquiries_set_updated_at on public.inquiries;
drop trigger if exists newsletter_subscribers_set_updated_at on public.newsletter_subscribers;

drop trigger if exists services_set_cms_updated_at on public.services;
create trigger services_set_cms_updated_at
before update on public.services
for each row execute function public.set_cms_updated_at();

drop trigger if exists admin_profiles_set_cms_updated_at on public.admin_profiles;
create trigger admin_profiles_set_cms_updated_at
before update on public.admin_profiles
for each row execute function public.set_cms_updated_at();

drop trigger if exists admin_profiles_protect_last_owner on public.admin_profiles;
create trigger admin_profiles_protect_last_owner
before update or delete on public.admin_profiles
for each row execute function public.protect_last_owner();

drop trigger if exists projects_set_cms_updated_at on public.projects;
create trigger projects_set_cms_updated_at
before update on public.projects
for each row execute function public.set_cms_updated_at();

drop trigger if exists projects_set_publication_timestamp on public.projects;
create trigger projects_set_publication_timestamp
before insert or update on public.projects
for each row execute function public.set_publication_timestamp();

drop trigger if exists blog_posts_set_cms_updated_at on public.blog_posts;
create trigger blog_posts_set_cms_updated_at
before update on public.blog_posts
for each row execute function public.set_cms_updated_at();

drop trigger if exists blog_posts_set_publication_timestamp on public.blog_posts;
create trigger blog_posts_set_publication_timestamp
before insert or update on public.blog_posts
for each row execute function public.set_publication_timestamp();

drop trigger if exists testimonials_set_cms_updated_at on public.testimonials;
create trigger testimonials_set_cms_updated_at
before update on public.testimonials
for each row execute function public.set_cms_updated_at();

drop trigger if exists client_logos_set_cms_updated_at on public.client_logos;
create trigger client_logos_set_cms_updated_at
before update on public.client_logos
for each row execute function public.set_cms_updated_at();

drop trigger if exists site_settings_set_cms_updated_at on public.site_settings;
create trigger site_settings_set_cms_updated_at
before update on public.site_settings
for each row execute function public.set_cms_updated_at();

drop trigger if exists inquiries_set_cms_updated_at on public.inquiries;
create trigger inquiries_set_cms_updated_at
before update on public.inquiries
for each row execute function public.set_cms_updated_at();

drop trigger if exists newsletter_set_cms_updated_at on public.newsletter_subscribers;
create trigger newsletter_set_cms_updated_at
before update on public.newsletter_subscribers
for each row execute function public.set_cms_updated_at();

drop trigger if exists newsletter_protect_explicit_consent on public.newsletter_subscribers;
create trigger newsletter_protect_explicit_consent
before update on public.newsletter_subscribers
for each row execute function public.protect_newsletter_consent();

-- Audit only operational mutations made with an authenticated admin identity.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'services',
    'admin_profiles',
    'projects',
    'blog_posts',
    'testimonials',
    'client_logos',
    'site_settings',
    'media_assets',
    'inquiries',
    'newsletter_subscribers'
  ]
  loop
    execute format('drop trigger if exists %I on public.%I', table_name || '_write_admin_audit', table_name);
    execute format(
      'create trigger %I after insert or update or delete on public.%I for each row execute function public.write_admin_audit_log()',
      table_name || '_write_admin_audit',
      table_name
    );
  end loop;
end;
$$;

grant select, insert, update, delete on public.admin_profiles, public.projects,
  public.project_services, public.blog_posts, public.blog_post_services,
  public.testimonials, public.client_logos, public.site_settings,
  public.media_assets, public.admin_audit_logs to service_role;

commit;

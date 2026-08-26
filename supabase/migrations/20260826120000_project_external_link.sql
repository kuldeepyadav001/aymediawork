-- Optional external showcase link per work entry (Instagram Reel, Behance,
-- Vimeo, client site, and similar). Shown as an outbound "view on platform"
-- button on the work detail page. Nullable; https URLs only. Flows through
-- save_admin_project exactly like video_url.

begin;

alter table public.projects
  add column if not exists external_url text;

alter table public.projects
  drop constraint if exists projects_external_url_format;
alter table public.projects
  add constraint projects_external_url_format check (
    external_url is null
    or external_url ~ '^https://[^\s]+$'
  );

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
      sort_order, video_url, external_url, created_by, updated_by
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
      (p_project ->> 'sort_order')::smallint,
      nullif(p_project ->> 'video_url', ''),
      nullif(p_project ->> 'external_url', ''),
      auth.uid(), auth.uid()
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
        video_url = nullif(p_project ->> 'video_url', ''),
        external_url = nullif(p_project ->> 'external_url', ''),
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

commit;

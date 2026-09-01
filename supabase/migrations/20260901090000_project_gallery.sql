-- Project gallery: optional additional images per work entry so ad-creative
-- sets and multi-frame projects can show every piece. Stored as a JSONB
-- string array of approved image paths (same validation family as
-- image_path). Includes the anonymous column grant (lesson from
-- 20260826130000: public queries fail closed without it).

begin;

alter table public.projects
  add column if not exists gallery jsonb not null default '[]'::jsonb;

alter table public.projects
  drop constraint if exists projects_gallery_shape;
alter table public.projects
  add constraint projects_gallery_shape check (
    public.cms_jsonb_is_string_array(gallery)
  );

grant select (gallery) on public.projects to anon;

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
      sort_order, video_url, external_url, gallery, created_by, updated_by
    ) values (
      p_project ->> 'slug', p_project ->> 'title', p_project ->> 'category',
      p_project ->> 'description', p_project ->> 'meta_description',
      p_project ->> 'image_path', p_project ->> 'image_alt',
      p_project ->> 'format_label',
      nullif(p_project ->> 'premise_question', ''),
      nullif(p_project ->> 'premise_context', ''),
      nullif(p_project ->> 'direction', ''),
      nullif(p_project ->> 'system', ''),
      nullif(p_project ->> 'experience', ''),
      p_project -> 'explores',
      nullif(p_project ->> 'principle', ''),
      p_project -> 'tone',
      p_project -> 'palette', p_project ->> 'status',
      (p_project ->> 'featured')::boolean,
      (p_project ->> 'sort_order')::smallint,
      nullif(p_project ->> 'video_url', ''),
      nullif(p_project ->> 'external_url', ''),
      coalesce(p_project -> 'gallery', '[]'::jsonb),
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
        premise_question = nullif(p_project ->> 'premise_question', ''),
        premise_context = nullif(p_project ->> 'premise_context', ''),
        direction = nullif(p_project ->> 'direction', ''),
        system = nullif(p_project ->> 'system', ''),
        experience = nullif(p_project ->> 'experience', ''),
        explores = p_project -> 'explores',
        principle = nullif(p_project ->> 'principle', ''),
        tone = p_project -> 'tone',
        palette = p_project -> 'palette',
        status = p_project ->> 'status',
        featured = (p_project ->> 'featured')::boolean,
        sort_order = (p_project ->> 'sort_order')::smallint,
        video_url = nullif(p_project ->> 'video_url', ''),
        external_url = nullif(p_project ->> 'external_url', ''),
        gallery = coalesce(p_project -> 'gallery', '[]'::jsonb),
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

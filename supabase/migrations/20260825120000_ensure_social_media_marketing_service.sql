-- Stage 10 catalog reconciliation: ensure Social Media Marketing exists with the complete CMS shape.
-- This remains safe after the full ordered migration sequence and repairs environments where
-- 20260825110000_admin_cms.sql was applied before the catalog amendment.

begin;

insert into public.services (
  id,
  slug,
  title,
  is_active,
  sort_order,
  description,
  hero_title,
  meta_description,
  image_path,
  image_alt,
  disciplines,
  useful_for,
  approach,
  related_slugs
)
values (
  '4d9b60c4-145b-4fc8-9195-9005dfe33cbf',
  'social-media-marketing',
  'Social Media Marketing',
  true,
  8,
  'Organic social systems built around clear strategy, useful content rhythms, and consistent brand participation.',
  'Build a social presence that stays coherent from one post to the next.',
  'Organic social media marketing across strategy, content planning, calendars, publishing coordination, community coordination, reporting, and iteration.',
  '/images/services/social-media-marketing.jpg',
  'Glass content tiles moving through a connected cobalt publishing system',
  '["Organic social strategy","Channel and audience priorities","Content pillars and recurring formats","Editorial calendars and content planning","Publishing and community coordination","Performance reporting and iteration"]'::jsonb,
  '["Brands building a consistent organic presence","Teams needing a practical publishing rhythm","Campaigns supported by ongoing social content","Channels ready for clearer learning loops"]'::jsonb,
  '[{"title":"Set the channel direction","description":"Align the audience priorities, channel roles, brand guardrails, available resources, and outcomes organic social should support."},{"title":"Shape the content system","description":"Translate the strategy into useful content pillars, recurring formats, editorial calendars, and a workable approval rhythm."},{"title":"Coordinate the presence","description":"Prepare publishing inputs and community guidance so planned content and audience interactions stay connected to the brand."},{"title":"Learn and refine","description":"Review audience signals and content performance in context, then turn the findings into focused improvements for the next cycle."}]'::jsonb,
  array['graphic-design', 'video-editing', 'facebook-and-meta-ads']::text[]
)
on conflict (id) do update
set
  slug = excluded.slug,
  title = excluded.title,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  description = excluded.description,
  hero_title = excluded.hero_title,
  meta_description = excluded.meta_description,
  image_path = excluded.image_path,
  image_alt = excluded.image_alt,
  disciplines = excluded.disciplines,
  useful_for = excluded.useful_for,
  approach = excluded.approach,
  related_slugs = excluded.related_slugs,
  updated_at = now();

update public.services
set
  sort_order = case slug
    when 'facebook-and-meta-ads' then 9
    when 'cgi-and-vfx' then 10
    else sort_order
  end,
  updated_at = now()
where slug in ('facebook-and-meta-ads', 'cgi-and-vfx');

commit;

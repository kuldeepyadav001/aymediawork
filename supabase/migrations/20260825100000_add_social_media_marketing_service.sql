-- Stage 10 catalog amendment: add organic Social Media Marketing.
-- This is intentionally forward-only because the Stage 9 inquiry migration is already applied.

begin;

insert into public.services (id, slug, title, is_active, sort_order)
values (
  '4d9b60c4-145b-4fc8-9195-9005dfe33cbf',
  'social-media-marketing',
  'Social Media Marketing',
  true,
  8
)
on conflict (id) do update
set
  slug = excluded.slug,
  title = excluded.title,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
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

-- Fix: the video_url (20260826090000) and external_url (20260826120000)
-- columns were added without extending the anon column-level SELECT grant
-- on public.projects. Anonymous public queries selecting those columns were
-- rejected, so the site silently served the code-level fallback studies
-- instead of CMS projects. Extend the grant to the two presentation fields.

begin;

grant select (video_url, external_url) on public.projects to anon;

commit;

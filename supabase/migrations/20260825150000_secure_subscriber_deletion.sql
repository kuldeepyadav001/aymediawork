-- Secure newsletter-subscriber deletion: senior admins (owner, admin) may
-- permanently delete subscriber records. Editors and unauthenticated users
-- remain denied by RLS. The existing newsletter_subscribers_write_admin_audit
-- trigger records a non-PII deletion entry. Deleting a record erases its
-- consent evidence; re-adding the address requires fresh explicit consent.

begin;

drop policy if exists "senior admins delete subscribers" on public.newsletter_subscribers;
create policy "senior admins delete subscribers"
on public.newsletter_subscribers for delete
to authenticated
using (public.has_admin_role(array['owner', 'admin']));

grant delete on public.newsletter_subscribers to authenticated;

commit;

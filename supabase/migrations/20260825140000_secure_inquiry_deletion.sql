-- Secure inquiry deletion: senior admins (owner, admin) may permanently delete
-- inquiry records. Editors and unauthenticated users remain denied by RLS.
-- The existing inquiries_write_admin_audit trigger records a non-PII deletion
-- entry, and inquiry_services rows are removed by the existing cascade.

begin;

drop policy if exists "senior admins delete inquiries" on public.inquiries;
create policy "senior admins delete inquiries"
on public.inquiries for delete
to authenticated
using (public.has_admin_role(array['owner', 'admin']));

grant delete on public.inquiries to authenticated;

commit;

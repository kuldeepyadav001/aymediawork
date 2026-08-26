-- Security Advisor remediation: SECURITY DEFINER functions keep the least
-- privilege that still lets the system work.
--
-- 1. Trigger functions (protect_last_owner, write_admin_audit_log) are only
--    ever invoked by their triggers; trigger firing does not require the
--    acting role to hold EXECUTE, so all direct-call grants are removed.
-- 2. The role-helper functions lose the default PUBLIC grant and the unused
--    anon grant. The authenticated grant is intentional and must remain:
--    RLS policies evaluate these helpers as the querying role, and each
--    helper only ever reveals the caller's own admin state.

begin;

revoke all on function public.protect_last_owner()
  from public, anon, authenticated;
revoke all on function public.write_admin_audit_log()
  from public, anon, authenticated;

revoke all on function public.current_admin_role() from public, anon;
revoke all on function public.is_active_admin() from public, anon;
revoke all on function public.has_admin_role(text[]) from public, anon;

grant execute on function public.current_admin_role()
  to authenticated, service_role;
grant execute on function public.is_active_admin()
  to authenticated, service_role;
grant execute on function public.has_admin_role(text[])
  to authenticated, service_role;

commit;

-- Security Advisor remediation, part 2: remove the /rest/v1/rpc/* exposure
-- of the SECURITY DEFINER role helpers by moving them out of the `public`
-- schema. PostgREST only serves functions from exposed schemas (public), so
-- the RPC endpoints disappear. Existing RLS policies keep working because
-- policy expressions bind functions by OID, which ALTER ... SET SCHEMA
-- preserves. The two helpers whose SQL bodies reference
-- public.current_admin_role() by name are recreated with the new
-- schema-qualified reference; CREATE OR REPLACE preserves their ACLs.

begin;

create schema if not exists internal;
revoke all on schema internal from public;
grant usage on schema internal to authenticated, service_role;

alter function public.current_admin_role() set schema internal;
alter function public.is_active_admin() set schema internal;
alter function public.has_admin_role(text[]) set schema internal;

create or replace function internal.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select internal.current_admin_role() is not null;
$$;

create or replace function internal.has_admin_role(allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(internal.current_admin_role() = any(allowed_roles), false);
$$;

commit;

import type { Metadata } from "next";

import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ProjectForm } from "@/components/admin/project-form";
import { getProjectEditorData } from "@/lib/supabase/queries/admin";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "New project" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [data, context, query] = await Promise.all([
    getProjectEditorData(),
    getAdminContext(),
    searchParams,
  ]);
  return (
    <>
      <AdminPageHeader
        description="Draft a new portfolio case study. Nothing appears publicly until a senior role publishes it."
        eyebrow="Portfolio CMS"
        title="New project"
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />
      <ProjectForm
        canPublish={context ? canPublish(context.role) : false}
        project={null}
        selectedServiceIds={data.selectedServiceIds}
        services={data.services}
      />
    </>
  );
}

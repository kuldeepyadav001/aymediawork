import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ProjectForm } from "@/components/admin/project-form";
import { getProjectEditorData } from "@/lib/supabase/queries/admin";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Edit project" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type Params = Promise<{ id: string }>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const [data, context, query] = await Promise.all([
    getProjectEditorData(id),
    getAdminContext(),
    searchParams,
  ]);
  if (!data.project) notFound();
  if (!context) redirect("/admin/login");
  if (!canPublish(context.role) && data.project.status !== "draft")
    redirect(
      "/admin/projects?error=Editors%20can%20only%20modify%20draft%20records.",
    );
  return (
    <>
      <AdminPageHeader
        description={`Editing /work/${data.project.slug}`}
        eyebrow="Portfolio CMS"
        title={data.project.title}
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />
      <ProjectForm
        canPublish={context ? canPublish(context.role) : false}
        project={data.project}
        selectedServiceIds={data.selectedServiceIds}
        services={data.services}
      />
    </>
  );
}

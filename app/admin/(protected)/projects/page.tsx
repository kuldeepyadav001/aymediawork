import type { Metadata } from "next";
import Link from "next/link";

import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ContentList } from "@/components/admin/content-list";
import { Button } from "@/components/ui/button";
import { listRows } from "@/lib/supabase/queries/admin";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Projects" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [projects, context, query] = await Promise.all([
    listRows("projects", "sort_order"),
    getAdminContext(),
    searchParams,
  ]);

  return (
    <>
      <AdminPageHeader
        actions={
          <Button asChild>
            <Link href="/admin/projects/new">New project</Link>
          </Button>
        }
        description="Create, sequence, feature, draft, and publish portfolio case studies."
        eyebrow="Portfolio CMS"
        title="Projects"
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />
      <div className="mt-6">
        <ContentList
          canDelete={context ? canPublish(context.role) : false}
          editBasePath="/admin/projects"
          entity="project"
          items={projects.map((project) => ({
            canEdit: context
              ? canPublish(context.role) || project.status === "draft"
              : false,
            id: project.id,
            status: project.status,
            subtitle: `${project.category} · /work/${project.slug}`,
            title: project.title,
            updatedAt: project.updated_at,
          }))}
        />
      </div>
    </>
  );
}

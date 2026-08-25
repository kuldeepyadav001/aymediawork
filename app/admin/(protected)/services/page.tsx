import type { Metadata } from "next";
import Link from "next/link";

import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ContentList } from "@/components/admin/content-list";
import { Button } from "@/components/ui/button";
import { listRows } from "@/lib/supabase/queries/admin";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Services" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [services, context, query] = await Promise.all([
    listRows("services", "sort_order"),
    getAdminContext(),
    searchParams,
  ]);

  return (
    <>
      <AdminPageHeader
        actions={
          <Button asChild>
            <Link href="/admin/services/new">New service</Link>
          </Button>
        }
        description="Maintain the ordered capability catalog and each service detail page."
        eyebrow="Capability CMS"
        title="Services"
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />
      <div className="mt-6">
        <ContentList
          canDelete={context ? canPublish(context.role) : false}
          editBasePath="/admin/services"
          entity="service"
          items={services.map((service) => ({
            canEdit: context
              ? canPublish(context.role) || !service.is_active
              : false,
            id: service.id,
            status: service.is_active ? "active" : "inactive",
            subtitle: `/services/${service.slug}`,
            title: service.title,
            updatedAt: service.updated_at,
          }))}
        />
      </div>
    </>
  );
}

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ServiceForm } from "@/components/admin/service-form";
import { getRow } from "@/lib/supabase/queries/admin";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Edit service" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type Params = Promise<{ id: string }>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function EditServicePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const [service, context, query] = await Promise.all([
    getRow("services", id),
    getAdminContext(),
    searchParams,
  ]);
  if (!service) notFound();
  if (!context) redirect("/admin/login");
  if (!canPublish(context.role) && service.is_active)
    redirect(
      "/admin/services?error=Editors%20can%20only%20modify%20inactive%20services.",
    );
  return (
    <>
      <AdminPageHeader
        description={`Editing /services/${service.slug}`}
        eyebrow="Capability CMS"
        title={service.title}
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />
      <ServiceForm canPublish={canPublish(context.role)} service={service} />
    </>
  );
}

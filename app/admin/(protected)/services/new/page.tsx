import type { Metadata } from "next";

import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ServiceForm } from "@/components/admin/service-form";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "New service" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function NewServicePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [context, query] = await Promise.all([getAdminContext(), searchParams]);
  return (
    <>
      <AdminPageHeader
        description="Add a capability as an inactive draft before publishing."
        eyebrow="Capability CMS"
        title="New service"
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />
      <ServiceForm
        canPublish={context ? canPublish(context.role) : false}
        service={null}
      />
    </>
  );
}

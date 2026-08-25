import type { Metadata } from "next";

import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ClientLogoForm } from "@/components/admin/client-logo-form";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "New client logo" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;
export default async function NewClientLogoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [context, query] = await Promise.all([getAdminContext(), searchParams]);
  return (
    <>
      <AdminPageHeader
        description="Register an approved client mark as a draft."
        eyebrow="Brand proof"
        title="New client logo"
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />
      <ClientLogoForm
        canPublish={context ? canPublish(context.role) : false}
        logo={null}
      />
    </>
  );
}

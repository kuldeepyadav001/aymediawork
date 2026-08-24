import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ClientLogoForm } from "@/components/admin/client-logo-form";
import { getRow } from "@/lib/supabase/queries/admin";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Edit client logo" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type Params = Promise<{ id: string }>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;
export default async function EditClientLogoPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const [logo, context, query] = await Promise.all([
    getRow("client_logos", id),
    getAdminContext(),
    searchParams,
  ]);
  if (!logo) notFound();
  if (!context) redirect("/admin/login");
  if (!canPublish(context.role) && logo.status !== "draft")
    redirect(
      "/admin/client-logos?error=Editors%20can%20only%20modify%20draft%20records.",
    );
  return (
    <>
      <AdminPageHeader
        description="Review artwork, permission, destination, and publication."
        eyebrow="Brand proof"
        title={logo.name}
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />
      <ClientLogoForm
        canPublish={context ? canPublish(context.role) : false}
        logo={logo}
      />
    </>
  );
}

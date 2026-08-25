import type { Metadata } from "next";
import Link from "next/link";

import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ContentList } from "@/components/admin/content-list";
import { Button } from "@/components/ui/button";
import { listRows } from "@/lib/supabase/queries/admin";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Client logos" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function ClientLogosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [logos, context, query] = await Promise.all([
    listRows("client_logos", "sort_order"),
    getAdminContext(),
    searchParams,
  ]);

  return (
    <>
      <AdminPageHeader
        actions={
          <Button asChild>
            <Link href="/admin/client-logos/new">New client logo</Link>
          </Button>
        }
        description="Manage approved client marks without inventing affiliations or endorsements."
        eyebrow="Brand proof"
        title="Client logos"
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />
      <div className="mt-6">
        <ContentList
          canDelete={context ? canPublish(context.role) : false}
          editBasePath="/admin/client-logos"
          entity="clientLogo"
          items={logos.map((logo) => ({
            canEdit: context
              ? canPublish(context.role) || logo.status === "draft"
              : false,
            id: logo.id,
            status: logo.status,
            subtitle: logo.image_path,
            title: logo.name,
            updatedAt: logo.updated_at,
          }))}
        />
      </div>
    </>
  );
}

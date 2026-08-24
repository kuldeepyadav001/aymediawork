import type { Metadata } from "next";
import Link from "next/link";

import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ContentList } from "@/components/admin/content-list";
import { Button } from "@/components/ui/button";
import { listRows } from "@/lib/supabase/queries/admin";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Testimonials" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [testimonials, context, query] = await Promise.all([
    listRows("testimonials", "sort_order"),
    getAdminContext(),
    searchParams,
  ]);

  return (
    <>
      <AdminPageHeader
        actions={
          <Button asChild>
            <Link href="/admin/testimonials/new">New testimonial</Link>
          </Button>
        }
        description="Only publish genuine client quotations after permission is recorded."
        eyebrow="Proof CMS"
        title="Testimonials"
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />
      <div className="mt-6">
        <ContentList
          canDelete={context ? canPublish(context.role) : false}
          editBasePath="/admin/testimonials"
          entity="testimonial"
          items={testimonials.map((testimonial) => ({
            canEdit: context
              ? canPublish(context.role) || testimonial.status === "draft"
              : false,
            id: testimonial.id,
            status: testimonial.status,
            subtitle: testimonial.quote,
            title: testimonial.attribution_name,
            updatedAt: testimonial.updated_at,
          }))}
        />
      </div>
    </>
  );
}

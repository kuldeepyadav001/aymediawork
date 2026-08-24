import type { Metadata } from "next";

import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { listRows } from "@/lib/supabase/queries/admin";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "New testimonial" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;
export default async function NewTestimonialPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [projects, context, query] = await Promise.all([
    listRows("projects", "title"),
    getAdminContext(),
    searchParams,
  ]);
  return (
    <>
      <AdminPageHeader
        description="Add a genuine, permission-controlled quotation."
        eyebrow="Proof CMS"
        title="New testimonial"
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />
      <TestimonialForm
        canPublish={context ? canPublish(context.role) : false}
        projects={projects}
        testimonial={null}
      />
    </>
  );
}

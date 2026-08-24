import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { getRow, listRows } from "@/lib/supabase/queries/admin";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Edit testimonial" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type Params = Promise<{ id: string }>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;
export default async function EditTestimonialPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const [testimonial, projects, context, query] = await Promise.all([
    getRow("testimonials", id),
    listRows("projects", "title"),
    getAdminContext(),
    searchParams,
  ]);
  if (!testimonial) notFound();
  if (!context) redirect("/admin/login");
  if (!canPublish(context.role) && testimonial.status !== "draft")
    redirect(
      "/admin/testimonials?error=Editors%20can%20only%20modify%20draft%20records.",
    );
  return (
    <>
      <AdminPageHeader
        description="Review attribution, context, permission, and publication state."
        eyebrow="Proof CMS"
        title={testimonial.attribution_name}
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />
      <TestimonialForm
        canPublish={context ? canPublish(context.role) : false}
        projects={projects}
        testimonial={testimonial}
      />
    </>
  );
}

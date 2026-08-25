import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { BlogForm } from "@/components/admin/blog-form";
import { getBlogEditorData } from "@/lib/supabase/queries/admin";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Edit blog post" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type Params = Promise<{ id: string }>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function EditBlogPostPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const [data, context, query] = await Promise.all([
    getBlogEditorData(id),
    getAdminContext(),
    searchParams,
  ]);
  if (!data.post) notFound();
  if (!context) redirect("/admin/login");
  if (!canPublish(context.role) && data.post.status !== "draft")
    redirect(
      "/admin/blog?error=Editors%20can%20only%20modify%20draft%20records.",
    );
  return (
    <>
      <AdminPageHeader
        description={`Editing /blog/${data.post.slug}`}
        eyebrow="Editorial CMS"
        title={data.post.title}
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />
      <BlogForm
        canPublish={context ? canPublish(context.role) : false}
        post={data.post}
        selectedServiceIds={data.selectedServiceIds}
        services={data.services}
      />
    </>
  );
}

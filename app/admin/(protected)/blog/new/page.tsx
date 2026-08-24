import type { Metadata } from "next";

import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { BlogForm } from "@/components/admin/blog-form";
import { getBlogEditorData } from "@/lib/supabase/queries/admin";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "New blog post" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function NewBlogPostPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [data, context, query] = await Promise.all([
    getBlogEditorData(),
    getAdminContext(),
    searchParams,
  ]);
  return (
    <>
      <AdminPageHeader
        description="Write a draft with safe Markdown and structured discovery fields."
        eyebrow="Editorial CMS"
        title="New blog post"
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />
      <BlogForm
        canPublish={context ? canPublish(context.role) : false}
        post={null}
        selectedServiceIds={data.selectedServiceIds}
        services={data.services}
      />
    </>
  );
}

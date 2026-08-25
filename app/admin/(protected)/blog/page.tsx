import type { Metadata } from "next";
import Link from "next/link";

import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ContentList } from "@/components/admin/content-list";
import { Button } from "@/components/ui/button";
import { listRows } from "@/lib/supabase/queries/admin";
import { canPublish, getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Blog" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [posts, context, query] = await Promise.all([
    listRows("blog_posts", "updated_at", false),
    getAdminContext(),
    searchParams,
  ]);

  return (
    <>
      <AdminPageHeader
        actions={
          <Button asChild>
            <Link href="/admin/blog/new">New post</Link>
          </Button>
        }
        description="Write safe Markdown articles, manage related services, and control publication."
        eyebrow="Editorial CMS"
        title="Blog"
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />
      <div className="mt-6">
        <ContentList
          canDelete={context ? canPublish(context.role) : false}
          editBasePath="/admin/blog"
          entity="blog"
          items={posts.map((post) => ({
            canEdit: context
              ? canPublish(context.role) || post.status === "draft"
              : false,
            id: post.id,
            status: post.status,
            subtitle: `${post.category} · /blog/${post.slug}`,
            title: post.title,
            updatedAt: post.updated_at,
          }))}
        />
      </div>
    </>
  );
}

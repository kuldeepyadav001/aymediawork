import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpenText,
  BriefcaseBusiness,
  MailOpen,
  UsersRound,
} from "lucide-react";

import { AdminNotice } from "@/components/admin/admin-notice";
import {
  AdminCard,
  AdminEmptyState,
  AdminPageHeader,
  formatAdminDate,
  StatusBadge,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/lib/supabase/queries/admin";
import { getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Dashboard" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [data, context, query] = await Promise.all([
    getDashboardData(),
    getAdminContext(),
    searchParams,
  ]);

  const stats = [
    { icon: BriefcaseBusiness, label: "Projects", value: data.counts.projects },
    { icon: BookOpenText, label: "Blog posts", value: data.counts.blogPosts },
    {
      icon: MailOpen,
      label: "Unread inquiries",
      value: data.counts.unreadInquiries,
    },
    {
      icon: UsersRound,
      label: "Active subscribers",
      value: data.counts.activeSubscribers,
    },
  ];

  return (
    <>
      <AdminPageHeader
        actions={
          <>
            <Button asChild variant="secondary">
              <Link href="/admin/blog/new">New post</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/projects/new">New project</Link>
            </Button>
          </>
        }
        description="Manage the published experience, incoming opportunities, and team operations."
        eyebrow="Control room"
        title={`Welcome, ${context?.displayName ?? "team"}`}
      />

      <AdminNotice error={first(query.error)} success={first(query.success)} />

      <section
        aria-label="Website overview"
        className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map(({ icon: Icon, label, value }) => (
          <AdminCard className="flex items-start justify-between" key={label}>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-3 font-display text-4xl font-semibold">
                {value}
              </p>
            </div>
            <span className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Icon aria-hidden="true" className="size-5" />
            </span>
          </AdminCard>
        ))}
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <AdminCard>
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">
              Recent inquiries
            </h2>
            <Button asChild size="sm" variant="ghost">
              <Link href="/admin/inquiries">View all</Link>
            </Button>
          </div>
          {data.recentInquiries.length === 0 ? (
            <AdminEmptyState>No inquiries have arrived yet.</AdminEmptyState>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[38rem] text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                  <tr className="border-b border-white/[0.08]">
                    <th className="px-2 py-3 font-medium">Contact</th>
                    <th className="px-2 py-3 font-medium">Type</th>
                    <th className="px-2 py-3 font-medium">Status</th>
                    <th className="px-2 py-3 font-medium">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentInquiries.map((inquiry) => (
                    <tr
                      className="border-b border-white/[0.06] last:border-0"
                      key={inquiry.id}
                    >
                      <td className="px-2 py-4">
                        <p
                          className={
                            inquiry.is_read
                              ? "font-medium"
                              : "font-bold text-primary"
                          }
                        >
                          {inquiry.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {inquiry.email}
                        </p>
                      </td>
                      <td className="px-2 py-4 capitalize">
                        {inquiry.inquiry_type}
                      </td>
                      <td className="px-2 py-4">
                        <StatusBadge status={inquiry.status} />
                      </td>
                      <td className="px-2 py-4 text-xs text-muted-foreground">
                        {formatAdminDate(inquiry.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>

        <AdminCard>
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">
              Recent activity
            </h2>
            <Button asChild size="sm" variant="ghost">
              <Link href="/admin/activity">Audit log</Link>
            </Button>
          </div>
          {data.activity.length === 0 ? (
            <AdminEmptyState>No admin changes recorded yet.</AdminEmptyState>
          ) : (
            <ol className="space-y-4">
              {data.activity.map((item) => (
                <li className="border-l border-primary/30 pl-4" key={item.id}>
                  <p className="text-sm font-medium capitalize">
                    {item.action.replaceAll("_", " ")} ·{" "}
                    {item.entity_type.replaceAll("_", " ")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatAdminDate(item.created_at)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </AdminCard>
      </div>
    </>
  );
}

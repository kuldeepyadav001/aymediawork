import type { Metadata } from "next";

import {
  AdminEmptyState,
  AdminPageHeader,
  formatAdminDate,
} from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { getAuditActivity } from "@/lib/supabase/queries/admin";

export const metadata: Metadata = { title: "Activity" };

export default async function ActivityPage() {
  const activity = await getAuditActivity();
  return (
    <>
      <AdminPageHeader
        description="A read-only operational record of authenticated CMS changes. Entries are written automatically by the database."
        eyebrow="Accountability"
        title="Audit activity"
      />
      {activity.length === 0 ? (
        <AdminEmptyState>
          No authenticated CMS changes have been recorded.
        </AdminEmptyState>
      ) : (
        <ol className="space-y-3">
          {activity.map((item) => (
            <li
              className="rounded-xl border border-white/[0.08] bg-surface/40 p-5"
              key={item.id}
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        item.action === "delete" ? "destructive" : "outline"
                      }
                    >
                      {item.action}
                    </Badge>
                    <h2 className="font-semibold capitalize">
                      {item.entity_type.replaceAll("_", " ")}
                    </h2>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    by {item.actorName}
                    {item.entity_id ? ` · Record ${item.entity_id}` : ""}
                  </p>
                </div>
                <time
                  className="text-xs text-muted-foreground"
                  dateTime={item.created_at}
                >
                  {formatAdminDate(item.created_at)}
                </time>
              </div>
              {item.details &&
              typeof item.details === "object" &&
              Object.keys(item.details).length > 0 ? (
                <pre className="mt-4 overflow-x-auto rounded-lg bg-black/20 p-3 text-xs text-muted-foreground">
                  {JSON.stringify(item.details, null, 2)}
                </pre>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

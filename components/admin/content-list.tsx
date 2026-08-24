import Link from "next/link";

import { deleteContentAction } from "@/app/admin/actions";
import {
  AdminEmptyState,
  formatAdminDate,
  StatusBadge,
} from "@/components/admin/admin-ui";
import { ConfirmSubmitButton } from "@/components/admin/form-buttons";
import { Button } from "@/components/ui/button";

export type ContentListItem = {
  canEdit?: boolean;
  id: string;
  title: string;
  subtitle?: string | null;
  status: string;
  updatedAt: string;
};

export function ContentList({
  canDelete,
  editBasePath,
  entity,
  items,
}: {
  canDelete: boolean;
  editBasePath: string;
  entity: "blog" | "clientLogo" | "project" | "service" | "testimonial";
  items: ContentListItem[];
}) {
  if (items.length === 0) {
    return (
      <AdminEmptyState>
        No records yet. Create the first one when content is ready.
      </AdminEmptyState>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-surface/35">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[48rem] text-left text-sm">
          <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-4 font-medium">Content</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Updated</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr className="border-t border-white/[0.07]" key={item.id}>
                <td className="px-5 py-4">
                  <p className="font-semibold">{item.title}</p>
                  {item.subtitle ? (
                    <p className="mt-1 max-w-xl truncate text-xs text-muted-foreground">
                      {item.subtitle}
                    </p>
                  ) : null}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-5 py-4 text-xs text-muted-foreground">
                  {formatAdminDate(item.updatedAt)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    {item.canEdit !== false ? (
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`${editBasePath}/${item.id}`}>Edit</Link>
                      </Button>
                    ) : (
                      <span
                        className="px-3 py-2 text-xs text-muted-foreground"
                        title="Editors can only modify draft or inactive records."
                      >
                        Publish-locked
                      </span>
                    )}
                    {canDelete ? (
                      <form action={deleteContentAction}>
                        <input name="entity" type="hidden" value={entity} />
                        <input name="id" type="hidden" value={item.id} />
                        <ConfirmSubmitButton>Delete</ConfirmSubmitButton>
                      </form>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

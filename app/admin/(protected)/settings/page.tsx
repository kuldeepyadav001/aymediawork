import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { saveSettingAction } from "@/app/admin/actions";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader, formatAdminDate } from "@/components/admin/admin-ui";
import { FormSubmitButton } from "@/components/admin/form-buttons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { listRows } from "@/lib/supabase/queries/admin";
import { getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Settings" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const context = await getAdminContext();
  if (!context || context.role !== "owner")
    redirect("/admin/dashboard?error=Owner+access+required.");
  const [settings, query] = await Promise.all([
    listRows("site_settings", "key"),
    searchParams,
  ]);

  return (
    <>
      <AdminPageHeader
        description="Manage typed JSON configuration. Public settings are readable by site visitors; private settings remain owner-only. Never store secrets here."
        eyebrow="Site configuration"
        title="Settings"
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />

      <form
        action={saveSettingAction}
        className="mt-7 rounded-xl border border-primary/20 bg-primary/[0.04] p-5"
      >
        <h2 className="font-display text-xl font-semibold">Add setting</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.5fr_auto] md:items-end">
          <div className="space-y-2">
            <label className="text-sm font-semibold" htmlFor="new-key">
              Lowercase dotted key
            </label>
            <Input
              id="new-key"
              name="key"
              pattern="[a-z0-9]+(?:[._-][a-z0-9]+)*"
              placeholder="section.item"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold" htmlFor="new-value">
              JSON value
            </label>
            <Input defaultValue="{}" id="new-value" name="value" required />
          </div>
          <FormSubmitButton>Add setting</FormSubmitButton>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input
            className="size-4 accent-primary"
            name="isPublic"
            type="checkbox"
          />{" "}
          Publicly readable
        </label>
      </form>

      <div className="mt-8 space-y-5">
        {settings.map((setting) => (
          <form
            action={saveSettingAction}
            className="rounded-xl border border-white/[0.08] bg-surface/40 p-5"
            key={setting.key}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-mono text-sm font-semibold text-primary">
                  {setting.key}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Updated {formatAdminDate(setting.updated_at)}
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  className="size-4 accent-primary"
                  defaultChecked={setting.is_public}
                  name="isPublic"
                  type="checkbox"
                />{" "}
                Publicly readable
              </label>
            </div>
            <input name="key" type="hidden" value={setting.key} />
            <label className="sr-only" htmlFor={`value-${setting.key}`}>
              JSON value for {setting.key}
            </label>
            <Textarea
              className="mt-4 min-h-40 font-mono text-xs"
              defaultValue={JSON.stringify(setting.value, null, 2)}
              id={`value-${setting.key}`}
              name="value"
              required
            />
            <div className="mt-4 flex justify-end">
              <FormSubmitButton pendingLabel="Saving…" variant="secondary">
                Save setting
              </FormSubmitButton>
            </div>
          </form>
        ))}
      </div>
    </>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  inviteAdminAction,
  updateAdminProfileAction,
} from "@/app/admin/actions";
import { AdminNotice } from "@/components/admin/admin-notice";
import {
  AdminEmptyState,
  AdminPageHeader,
  formatAdminDate,
  StatusBadge,
} from "@/components/admin/admin-ui";
import { adminSelectClassName } from "@/components/admin/admin-form";
import { FormSubmitButton } from "@/components/admin/form-buttons";
import { Input } from "@/components/ui/input";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { listRows } from "@/lib/supabase/queries/admin";
import { getAdminContext } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Users" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function UsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const context = await getAdminContext();
  if (!context || context.role !== "owner")
    redirect("/admin/dashboard?error=Owner+access+required.");

  const admin = getSupabaseAdmin();
  const [profiles, authUsers, query] = await Promise.all([
    listRows("admin_profiles", "created_at"),
    admin.auth.admin.listUsers({ page: 1, perPage: 100 }),
    searchParams,
  ]);
  if (authUsers.error)
    throw new Error(
      `Auth users could not be loaded: ${authUsers.error.message}`,
    );
  const userById = new Map(authUsers.data.users.map((user) => [user.id, user]));

  return (
    <>
      <AdminPageHeader
        description="Invite team members and assign least-privilege access. Only owners can change user access."
        eyebrow="Access control"
        title="Users"
      />
      <AdminNotice error={first(query.error)} success={first(query.success)} />

      <form
        action={inviteAdminAction}
        className="mt-7 grid gap-4 rounded-xl border border-white/[0.08] bg-surface/40 p-5 md:grid-cols-[1fr_1fr_11rem_auto] md:items-end"
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="displayName">
            Display name
          </label>
          <Input
            id="displayName"
            maxLength={100}
            minLength={2}
            name="displayName"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <Input
            autoComplete="email"
            id="email"
            maxLength={254}
            name="email"
            required
            type="email"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="role">
            Role
          </label>
          <select
            className={adminSelectClassName}
            defaultValue="editor"
            id="role"
            name="role"
          >
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <FormSubmitButton pendingLabel="Inviting…">
          Send invite
        </FormSubmitButton>
      </form>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Editors manage drafts. Admins can publish and delete content. Owners
        additionally manage settings and users.
      </p>

      <section className="mt-8">
        {profiles.length === 0 ? (
          <AdminEmptyState>No admin profiles found.</AdminEmptyState>
        ) : (
          <div className="space-y-4">
            {profiles.map((profile) => {
              const authUser = userById.get(profile.user_id);
              return (
                <article
                  className="rounded-xl border border-white/[0.08] bg-surface/40 p-5"
                  key={profile.user_id}
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-xl font-semibold">
                          {profile.display_name}
                        </h2>
                        <StatusBadge
                          status={profile.is_active ? "active" : "inactive"}
                        />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {authUser?.email ?? "Auth email unavailable"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Created {formatAdminDate(profile.created_at)}
                        {authUser?.last_sign_in_at
                          ? ` · Last sign-in ${formatAdminDate(authUser.last_sign_in_at)}`
                          : " · Invitation pending"}
                      </p>
                    </div>
                    <form
                      action={updateAdminProfileAction}
                      className="flex flex-col gap-3 sm:flex-row sm:items-end"
                    >
                      <input
                        name="userId"
                        type="hidden"
                        value={profile.user_id}
                      />
                      <div className="space-y-2">
                        <label
                          className="text-xs font-semibold"
                          htmlFor={`role-${profile.user_id}`}
                        >
                          Role
                        </label>
                        <select
                          className={adminSelectClassName}
                          defaultValue={profile.role}
                          id={`role-${profile.user_id}`}
                          name="role"
                        >
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                          <option value="owner">Owner</option>
                        </select>
                      </div>
                      <label className="flex h-11 items-center gap-2 rounded-lg border border-white/[0.08] px-4 text-sm">
                        <input
                          className="size-4 accent-primary"
                          defaultChecked={profile.is_active}
                          name="isActive"
                          type="checkbox"
                        />{" "}
                        Active
                      </label>
                      <FormSubmitButton
                        pendingLabel="Saving…"
                        variant="secondary"
                      >
                        Save access
                      </FormSubmitButton>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

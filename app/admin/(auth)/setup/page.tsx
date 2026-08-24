import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { bootstrapOwnerAction, logoutAction } from "@/app/admin/actions";
import { AdminNotice } from "@/components/admin/admin-notice";
import { BrandLogo } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdminContext, getAuthenticatedUser } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Owner setup" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminSetupPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [user, context, query] = await Promise.all([
    getAuthenticatedUser(),
    getAdminContext(),
    searchParams,
  ]);
  if (!user) redirect("/admin/login");
  if (context) redirect("/admin/dashboard");

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-12 text-foreground">
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.09] bg-surface/80 p-6 shadow-2xl sm:p-8">
        <Link
          aria-label="AY Media Work home"
          className="mx-auto block w-40"
          href="/"
        >
          <BrandLogo priority />
        </Link>
        <div className="mt-8 text-center">
          <p className="eyebrow">One-time activation</p>
          <h1 className="mt-3 font-display text-3xl font-semibold">
            Create the first owner
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This guarded setup works only while no owner profile exists. Later
            team members must be invited by the owner.
          </p>
        </div>
        <div className="mt-6">
          <AdminNotice
            error={first(query.error)}
            success={first(query.success)}
          />
        </div>
        <form action={bootstrapOwnerAction} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="displayName">
              Display name
            </label>
            <Input
              autoComplete="name"
              defaultValue={
                typeof user.user_metadata.display_name === "string"
                  ? user.user_metadata.display_name
                  : ""
              }
              id="displayName"
              maxLength={100}
              minLength={2}
              name="displayName"
              required
            />
          </div>
          <p className="rounded-lg bg-white/[0.04] px-4 py-3 text-xs text-muted-foreground">
            Signed in as {user.email}
          </p>
          <Button className="w-full" size="lg" type="submit">
            Activate owner account
          </Button>
        </form>
        <form action={logoutAction} className="mt-3">
          <Button className="w-full" type="submit" variant="ghost">
            Sign out
          </Button>
        </form>
      </div>
    </main>
  );
}

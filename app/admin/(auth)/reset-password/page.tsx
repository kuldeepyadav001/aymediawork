import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { updatePasswordAction } from "@/app/admin/actions";
import { AdminNotice } from "@/components/admin/admin-notice";
import { BrandLogo } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuthenticatedUser } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Set password" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const user = await getAuthenticatedUser();

  if (!user && !first(query.error)) {
    redirect(
      "/admin/login?error=Open+the+secure+link+from+your+email+to+set+a+password.",
    );
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-12 text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.09] bg-surface/80 p-6 shadow-2xl sm:p-8">
        <Link
          aria-label="AY Media Work home"
          className="mx-auto block w-40"
          href="/"
        >
          <BrandLogo priority />
        </Link>
        <div className="mt-8 text-center">
          <p className="eyebrow">Account security</p>
          <h1 className="mt-3 font-display text-3xl font-semibold">
            Set your password
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Use at least 12 characters and avoid passwords used on other
            services.
          </p>
        </div>
        <div className="mt-6">
          <AdminNotice
            error={first(query.error)}
            success={first(query.success)}
          />
        </div>
        {user ? (
          <form action={updatePasswordAction} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                New password
              </label>
              <Input
                autoComplete="new-password"
                id="password"
                minLength={12}
                name="password"
                required
                type="password"
              />
            </div>
            <Button className="w-full" size="lg" type="submit">
              Save password
            </Button>
          </form>
        ) : (
          <Button asChild className="mt-6 w-full">
            <Link href="/admin/login">Return to sign in</Link>
          </Button>
        )}
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { loginAction, requestPasswordResetAction } from "@/app/admin/actions";
import { AdminNotice } from "@/components/admin/admin-notice";
import { BrandLogo } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuthenticatedUser } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "Sign in" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getAuthenticatedUser();
  if (user) redirect("/admin/dashboard");

  const query = await searchParams;
  const error = first(query.error);
  const success = first(query.success);
  const next = first(query.next) ?? "/admin/dashboard";

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-background px-4 py-12 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,77,0,0.13),transparent_34%),radial-gradient(circle_at_80%_90%,rgba(99,102,241,0.10),transparent_36%)]" />
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.09] bg-surface/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <Link
          aria-label="AY Media Work home"
          className="mx-auto block w-40"
          href="/"
        >
          <BrandLogo priority />
        </Link>
        <div className="mt-8 text-center">
          <p className="eyebrow">Protected workspace</p>
          <h1 className="mt-3 font-display text-3xl font-semibold">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Use an invited team account to manage website content and
            operations.
          </p>
        </div>

        <div className="mt-6">
          <AdminNotice error={error} success={success} />
        </div>

        <form action={loginAction} className="mt-6 space-y-4">
          <input name="next" type="hidden" value={next} />
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              autoComplete="email"
              id="email"
              name="email"
              required
              type="email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Input
              autoComplete="current-password"
              id="password"
              minLength={12}
              name="password"
              required
              type="password"
            />
          </div>
          <Button className="w-full" size="lg" type="submit">
            Sign in
          </Button>
        </form>

        <details className="group mt-6 border-t border-white/[0.08] pt-5">
          <summary className="cursor-pointer list-none text-center text-sm font-medium text-muted-foreground hover:text-foreground">
            Forgot your password?
          </summary>
          <form action={requestPasswordResetAction} className="mt-4 space-y-3">
            <label className="sr-only" htmlFor="reset-email">
              Account email
            </label>
            <Input
              autoComplete="email"
              id="reset-email"
              name="email"
              placeholder="Account email"
              required
              type="email"
            />
            <Button className="w-full" type="submit" variant="secondary">
              Send reset link
            </Button>
          </form>
        </details>
      </div>
    </main>
  );
}

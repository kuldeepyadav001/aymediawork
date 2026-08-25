import type { ReactNode } from "react";
import Link from "next/link";
import {
  BookOpenText,
  BriefcaseBusiness,
  ContactRound,
  FileImage,
  Gauge,
  History,
  ImageIcon,
  LogOut,
  MessageSquareQuote,
  Settings,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { logoutAction } from "@/app/admin/actions";
import { BrandLockup } from "@/components/layout/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminContext } from "@/lib/supabase/session";

const navigation = [
  { href: "/admin/dashboard", icon: Gauge, label: "Overview" },
  { href: "/admin/projects", icon: BriefcaseBusiness, label: "Projects" },
  { href: "/admin/blog", icon: BookOpenText, label: "Blog" },
  { href: "/admin/services", icon: Sparkles, label: "Services" },
  {
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
    label: "Testimonials",
  },
  { href: "/admin/client-logos", icon: ImageIcon, label: "Client logos" },
  { href: "/admin/media", icon: FileImage, label: "Media" },
  { href: "/admin/inquiries", icon: ContactRound, label: "Inquiries" },
  { href: "/admin/activity", icon: History, label: "Activity" },
  { href: "/admin/users", icon: UsersRound, label: "Users", ownerOnly: true },
  {
    href: "/admin/settings",
    icon: Settings,
    label: "Settings",
    ownerOnly: true,
  },
] as const;

export function AdminShell({
  children,
  context,
}: {
  children: ReactNode;
  context: AdminContext;
}) {
  const visibleNavigation = navigation.filter(
    (item) => !("ownerOnly" in item) || context.role === "owner",
  );

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-background/90 backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-between gap-4 px-4">
          <Link aria-label="Admin dashboard" href="/admin/dashboard">
            <BrandLockup />
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{context.role}</Badge>
            <form action={logoutAction}>
              <Button
                aria-label="Sign out"
                size="icon-sm"
                type="submit"
                variant="ghost"
              >
                <LogOut aria-hidden="true" />
              </Button>
            </form>
          </div>
        </div>
        <nav
          aria-label="Admin mobile navigation"
          className="overflow-x-auto px-3 pb-3"
        >
          <ul className="flex min-w-max gap-1">
            {visibleNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  className="inline-flex min-h-10 items-center rounded-full px-3 text-xs font-semibold text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/[0.08] bg-surface/40 p-5 lg:flex lg:flex-col">
        <Link
          aria-label="Admin dashboard"
          className="w-fit"
          href="/admin/dashboard"
        >
          <BrandLockup priority />
        </Link>
        <div className="mt-7 border-y border-white/[0.08] py-4">
          <p className="truncate text-sm font-semibold">
            {context.displayName}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {context.email}
          </p>
          <Badge className="mt-3" variant="outline">
            {context.role}
          </Badge>
        </div>
        <nav
          aria-label="Admin navigation"
          className="mt-5 min-h-0 flex-1 overflow-y-auto"
        >
          <ul className="space-y-1">
            {visibleNavigation.map(({ href, icon: Icon, label }) => (
              <li key={href}>
                <Link
                  className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={href}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-2 border-t border-white/[0.08] pt-4">
          <Button asChild className="w-full justify-start" variant="ghost">
            <Link href="/" rel="noopener noreferrer" target="_blank">
              View public site
            </Link>
          </Button>
          <form action={logoutAction}>
            <Button
              className="w-full justify-start"
              type="submit"
              variant="ghost"
            >
              <LogOut aria-hidden="true" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <main className="min-h-dvh lg:pl-64">
        <div className="mx-auto w-full max-w-[96rem] px-4 py-8 sm:px-7 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu } from "lucide-react";

import { BrandLockup } from "@/components/layout/brand";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PRIMARY_NAVIGATION } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";

function isCurrentRoute(pathname: string, href: string) {
  if (href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => {
      const nextIsScrolled = window.scrollY > 24;
      setIsScrolled((current) =>
        current === nextIsScrolled ? current : nextIsScrolled,
      );
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        isScrolled
          ? "border-white/[0.08] bg-background/85 shadow-[0_16px_60px_-36px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          : "border-transparent bg-background/25",
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-6 sm:h-24">
        <Link
          aria-label="AY Media Work — home"
          className="shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/"
        >
          <BrandLockup priority />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {PRIMARY_NAVIGATION.map((item) => {
              const active = isCurrentRoute(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-10 items-center rounded-full px-3 text-[0.8125rem] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:px-4",
                      active && "text-foreground",
                    )}
                    href={item.href}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-4 bottom-1.5 h-px origin-left bg-brand-linear transition-transform duration-300",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden xl:inline-flex" variant="outline">
            <Link href="/contact">
              Start a project
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>

          <Dialog onOpenChange={setMenuOpen} open={menuOpen}>
            <DialogTrigger asChild>
              <Button
                aria-label="Open navigation"
                className="lg:hidden"
                size="icon"
                variant="outline"
              >
                <Menu aria-hidden="true" />
              </Button>
            </DialogTrigger>
            <DialogContent className="inset-0 h-dvh w-full max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none border-0 bg-background p-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2">
              <DialogTitle className="sr-only">Site navigation</DialogTitle>
              <DialogDescription className="sr-only">
                Navigate to an AY Media Work page.
              </DialogDescription>

              <Container className="flex min-h-dvh flex-col py-5 sm:py-7">
                <Link
                  aria-label="AY Media Work — home"
                  className="w-fit rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href="/"
                  onClick={() => setMenuOpen(false)}
                >
                  <BrandLockup />
                </Link>

                <nav aria-label="Mobile" className="my-auto py-16">
                  <ol className="space-y-1">
                    {PRIMARY_NAVIGATION.map((item, index) => {
                      const active = isCurrentRoute(pathname, item.href);

                      return (
                        <li key={item.href}>
                          <Link
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "group grid grid-cols-[2rem_1fr_auto] items-center gap-3 border-b border-white/[0.08] py-4 font-display text-3xl tracking-[-0.04em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:text-5xl",
                              active && "text-foreground",
                            )}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                          >
                            <span className="font-sans text-[0.625rem] tracking-[0.18em] text-muted-foreground">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            {item.label}
                            <ArrowUpRight
                              aria-hidden="true"
                              className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </nav>

                <div className="flex flex-col gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Ideas in motion. Stories that stay.
                  </p>
                  <Button asChild variant="brand">
                    <Link href="/contact" onClick={() => setMenuOpen(false)}>
                      Start a project
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </Container>
            </DialogContent>
          </Dialog>
        </div>
      </Container>
    </header>
  );
}

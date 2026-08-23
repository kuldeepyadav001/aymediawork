import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
  BRAND_LINE,
  LEGAL_NAVIGATION,
  PRIMARY_NAVIGATION,
} from "@/lib/constants/navigation";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[hsl(230_34%_3%)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 size-96 rounded-full bg-brand-violet/10 blur-[120px]"
      />

      <Container className="relative">
        <section
          aria-labelledby="footer-cta-title"
          className="grid gap-10 border-b border-white/[0.08] py-16 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end lg:py-24"
        >
          <div className="max-w-4xl">
            <p className="editorial-kicker mb-5">Start a project</p>
            <h2
              className="max-w-3xl text-balance font-display text-heading-xl"
              id="footer-cta-title"
            >
              Have an idea worth putting in motion?
            </h2>
          </div>
          <Button asChild size="xl" variant="brand">
            <Link href="/contact">
              Tell us about it
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
        </section>

        <div className="grid gap-14 py-14 sm:py-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(10rem,0.5fr)_minmax(10rem,0.5fr)] lg:gap-12">
          <div className="max-w-sm">
            <Link
              aria-label="AY Media Work — home"
              className="block w-52 transition-opacity hover:opacity-80 sm:w-60"
              href="/"
            >
              <BrandLogo />
            </Link>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              {BRAND_LINE}
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="editorial-kicker mb-5">Explore</p>
            <ul className="space-y-3">
              {PRIMARY_NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <p className="editorial-kicker mb-5">Legal</p>
            <ul className="space-y-3">
              {LEGAL_NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.08] py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AY Media Work.</p>
          <p>{BRAND_LINE}</p>
        </div>
      </Container>
    </footer>
  );
}

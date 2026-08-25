import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Camera,
  Clapperboard,
} from "lucide-react";

import { NewsletterForm } from "@/components/forms/newsletter-form";
import { BrandLogo } from "@/components/layout/brand";
import { PrivacySettingsButton } from "@/components/privacy/privacy-settings-button";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
  BRAND_LINE,
  FOOTER_NAVIGATION,
  LEGAL_NAVIGATION,
} from "@/lib/constants/navigation";
import type { SocialLink } from "@/lib/constants/social";
import { SOCIAL_LINKS } from "@/lib/constants/social";

const SOCIAL_ICONS = {
  Instagram: Camera,
  LinkedIn: BriefcaseBusiness,
  YTJobs: Clapperboard,
} as const;

type SiteFooterProps = {
  brandLine?: string;
  socialLinks?: readonly SocialLink[];
};

export function SiteFooter({
  brandLine = BRAND_LINE,
  socialLinks = SOCIAL_LINKS,
}: SiteFooterProps = {}) {
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

        <section
          aria-labelledby="newsletter-title"
          className="grid gap-7 border-b border-white/[0.08] py-10 sm:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)] sm:items-start sm:py-12"
        >
          <div className="max-w-xl">
            <p className="editorial-kicker mb-3">Studio notes</p>
            <h2
              className="font-display text-2xl tracking-[-0.035em]"
              id="newsletter-title"
            >
              Ideas on craft, systems, and work in motion.
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              An occasional note from AY Media Work, offered through a separate
              and explicit opt-in.
            </p>
          </div>
          <NewsletterForm
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />
        </section>

        <div className="grid gap-12 py-14 sm:grid-cols-2 sm:py-16 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(9rem,0.55fr))] lg:gap-10">
          <div className="max-w-sm">
            <Link
              aria-label="AY Media Work — home"
              className="block w-52 transition-opacity hover:opacity-80 sm:w-60"
              href="/"
            >
              <BrandLogo />
            </Link>
            {brandLine ? (
              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                {brandLine}
              </p>
            ) : null}
          </div>

          <nav aria-label="Footer">
            <p className="editorial-kicker mb-5">Explore</p>
            <ul className="space-y-3">
              {FOOTER_NAVIGATION.map((item) => (
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
              <li>
                <PrivacySettingsButton />
              </li>
            </ul>
          </nav>

          <nav aria-label="Social media">
            <p className="editorial-kicker mb-5">Connect</p>
            <ul className="space-y-2">
              {socialLinks.map((item) => {
                const Icon = SOCIAL_ICONS[item.label];
                const content = (
                  <>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.035] transition-[background-color,border-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/35 group-hover:bg-primary group-hover:text-background">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">
                        {item.label}
                      </span>
                      <span className="block truncate text-[0.6875rem] text-muted-foreground">
                        {item.note}
                      </span>
                    </span>
                    {item.status === "active" ? (
                      <ArrowUpRight
                        aria-hidden="true"
                        className="ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                      />
                    ) : null}
                  </>
                );

                return (
                  <li key={item.label}>
                    {item.status === "active" ? (
                      <a
                        className="group flex min-h-12 items-center gap-3 rounded-lg p-1.5 pr-2 transition-colors hover:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        href={item.href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {content}
                      </a>
                    ) : (
                      <div
                        aria-disabled="true"
                        className="flex min-h-12 cursor-not-allowed items-center gap-3 rounded-lg p-1.5 pr-2 opacity-45"
                      >
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.08] py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AY Media Work.</p>
          {brandLine ? <p>{brandLine}</p> : null}
        </div>
      </Container>
    </footer>
  );
}

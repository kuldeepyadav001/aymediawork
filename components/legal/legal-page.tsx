import type { ReactNode } from "react";
import Link from "next/link";

import { Container } from "@/components/shared/container";

export type LegalSection = {
  content: ReactNode;
  id: string;
  title: string;
};

type LegalPageProps = {
  description: string;
  eyebrow?: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
  title: string;
};

export function LegalPage({
  description,
  eyebrow = "Legal",
  lastUpdated,
  sections,
  title,
}: LegalPageProps) {
  return (
    <>
      <header className="relative isolate overflow-hidden border-b border-white/[0.08] py-20 sm:py-28 lg:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-48 -z-10 size-[38rem] rounded-full bg-brand-violet/10 blur-[135px]"
        />
        <Container>
          <p className="editorial-kicker">{eyebrow}</p>
          <h1 className="mt-6 max-w-4xl text-balance font-display text-display-lg">
            {title}
          </h1>
          <p className="mt-7 max-w-3xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
            {description}
          </p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/60">
            Last updated {lastUpdated}
          </p>
        </Container>
      </header>

      <Container className="py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav
              aria-label={`${title} sections`}
              className="rounded-xl border border-white/[0.09] bg-white/[0.025] p-5"
            >
              <p className="editorial-kicker mb-4">On this page</p>
              <ol className="space-y-2.5">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <Link
                      className="flex gap-3 text-sm leading-6 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      href={`#${section.id}`}
                    >
                      <span aria-hidden="true" className="text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {section.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="min-w-0 divide-y divide-white/[0.08]">
            {sections.map((section) => (
              <section
                className="scroll-mt-28 py-9 first:pt-0 sm:py-11"
                id={section.id}
                key={section.id}
              >
                <h2 className="font-display text-3xl tracking-[-0.04em] sm:text-4xl">
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8 [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:decoration-primary/60 [&_a]:underline-offset-4 hover:[&_a]:text-primary [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}

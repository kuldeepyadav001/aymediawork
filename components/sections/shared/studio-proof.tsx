import { ArrowUpRight } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { Container } from "@/components/shared/container";
import { STUDIO_STATS, YTJOBS_PROFILE_URL } from "@/lib/constants/studio-proof";

export function StudioProof({
  eyebrow = "Track record",
  title = "Work that audiences actually watched.",
}: {
  eyebrow?: string;
  title?: string;
}) {
  return (
    <section
      aria-labelledby="studio-proof-title"
      className="border-y border-white/[0.08] bg-surface/45 py-section"
    >
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="editorial-kicker">{eyebrow}</p>
            <h2
              className="mt-5 max-w-3xl text-balance text-heading-xl"
              id="studio-proof-title"
            >
              {title}
            </h2>
          </div>
          <a
            className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href={YTJOBS_PROFILE_URL}
            rel="noreferrer"
            target="_blank"
          >
            Verify on our public profile
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
            />
          </a>
        </Reveal>

        <Stagger className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {STUDIO_STATS.map((stat) => (
            <StaggerItem className="min-h-full bg-background" key={stat.label}>
              <div className="flex h-full min-h-44 flex-col justify-between p-7 sm:p-8">
                <p className="text-gradient-brand font-display text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
                  {stat.value}
                </p>
                <div className="mt-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em]">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                    {stat.note}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Figures reflect our published portfolio on YTJobs at the time of
          writing and are publicly verifiable there.
        </p>
      </Container>
    </section>
  );
}

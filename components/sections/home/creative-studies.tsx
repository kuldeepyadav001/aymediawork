import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import type { CreativeStudy } from "@/lib/constants/homepage";
import { CREATIVE_STUDIES } from "@/lib/constants/homepage";
import { cn } from "@/lib/utils/cn";

export function CreativeStudies({
  studies = CREATIVE_STUDIES,
}: {
  studies?: readonly CreativeStudy[];
}) {
  return (
    <section className="border-y border-white/[0.08] bg-surface/55 py-section">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            description="Three original art-direction studies exploring the visual territories behind our editing, motion, and social work. These are studio concepts—not attributed client projects."
            eyebrow="Creative directions"
            title="A glimpse of what an idea can become."
          />
          <Reveal delay={0.08}>
            <Button asChild variant="outline">
              <Link href="/work">
                Visit the work archive
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-4 lg:grid-cols-12 lg:grid-rows-2">
          {studies.map((study, index) => (
            <StaggerItem
              className={cn(
                "relative min-h-80 sm:min-h-[26rem]",
                index === 0
                  ? "lg:col-span-7 lg:row-span-2 lg:min-h-[46rem]"
                  : "lg:col-span-5 lg:min-h-0",
              )}
              key={study.title}
            >
              <Link
                className="group absolute inset-0 overflow-hidden rounded-xl border border-white/[0.1] bg-background shadow-panel transition-[border-color,box-shadow] duration-500 hover:border-primary/30 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={study.href}
              >
                <figure className="absolute inset-0">
                  <Image
                    fill
                    alt={study.alt}
                    className="object-cover transition-transform duration-800 ease-cinematic motion-safe:group-hover:scale-[1.025]"
                    sizes={
                      index === 0
                        ? "(max-width: 1023px) 92vw, 56vw"
                        : "(max-width: 1023px) 92vw, 40vw"
                    }
                    src={study.image}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,11,0.04)_25%,rgba(5,6,11,0.88)_100%)]"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <div className="flex items-center gap-3 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-white/60">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span className="h-px w-8 bg-white/25" />
                      <span>{study.category}</span>
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-5">
                      <h3 className="max-w-xl font-display text-2xl font-medium tracking-[-0.04em] text-white sm:text-3xl">
                        {study.title}
                      </h3>
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-background/45 text-white backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                      </span>
                    </div>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-white/65">
                      {study.description}
                    </p>
                  </figcaption>
                </figure>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          Original visual studies created for AY Media Work. Confirmed client
          case studies will be added only with approval.
        </p>
      </Container>
    </section>
  );
}

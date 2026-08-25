import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Layers3, Route, ScanLine } from "lucide-react";

import { Reveal } from "@/components/animations/reveal";
import { FilterableWorkGrid } from "@/components/sections/work/filterable-work-grid";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { WORK_STUDIES, type WorkStudy } from "@/lib/constants/work";

const ARCHIVE_LENSES = [
  {
    icon: ScanLine,
    title: "Premise",
    description:
      "The creative question each study is designed to investigate—not an invented client brief.",
  },
  {
    icon: Layers3,
    title: "Visual system",
    description:
      "The palette, material, hierarchy, and motion rules that keep the direction coherent.",
  },
  {
    icon: Route,
    title: "Experience",
    description:
      "How the idea could unfold across frames, formats, interfaces, or connected touchpoints.",
  },
] as const;

export function WorkIndex({
  studies = WORK_STUDIES,
}: {
  studies?: readonly WorkStudy[];
}) {
  const studyCount = studies.length;
  const studyCountLabel = studyCount === 6 ? "Six" : String(studyCount);

  return (
    <>
      <section
        aria-labelledby="work-title"
        className="relative isolate overflow-hidden border-b border-white/[0.08]"
      >
        <div
          aria-hidden="true"
          className="ambient-grid pointer-events-none absolute inset-0 -z-20 opacity-20"
        />
        <div
          aria-hidden="true"
          className="bg-brand-violet/12 pointer-events-none absolute -right-48 -top-56 -z-10 size-[44rem] rounded-full blur-[150px]"
        />
        <Container className="grid min-h-[clamp(34rem,72svh,50rem)] content-center gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,0.86fr)_minmax(28rem,1.14fr)] lg:items-center lg:gap-14 lg:py-20">
          <Reveal>
            <p className="editorial-kicker">Work / Original studies</p>
            <h1
              className="mt-5 max-w-5xl text-balance text-display-lg sm:mt-6"
              id="work-title"
            >
              Direction you can see.
              <span className="text-gradient-brand block">
                Thinking you can follow.
              </span>
            </h1>
            <p className="mt-6 max-w-copy text-pretty text-lead text-muted-foreground">
              {studyCountLabel} self-initiated studies across film, motion,
              product stories, campaigns, digital systems, and emerging
              visuals—each showing the rules behind the frame.
            </p>
            <Button asChild className="mt-8" size="lg" variant="outline">
              <a href="#work-archive">
                Explore the archive
                <ArrowDown aria-hidden="true" />
              </a>
            </Button>
          </Reveal>

          <Reveal delay={0.1} direction="left">
            <figure>
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.1] bg-surface shadow-panel">
                <Image
                  fill
                  priority
                  alt="Floating film frames and glass panels receding into a dark gallery corridor with one frame lit in cobalt blue"
                  className="object-cover"
                  sizes="(max-width: 1023px) 92vw, 55vw"
                  src="/images/work/work-hero.jpg"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(4,6,12,0.58))]"
                />
                <span className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-background/60 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-white/75 backdrop-blur-md sm:bottom-6 sm:left-6">
                  Original studio artwork
                </span>
              </div>
              <figcaption className="mt-3 text-right text-xs text-muted-foreground">
                Original AY Media Work studio concepts, not attributed client
                projects or commercial result claims.
              </figcaption>
            </figure>
          </Reveal>
        </Container>
      </section>

      <section className="py-section" id="work-archive">
        <Container>
          <Reveal className="grid gap-8 pb-12 lg:grid-cols-[1fr_auto] lg:items-end lg:pb-14">
            <div>
              <p className="editorial-kicker">Selected directions</p>
              <h2 className="mt-5 max-w-3xl text-balance text-heading-xl">
                {studyCountLabel} routes through one connected studio.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground lg:text-right">
              Filter by creative territory, then open any study to examine its
              premise, visual system, and intended experience.
            </p>
          </Reveal>

          <FilterableWorkGrid studies={studies} />
        </Container>
      </section>

      <section className="border-y border-white/[0.08] bg-surface/35 py-section">
        <Container>
          <Reveal className="max-w-4xl">
            <p className="editorial-kicker">How to read the archive</p>
            <h2 className="mt-6 text-balance text-heading-xl">
              More than a gallery of finished frames.
            </h2>
            <p className="mt-6 max-w-2xl text-pretty text-lead text-muted-foreground">
              Each concept makes the creative reasoning visible, so the work can
              be discussed through choices—not unsupported outcomes.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
            {ARCHIVE_LENSES.map(({ description, icon: Icon, title }, index) => (
              <Reveal
                className="min-h-full bg-background"
                delay={index * 0.06}
                key={title}
              >
                <article className="flex h-full min-h-72 flex-col p-7 sm:p-8">
                  <span className="flex size-11 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  <div className="mt-auto pt-14">
                    <h3 className="font-display text-2xl font-medium tracking-[-0.035em]">
                      {title}
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden py-section">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-16rem] left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-brand-blue/10 blur-[140px]"
        />
        <Container className="relative text-center" size="copy">
          <Reveal>
            <p className="editorial-kicker">Your brief, not a template</p>
            <h2 className="mt-6 text-balance text-heading-xl">
              See a direction worth developing?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lead text-muted-foreground">
              Bring the idea, audience, and context. We will shape an original
              path around what your project actually needs.
            </p>
            <Button asChild className="mt-9" size="xl" variant="brand">
              <Link href="/contact?type=client">
                Start a project conversation
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

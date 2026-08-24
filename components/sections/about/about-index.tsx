import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  Layers3,
  Network,
  Sparkles,
} from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
  ABOUT_PRINCIPLES,
  COLLABORATION_VALUES,
  STUDIO_LAYERS,
} from "@/lib/constants/about";

const LAYER_ICONS = [Compass, Layers3, Network] as const;

export function AboutIndex() {
  return (
    <>
      <section
        aria-labelledby="about-title"
        className="relative isolate overflow-hidden border-b border-white/[0.08]"
      >
        <div
          aria-hidden="true"
          className="ambient-grid pointer-events-none absolute inset-0 -z-30 opacity-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-52 -top-60 -z-20 size-[46rem] rounded-full bg-brand-blue/15 blur-[150px]"
        />
        <Container className="grid min-h-[clamp(34rem,72svh,50rem)] content-center gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,0.86fr)_minmax(28rem,1.14fr)] lg:items-center lg:gap-14 lg:py-20">
          <Reveal>
            <p className="editorial-kicker">About / The connected studio</p>
            <h1
              className="mt-5 max-w-5xl text-balance text-display-lg sm:mt-6"
              id="about-title"
            >
              Built around the idea.
              <span className="text-gradient-brand block">
                Not the department.
              </span>
            </h1>
            <p className="mt-6 max-w-copy text-pretty text-lead text-muted-foreground">
              AY Media Work brings story, design, motion, and practical
              technology into one creative direction for brands, businesses, and
              creators.
            </p>
            <Button asChild className="mt-8" size="lg" variant="outline">
              <a href="#studio-story">
                Meet the studio model
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
                  alt="Film, interface, graphic, and dimensional forms converging inside a dark creative space"
                  className="object-cover"
                  sizes="(max-width: 1023px) 92vw, 55vw"
                  src="/images/about/studio-convergence.jpg"
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
                A visual study of connected creative disciplines
              </figcaption>
            </figure>
          </Reveal>
        </Container>
      </section>

      <section className="py-section" id="studio-story">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(15rem,0.42fr)_minmax(0,1fr)] lg:gap-20">
            <Reveal>
              <p className="editorial-kicker">The studio idea</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="max-w-5xl text-balance text-heading-xl">
                The strongest work rarely stays inside one creative box.
              </h2>
              <div className="mt-8 grid gap-6 border-t border-white/[0.08] pt-8 md:grid-cols-2 md:gap-10">
                <p className="text-pretty text-base leading-8 text-muted-foreground">
                  A film may need design. A product story may need animation. A
                  campaign may need a digital experience, and a connected
                  workflow may need a human story before it needs automation.
                </p>
                <p className="text-pretty text-base leading-8 text-muted-foreground">
                  AY Media Work is shaped around that overlap: establish one
                  clear direction, bring together the craft the brief needs, and
                  keep every output connected to the same central idea.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/[0.08] bg-surface/35 py-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(24rem,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-20">
            <Reveal>
              <figure>
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.1] bg-background shadow-panel lg:aspect-[4/5]">
                  <Image
                    fill
                    alt="Rough paper, film, glass, and metal fragments becoming an ordered connected visual system"
                    className="object-cover"
                    sizes="(max-width: 1023px) 92vw, 44vw"
                    src="/images/about/connected-craft.jpg"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,11,0.02)_50%,rgba(5,6,11,0.56)_100%)]"
                  />
                </div>
                <figcaption className="mt-3 text-xs text-muted-foreground">
                  Original concept artwork: fragments becoming a system
                </figcaption>
              </figure>
            </Reveal>

            <div>
              <Reveal>
                <p className="editorial-kicker">How the studio is shaped</p>
                <h2 className="mt-6 max-w-3xl text-balance text-heading-xl">
                  One centre. The right craft around it.
                </h2>
                <p className="mt-6 max-w-2xl text-pretty text-lead text-muted-foreground">
                  The model stays focused on the brief while allowing the mix of
                  disciplines to change around it.
                </p>
              </Reveal>

              <Stagger className="mt-10 divide-y divide-white/[0.08] border-y border-white/[0.08]">
                {STUDIO_LAYERS.map((layer, index) => {
                  const Icon = LAYER_ICONS[index];
                  if (!Icon) return null;

                  return (
                    <StaggerItem key={layer.title}>
                      <article className="grid gap-5 py-7 sm:grid-cols-[3rem_minmax(9rem,0.45fr)_minmax(0,1fr)] sm:items-start sm:gap-6">
                        <span className="flex size-10 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                          <Icon aria-hidden="true" className="size-4" />
                        </span>
                        <div>
                          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-primary">
                            {layer.label}
                          </p>
                          <h3 className="mt-2 font-display text-xl font-medium tracking-[-0.025em]">
                            {layer.title}
                          </h3>
                        </div>
                        <p className="text-sm leading-7 text-muted-foreground">
                          {layer.description}
                        </p>
                      </article>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-section">
        <Container>
          <Reveal className="max-w-4xl">
            <p className="editorial-kicker">Principles in practice</p>
            <h2 className="mt-6 text-balance text-heading-xl">
              The standards behind the surface.
            </h2>
            <p className="mt-6 max-w-2xl text-pretty text-lead text-muted-foreground">
              These principles guide the direction AY Media Work intends to
              bring to every brief. They are studio commitments—not invented
              project results.
            </p>
          </Reveal>

          <Stagger className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-2">
            {ABOUT_PRINCIPLES.map((principle) => (
              <StaggerItem
                className="min-h-full bg-background"
                key={principle.index}
              >
                <article className="flex h-full min-h-80 flex-col p-7 sm:p-9">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-primary">
                      {principle.index}
                    </span>
                    <Sparkles
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                  </div>
                  <div className="mt-auto pt-16">
                    <h3 className="font-display text-2xl font-medium tracking-[-0.035em]">
                      {principle.title}
                    </h3>
                    <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
                      {principle.description}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="border-y border-white/[0.08] bg-surface/35 py-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(22rem,0.55fr)] lg:items-start lg:gap-20">
            <Reveal>
              <p className="editorial-kicker">Working together</p>
              <h2 className="mt-6 max-w-3xl text-balance text-heading-xl">
                Collaboration without the theatre.
              </h2>
              <p className="mt-6 max-w-2xl text-pretty text-lead text-muted-foreground">
                Good collaboration should make the work clearer, not make the
                process feel more complicated than the idea itself.
              </p>
              <Stagger className="mt-10 grid gap-3 sm:grid-cols-2">
                {COLLABORATION_VALUES.map((value) => (
                  <StaggerItem key={value}>
                    <div className="flex min-h-24 items-start gap-4 rounded-lg border border-white/[0.1] bg-background p-5">
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check aria-hidden="true" className="size-3.5" />
                      </span>
                      <p className="text-sm font-medium leading-6">{value}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>

            <Reveal delay={0.08}>
              <aside className="glass-panel rounded-xl p-7 sm:p-9">
                <span className="flex size-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                  <Network aria-hidden="true" className="size-5" />
                </span>
                <p className="editorial-kicker mt-8">A flexible studio path</p>
                <h3 className="mt-5 font-display text-3xl font-medium tracking-[-0.04em]">
                  Start with the need—not a preselected service list.
                </h3>
                <p className="mt-5 text-sm leading-7 text-muted-foreground">
                  A project can begin with a rough idea, an existing brief, or a
                  specific production need. The first job is to understand the
                  context and identify the most useful creative path.
                </p>
                <Button asChild className="mt-8" variant="outline">
                  <Link href="/services">
                    Explore the capabilities
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </aside>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-section">
        <Container>
          <Reveal className="flex flex-col gap-6 border-b border-white/[0.08] pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="editorial-kicker">Look beyond the about page</p>
              <h2 className="mt-5 max-w-3xl text-balance text-heading-lg">
                See the thinking. Understand the feedback standard.
              </h2>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Reveal>
              <Link
                className="group flex min-h-72 flex-col rounded-xl border border-white/[0.1] bg-surface/45 p-7 transition-[background-color,border-color,box-shadow,transform] duration-500 ease-cinematic hover:border-primary/30 hover:bg-surface hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-safe:hover:-translate-y-1 sm:p-9"
                href="/work"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary">01</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                  />
                </div>
                <div className="mt-auto pt-16">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Work archive
                  </p>
                  <h3 className="mt-4 text-heading-sm">
                    Explore the creative directions.
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                    Original studio studies make the premise, visual system, and
                    creative reasoning visible.
                  </p>
                </div>
              </Link>
            </Reveal>

            <Reveal delay={0.06}>
              <Link
                className="group flex min-h-72 flex-col rounded-xl border border-white/[0.1] bg-surface/45 p-7 transition-[background-color,border-color,box-shadow,transform] duration-500 ease-cinematic hover:border-primary/30 hover:bg-surface hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-safe:hover:-translate-y-1 sm:p-9"
                href="/testimonials"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary">02</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                  />
                </div>
                <div className="mt-auto pt-16">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Client feedback
                  </p>
                  <h3 className="mt-4 text-heading-sm">
                    See how feedback will be verified.
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                    No invented quotation fills the gap while approved client
                    feedback is unavailable.
                  </p>
                </div>
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden border-t border-white/[0.08] bg-surface/35 py-section">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[150px]"
        />
        <Container className="relative text-center" size="copy">
          <Reveal>
            <p className="editorial-kicker">Choose the conversation</p>
            <h2 className="mt-6 text-balance text-heading-xl">
              Build with us—or alongside us.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lead text-muted-foreground">
              Start a client project or introduce your specialist craft through
              the dedicated partner journey.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="xl" variant="brand">
                <Link href="/contact?type=client">
                  Start a project
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/contact?type=partner">
                  Collaborate with the studio
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

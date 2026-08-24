import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { SERVICE_CATALOG } from "@/lib/constants/services";

const CONNECTED_PROCESS = [
  {
    index: "01",
    title: "Start with the idea",
    description:
      "The audience, objective, format, and feeling come before a list of outputs.",
  },
  {
    index: "02",
    title: "Choose the right mix",
    description:
      "Each brief gets the disciplines it needs, connected by one creative direction.",
  },
  {
    index: "03",
    title: "Craft in context",
    description:
      "Picture, sound, motion, design, development, and delivery are reviewed as one experience.",
  },
  {
    index: "04",
    title: "Deliver with clarity",
    description:
      "Agreed formats, handoffs, and review points stay visible throughout the work.",
  },
] as const;

export function ServicesIndex() {
  return (
    <>
      <section
        aria-labelledby="services-title"
        className="relative isolate overflow-hidden border-b border-white/[0.08]"
      >
        <div
          aria-hidden="true"
          className="ambient-grid pointer-events-none absolute inset-0 -z-20 opacity-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-52 -top-64 -z-10 size-[46rem] rounded-full bg-brand-blue/15 blur-[150px]"
        />
        <Container className="grid min-h-[clamp(30rem,62svh,42rem)] content-center items-center gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.55fr)] lg:gap-14 lg:py-20">
          <Reveal>
            <p className="editorial-kicker">Services / Connected craft</p>
            <h1
              className="mt-5 max-w-5xl text-balance text-display-lg sm:mt-6"
              id="services-title"
            >
              One studio. Ten ways to
              <span className="text-gradient-brand block">move an idea.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="max-w-copy text-pretty text-lead text-muted-foreground">
              Bring us a single frame, a digital product, a campaign, or a
              connected workflow. We combine creative craft and practical
              technology around what the brief actually needs.
            </p>
            <Button asChild className="mt-8" size="lg" variant="outline">
              <a href="#service-catalog">
                Explore the capabilities
                <ArrowDown aria-hidden="true" />
              </a>
            </Button>
          </Reveal>
        </Container>
      </section>

      <section className="py-section" id="service-catalog">
        <Container>
          <Reveal className="grid gap-8 border-b border-white/[0.08] pb-12 lg:grid-cols-[1fr_auto] lg:items-end lg:pb-16">
            <div>
              <p className="editorial-kicker">Capability index</p>
              <h2 className="mt-5 max-w-3xl text-balance text-heading-xl">
                Built separately. Stronger together.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground lg:text-right">
              Every image below is original studio concept artwork created for
              AY Media Work—not attributed client work.
            </p>
          </Reveal>

          <Stagger className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {SERVICE_CATALOG.map((service) => (
              <StaggerItem className="min-h-full" key={service.slug}>
                <Link
                  className="group relative flex h-full min-h-[29rem] flex-col overflow-hidden rounded-xl border border-white/[0.1] bg-surface shadow-panel transition-[border-color,box-shadow,transform] duration-400 ease-cinematic hover:border-primary/30 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-safe:hover:-translate-y-1"
                  href={`/services/${service.slug}`}
                >
                  <div className="relative aspect-[3/2] overflow-hidden border-b border-white/[0.08] bg-background">
                    <Image
                      fill
                      alt={service.image.alt}
                      className="object-cover transition-transform duration-800 ease-cinematic motion-safe:group-hover:scale-[1.035]"
                      sizes="(max-width: 767px) 92vw, (max-width: 1279px) 46vw, 31vw"
                      src={service.image.src}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent"
                    />
                    <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-background/55 px-3 py-1.5 font-mono text-[0.6875rem] text-white/75 backdrop-blur-md">
                      {service.index}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-heading-sm">{service.title}</h2>
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/[0.12] text-muted-foreground transition-[background-color,border-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-background">
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {service.description}
                    </p>
                    <span className="mt-auto pt-8 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/75">
                      Explore service
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="border-y border-white/[0.08] bg-surface/35 py-section">
        <Container>
          <Reveal className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <div>
              <p className="editorial-kicker">How the studio connects</p>
              <h2 className="mt-6 max-w-2xl text-balance text-heading-xl">
                The brief leads.
                <span className="block text-muted-foreground">
                  The disciplines follow.
                </span>
              </h2>
              <p className="mt-6 max-w-copy text-pretty text-base leading-7 text-muted-foreground">
                You do not need to arrive with the service mix solved. Start
                with the problem, the audience, and what the work needs to do.
              </p>
            </div>

            <ol className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {CONNECTED_PROCESS.map((step) => (
                <li
                  className="grid gap-4 py-6 sm:grid-cols-[3rem_minmax(0,0.65fr)_minmax(0,1fr)] sm:items-start sm:gap-6"
                  key={step.index}
                >
                  <span className="font-mono text-xs text-primary">
                    {step.index}
                  </span>
                  <h3 className="font-display text-xl font-medium tracking-[-0.025em]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden py-section">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-16rem] left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-brand-violet/10 blur-[130px]"
        />
        <Container className="relative text-center" size="copy">
          <Reveal>
            <p className="editorial-kicker">Start with the brief</p>
            <h2 className="mt-6 text-balance text-heading-xl">
              Not sure where the work fits?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lead text-muted-foreground">
              Bring the rough idea. We will help identify the right creative
              path before the craft begins.
            </p>
            <Button asChild className="mt-9" size="xl" variant="brand">
              <Link href="/contact?type=client">
                Tell us what you are building
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

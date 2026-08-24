import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
} from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { SERVICE_CATALOG, type Service } from "@/lib/constants/services";

type ServiceDetailProps = {
  catalog?: readonly Service[];
  service: Service;
};

export function ServiceDetail({
  catalog = SERVICE_CATALOG,
  service,
}: ServiceDetailProps) {
  const relatedServices = service.relatedSlugs
    .map((slug) => catalog.find((item) => item.slug === slug))
    .filter((related): related is Service => Boolean(related));

  return (
    <>
      <section
        aria-labelledby="service-title"
        className="relative isolate overflow-hidden border-b border-white/[0.08]"
      >
        <div
          aria-hidden="true"
          className="ambient-grid pointer-events-none absolute inset-0 -z-30 opacity-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-64 -top-64 -z-20 size-[46rem] rounded-full bg-brand-blue/15 blur-[150px]"
        />
        <Container className="py-8 sm:py-10 lg:pb-20 lg:pt-10">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <li>
                <Link
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href="/services"
                >
                  <ArrowLeft aria-hidden="true" className="size-3.5" />
                  Services
                </Link>
              </li>
              <li aria-hidden="true" className="text-white/25">
                /
              </li>
              <li aria-current="page" className="text-foreground/75">
                {service.title}
              </li>
            </ol>
          </nav>

          <div className="mt-9 grid gap-10 sm:mt-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(28rem,1.15fr)] lg:items-center lg:gap-14">
            <Reveal>
              <p className="editorial-kicker">
                {service.index} / {service.title}
              </p>
              <h1
                className="mt-5 max-w-4xl text-balance text-display-lg sm:mt-6"
                id="service-title"
              >
                {service.heroTitle}
              </h1>
              <p className="mt-5 max-w-copy text-pretty text-lead text-muted-foreground sm:mt-6">
                {service.description}
              </p>
              <Button
                asChild
                className="mt-7 sm:mt-8"
                size="xl"
                variant="brand"
              >
                <Link href={`/contact?type=client&service=${service.slug}`}>
                  Start a conversation
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </Button>
            </Reveal>

            <Reveal delay={0.1} direction="left">
              <figure>
                <div className="relative aspect-[3/2] overflow-hidden rounded-xl border border-white/[0.1] bg-surface shadow-panel">
                  <Image
                    fill
                    priority
                    alt={service.image.alt}
                    className="object-cover"
                    sizes="(max-width: 1023px) 92vw, 55vw"
                    src={service.image.src}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(4,6,12,0.5))]"
                  />
                  <span className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-background/55 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/70 backdrop-blur-md sm:bottom-6 sm:left-6">
                    Original studio concept
                  </span>
                </div>
                <figcaption className="mt-3 text-right text-xs text-muted-foreground">
                  Directional artwork created for AY Media Work
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-section">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.55fr)] lg:gap-20">
            <Reveal>
              <p className="editorial-kicker">What this can include</p>
              <h2 className="mt-6 max-w-3xl text-balance text-heading-xl">
                The craft around the core idea.
              </h2>
              <Stagger className="mt-10 grid gap-3 sm:grid-cols-2">
                {service.disciplines.map((discipline) => (
                  <StaggerItem key={discipline}>
                    <div className="flex min-h-24 items-start gap-4 rounded-lg border border-white/[0.1] bg-surface/45 p-5">
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check aria-hidden="true" className="size-3.5" />
                      </span>
                      <p className="text-sm font-medium leading-6">
                        {discipline}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-xl border border-white/[0.1] bg-surface p-6 shadow-panel sm:p-8">
                <span className="flex size-11 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                  <Sparkles aria-hidden="true" className="size-4" />
                </span>
                <p className="editorial-kicker mt-8">Useful for</p>
                <ul className="mt-5 divide-y divide-white/[0.08] border-y border-white/[0.08]">
                  {service.usefulFor.map((item) => (
                    <li className="py-4 text-sm leading-6" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-6 text-muted-foreground">
                  Scope, formats, review points, and delivery requirements are
                  aligned around each brief before production begins.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/[0.08] bg-surface/35 py-section">
        <Container>
          <Reveal className="max-w-4xl">
            <p className="editorial-kicker">Our approach</p>
            <h2 className="mt-6 text-balance text-heading-xl">
              A visible path from brief to delivery.
            </h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-2 xl:grid-cols-4">
            {service.approach.map((step, index) => (
              <StaggerItem
                className="min-h-full bg-background"
                key={step.title}
              >
                <article className="flex h-full min-h-72 flex-col p-6 sm:p-8">
                  <span className="font-mono text-xs text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="mt-auto pt-16">
                    <h3 className="font-display text-xl font-medium tracking-[-0.025em]">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="py-section">
        <Container>
          <Reveal className="flex flex-col gap-6 border-b border-white/[0.08] pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="editorial-kicker">Connected capabilities</p>
              <h2 className="mt-5 text-balance text-heading-lg">
                Build around the brief.
              </h2>
            </div>
            <Button asChild className="w-fit" variant="outline">
              <Link href="/services">
                All services
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {relatedServices.map((related) => (
              <Link
                className="group flex min-h-56 flex-col rounded-xl border border-white/[0.1] bg-surface/45 p-6 transition-[background-color,border-color,transform] duration-400 ease-cinematic hover:border-primary/30 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-safe:hover:-translate-y-1 sm:p-7"
                href={`/services/${related.slug}`}
                key={related.slug}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary">
                    {related.index}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                  />
                </div>
                <div className="mt-auto pt-10">
                  <h3 className="text-heading-sm">{related.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {related.description}
                  </p>
                </div>
              </Link>
            ))}
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
            <p className="editorial-kicker">Bring us the brief</p>
            <h2 className="mt-6 text-balance text-heading-xl">
              Rough edges are welcome.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lead text-muted-foreground">
              Start with what you know: the idea, the audience, and what the
              work needs to communicate. We can shape the path from there.
            </p>
            <Button asChild className="mt-9" size="xl" variant="brand">
              <Link href={`/contact?type=client&service=${service.slug}`}>
                Start a {service.title.toLowerCase()} project
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Layers3,
  ScanLine,
  Sparkles,
} from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { getNextWorkStudy, type WorkStudy } from "@/lib/constants/work";
import { getServiceBySlug, type Service } from "@/lib/constants/services";

export function WorkDetail({ study }: { study: WorkStudy }) {
  const services = study.services
    .map((slug) => getServiceBySlug(slug))
    .filter((service): service is Service => Boolean(service));
  const nextStudy = getNextWorkStudy(study.slug);

  return (
    <>
      <section
        aria-labelledby="work-study-title"
        className="relative isolate overflow-hidden border-b border-white/[0.08]"
      >
        <div
          aria-hidden="true"
          className="ambient-grid pointer-events-none absolute inset-0 -z-30 opacity-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-64 -top-64 -z-20 size-[48rem] rounded-full bg-brand-blue/15 blur-[150px]"
        />
        <Container className="py-8 sm:py-10 lg:pb-20 lg:pt-10">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <li>
                <Link
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href="/work"
                >
                  <ArrowLeft aria-hidden="true" className="size-3.5" />
                  Work
                </Link>
              </li>
              <li aria-hidden="true" className="text-white/25">
                /
              </li>
              <li aria-current="page" className="text-foreground/75">
                {study.title}
              </li>
            </ol>
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.45fr)] lg:items-end lg:gap-16">
            <Reveal>
              <p className="editorial-kicker">
                {study.index} / {study.category}
              </p>
              <h1
                className="mt-5 max-w-5xl text-balance text-display-lg sm:mt-6"
                id="work-study-title"
              >
                {study.title}
              </h1>
              <p className="mt-6 max-w-3xl text-pretty text-lead text-muted-foreground">
                {study.description}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <dl className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
                <div className="grid grid-cols-[6rem_1fr] gap-4 py-4 text-sm">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-medium">Original studio concept</dd>
                </div>
                <div className="grid grid-cols-[6rem_1fr] gap-4 py-4 text-sm">
                  <dt className="text-muted-foreground">Format</dt>
                  <dd className="font-medium">{study.format}</dd>
                </div>
                <div className="grid grid-cols-[6rem_1fr] gap-4 py-4 text-sm">
                  <dt className="text-muted-foreground">Tone</dt>
                  <dd className="font-medium">{study.tone.join(" / ")}</dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal className="mt-12 sm:mt-14" delay={0.12}>
            <figure>
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.1] bg-surface shadow-panel lg:aspect-[21/10]">
                <Image
                  fill
                  priority
                  alt={study.image.alt}
                  className="object-cover"
                  sizes="92vw"
                  src={study.image.src}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(4,6,12,0.55))]"
                />
                <span className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-background/60 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-white/75 backdrop-blur-md sm:bottom-7 sm:left-7">
                  Self-initiated direction study
                </span>
              </div>
              <figcaption className="mt-3 flex flex-col gap-1 text-xs leading-5 text-muted-foreground sm:flex-row sm:justify-between">
                <span>Original visual artwork created for AY Media Work</span>
                <span>No client attribution or performance claim</span>
              </figcaption>
            </figure>
          </Reveal>
        </Container>
      </section>

      <section className="py-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(16rem,0.48fr)_minmax(0,1.05fr)] lg:gap-20">
            <Reveal>
              <p className="editorial-kicker">Creative premise</p>
              <div className="mt-7 flex size-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                <ScanLine aria-hidden="true" className="size-5" />
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="max-w-4xl text-balance text-heading-xl">
                {study.premise.question}
              </h2>
              <p className="mt-7 max-w-3xl text-pretty text-base leading-8 text-muted-foreground">
                {study.premise.context}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/[0.08] bg-surface/35 py-section">
        <Container>
          <Reveal className="max-w-4xl">
            <p className="editorial-kicker">From question to direction</p>
            <h2 className="mt-6 text-balance text-heading-xl">
              Three layers holding the idea together.
            </h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] lg:grid-cols-3">
            {[
              { label: "Direction", copy: study.direction, icon: Sparkles },
              { label: "System", copy: study.system, icon: Layers3 },
              { label: "Experience", copy: study.experience, icon: ScanLine },
            ].map(({ copy, icon: Icon, label }, index) => (
              <StaggerItem className="min-h-full bg-background" key={label}>
                <article className="flex h-full min-h-96 flex-col p-7 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                  </div>
                  <div className="mt-auto pt-20">
                    <h3 className="font-display text-2xl font-medium tracking-[-0.035em]">
                      {label}
                    </h3>
                    <p className="mt-5 text-sm leading-7 text-muted-foreground">
                      {copy}
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
          <Reveal className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="editorial-kicker">Frame study</p>
              <h2 className="mt-6 max-w-3xl text-balance text-heading-xl">
                One world, examined at different scales.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground lg:text-right">
              These crops examine composition and material within the same
              original concept artwork; they are not separate delivered assets.
            </p>
          </Reveal>

          <Reveal
            className="mt-12 grid gap-4 lg:grid-cols-12 lg:grid-rows-2"
            delay={0.06}
          >
            <div className="relative min-h-80 overflow-hidden rounded-xl border border-white/[0.1] bg-surface shadow-panel lg:col-span-8 lg:row-span-2 lg:min-h-[42rem]">
              <Image
                fill
                aria-hidden="true"
                alt=""
                className="object-cover"
                sizes="(max-width: 1023px) 92vw, 61vw"
                src={study.image.src}
              />
            </div>
            <div className="relative min-h-64 overflow-hidden rounded-xl border border-white/[0.1] bg-surface lg:col-span-4 lg:min-h-0">
              <Image
                fill
                aria-hidden="true"
                alt=""
                className="scale-150 object-cover object-left"
                sizes="(max-width: 1023px) 92vw, 31vw"
                src={study.image.src}
              />
            </div>
            <div className="relative min-h-64 overflow-hidden rounded-xl border border-white/[0.1] bg-surface lg:col-span-4 lg:min-h-0">
              <Image
                fill
                aria-hidden="true"
                alt=""
                className="scale-150 object-cover object-right"
                sizes="(max-width: 1023px) 92vw, 31vw"
                src={study.image.src}
              />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-white/[0.08] bg-surface/35 py-section">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.5fr)] lg:gap-20">
            <Reveal>
              <p className="editorial-kicker">What this concept explores</p>
              <h2 className="mt-6 max-w-3xl text-balance text-heading-xl">
                Creative choices, not invented outcomes.
              </h2>
              <Stagger className="mt-10 grid gap-3 sm:grid-cols-2">
                {study.explores.map((item) => (
                  <StaggerItem key={item}>
                    <div className="flex min-h-28 items-start gap-4 rounded-lg border border-white/[0.1] bg-background p-5">
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check aria-hidden="true" className="size-3.5" />
                      </span>
                      <p className="text-sm font-medium leading-6">{item}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>

            <Reveal delay={0.08}>
              <aside className="rounded-xl border border-white/[0.1] bg-background p-6 shadow-panel sm:p-8">
                <p className="editorial-kicker">Design principle</p>
                <blockquote className="mt-6 font-display text-2xl font-medium leading-snug tracking-[-0.035em]">
                  “{study.principle}”
                </blockquote>

                <p className="mt-9 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/70">
                  Working palette
                </p>
                <ul className="mt-4 space-y-3">
                  {study.palette.map((colour) => (
                    <li
                      className="flex items-center gap-3 text-xs text-muted-foreground"
                      key={colour.hex}
                    >
                      <span
                        aria-label={`${colour.name}: ${colour.hex}`}
                        className="size-8 shrink-0 rounded-full border border-white/15"
                        style={{ backgroundColor: colour.hex }}
                      />
                      <span className="flex-1 text-foreground/80">
                        {colour.name}
                      </span>
                      <span className="font-mono">{colour.hex}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-section">
        <Container>
          <Reveal className="grid gap-10 lg:grid-cols-[minmax(16rem,0.45fr)_minmax(0,1fr)] lg:items-start lg:gap-20">
            <div>
              <p className="editorial-kicker">Connected craft</p>
              <h2 className="mt-6 text-balance text-heading-lg">
                Disciplines behind the direction.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {services.map((service) => (
                <Link
                  className="group flex min-h-52 flex-col rounded-xl border border-white/[0.1] bg-surface/45 p-6 transition-[background-color,border-color,transform] duration-400 ease-cinematic hover:border-primary/30 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-safe:hover:-translate-y-1"
                  href={`/services/${service.slug}`}
                  key={service.slug}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-primary">
                      {service.index}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                    />
                  </div>
                  <h3 className="mt-auto pt-10 font-display text-xl font-medium tracking-[-0.025em]">
                    {service.title}
                  </h3>
                </Link>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-white/[0.08] bg-surface/35 py-section">
        <Container>
          <Reveal>
            <Link
              className="group grid overflow-hidden rounded-xl border border-white/[0.1] bg-background shadow-panel transition-[border-color,box-shadow] duration-500 hover:border-primary/30 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:grid-cols-[minmax(20rem,0.72fr)_minmax(0,1fr)]"
              href={`/work/${nextStudy.slug}`}
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-96">
                <Image
                  fill
                  alt={nextStudy.image.alt}
                  className="object-cover transition-transform duration-800 ease-cinematic motion-safe:group-hover:scale-[1.035]"
                  sizes="(max-width: 1023px) 92vw, 43vw"
                  src={nextStudy.image.src}
                />
              </div>
              <div className="flex min-h-80 flex-col p-7 sm:p-10 lg:p-12">
                <div className="flex items-center justify-between">
                  <p className="editorial-kicker">Next study</p>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                  />
                </div>
                <div className="mt-auto pt-16">
                  <p className="font-mono text-xs text-primary">
                    {nextStudy.index} / {nextStudy.category}
                  </p>
                  <h2 className="mt-5 text-balance text-heading-lg">
                    {nextStudy.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                    {nextStudy.description}
                  </p>
                </div>
              </div>
            </Link>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden py-section">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-violet/10 blur-[150px]"
        />
        <Container className="relative text-center" size="copy">
          <Reveal>
            <p className="editorial-kicker">Build an original direction</p>
            <h2 className="mt-6 text-balance text-heading-xl">
              Your project starts with its own question.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lead text-muted-foreground">
              Share the audience, context, and rough idea. We will identify the
              right mix of story, design, motion, and technology from there.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="xl" variant="brand">
                <Link href="/contact?type=client">
                  Start a project conversation
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/work">
                  All work studies
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

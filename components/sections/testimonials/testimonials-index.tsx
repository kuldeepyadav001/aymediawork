import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  FileCheck2,
  MessageSquareText,
  Quote,
  ShieldCheck,
} from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
  APPROVED_TESTIMONIALS,
  FEEDBACK_PUBLISHING_STEPS,
  type PublishedTestimonial,
  WORKING_EXPERIENCE,
} from "@/lib/constants/testimonials";

const PUBLISHING_ICONS = [FileCheck2, BadgeCheck, ShieldCheck] as const;

function TestimonialCard({
  testimonial,
}: {
  testimonial: PublishedTestimonial;
}) {
  const attribution = [
    testimonial.attribution.name,
    testimonial.attribution.role,
    testimonial.attribution.organisation,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="flex h-full flex-col rounded-xl border border-white/[0.1] bg-surface/50 p-7 shadow-panel sm:p-9">
      <Quote aria-hidden="true" className="size-8 text-primary" />
      <blockquote className="mt-8 text-balance font-display text-2xl font-medium leading-snug tracking-[-0.03em] sm:text-3xl">
        “{testimonial.quote}”
      </blockquote>
      <div className="mt-auto border-t border-white/[0.08] pt-7">
        <p className="font-semibold">{attribution}</p>
        {testimonial.projectContext ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {testimonial.projectContext}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function TestimonialCollection({
  testimonials,
}: {
  testimonials: readonly PublishedTestimonial[];
}) {
  if (testimonials.length === 0) {
    return (
      <div
        aria-labelledby="testimonial-empty-title"
        className="relative overflow-hidden rounded-xl border border-white/[0.1] bg-surface/45 p-7 shadow-panel sm:p-10 lg:p-14"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full bg-brand-blue/10 blur-[100px]"
        />
        <div className="relative grid gap-10 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
          <span className="flex size-14 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
            <MessageSquareText aria-hidden="true" className="size-6" />
          </span>
          <div>
            <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-primary">
              The honest state
            </p>
            <h3
              className="mt-4 max-w-3xl text-balance text-heading-sm"
              id="testimonial-empty-title"
            >
              No approved client testimonials are published yet.
            </h3>
            <p className="mt-5 max-w-3xl text-pretty text-base leading-8 text-muted-foreground">
              That space will remain intentionally clear until the exact words,
              attribution, context, and permission to publish have been
              confirmed. AY Media Work will not substitute invented praise for
              genuine client feedback.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/work">
              Explore studio work
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Stagger className="grid gap-5 lg:grid-cols-2">
      {testimonials.map((testimonial) => (
        <StaggerItem className="min-h-full" key={testimonial.id}>
          <TestimonialCard testimonial={testimonial} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

type ClientLogo = {
  destinationUrl?: string;
  id: string;
  image: { alt: string; src: string };
  name: string;
};

export function TestimonialsIndex({
  clientLogos = [],
  testimonials = APPROVED_TESTIMONIALS,
}: {
  clientLogos?: readonly ClientLogo[];
  testimonials?: readonly PublishedTestimonial[];
} = {}) {
  return (
    <>
      <section
        aria-labelledby="testimonials-title"
        className="relative isolate overflow-hidden border-b border-white/[0.08]"
      >
        <div
          aria-hidden="true"
          className="ambient-grid pointer-events-none absolute inset-0 -z-30 opacity-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-52 -top-60 -z-20 size-[46rem] rounded-full bg-brand-violet/15 blur-[150px]"
        />
        <Container className="grid min-h-[clamp(34rem,70svh,48rem)] content-center gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(27rem,1.1fr)] lg:items-center lg:gap-14 lg:py-20">
          <Reveal>
            <p className="editorial-kicker">Testimonials / Earned words</p>
            <h1
              className="mt-5 max-w-5xl text-balance text-display-lg sm:mt-6"
              id="testimonials-title"
            >
              Feedback should be earned.
              <span className="text-gradient-brand block">
                Never filled in.
              </span>
            </h1>
            <p className="mt-6 max-w-copy text-pretty text-lead text-muted-foreground">
              This page is built for real client perspectives—and protected by a
              simple rule: only publish feedback that has been approved for
              public use.
            </p>
          </Reveal>

          <Reveal delay={0.1} direction="left">
            <figure>
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.1] bg-surface shadow-panel">
                <Image
                  fill
                  priority
                  alt="Abstract translucent speech forms gathering around a luminous centre in a dark cinematic space"
                  className="object-cover"
                  sizes="(max-width: 1023px) 92vw, 53vw"
                  src="/images/testimonials/earned-words.jpg"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(4,6,12,0.58))]"
                />
                <span className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-background/60 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-white/75 backdrop-blur-md sm:bottom-6 sm:left-6">
                  Listening before publishing
                </span>
              </div>
              <figcaption className="mt-3 text-right text-xs text-muted-foreground">
                Original abstract artwork—not client material
              </figcaption>
            </figure>
          </Reveal>
        </Container>
      </section>

      <section className="py-section">
        <Container>
          <Reveal className="grid gap-6 border-b border-white/[0.08] pb-10 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.5fr)] md:items-end md:gap-10">
            <div>
              <p className="editorial-kicker">Approved perspectives</p>
              <h2 className="mt-6 max-w-4xl text-balance text-heading-xl">
                What clients choose to share.
              </h2>
            </div>
            <p className="text-pretty text-sm leading-7 text-muted-foreground md:text-right">
              The collection below is connected to a maintainable publishing
              model, ready for approved feedback when it becomes available.
            </p>
          </Reveal>

          <Reveal className="mt-10" delay={0.05}>
            <TestimonialCollection testimonials={testimonials} />
          </Reveal>

          {clientLogos.length > 0 ? (
            <Reveal
              className="mt-16 border-t border-white/[0.08] pt-10"
              delay={0.08}
            >
              <p className="editorial-kicker">Approved client marks</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {clientLogos.map((logo) => {
                  const artwork = (
                    <span className="relative block h-24 w-full">
                      <Image
                        fill
                        alt={logo.image.alt}
                        className="object-contain p-4"
                        sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 22vw"
                        src={logo.image.src}
                      />
                    </span>
                  );
                  return logo.destinationUrl ? (
                    <a
                      className="rounded-xl border border-white/[0.1] bg-surface/45 transition-colors hover:border-primary/30"
                      href={logo.destinationUrl}
                      key={logo.id}
                      rel="noreferrer"
                      target="_blank"
                      title={logo.name}
                    >
                      {artwork}
                    </a>
                  ) : (
                    <div
                      className="rounded-xl border border-white/[0.1] bg-surface/45"
                      key={logo.id}
                      title={logo.name}
                    >
                      {artwork}
                    </div>
                  );
                })}
              </div>
            </Reveal>
          ) : null}
        </Container>
      </section>

      <section className="border-y border-white/[0.08] bg-surface/35 py-section">
        <Container>
          <Reveal className="max-w-4xl">
            <p className="editorial-kicker">The publishing standard</p>
            <h2 className="mt-6 text-balance text-heading-xl">
              A quote is not content until it is cleared.
            </h2>
            <p className="mt-6 max-w-2xl text-pretty text-lead text-muted-foreground">
              Every future testimonial passes through the same three checks
              before it appears here.
            </p>
          </Reveal>

          <Stagger className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] lg:grid-cols-3">
            {FEEDBACK_PUBLISHING_STEPS.map((step, index) => {
              const Icon = PUBLISHING_ICONS[index];
              if (!Icon) return null;

              return (
                <StaggerItem
                  className="min-h-full bg-background"
                  key={step.index}
                >
                  <article className="flex h-full min-h-72 flex-col p-7 sm:p-9">
                    <div className="flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {step.index}
                      </span>
                    </div>
                    <div className="mt-auto pt-14">
                      <h3 className="font-display text-2xl font-medium tracking-[-0.035em]">
                        {step.title}
                      </h3>
                      <p className="mt-5 text-sm leading-7 text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </section>

      <section className="py-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(17rem,0.48fr)_minmax(0,1fr)] lg:gap-20">
            <Reveal>
              <p className="editorial-kicker">The intended experience</p>
              <h2 className="mt-6 text-balance text-heading-lg">
                How the work should feel while it is being made.
              </h2>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                These are AY Media Work&apos;s collaboration intentions, not
                quotations or claims attributed to past clients.
              </p>
            </Reveal>

            <Stagger className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {WORKING_EXPERIENCE.map((item) => (
                <StaggerItem key={item.title}>
                  <article className="grid gap-5 py-8 sm:grid-cols-[2.5rem_minmax(9rem,0.42fr)_minmax(0,1fr)] sm:items-start sm:gap-6">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check aria-hidden="true" className="size-4" />
                    </span>
                    <h3 className="font-display text-xl font-medium tracking-[-0.025em]">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {item.description}
                    </p>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden border-t border-white/[0.08] bg-surface/35 py-section">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-violet/10 blur-[150px]"
        />
        <Container className="relative text-center" size="copy">
          <Reveal>
            <p className="editorial-kicker">Your project can start here</p>
            <h2 className="mt-6 text-balance text-heading-xl">
              Let the next honest review begin with a clear brief.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lead text-muted-foreground">
              Share the context, ambition, and constraints. AY Media Work will
              help identify the creative path from there.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="xl" variant="brand">
                <Link href="/contact?type=client">
                  Start a project
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/services">
                  Explore services
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

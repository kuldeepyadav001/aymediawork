import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { CREATIVE_DISCIPLINES } from "@/lib/constants/homepage";

export function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate overflow-hidden border-b border-white/[0.08]"
    >
      <div
        aria-hidden="true"
        className="ambient-grid pointer-events-none absolute inset-0 -z-30 opacity-25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-18rem] top-[-20rem] -z-20 size-[42rem] rounded-full bg-brand-blue/15 blur-[140px] sm:size-[58rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-18rem] right-[-16rem] -z-20 size-[38rem] rounded-full bg-brand-violet/10 blur-[130px]"
      />

      <Container className="grid min-h-[calc(100svh-5rem)] items-center gap-12 py-16 sm:min-h-[calc(100svh-6rem)] sm:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(26rem,1.1fr)] lg:gap-14 lg:py-16 xl:gap-20">
        <Reveal className="relative z-10 max-w-4xl">
          <p className="editorial-kicker">Creative media studio</p>
          <h1
            className="mt-7 text-balance text-display-xl"
            id="home-hero-title"
          >
            Stories built to move.
            <span className="text-gradient-brand block">
              Frames made to stay.
            </span>
          </h1>
          <p className="mt-7 max-w-copy text-pretty text-lead text-muted-foreground sm:mt-8">
            AY Media Work brings editing, motion, design, and digital
            storytelling into one focused creative process for brands,
            businesses, and creators.
          </p>

          <div className="mt-9 flex flex-col gap-3 xs:flex-row">
            <Button asChild size="xl" variant="brand">
              <Link href="/contact?type=client">
                Start a project
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/work">
                Explore the work
                <ArrowDown aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Reveal>

        <Reveal
          className="relative mx-auto w-full max-w-3xl lg:max-w-none"
          delay={0.12}
          direction="left"
        >
          <div className="relative aspect-[16/11] overflow-hidden rounded-xl border border-white/[0.1] bg-surface shadow-panel sm:aspect-[16/10] lg:aspect-[7/8] xl:aspect-[16/11]">
            <Image
              fill
              priority
              alt="Abstract translucent film ribbon illuminated in electric blue"
              className="object-cover object-center"
              sizes="(max-width: 1023px) 92vw, (max-width: 1279px) 46vw, 52vw"
              src="/images/home/hero-cinematic-frame.jpg"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,12,0.04),rgba(4,6,12,0.2)_56%,rgba(4,6,12,0.9)),linear-gradient(90deg,rgba(4,6,12,0.28),transparent_45%)]"
            />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-white/70 sm:p-7">
              <span>AY / Visual storytelling</span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-brand-blue shadow-[0_0_14px_rgba(61,112,255,0.9)]" />
                In motion
              </span>
            </div>

            <div
              aria-hidden="true"
              className="absolute left-[16%] top-[28%] size-[42%] rounded-full border border-white/10"
            >
              <div className="absolute inset-[18%] animate-pulse-glow rounded-full border border-brand-blue/30 motion-reduce:animate-none" />
            </div>

            <div className="absolute inset-x-5 bottom-5 grid gap-4 rounded-lg border border-white/[0.1] bg-background/55 p-5 backdrop-blur-xl sm:inset-x-7 sm:bottom-7 sm:grid-cols-[1fr_auto] sm:items-end sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                  Built around the idea
                </p>
                <p className="mt-2 max-w-sm font-display text-xl font-medium tracking-[-0.03em] text-white sm:text-2xl">
                  Every frame has a reason to be there.
                </p>
              </div>
              <div
                aria-hidden="true"
                className="hidden size-12 items-center justify-center rounded-full border border-white/15 bg-white/10 sm:flex"
              >
                <ArrowUpRight className="size-4" />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>

      <div className="border-t border-white/[0.08] bg-background/65 py-4">
        <div
          aria-label={`Creative disciplines: ${CREATIVE_DISCIPLINES.join(", ")}`}
          className="mask-fade-x overflow-hidden"
          role="group"
        >
          <div className="flex w-max animate-marquee motion-reduce:animate-none">
            {[0, 1].map((group) => (
              <div
                aria-hidden="true"
                className="flex shrink-0 items-center"
                key={group}
              >
                {CREATIVE_DISCIPLINES.map((discipline) => (
                  <span
                    className="flex items-center whitespace-nowrap px-5 font-display text-sm font-medium uppercase tracking-[0.18em] text-white/55 sm:px-8"
                    key={discipline}
                  >
                    {discipline}
                    <span
                      aria-hidden="true"
                      className="ml-10 size-1 rounded-full bg-brand-blue sm:ml-16"
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

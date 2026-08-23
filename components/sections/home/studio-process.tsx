import Link from "next/link";
import { ArrowUpRight, Handshake, MessageSquareText } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { PROCESS_STEPS } from "@/lib/constants/homepage";

export function StudioProcess() {
  return (
    <>
      <section className="relative overflow-hidden py-section">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-15rem] top-1/4 size-[34rem] rounded-full bg-brand-blue/10 blur-[140px]"
        />
        <Container className="relative grid gap-14 lg:grid-cols-[minmax(18rem,0.68fr)_minmax(0,1.32fr)] lg:gap-20">
          <Reveal className="lg:sticky lg:top-36 lg:self-start">
            <p className="editorial-kicker">The process</p>
            <h2 className="mt-6 max-w-xl text-balance text-heading-xl">
              Clear from the brief.
              <span className="text-gradient-brand block">
                Considered to the last frame.
              </span>
            </h2>
            <p className="mt-6 max-w-md text-pretty text-base leading-7 text-muted-foreground">
              A focused path keeps the idea visible while each creative layer is
              shaped, reviewed, and prepared for where it needs to live.
            </p>
          </Reveal>

          <Stagger className="border-t border-white/[0.1]">
            {PROCESS_STEPS.map((step) => (
              <StaggerItem
                className="grid gap-5 border-b border-white/[0.1] py-8 sm:grid-cols-[4rem_minmax(10rem,0.62fr)_minmax(0,1fr)] sm:items-start sm:gap-8 sm:py-10"
                key={step.index}
              >
                <span className="font-mono text-xs text-primary">
                  {step.index}
                </span>
                <h3 className="font-display text-2xl font-medium tracking-[-0.035em] sm:text-3xl">
                  {step.title}
                </h3>
                <p className="max-w-lg text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                  {step.description}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="pb-section">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-xl border border-white/[0.1] bg-[linear-gradient(135deg,hsl(var(--surface-elevated)),hsl(var(--background))_58%)] p-6 shadow-panel sm:p-10 lg:p-14">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-24 size-80 rounded-full bg-brand-violet/15 blur-[100px]"
              />
              <div className="relative grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(30rem,1.2fr)] lg:items-end">
                <div>
                  <p className="editorial-kicker">Work with AY</p>
                  <h2 className="mt-6 max-w-xl text-balance text-heading-lg">
                    Bring a brief.
                    <span className="block text-muted-foreground">
                      Or bring your craft.
                    </span>
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <article className="flex min-h-64 flex-col rounded-lg border border-white/[0.1] bg-white/[0.035] p-6 backdrop-blur-sm sm:p-7">
                    <MessageSquareText
                      aria-hidden="true"
                      className="size-6 text-primary"
                    />
                    <h3 className="mt-10 text-heading-sm">Start a project</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      Tell us what you want to make, where it needs to go, and
                      what success should feel like.
                    </p>
                    <Button
                      asChild
                      className="mt-7 w-fit"
                      size="sm"
                      variant="inverse"
                    >
                      <Link href="/contact?type=client">
                        Client inquiry
                        <ArrowUpRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </article>

                  <article className="flex min-h-64 flex-col rounded-lg border border-white/[0.1] bg-white/[0.035] p-6 backdrop-blur-sm sm:p-7">
                    <Handshake
                      aria-hidden="true"
                      className="size-6 text-brand-violet"
                    />
                    <h3 className="mt-10 text-heading-sm">
                      Collaborate with us
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      Share your specialty, portfolio, and availability for
                      future creative collaborations.
                    </p>
                    <Button
                      asChild
                      className="mt-7 w-fit"
                      size="sm"
                      variant="outline"
                    >
                      <Link href="/contact?type=partner">
                        Partner inquiry
                        <ArrowUpRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </article>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { HOMEPAGE_SERVICES } from "@/lib/constants/homepage";

export function ServicesOverview() {
  return (
    <section className="relative py-section" id="home-services">
      <Container>
        <div className="grid gap-10 border-b border-white/[0.08] pb-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:items-end lg:pb-20">
          <Reveal>
            <p className="editorial-kicker">One connected studio</p>
            <h2 className="mt-6 max-w-4xl text-balance text-heading-xl">
              Not more noise.
              <span className="text-gradient-brand block">More meaning.</span>
            </h2>
          </Reveal>
          <Reveal className="lg:pb-1" delay={0.08}>
            <p className="max-w-copy text-pretty text-lead text-muted-foreground">
              Every cut, frame, campaign, and digital system has a job: sharpen
              the idea and carry it further. Our capabilities meet inside one
              clear creative direction.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="editorial-kicker">Capabilities</p>
            <h2 className="mt-5 text-balance text-heading-lg">
              From first thought to final format.
            </h2>
          </div>
          <Button asChild className="w-fit" variant="outline">
            <Link href="/services">
              View all services
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <Stagger className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {HOMEPAGE_SERVICES.map((service) => (
            <StaggerItem className="min-h-full" key={service.slug}>
              <Link
                className="group relative z-0 flex h-full min-h-64 flex-col rounded-xl border border-white/[0.1] bg-background p-6 shadow-panel transition-[background-color,border-color,box-shadow,transform] duration-400 ease-cinematic hover:z-10 hover:border-primary/30 hover:bg-surface hover:shadow-glow focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.01] motion-safe:focus-visible:-translate-y-1 motion-safe:focus-visible:scale-[1.01] sm:p-8"
                href={`/services/${service.slug}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary">
                    {service.index}
                  </span>
                  <span className="flex size-10 items-center justify-center rounded-full border border-white/[0.1] text-muted-foreground transition-[background-color,border-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-background">
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </span>
                </div>
                <div className="mt-auto pt-14">
                  <h3 className="text-heading-sm">{service.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

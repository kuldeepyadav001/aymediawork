import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { WorkStudy } from "@/lib/constants/work";
import { getServiceBySlug } from "@/lib/constants/services";

export function WorkCard({
  priority = false,
  study,
}: {
  priority?: boolean;
  study: WorkStudy;
}) {
  const serviceNames = study.services
    .map((slug) => getServiceBySlug(slug)?.title)
    .filter((title): title is string => Boolean(title));

  return (
    <article className="group h-full">
      <Link
        className="flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.1] bg-surface/55 shadow-panel transition-[border-color,box-shadow,transform] duration-500 ease-cinematic hover:border-primary/30 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-safe:hover:-translate-y-1"
        href={`/work/${study.slug}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-background">
          <Image
            fill
            alt={study.image.alt}
            className="object-cover transition-transform duration-800 ease-cinematic motion-safe:group-hover:scale-[1.035]"
            priority={priority}
            sizes="(max-width: 767px) 92vw, 46vw"
            src={study.image.src}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,11,0.02)_35%,rgba(5,6,11,0.72)_100%)]"
          />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6">
            <span className="rounded-full border border-white/15 bg-background/60 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-white/75 backdrop-blur-md">
              Original studio concept
            </span>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-background/55 text-white backdrop-blur-md transition-[background-color,border-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-primary group-hover:bg-primary group-hover:text-background">
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="flex items-center gap-3 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <span className="font-mono text-primary">{study.index}</span>
            <span aria-hidden="true" className="h-px w-7 bg-white/20" />
            <span>{study.category}</span>
          </div>
          <h2 className="mt-5 text-heading-sm">{study.title}</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {study.description}
          </p>
          <div className="mt-auto flex flex-wrap gap-2 pt-7">
            {serviceNames.map((service) => (
              <span
                className="rounded-full border border-white/[0.1] bg-white/[0.025] px-3 py-1 text-[0.6875rem] text-foreground/65"
                key={service}
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}

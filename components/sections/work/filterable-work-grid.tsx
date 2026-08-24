"use client";

import { useState } from "react";

import { WorkCard } from "@/components/sections/work/work-card";
import {
  WORK_CATEGORIES,
  type WorkCategory,
  type WorkStudy,
} from "@/lib/constants/work";
import { cn } from "@/lib/utils/cn";

const ALL_WORK = "All work" as const;
type WorkFilter = typeof ALL_WORK | WorkCategory;

export function FilterableWorkGrid({
  studies,
}: {
  studies: readonly WorkStudy[];
}) {
  const [activeFilter, setActiveFilter] = useState<WorkFilter>(ALL_WORK);
  const filters: readonly WorkFilter[] = [ALL_WORK, ...WORK_CATEGORIES];
  const visibleStudies =
    activeFilter === ALL_WORK
      ? studies
      : studies.filter((study) => study.category === activeFilter);

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-white/[0.08] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/70">
            Filter by territory
          </p>
          <div
            aria-label="Filter work by creative territory"
            className="mt-4 flex flex-wrap gap-2"
            role="group"
          >
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              const count =
                filter === ALL_WORK
                  ? studies.length
                  : studies.filter((study) => study.category === filter).length;

              return (
                <button
                  aria-pressed={isActive}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-[background-color,border-color,color,transform] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-safe:hover:-translate-y-0.5",
                    isActive
                      ? "border-primary bg-primary text-background"
                      : "border-white/[0.12] bg-white/[0.025] text-muted-foreground hover:border-white/25 hover:text-foreground",
                  )}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  type="button"
                >
                  {filter}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "font-mono text-[0.625rem]",
                      isActive ? "text-background/65" : "text-foreground/40",
                    )}
                  >
                    {String(count).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <p
          aria-live="polite"
          className="shrink-0 font-mono text-xs text-muted-foreground"
        >
          {visibleStudies.length}{" "}
          {visibleStudies.length === 1 ? "study" : "studies"} shown
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:gap-6">
        {visibleStudies.map((study, index) => (
          <WorkCard
            key={study.slug}
            priority={activeFilter === ALL_WORK && index < 2}
            study={study}
          />
        ))}
      </div>
    </div>
  );
}

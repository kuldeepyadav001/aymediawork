import Image from "next/image";

import { cn } from "@/lib/utils/cn";

type BrandProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLockup({ className, priority = false }: BrandProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        alt=""
        aria-hidden="true"
        className="h-6 w-auto sm:h-7"
        height={176}
        priority={priority}
        src="/images/brand/ay-media-work-mark-light.png"
        width={488}
      />
      <span className="border-l border-white/15 pl-2.5 font-display text-[0.625rem] font-semibold uppercase leading-[1.05] tracking-[0.18em] text-foreground sm:text-[0.6875rem]">
        Media
        <br />
        Work
      </span>
    </span>
  );
}

export function BrandLogo({ className, priority = false }: BrandProps) {
  return (
    <Image
      className={cn("h-auto w-full", className)}
      height={447}
      priority={priority}
      src="/images/brand/ay-media-work-logo-light.png"
      width={609}
      alt="AY Media Work"
    />
  );
}

import * as React from "react";

import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  align?: "left" | "center";
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  level?: "h1" | "h2" | "h3";
  title: React.ReactNode;
}

function SectionHeading({
  align = "left",
  className,
  description,
  eyebrow,
  level = "h2",
  title,
  ...props
}: SectionHeadingProps) {
  const Heading = level;

  return (
    <div
      className={cn(
        "flex max-w-4xl flex-col gap-5",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
      {...props}
    >
      {eyebrow ? <div className="editorial-kicker">{eyebrow}</div> : null}
      <Heading className="text-balance text-heading-xl">{title}</Heading>
      {description ? (
        <div className="max-w-copy text-pretty text-lead text-muted-foreground">
          {description}
        </div>
      ) : null}
    </div>
  );
}

export { SectionHeading };

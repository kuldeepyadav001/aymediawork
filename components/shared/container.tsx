import * as React from "react";

import { cn } from "@/lib/utils/cn";

const containerSizes = {
  default: "max-w-shell",
  wide: "max-w-wide",
  copy: "max-w-copy",
  full: "max-w-none",
} as const;

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof containerSizes;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full px-gutter",
        containerSizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Container.displayName = "Container";

export { Container };

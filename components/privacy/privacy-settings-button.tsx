"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { OPEN_ANALYTICS_PREFERENCES_EVENT } from "@/lib/analytics/consent";
import { cn } from "@/lib/utils/cn";

type PrivacySettingsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

export function PrivacySettingsButton({
  children = "Analytics preferences",
  className,
  type = "button",
  ...props
}: PrivacySettingsButtonProps) {
  return (
    <button
      className={cn(
        "text-left text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      onClick={() =>
        window.dispatchEvent(new Event(OPEN_ANALYTICS_PREFERENCES_EVENT))
      }
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

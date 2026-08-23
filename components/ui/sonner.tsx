"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ theme = "dark", ...props }: ToasterProps) => (
  <Sonner
    theme={theme}
    position="bottom-right"
    className="toaster group"
    toastOptions={{
      classNames: {
        toast:
          "group toast group-[.toaster]:rounded-xl group-[.toaster]:border-border group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:shadow-panel",
        description: "group-[.toast]:text-muted-foreground",
        actionButton:
          "group-[.toast]:rounded-full group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
        cancelButton:
          "group-[.toast]:rounded-full group-[.toast]:bg-secondary group-[.toast]:text-secondary-foreground",
      },
    }}
    {...props}
  />
);

export { Toaster };

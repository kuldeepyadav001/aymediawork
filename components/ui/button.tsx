import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border text-sm font-semibold tracking-[-0.01em] transition-[background-color,border-color,color,box-shadow,transform,filter] duration-300 ease-cinematic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-primary/50 bg-primary text-primary-foreground shadow-glow hover:bg-primary/90 hover:shadow-[0_16px_52px_-18px_hsl(var(--brand-blue)/0.78)]",
        brand:
          "border-white/10 bg-brand-linear text-background shadow-glow hover:brightness-110",
        destructive:
          "border-destructive/50 bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-border/90 bg-surface/50 text-foreground backdrop-blur-xl hover:border-foreground/25 hover:bg-secondary",
        secondary:
          "border-border/70 bg-secondary text-secondary-foreground hover:border-foreground/20 hover:bg-secondary/80",
        inverse:
          "border-foreground bg-foreground text-background hover:bg-foreground/90",
        ghost:
          "border-transparent bg-transparent text-foreground hover:bg-white/[0.06]",
        link: "h-auto border-transparent bg-transparent p-0 text-foreground underline-offset-4 hover:text-primary hover:underline motion-safe:hover:translate-y-0",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        default: "h-11 px-5",
        lg: "h-12 px-6 text-[0.9375rem]",
        xl: "h-14 px-8 text-base",
        icon: "size-11 p-0",
        "icon-sm": "size-9 p-0",
        "icon-lg": "size-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

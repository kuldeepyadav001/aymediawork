"use client";

import * as React from "react";

import {
  MOTION_DISTANCE,
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_STAGGER,
} from "@/lib/constants/motion";
import { cn } from "@/lib/utils/cn";

type RevealDirection = "up" | "down" | "left" | "right" | "none";
type MotionStyle = React.CSSProperties & Record<`--${string}`, string>;

interface VisibilityOptions {
  amount: number;
  once: boolean;
}

function useElementVisibility({ amount, once }: VisibilityOptions) {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: amount },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [amount, once]);

  return { elementRef, isVisible };
}

interface RevealProps extends React.ComponentPropsWithoutRef<"div"> {
  delay?: number;
  direction?: RevealDirection;
  distance?: number;
  once?: boolean;
}

const directionOffset: Record<RevealDirection, { x: number; y: number }> = {
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  none: { x: 0, y: 0 },
  right: { x: -1, y: 0 },
  up: { x: 0, y: 1 },
};

function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = MOTION_DISTANCE.base,
  once = true,
  style,
  ...props
}: RevealProps) {
  const { elementRef, isVisible } = useElementVisibility({
    amount: 0.2,
    once,
  });
  const offset = directionOffset[direction];
  const motionStyle: MotionStyle = {
    ...style,
    "--reveal-delay": `${delay}s`,
    "--reveal-duration": `${MOTION_DURATION.slow}s`,
    "--reveal-ease": `cubic-bezier(${MOTION_EASE.enter.join(",")})`,
    "--reveal-x": `${offset.x * distance}px`,
    "--reveal-y": `${offset.y * distance}px`,
  };

  return (
    <div
      className={cn("reveal-motion", className)}
      data-in-view={isVisible}
      ref={elementRef}
      style={motionStyle}
      {...props}
    >
      {children}
    </div>
  );
}

interface StaggerProps extends React.ComponentPropsWithoutRef<"div"> {
  once?: boolean;
  stagger?: number;
}

function Stagger({
  children,
  className,
  once = true,
  stagger = MOTION_STAGGER.base,
  ...props
}: StaggerProps) {
  const { elementRef, isVisible } = useElementVisibility({
    amount: 0.15,
    once,
  });
  const staggeredChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement<{ style?: React.CSSProperties }>(child)) {
      return child;
    }

    const childStyle: MotionStyle = {
      ...child.props.style,
      "--stagger-delay": `${MOTION_STAGGER.tight + index * stagger}s`,
    };
    return React.cloneElement(child, { style: childStyle });
  });

  return (
    <div
      className={cn("stagger-motion", className)}
      data-in-view={isVisible}
      ref={elementRef}
      {...props}
    >
      {staggeredChildren}
    </div>
  );
}

function StaggerItem({
  className,
  style,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const motionStyle: MotionStyle = {
    ...style,
    "--stagger-duration": `${MOTION_DURATION.slow}s`,
    "--stagger-ease": `cubic-bezier(${MOTION_EASE.enter.join(",")})`,
    "--stagger-y": `${MOTION_DISTANCE.subtle}px`,
  };

  return (
    <div
      className={cn("stagger-item-motion", className)}
      style={motionStyle}
      {...props}
    />
  );
}

export { Reveal, Stagger, StaggerItem };

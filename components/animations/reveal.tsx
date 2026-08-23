"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  MOTION_DISTANCE,
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_STAGGER,
} from "@/lib/constants/motion";
import { cn } from "@/lib/utils/cn";

type MotionDivProps = React.ComponentPropsWithoutRef<typeof motion.div>;
type RevealDirection = "up" | "down" | "left" | "right" | "none";

interface RevealProps extends Omit<
  MotionDivProps,
  "initial" | "transition" | "viewport" | "whileInView"
> {
  delay?: number;
  direction?: RevealDirection;
  distance?: number;
  once?: boolean;
}

const directionOffset: Record<
  Exclude<RevealDirection, "none">,
  { x: number; y: number }
> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
};

function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = MOTION_DISTANCE.base,
  once = true,
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const offset =
    direction === "none" ? { x: 0, y: 0 } : directionOffset[direction];

  return (
    <motion.div
      className={cn(className)}
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              x: offset.x * distance,
              y: offset.y * distance,
            }
      }
      transition={{
        delay: reduceMotion ? 0 : delay,
        duration: reduceMotion ? 0 : MOTION_DURATION.slow,
        ease: MOTION_EASE.enter,
      }}
      viewport={{ amount: 0.2, once }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps extends Omit<
  MotionDivProps,
  "initial" | "transition" | "variants" | "viewport" | "whileInView"
> {
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
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: MOTION_STAGGER.tight,
            staggerChildren: reduceMotion ? 0 : stagger,
          },
        },
      }}
      viewport={{ amount: 0.15, once }}
      whileInView="visible"
      {...props}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ className, ...props }: MotionDivProps) {
  return (
    <motion.div
      className={cn(className)}
      transition={{
        duration: MOTION_DURATION.slow,
        ease: MOTION_EASE.enter,
      }}
      variants={{
        hidden: { opacity: 0, y: MOTION_DISTANCE.subtle },
        visible: { opacity: 1, y: 0 },
      }}
      {...props}
    />
  );
}

export { Reveal, Stagger, StaggerItem };

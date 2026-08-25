"use client";

import { useEffect, type ReactNode } from "react";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

type IdleWindow = Window &
  typeof globalThis & {
    cancelIdleCallback?: (handle: number) => void;
    requestIdleCallback?: (
      callback: () => void,
      options?: { timeout: number },
    ) => number;
  };

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const idleWindow = window as IdleWindow;
    let disposed = false;
    let generation = 0;
    let idleHandle: number | undefined;
    let timerHandle: number | undefined;
    let lenis: { destroy: () => void } | undefined;

    const cancelScheduledStart = () => {
      if (idleHandle !== undefined) {
        idleWindow.cancelIdleCallback?.(idleHandle);
        idleHandle = undefined;
      }
      if (timerHandle !== undefined) {
        window.clearTimeout(timerHandle);
        timerHandle = undefined;
      }
    };

    const configureScrolling = () => {
      generation += 1;
      const requestedGeneration = generation;
      cancelScheduledStart();
      lenis?.destroy();
      lenis = undefined;

      if (reducedMotion.matches) return;

      const start = async () => {
        let Lenis: (typeof import("lenis"))["default"];
        try {
          ({ default: Lenis } = await import("lenis"));
        } catch {
          // Native scrolling remains available if the optional enhancement fails.
          return;
        }
        if (
          disposed ||
          reducedMotion.matches ||
          requestedGeneration !== generation
        ) {
          return;
        }

        lenis = new Lenis({
          anchors: { offset: -96 },
          autoRaf: true,
          duration: 1.05,
          smoothWheel: true,
        });
      };

      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(() => void start(), {
          timeout: 1_200,
        });
      } else {
        timerHandle = window.setTimeout(() => void start(), 1);
      }
    };

    configureScrolling();
    reducedMotion.addEventListener("change", configureScrolling);

    return () => {
      disposed = true;
      generation += 1;
      cancelScheduledStart();
      reducedMotion.removeEventListener("change", configureScrolling);
      lenis?.destroy();
    };
  }, []);

  return children;
}

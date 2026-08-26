"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

type LenisInstance = {
  destroy: () => void;
  scrollTo: (
    target: number,
    options?: { force?: boolean; immediate?: boolean },
  ) => void;
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
  const lenisRef = useRef<LenisInstance | undefined>(undefined);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const idleWindow = window as IdleWindow;
    let disposed = false;
    let generation = 0;
    let idleHandle: number | undefined;
    let timerHandle: number | undefined;

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
      lenisRef.current?.destroy();
      lenisRef.current = undefined;

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

        lenisRef.current = new Lenis({
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
      lenisRef.current?.destroy();
      lenisRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    // New route: reset Lenis' internal position so the page opens at the
    // top instead of restoring the previous page's scroll offset. Hash
    // navigations keep their intended anchor target.
    if (window.location.hash) return;
    lenisRef.current?.scrollTo(0, { force: true, immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
}

"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;

    const configureScrolling = () => {
      lenis?.destroy();
      lenis = undefined;

      if (reducedMotion.matches) return;

      lenis = new Lenis({
        anchors: { offset: -96 },
        autoRaf: true,
        duration: 1.05,
        smoothWheel: true,
      });
    };

    configureScrolling();
    reducedMotion.addEventListener("change", configureScrolling);

    return () => {
      reducedMotion.removeEventListener("change", configureScrolling);
      lenis?.destroy();
    };
  }, []);

  return children;
}

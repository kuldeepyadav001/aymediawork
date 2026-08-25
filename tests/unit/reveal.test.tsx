import { readFileSync } from "node:fs";
import { join } from "node:path";

import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";

function installIntersectionObserver() {
  let callback: IntersectionObserverCallback | undefined;
  const disconnect = vi.fn();
  const observe = vi.fn();

  class TestIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "0px";
    readonly thresholds = [0.2];

    constructor(nextCallback: IntersectionObserverCallback) {
      callback = nextCallback;
    }

    disconnect() {
      disconnect();
    }

    observe(target: Element) {
      observe(target);
    }

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }

    unobserve() {}
  }

  vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);

  return {
    disconnect,
    enter(target: Element) {
      if (!callback)
        throw new Error("IntersectionObserver was not initialized");
      callback(
        [{ isIntersecting: true, target } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    },
    observe,
  };
}

describe("native reveal motion", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reveals intersecting content and disconnects one-time observers", () => {
    const observer = installIntersectionObserver();
    render(
      <Reveal data-testid="reveal" delay={0.12} direction="left">
        Content
      </Reveal>,
    );

    const reveal = screen.getByTestId("reveal");
    expect(reveal).toHaveAttribute("data-in-view", "false");
    expect(reveal).toHaveStyle({
      "--reveal-delay": "0.12s",
      "--reveal-x": "24px",
      "--reveal-y": "0px",
    });
    expect(observer.observe).toHaveBeenCalledWith(reveal);

    act(() => observer.enter(reveal));

    expect(reveal).toHaveAttribute("data-in-view", "true");
    expect(observer.disconnect).toHaveBeenCalledOnce();
  });

  it("applies deterministic delays to staggered children", () => {
    installIntersectionObserver();
    render(
      <Stagger data-testid="stagger" stagger={0.1}>
        <StaggerItem data-testid="first">First</StaggerItem>
        <StaggerItem data-testid="second">Second</StaggerItem>
      </Stagger>,
    );

    expect(screen.getByTestId("stagger")).toHaveClass("stagger-motion");
    expect(screen.getByTestId("first")).toHaveStyle({
      "--stagger-delay": "0.045s",
    });
    expect(
      Number.parseFloat(
        screen.getByTestId("second").style.getPropertyValue("--stagger-delay"),
      ),
    ).toBeCloseTo(0.145);
  });

  it("keeps content visible when IntersectionObserver is unavailable", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Reveal data-testid="fallback">Fallback content</Reveal>);

    await waitFor(() =>
      expect(screen.getByTestId("fallback")).toHaveAttribute(
        "data-in-view",
        "true",
      ),
    );
  });

  it("fails open without scripting and under reduced motion", () => {
    const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

    const scriptingGuard = css.indexOf("@media (scripting: enabled)");
    const hiddenReveal = css.indexOf(".reveal-motion {\n      opacity: 0");
    expect(scriptingGuard).toBeGreaterThan(-1);
    expect(hiddenReveal).toBeGreaterThan(scriptingGuard);
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.reveal-motion,[\s\S]*\.stagger-item-motion[\s\S]*opacity: 1 !important/,
    );
  });
});

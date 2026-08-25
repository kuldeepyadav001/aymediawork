import { act, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

const lenisSpies = vi.hoisted(() => ({
  create: vi.fn(),
  destroy: vi.fn(),
}));

vi.mock("lenis", () => ({
  default: class MockLenis {
    constructor(options: unknown) {
      lenisSpies.create(options);
    }

    destroy() {
      lenisSpies.destroy();
    }
  },
}));

function mockReducedMotion(initialMatches: boolean) {
  let changeListener: ((event: MediaQueryListEvent) => void) | undefined;
  let matches = initialMatches;
  const media = "(prefers-reduced-motion: reduce)";
  const mediaQuery = {
    addEventListener: vi.fn(
      (_type: string, listener: (event: MediaQueryListEvent) => void) => {
        changeListener = listener;
      },
    ),
    dispatchEvent: vi.fn(),
    get matches() {
      return matches;
    },
    media,
    onchange: null,
    removeEventListener: vi.fn(),
  };

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockReturnValue(mediaQuery),
  });

  return {
    change(nextMatches: boolean) {
      matches = nextMatches;
      changeListener?.({ matches, media } as MediaQueryListEvent);
    },
  };
}

describe("SmoothScrollProvider", () => {
  beforeEach(() => {
    lenisSpies.create.mockClear();
    lenisSpies.destroy.mockClear();
  });

  it("starts and cleans up Lenis when motion is allowed", async () => {
    mockReducedMotion(false);

    const view = render(
      <SmoothScrollProvider>
        <div>Content</div>
      </SmoothScrollProvider>,
    );

    await waitFor(() =>
      expect(lenisSpies.create).toHaveBeenCalledWith(
        expect.objectContaining({ autoRaf: true, smoothWheel: true }),
      ),
    );

    view.unmount();
    expect(lenisSpies.destroy).toHaveBeenCalledOnce();
  });

  it("does not create smooth scrolling when reduced motion is requested", () => {
    mockReducedMotion(true);

    render(
      <SmoothScrollProvider>
        <div>Content</div>
      </SmoothScrollProvider>,
    );

    expect(lenisSpies.create).not.toHaveBeenCalled();
  });

  it("returns to native scrolling when reduced motion changes live", async () => {
    const preference = mockReducedMotion(false);
    render(
      <SmoothScrollProvider>
        <div>Content</div>
      </SmoothScrollProvider>,
    );
    await waitFor(() => expect(lenisSpies.create).toHaveBeenCalledOnce());

    act(() => preference.change(true));

    expect(lenisSpies.destroy).toHaveBeenCalledOnce();
  });
});

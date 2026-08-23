import { render } from "@testing-library/react";
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

function mockReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockReturnValue({
      addEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      removeEventListener: vi.fn(),
    }),
  });
}

describe("SmoothScrollProvider", () => {
  beforeEach(() => {
    lenisSpies.create.mockClear();
    lenisSpies.destroy.mockClear();
  });

  it("starts and cleans up Lenis when motion is allowed", () => {
    mockReducedMotion(false);

    const view = render(
      <SmoothScrollProvider>
        <div>Content</div>
      </SmoothScrollProvider>,
    );

    expect(lenisSpies.create).toHaveBeenCalledWith(
      expect.objectContaining({ autoRaf: true, smoothWheel: true }),
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
});

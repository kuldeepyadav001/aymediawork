import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/(public)/page";
import { cn } from "@/lib/utils/cn";

describe("project foundation", () => {
  it("renders the design-system review surface", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /cinematic clarity.*editorial control/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /explore the system/i }),
    ).toHaveAttribute("href", "#components");
  });

  it("merges conditional and conflicting Tailwind classes", () => {
    expect(cn("px-2", false && "hidden", "px-4")).toBe("px-4");
  });
});

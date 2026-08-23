import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/(public)/page";
import { cn } from "@/lib/utils/cn";

describe("project foundation", () => {
  it("renders the production homepage entry point", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /stories built to move.*frames made to stay/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /explore the work/i }),
    ).toHaveAttribute("href", "/work");
  });

  it("merges conditional and conflicting Tailwind classes", () => {
    expect(cn("px-2", false && "hidden", "px-4")).toBe("px-4");
  });
});

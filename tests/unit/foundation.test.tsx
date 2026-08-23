import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/(public)/page";
import { cn } from "@/lib/utils/cn";

describe("project foundation", () => {
  it("renders the AY Media Work landing heading", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "AY Media Work" }),
    ).toBeInTheDocument();
  });

  it("merges conditional and conflicting Tailwind classes", () => {
    expect(cn("px-2", false && "hidden", "px-4")).toBe("px-4");
  });
});

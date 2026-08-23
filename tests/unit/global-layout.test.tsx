import type { PropsWithChildren } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import PublicLayout from "@/app/(public)/layout";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/services",
}));

vi.mock("@/components/providers/smooth-scroll-provider", () => ({
  SmoothScrollProvider: ({ children }: PropsWithChildren) => children,
}));

afterEach(cleanup);

describe("global public layout", () => {
  it("provides the landmark shell and keyboard skip navigation", () => {
    render(
      <PublicLayout>
        <p>Page content</p>
      </PublicLayout>,
    );

    expect(
      screen.getByRole("link", { name: "Skip to content" }),
    ).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("identifies the current route and exposes an accessible mobile menu", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    expect(
      within(screen.getByRole("navigation", { name: "Primary" })).getByRole(
        "link",
        { name: "Services" },
      ),
    ).toHaveAttribute("aria-current", "page");

    await user.click(screen.getByRole("button", { name: "Open navigation" }));

    const dialog = screen.getByRole("dialog", { name: "Site navigation" });
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByRole("navigation", { name: "Mobile" }),
    ).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps footer navigation and project conversion paths available", () => {
    render(<SiteFooter />);

    expect(
      screen.getByRole("link", { name: "Tell us about it" }),
    ).toHaveAttribute("href", "/contact");
    expect(
      screen.getByRole("navigation", { name: "Footer" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Legal" }),
    ).toBeInTheDocument();

    const socialNavigation = screen.getByRole("navigation", {
      name: "Social media",
    });
    expect(
      within(socialNavigation).getByRole("link", { name: /Instagram/i }),
    ).toHaveAttribute("href", "https://www.instagram.com/aymediawork_/");
    expect(
      within(socialNavigation).getByRole("link", { name: /YTJobs/i }),
    ).toHaveAttribute("href", "https://ytjobs.co/talent/profile/439676?r=253");
    expect(
      within(socialNavigation).queryByRole("link", { name: /LinkedIn/i }),
    ).not.toBeInTheDocument();
    const comingSoon = within(socialNavigation).getByText("Coming soon");
    expect(comingSoon).toBeVisible();
    expect(comingSoon.closest('[aria-disabled="true"]')).toBeInTheDocument();

    expect(
      screen.getAllByText("Ideas in motion. Stories that stay."),
    ).toHaveLength(2);
  });
});

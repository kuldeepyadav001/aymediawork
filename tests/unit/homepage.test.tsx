import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import HomePage from "@/app/(public)/page";
import {
  CREATIVE_DISCIPLINES,
  CREATIVE_STUDIES,
  HOMEPAGE_SERVICES,
  PROCESS_STEPS,
} from "@/lib/constants/homepage";

afterEach(cleanup);

describe("production homepage", () => {
  it("presents one clear page heading and the primary conversion paths", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Stories built to move.*Frames made to stay/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Start a project" }),
    ).toHaveAttribute("href", "/contact?type=client");
    expect(
      screen.getByRole("link", { name: "Client inquiry" }),
    ).toHaveAttribute("href", "/contact?type=client");
    expect(
      screen.getByRole("link", { name: "Partner inquiry" }),
    ).toHaveAttribute("href", "/contact?type=partner");
  });

  it("exposes all ten approved services through stable routes", () => {
    render(<HomePage />);

    expect(HOMEPAGE_SERVICES).toHaveLength(10);
    for (const service of HOMEPAGE_SERVICES) {
      expect(
        screen.getByRole("link", { name: new RegExp(service.title) }),
      ).toHaveAttribute("href", `/services/${service.slug}`);
    }
  });

  it("keeps the hero glass message in subtle motion and the ticker in sync", () => {
    render(<HomePage />);

    expect(CREATIVE_DISCIPLINES).toEqual(
      HOMEPAGE_SERVICES.map(({ title }) => title),
    );
    expect(
      screen.getByRole("group", { name: /Creative disciplines:/i }),
    ).toHaveAccessibleName(
      `Creative disciplines: ${CREATIVE_DISCIPLINES.join(", ")}`,
    );

    const glassMessage = screen
      .getByText("Built around the idea")
      .closest("div.motion-safe\\:animate-hero-card-float");
    expect(glassMessage).toBeInTheDocument();
  });

  it("labels original visual studies transparently and avoids client attribution", () => {
    render(<HomePage />);

    for (const study of CREATIVE_STUDIES) {
      expect(screen.getByRole("img", { name: study.alt })).toBeInTheDocument();
    }
    expect(
      screen.getByText(
        /These are studio concepts—not attributed client projects/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Confirmed client case studies will be added only with approval/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders the complete four-step studio process", () => {
    render(<HomePage />);

    expect(PROCESS_STEPS).toHaveLength(4);
    for (const step of PROCESS_STEPS) {
      expect(
        screen.getByRole("heading", { level: 3, name: step.title }),
      ).toBeInTheDocument();
    }
  });
});

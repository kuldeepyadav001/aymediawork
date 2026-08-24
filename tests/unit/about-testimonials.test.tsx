import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { metadata as aboutMetadata } from "@/app/(public)/about/page";
import { metadata as testimonialsMetadata } from "@/app/(public)/testimonials/page";
import { SiteFooter } from "@/components/layout/site-footer";
import { AboutIndex } from "@/components/sections/about/about-index";
import {
  TestimonialCollection,
  TestimonialsIndex,
} from "@/components/sections/testimonials/testimonials-index";
import {
  ABOUT_PRINCIPLES,
  COLLABORATION_VALUES,
  STUDIO_LAYERS,
} from "@/lib/constants/about";
import {
  APPROVED_TESTIMONIALS,
  FEEDBACK_PUBLISHING_STEPS,
  type PublishedTestimonial,
  WORKING_EXPERIENCE,
} from "@/lib/constants/testimonials";

afterEach(cleanup);

describe("about and testimonials", () => {
  it("renders the About story, original artwork, principles, and conversion paths", () => {
    render(<AboutIndex />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Built around the idea.*Not the department/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: /Film, interface, graphic, and dimensional forms converging/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: /Rough paper, film, glass, and metal fragments/i,
      }),
    ).toBeInTheDocument();

    for (const principle of ABOUT_PRINCIPLES) {
      expect(
        screen.getByRole("heading", { level: 3, name: principle.title }),
      ).toBeInTheDocument();
    }
    for (const layer of STUDIO_LAYERS) {
      expect(
        screen.getByRole("heading", { level: 3, name: layer.title }),
      ).toBeInTheDocument();
    }
    for (const value of COLLABORATION_VALUES) {
      expect(screen.getByText(value)).toBeInTheDocument();
    }

    expect(
      screen.getByRole("link", { name: "Start a project" }),
    ).toHaveAttribute("href", "/contact?type=client");
    expect(
      screen.getByRole("link", { name: "Collaborate with the studio" }),
    ).toHaveAttribute("href", "/contact?type=partner");
    expect(
      screen.getByRole("link", { name: /See how feedback will be verified/i }),
    ).toHaveAttribute("href", "/testimonials");
  });

  it("publishes no review until approved feedback is supplied", () => {
    expect(APPROVED_TESTIMONIALS).toEqual([]);

    render(<TestimonialsIndex />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Feedback should be earned.*Never filled in/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "No approved client testimonials are published yet.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/will not substitute invented praise/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("blockquote")).not.toBeInTheDocument();

    for (const step of FEEDBACK_PUBLISHING_STEPS) {
      expect(
        screen.getByRole("heading", { level: 3, name: step.title }),
      ).toBeInTheDocument();
    }
    for (const item of WORKING_EXPERIENCE) {
      expect(
        screen.getByRole("heading", { level: 3, name: item.title }),
      ).toBeInTheDocument();
    }
  });

  it("keeps future approved testimonial rendering reusable", () => {
    const fixture: PublishedTestimonial = {
      approvedAt: "2026-08-24",
      attribution: {
        name: "Approved contributor fixture",
        organisation: "Test organisation",
        role: "Test role",
      },
      id: "rendering-fixture",
      projectContext: "Rendering test only",
      quote: "Approved feedback fixture.",
    };

    render(<TestimonialCollection testimonials={[fixture]} />);

    expect(
      screen.getByText("“Approved feedback fixture.”"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Approved contributor fixture · Test role · Test organisation",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Rendering test only")).toBeInTheDocument();
    expect(
      screen.queryByText(/No approved client testimonials/i),
    ).not.toBeInTheDocument();
  });

  it("keeps unsupported business claims outside provisional public content", () => {
    const publicContent = JSON.stringify({
      about: [ABOUT_PRINCIPLES, STUDIO_LAYERS, COLLABORATION_VALUES],
      testimonials: [
        APPROVED_TESTIMONIALS,
        FEEDBACK_PUBLISHING_STEPS,
        WORKING_EXPERIENCE,
      ],
    });

    expect(publicContent).not.toMatch(
      /founded|headquartered|award-winning|global team|\d+\s+(?:clients|projects|years)|\d+%|\d+(?:\.\d+)?m views/i,
    );
  });

  it("adds canonical metadata and a footer route without expanding the primary nav", () => {
    expect(aboutMetadata.alternates).toEqual({ canonical: "/about" });
    expect(testimonialsMetadata.alternates).toEqual({
      canonical: "/testimonials",
    });
    expect(aboutMetadata.openGraph).toMatchObject({
      url: "/about",
    });
    expect(testimonialsMetadata.openGraph).toMatchObject({
      url: "/testimonials",
    });

    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "Testimonials" })).toHaveAttribute(
      "href",
      "/testimonials",
    );
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { generateStaticParams } from "@/app/(public)/services/[slug]/page";
import { ServiceDetail } from "@/components/sections/services/service-detail";
import { ServicesIndex } from "@/components/sections/services/services-index";
import { SERVICE_SLUGS } from "@/lib/constants/service-slugs";
import { getServiceBySlug, SERVICE_CATALOG } from "@/lib/constants/services";

afterEach(cleanup);

const EXPECTED_SERVICE_SLUGS = [
  "video-editing",
  "2d-and-3d-animation",
  "saas-video",
  "graphic-design",
  "ai-animation",
  "web-development",
  "ai-automation",
  "facebook-and-meta-ads",
  "cgi-and-vfx",
] as const;

describe("services catalog", () => {
  it("defines the nine approved service routes with original artwork", () => {
    expect(SERVICE_CATALOG).toHaveLength(9);

    const slugs = SERVICE_CATALOG.map(({ slug }) => slug);
    expect(slugs).toEqual(EXPECTED_SERVICE_SLUGS);
    expect(SERVICE_SLUGS).toEqual(EXPECTED_SERVICE_SLUGS);
    expect(new Set(slugs).size).toBe(9);
    expect(generateStaticParams()).toEqual(slugs.map((slug) => ({ slug })));

    for (const service of SERVICE_CATALOG) {
      expect(service.image.src).toBe(`/images/services/${service.slug}.jpg`);
      expect(service.disciplines).toHaveLength(6);
      expect(service.approach).toHaveLength(4);
      expect(service.relatedSlugs).toHaveLength(3);
      expect(getServiceBySlug(service.slug)).toBe(service);
    }
    expect(getServiceBySlug("not-a-service")).toBeUndefined();
  });

  it("renders the overview with every service destination and transparent provenance", () => {
    render(<ServicesIndex />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /One studio.*Nine ways to.*move an idea/i,
      }),
    ).toBeInTheDocument();

    for (const service of SERVICE_CATALOG) {
      expect(
        screen.getByRole("link", { name: new RegExp(service.title) }),
      ).toHaveAttribute("href", `/services/${service.slug}`);
      expect(
        screen.getByRole("img", { name: service.image.alt }),
      ).toBeInTheDocument();
    }

    expect(
      screen.getByText(/original studio concept artwork/i),
    ).toBeInTheDocument();
  });

  it("renders a complete service page within the approved content boundary", () => {
    const service = SERVICE_CATALOG.at(0);
    expect(service).toBeDefined();
    if (!service) {
      throw new Error("Expected the services catalog to contain an entry");
    }

    render(<ServiceDetail service={service} />);

    expect(
      screen.getByRole("heading", { level: 1, name: service.heroTitle }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Start a conversation" }),
    ).toHaveAttribute("href", `/contact?type=client&service=${service.slug}`);

    for (const discipline of service.disciplines) {
      expect(screen.getByText(discipline)).toBeInTheDocument();
    }
    for (const step of service.approach) {
      expect(
        screen.getByRole("heading", { level: 3, name: step.title }),
      ).toBeInTheDocument();
    }

    expect(document.body).not.toHaveTextContent(
      /pricing|starting (?:at|from)|per month|₹|\$\d/i,
    );
  });
});

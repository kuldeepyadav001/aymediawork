import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import WorkStudyPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/(public)/work/[slug]/page";
import { WorkDetail } from "@/components/sections/work/work-detail";
import { WorkIndex } from "@/components/sections/work/work-index";
import { getServiceBySlug } from "@/lib/constants/services";
import {
  getNextWorkStudy,
  getWorkStudyBySlug,
  WORK_STUDIES,
} from "@/lib/constants/work";
import { WORK_SLUGS } from "@/lib/constants/work-slugs";

afterEach(cleanup);

const EXPECTED_WORK_SLUGS = [
  "signal-in-the-noise",
  "interface-in-motion",
  "worlds-between-frames",
  "identity-in-rhythm",
  "connected-by-design",
  "impossible-made-visible",
] as const;

describe("work archive", () => {
  it("defines six stable concept routes with complete original study data", () => {
    expect(WORK_STUDIES).toHaveLength(6);
    expect(WORK_SLUGS).toEqual(EXPECTED_WORK_SLUGS);
    expect(WORK_STUDIES.map(({ slug }) => slug)).toEqual(EXPECTED_WORK_SLUGS);
    expect(generateStaticParams()).toEqual(
      EXPECTED_WORK_SLUGS.map((slug) => ({ slug })),
    );
    expect(new Set(WORK_STUDIES.map(({ id }) => id)).size).toBe(6);

    for (const study of WORK_STUDIES) {
      expect(study.image.src).toBe(`/images/work/${study.slug}.jpg`);
      expect(study.services).toHaveLength(3);
      expect(study.explores).toHaveLength(4);
      expect(study.palette).toHaveLength(4);
      expect(getWorkStudyBySlug(study.slug)).toBe(study);
      for (const serviceSlug of study.services) {
        expect(getServiceBySlug(serviceSlug)).toBeDefined();
      }
    }

    expect(getWorkStudyBySlug("not-a-study")).toBeUndefined();
    const firstStudy = WORK_STUDIES.at(0);
    const lastStudy = WORK_STUDIES.at(-1);
    expect(firstStudy).toBeDefined();
    expect(lastStudy).toBeDefined();
    if (firstStudy && lastStudy) {
      expect(getNextWorkStudy(lastStudy.slug)).toBe(firstStudy);
    }
  });

  it("renders every archive destination with transparent provenance", () => {
    render(<WorkIndex />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Direction you can see.*Thinking you can follow/i,
      }),
    ).toBeInTheDocument();

    for (const study of WORK_STUDIES) {
      expect(
        screen.getByRole("link", { name: new RegExp(study.title) }),
      ).toHaveAttribute("href", `/work/${study.slug}`);
      expect(
        screen.getByRole("img", { name: study.image.alt }),
      ).toBeInTheDocument();
    }

    expect(
      screen.getByText(
        /not attributed client projects or commercial result claims/i,
      ),
    ).toBeInTheDocument();
  });

  it("filters the archive by creative territory without losing accessibility", async () => {
    const user = userEvent.setup();
    render(<WorkIndex />);

    const productFilter = screen.getByRole("button", {
      name: /Product Stories/i,
    });
    await user.click(productFilter);

    expect(productFilter).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("1 study shown")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Interface in Motion/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Signal in the Noise/i }),
    ).not.toBeInTheDocument();
  });

  it("publishes canonical work metadata and honest CreativeWork JSON-LD", async () => {
    const study = WORK_STUDIES[0];
    expect(study).toBeDefined();
    if (!study) throw new Error("Expected an approved work study");

    const params = Promise.resolve({ slug: study.slug });
    const pageMetadata = await generateMetadata({ params });
    const { container } = render(await WorkStudyPage({ params }));
    const schema = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')
        ?.textContent ?? "{}",
    );

    expect(pageMetadata.alternates?.canonical).toBe(`/work/${study.slug}`);
    expect(pageMetadata.openGraph).toMatchObject({
      siteName: "AY Media Work",
      type: "article",
      url: `/work/${study.slug}`,
    });
    expect(schema).toMatchObject({
      "@type": "CreativeWork",
      abstract: study.description,
      description: study.metaDescription,
      name: study.title,
    });
    expect(schema).not.toHaveProperty("client");
    expect(schema).not.toHaveProperty("award");
  });

  it("renders a complete study without invented commercial claims", () => {
    const study = WORK_STUDIES.at(0);
    expect(study).toBeDefined();
    if (!study) {
      throw new Error("Expected the work archive to contain a study");
    }
    render(<WorkDetail study={study} />);

    expect(
      screen.getByRole("heading", { level: 1, name: study.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: study.premise.question }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("No client attribution or performance claim"),
    ).toBeInTheDocument();

    for (const item of study.explores) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
    for (const serviceSlug of study.services) {
      const service = getServiceBySlug(serviceSlug);
      expect(service).toBeDefined();
      if (service) {
        expect(
          screen.getByRole("link", { name: new RegExp(service.title) }),
        ).toHaveAttribute("href", `/services/${service.slug}`);
      }
    }

    expect(document.body).not.toHaveTextContent(
      /pricing|starting (?:at|from)|per month|₹|\$\d|\d+(?:\.\d+)?m views/i,
    );
  });
});

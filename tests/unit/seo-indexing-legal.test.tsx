import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const publicQueryMocks = vi.hoisted(() => ({
  getPublishedBlogArticles: vi.fn(async () => [{ slug: "published-article" }]),
  getPublishedProjects: vi.fn(async () => [{ slug: "published-project" }]),
  getPublishedServices: vi.fn(async () => [{ slug: "published-service" }]),
}));

vi.mock("@/lib/supabase/queries/public", () => publicQueryMocks);

import { metadata as adminMetadata } from "@/app/admin/layout";
import PrivacyPage, {
  metadata as privacyMetadata,
} from "@/app/(public)/privacy/page";
import TermsPage, {
  metadata as termsMetadata,
} from "@/app/(public)/terms/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { JsonLd, serializeJsonLd } from "@/components/seo/json-ld";
import { createPageMetadata } from "@/lib/seo/metadata";
import nextConfig from "@/next.config";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe("crawler controls", () => {
  it("publishes only public static and published CMS routes in the sitemap", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.aymediawork.site");

    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toEqual([
      "https://www.aymediawork.site/",
      "https://www.aymediawork.site/services",
      "https://www.aymediawork.site/work",
      "https://www.aymediawork.site/about",
      "https://www.aymediawork.site/testimonials",
      "https://www.aymediawork.site/blog",
      "https://www.aymediawork.site/contact",
      "https://www.aymediawork.site/privacy",
      "https://www.aymediawork.site/terms",
      "https://www.aymediawork.site/services/published-service",
      "https://www.aymediawork.site/work/published-project",
      "https://www.aymediawork.site/blog/published-article",
    ]);
    expect(urls.join("\n")).not.toMatch(/\/admin|\/api/);
  });

  it("allows public crawling while excluding admin and API surfaces", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.aymediawork.site");

    expect(robots()).toEqual({
      host: "https://www.aymediawork.site",
      rules: {
        allow: "/",
        disallow: ["/admin", "/api"],
        userAgent: "*",
      },
      sitemap: "https://www.aymediawork.site/sitemap.xml",
    });
    expect(adminMetadata.robots).toEqual({ follow: false, index: false });
  });

  it("sends noindex response headers on private application surfaces", async () => {
    const headerRules = await nextConfig.headers?.();

    expect(headerRules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          headers: [
            {
              key: "X-Robots-Tag",
              value: "noindex, nofollow, noarchive",
            },
          ],
          source: "/admin/:path*",
        }),
        expect.objectContaining({
          headers: [
            {
              key: "X-Robots-Tag",
              value: "noindex, nofollow, noarchive",
            },
          ],
          source: "/api/:path*",
        }),
      ]),
    );
  });
});

describe("public metadata and structured data safety", () => {
  it("builds consistent canonical, Open Graph, and social preview metadata", () => {
    const metadata = createPageMetadata({
      description: "Focused fixture description.",
      path: "/fixture",
      title: "Fixture",
    });

    expect(metadata.alternates).toEqual({ canonical: "/fixture" });
    expect(metadata.openGraph).toMatchObject({
      description: "Focused fixture description.",
      siteName: "AY Media Work",
      title: "Fixture | AY Media Work",
      type: "website",
      url: "/fixture",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Fixture | AY Media Work",
    });
  });

  it("escapes script-breaking content in every shared JSON-LD payload", () => {
    const payload = {
      "@context": "https://schema.org",
      description: "</script><script>alert('unsafe')</script>",
    };
    const serialized = serializeJsonLd(payload);

    expect(serialized).not.toContain("<");
    expect(serialized).toContain("\\u003c/script>");

    const { container } = render(<JsonLd data={payload} />);
    const schema = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(schema).not.toBeNull();
    expect(schema?.textContent).toBe(serialized);
    expect(JSON.parse(schema?.textContent ?? "{}")).toEqual(payload);
  });
});

describe("legal routes", () => {
  it("publishes an accessible Privacy notice with canonical metadata and preference controls", () => {
    render(<PrivacyPage />);

    expect(privacyMetadata.alternates).toEqual({ canonical: "/privacy" });
    expect(privacyMetadata.openGraph).toMatchObject({
      siteName: "AY Media Work",
      url: "/privacy",
    });
    expect(
      screen.getByRole("heading", { level: 1, name: "Privacy notice" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Last updated 25 August 2026")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Analytics preferences" }),
    ).toBeInTheDocument();
    for (const link of screen.getAllByRole("link", { name: /contact form/i })) {
      expect(link).toHaveAttribute("href", "/contact");
    }
  });

  it("publishes Website terms without inventing a jurisdiction or commercial promise", () => {
    render(<TermsPage />);

    expect(termsMetadata.alternates).toEqual({ canonical: "/terms" });
    expect(termsMetadata.openGraph).toMatchObject({
      siteName: "AY Media Work",
      url: "/terms",
    });
    expect(
      screen.getByRole("heading", { level: 1, name: "Website terms" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/do not select an exclusive court or jurisdiction/i),
    ).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(
      /starting at|per month|₹|\$\d/i,
    );
  });
});

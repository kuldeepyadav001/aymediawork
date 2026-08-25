import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import BlogArticlePage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/(public)/blog/[slug]/page";
import BlogPage from "@/app/(public)/blog/page";
import { BlogArchiveGrid } from "@/components/blog/blog-archive-grid";
import { SafeMarkdown } from "@/components/blog/safe-markdown";
import {
  BLOG_ARTICLES,
  BLOG_ARTICLE_SUMMARIES,
  BLOG_CATEGORIES,
  getBlogArticleBySlug,
  getNextBlogArticle,
} from "@/lib/constants/blog";
import { BLOG_SLUGS } from "@/lib/constants/blog-slugs";
import { getServiceBySlug } from "@/lib/constants/services";
import { formatBlogDate } from "@/lib/utils/blog";

afterEach(cleanup);

const EXPECTED_BLOG_SLUGS = [
  "one-idea-many-outputs",
  "motion-that-carries-meaning",
  "automation-with-a-human-thread",
  "website-as-a-living-system",
] as const;

describe("Studio Journal data", () => {
  it("formats date-only and Supabase timestamp values without breaking prerendering", () => {
    expect(formatBlogDate("2026-08-24")).toBe("24 Aug 2026");
    expect(formatBlogDate("2026-08-24T00:00:00+00:00")).toBe("24 Aug 2026");
    expect(formatBlogDate("not-a-date")).toBe("Date unavailable");
  });

  it("defines four stable, CMS-ready article routes with original content", () => {
    expect(BLOG_ARTICLES).toHaveLength(4);
    expect(BLOG_SLUGS).toEqual(EXPECTED_BLOG_SLUGS);
    expect(BLOG_ARTICLES.map(({ slug }) => slug)).toEqual(EXPECTED_BLOG_SLUGS);
    expect(generateStaticParams()).toEqual(
      EXPECTED_BLOG_SLUGS.map((slug) => ({ slug })),
    );
    expect(new Set(BLOG_ARTICLES.map(({ id }) => id)).size).toBe(4);
    expect(BLOG_ARTICLES.filter(({ featured }) => featured)).toHaveLength(1);
    expect(BLOG_ARTICLES.map(({ category }) => category)).toEqual(
      BLOG_CATEGORIES,
    );

    const expectedImages = [
      "/images/blog/one-idea-many-outputs.jpg",
      "/images/blog/motion-that-carries-meaning.jpg",
      "/images/blog/automation-with-human-thread.jpg",
      "/images/blog/website-as-living-system.jpg",
    ];

    for (const [index, article] of BLOG_ARTICLES.entries()) {
      expect(article.author).toBe("AY Media Work");
      expect(article.image.src).toBe(expectedImages[index]);
      expect(article.image.alt.length).toBeGreaterThan(30);
      expect(article.body.length).toBeGreaterThan(2_500);
      expect(article.body.match(/^## /gm)?.length).toBeGreaterThanOrEqual(5);
      expect(article.tags).toHaveLength(3);
      expect(article.takeaways).toHaveLength(4);
      expect(article.relatedServices).toHaveLength(3);
      expect(getBlogArticleBySlug(article.slug)).toBe(article);

      for (const serviceSlug of article.relatedServices) {
        expect(getServiceBySlug(serviceSlug)).toBeDefined();
      }
    }

    expect(getBlogArticleBySlug("not-an-article")).toBeUndefined();
    expect(BLOG_ARTICLE_SUMMARIES).toHaveLength(4);
    expect(
      BLOG_ARTICLE_SUMMARIES.every((article) => !("body" in article)),
    ).toBe(true);

    const firstArticle = BLOG_ARTICLES.at(0);
    const lastArticle = BLOG_ARTICLES.at(-1);
    expect(firstArticle).toBeDefined();
    expect(lastArticle).toBeDefined();
    if (firstArticle && lastArticle) {
      expect(getNextBlogArticle(lastArticle.slug)).toBe(firstArticle);
    }
  });
});

describe("Studio Journal archive", () => {
  it("renders the archive, discoverable article links, and honest provenance", async () => {
    render(await BlogPage());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Ideas for work that moves/i,
      }),
    ).toBeInTheDocument();

    for (const article of BLOG_ARTICLES) {
      expect(
        screen.getAllByRole("link", { name: new RegExp(article.title) }).at(0),
      ).toHaveAttribute("href", `/blog/${article.slug}`);
      expect(
        screen.getAllByRole("img", { name: article.image.alt }).at(0),
      ).toBeInTheDocument();
    }

    expect(
      screen.getByText(
        /do not present client engagements or performance claims/i,
      ),
    ).toBeInTheDocument();

    const schema = document.querySelector('script[type="application/ld+json"]');
    expect(schema).not.toBeNull();
    const structuredData = JSON.parse(schema?.textContent ?? "{}");
    expect(structuredData["@type"]).toBe("CollectionPage");
    expect(structuredData.mainEntity.itemListElement).toHaveLength(4);
  });

  it("filters entries by editorial category with an announced result count", async () => {
    const user = userEvent.setup();
    render(
      <BlogArchiveGrid
        articles={BLOG_ARTICLE_SUMMARIES}
        categories={BLOG_CATEGORIES}
      />,
    );

    const automationFilter = screen.getByRole("button", {
      name: "AI & Automation",
    });
    await user.click(automationFilter);

    expect(automationFilter).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Showing 1 article.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Automation With a Human Thread" }),
    ).toHaveAttribute("href", "/blog/automation-with-a-human-thread");
    expect(
      screen.queryByRole("link", { name: "Motion That Carries Meaning" }),
    ).not.toBeInTheDocument();
  });
});

describe("Studio Journal article experience", () => {
  it("renders a complete article, related navigation, and Article structured data", async () => {
    const article = BLOG_ARTICLES[0];
    expect(article).toBeDefined();
    if (!article) {
      throw new Error("Expected the Studio Journal to contain an article");
    }

    const page = await BlogArticlePage({
      params: Promise.resolve({ slug: article.slug }),
    });
    render(page);

    expect(
      screen.getByRole("heading", { level: 1, name: article.title }),
    ).toBeInTheDocument();
    expect(screen.getByText("AY Media Work")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: article.image.alt }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Start with the idea that must survive",
      }),
    ).toBeInTheDocument();

    for (const serviceSlug of article.relatedServices) {
      const service = getServiceBySlug(serviceSlug);
      expect(service).toBeDefined();
      if (service) {
        expect(
          screen.getByRole("link", { name: service.title }),
        ).toHaveAttribute("href", `/services/${service.slug}`);
      }
    }

    const schema = document.querySelector('script[type="application/ld+json"]');
    expect(schema).not.toBeNull();
    const structuredData = JSON.parse(schema?.textContent ?? "{}");
    expect(structuredData["@type"]).toBe("Article");
    expect(structuredData.headline).toBe(article.title);
    expect(structuredData.author).toEqual({
      "@id": "http://localhost:3000/#organization",
    });
    expect(structuredData.publisher).toEqual(structuredData.author);

    expect(document.body).not.toHaveTextContent(
      /pricing|starting (?:at|from)|per month|₹|\$\d|\d+(?:\.\d+)?m views/i,
    );
  });

  it("publishes canonical article metadata with the approved byline", async () => {
    const article = BLOG_ARTICLES[2];
    expect(article).toBeDefined();
    if (!article) {
      throw new Error("Expected the Studio Journal to contain an article");
    }

    const articleMetadata = await generateMetadata({
      params: Promise.resolve({ slug: article.slug }),
    });

    expect(articleMetadata.title).toBe(`${article.title} | Studio Journal`);
    expect(articleMetadata.description).toBe(article.metaDescription);
    expect(articleMetadata.alternates?.canonical).toBe(`/blog/${article.slug}`);
    expect(articleMetadata.authors).toEqual([{ name: "AY Media Work" }]);
    expect(articleMetadata.openGraph).toMatchObject({
      siteName: "AY Media Work",
      type: "article",
      publishedTime: article.publishedAt,
    });
    expect(articleMetadata.openGraph).not.toHaveProperty("modifiedTime");
  });

  it("sanitizes runtime Markdown instead of executing embedded HTML or unsafe URLs", () => {
    render(
      <SafeMarkdown
        source={`## Safe heading\n\nA useful **paragraph**.\n\n[Unsafe link](javascript:alert('no'))\n\n<script data-danger="yes">alert('no')</script>`}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Safe heading" }),
    ).toBeInTheDocument();
    expect(screen.getByText("paragraph", { exact: false })).toBeInTheDocument();
    expect(document.querySelector("script[data-danger='yes']")).toBeNull();
    expect(screen.getByText("Unsafe link").closest("a")).not.toHaveAttribute(
      "href",
    );
  });
});

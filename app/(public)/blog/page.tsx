import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BlogArchiveGrid } from "@/components/blog/blog-archive-grid";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import type { BlogArticleSummary } from "@/lib/constants/blog";
import { getPublishedBlogArticles } from "@/lib/supabase/queries/public";
import { formatBlogDate } from "@/lib/utils/blog";
import { getSiteUrl } from "@/lib/utils/site-url";

export const metadata: Metadata = {
  title: "Studio Journal",
  description:
    "Original notes from AY Media Work on creative direction, motion craft, digital systems, and responsible AI-assisted workflows.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Studio Journal | AY Media Work",
    description:
      "Ideas and practical notes across creative craft, digital systems, and responsible automation.",
    images: [
      {
        url: "/images/blog/one-idea-many-outputs.jpg",
        width: 1312,
        height: 816,
        alt: "The AY Media Work Studio Journal",
      },
    ],
  },
};

export default async function BlogPage() {
  const articles = await getPublishedBlogArticles();
  const featuredArticle =
    articles.find((article) => article.featured) ?? articles[0];
  const summaries: BlogArticleSummary[] = articles.map((article) => ({
    author: article.author,
    category: article.category,
    excerpt: article.excerpt,
    featured: article.featured,
    id: article.id,
    image: article.image,
    metaDescription: article.metaDescription,
    publishedAt: article.publishedAt,
    readingMinutes: article.readingMinutes,
    relatedServices: article.relatedServices,
    slug: article.slug,
    tags: article.tags,
    title: article.title,
  }));
  const categories = [...new Set(articles.map((article) => article.category))];
  const siteUrl = getSiteUrl();
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AY Media Work Studio Journal",
    description:
      "Original notes on creative direction, motion craft, digital systems, and responsible AI-assisted workflows.",
    url: new URL("/blog", siteUrl).toString(),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: new URL(`/blog/${article.slug}`, siteUrl).toString(),
        name: article.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative overflow-hidden pb-16 pt-24 sm:pb-20 sm:pt-32 lg:pt-36">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[50rem] -translate-x-1/2 rounded-full bg-brand-blue/10 blur-[120px]"
          aria-hidden="true"
        />
        <Container className="relative">
          <div className="max-w-4xl">
            <p className="editorial-kicker">Studio Journal</p>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-8xl">
              Ideas for work that <span className="text-primary">moves.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Original notes on creative direction, motion craft, digital
              systems, and responsible automation—written to make the thinking
              behind the output more useful.
            </p>
          </div>
        </Container>
      </section>

      {featuredArticle ? (
        <section className="pb-20 pt-0 sm:pb-28">
          <Container>
            <article className="group grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] lg:grid-cols-[1.12fr_0.88fr]">
              <div className="relative min-h-[19rem] overflow-hidden bg-surface sm:min-h-[27rem] lg:min-h-[34rem]">
                <Image
                  src={featuredArticle.image.src}
                  alt={featuredArticle.image.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition duration-700 motion-safe:group-hover:scale-[1.025]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/30"
                  aria-hidden="true"
                />
              </div>

              <div className="relative flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Featured entry
                </span>
                <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <span>{featuredArticle.category}</span>
                  <span aria-hidden="true">/</span>
                  <time dateTime={featuredArticle.publishedAt}>
                    {formatBlogDate(featuredArticle.publishedAt)}
                  </time>
                  <span aria-hidden="true">/</span>
                  <span>{featuredArticle.readingMinutes} min read</span>
                </div>
                <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-5xl">
                  {featuredArticle.title}
                </h2>
                <p className="mt-5 text-base leading-8 text-white/60">
                  {featuredArticle.excerpt}
                </p>
                <Link
                  href={`/blog/${featuredArticle.slug}`}
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-sm text-sm font-semibold text-white transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Read the featured entry
                  <span
                    className="text-primary transition-transform motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </div>
            </article>
          </Container>
        </section>
      ) : null}

      <section className="border-y border-white/[0.08] bg-white/[0.018] py-20 sm:py-28">
        <Container>
          <div className="mb-10 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="editorial-kicker">Browse the journal</p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
                Follow a line of thought.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground lg:justify-self-end">
              Move between creative direction, motion and design, AI-assisted
              workflows, and the digital systems that connect them.
            </p>
          </div>

          <BlogArchiveGrid articles={summaries} categories={categories} />
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-10 rounded-[2rem] border border-white/10 bg-gradient-to-br from-brand-blue/20 via-white/[0.04] to-white/[0.025] p-8 sm:p-11 lg:grid-cols-[1fr_auto] lg:items-end lg:p-14">
            <div className="max-w-2xl">
              <p className="editorial-kicker">From thought to system</p>
              <h2 className="mt-5 font-display text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
                Have something complex to make clear?
              </h2>
              <p className="mt-5 text-base leading-8 text-white/60 sm:text-lg">
                Bring us the brief, the moving parts, or the unfinished idea.
                We&apos;ll help shape a connected creative direction and the
                right way to build it.
              </p>
            </div>
            <Button asChild size="lg" variant="brand">
              <Link href="/contact?type=client">
                Start a project
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-muted-foreground">
            Studio Journal articles are original editorial material by AY Media
            Work. They describe working principles and do not present client
            engagements or performance claims.
          </p>
        </Container>
      </section>
    </>
  );
}

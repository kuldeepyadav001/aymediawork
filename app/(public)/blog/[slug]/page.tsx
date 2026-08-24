import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock3 } from "lucide-react";

import { SafeMarkdown } from "@/components/blog/safe-markdown";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
  BLOG_ARTICLES,
  getBlogArticleBySlug,
  getNextBlogArticle,
} from "@/lib/constants/blog";
import { SERVICE_CATALOG } from "@/lib/constants/services";
import { formatBlogDate } from "@/lib/utils/blog";
import { getSiteUrl } from "@/lib/utils/site-url";

type BlogArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return BLOG_ARTICLES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const canonical = `/blog/${article.slug}`;
  const title = `${article.title} | Studio Journal`;

  return {
    title,
    description: article.metaDescription,
    alternates: {
      canonical,
    },
    authors: [{ name: article.author }],
    openGraph: {
      type: "article",
      title: `${title} | AY Media Work`,
      description: article.metaDescription,
      url: canonical,
      publishedTime: article.publishedAt,
      authors: [article.author],
      tags: [...article.tags],
      images: [
        {
          url: article.image.src,
          width: 1312,
          height: 816,
          alt: article.image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | AY Media Work`,
      description: article.metaDescription,
      images: [article.image.src],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const nextArticle = getNextBlogArticle(article.slug);
  const relatedServices = article.relatedServices
    .map((relatedSlug) =>
      SERVICE_CATALOG.find((service) => service.slug === relatedSlug),
    )
    .filter((service) => service !== undefined);
  const articleUrl = new URL(`/blog/${article.slug}`, siteUrl).toString();
  const organizationUrl = siteUrl.toString();
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: new URL(article.image.src, siteUrl).toString(),
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: articleUrl,
    author: {
      "@type": "Organization",
      name: article.author,
      url: organizationUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "AY Media Work",
      url: organizationUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
        }}
      />

      <article>
        <header className="relative isolate overflow-hidden border-b border-white/[0.08] pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pt-32">
          <div
            aria-hidden="true"
            className="ambient-grid pointer-events-none absolute inset-0 -z-30 opacity-15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 -top-56 -z-20 size-[42rem] rounded-full bg-brand-blue/15 blur-[145px]"
          />
          <Container>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to Studio Journal
            </Link>

            <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end lg:gap-16">
              <div>
                <p className="editorial-kicker">{article.category}</p>
                <h1 className="mt-6 max-w-5xl text-balance text-display-lg">
                  {article.title}
                </h1>
                <p className="mt-7 max-w-3xl text-pretty text-lead text-muted-foreground">
                  {article.excerpt}
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-x-5 gap-y-6 border-t border-white/[0.1] pt-6 text-sm lg:grid-cols-1">
                <div>
                  <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Written by
                  </dt>
                  <dd className="mt-2 font-medium text-foreground">
                    {article.author}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Published
                  </dt>
                  <dd className="mt-2 font-medium text-foreground">
                    <time dateTime={article.publishedAt}>
                      {formatBlogDate(article.publishedAt)}
                    </time>
                  </dd>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-muted-foreground lg:col-span-1">
                  <dt className="sr-only">Reading time</dt>
                  <Clock3 aria-hidden="true" className="size-4 text-primary" />
                  <dd>{article.readingMinutes} minute read</dd>
                </div>
              </dl>
            </div>

            <div className="mt-9 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/[0.1] bg-white/[0.035] px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Container>
        </header>

        <Container className="pt-10 sm:pt-14">
          <figure>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.1] bg-surface shadow-panel sm:aspect-[16/9]">
              <Image
                fill
                priority
                src={article.image.src}
                alt={article.image.alt}
                sizes="(max-width: 1439px) 92vw, 86rem"
                className="object-cover"
              />
              <span className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-background/65 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/75 backdrop-blur-md">
                Original Studio Journal artwork
              </span>
            </div>
            <figcaption className="mt-3 text-right text-xs text-muted-foreground">
              Replaceable original concept artwork by AY Media Work
            </figcaption>
          </figure>
        </Container>

        <section className="py-16 sm:py-24" aria-label="Article content">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(15rem,0.34fr)_minmax(0,0.66fr)] lg:gap-20">
              <aside className="lg:order-1">
                <div className="rounded-xl border border-white/[0.09] bg-surface/60 p-6 lg:sticky lg:top-28">
                  <p className="editorial-kicker">Key ideas</p>
                  <ul className="mt-6 space-y-4">
                    {article.takeaways.map((takeaway) => (
                      <li
                        key={takeaway}
                        className="flex gap-3 text-sm leading-6 text-muted-foreground"
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                          <Check aria-hidden="true" className="size-3" />
                        </span>
                        {takeaway}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 border-t border-white/[0.08] pt-6">
                    <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Related capabilities
                    </p>
                    <div className="mt-4 flex flex-col items-start gap-3">
                      {relatedServices.map((service) => (
                        <Link
                          key={service.slug}
                          href={`/services/${service.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                        >
                          {service.title}
                          <ArrowRight aria-hidden="true" className="size-3.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              <div className="min-w-0 lg:order-2">
                <SafeMarkdown source={article.body} />

                <div className="mt-14 border-t border-white/[0.1] pt-8">
                  <p className="text-xs leading-6 text-muted-foreground">
                    This article is original editorial material by AY Media
                    Work. It shares studio principles and does not claim a
                    client engagement, measured result, or third-party
                    endorsement.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </article>

      <section className="border-y border-white/[0.08] bg-surface/35 py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="editorial-kicker">Continue reading</p>
              <p className="mt-5 text-sm text-muted-foreground">
                Next in the Studio Journal
              </p>
            </div>
            <Link
              href={`/blog/${nextArticle.slug}`}
              className="group rounded-xl border border-white/[0.1] bg-background/45 p-7 transition duration-300 hover:border-primary/30 hover:bg-background/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-9"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {nextArticle.category}
              </span>
              <span className="mt-4 flex items-end justify-between gap-6">
                <span className="font-display text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
                  {nextArticle.title}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="mb-1 size-6 shrink-0 text-primary transition-transform duration-300 motion-safe:group-hover:translate-x-1"
                />
              </span>
            </Link>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden py-section">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-16rem] left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-brand-blue/10 blur-[140px]"
        />
        <Container className="relative text-center" size="copy">
          <p className="editorial-kicker">Build the next idea</p>
          <h2 className="mt-6 text-balance text-heading-xl">
            Turn the thinking into something people can experience.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lead text-muted-foreground">
            Share the brief, the audience, and what needs to become clearer. We
            will shape the right creative and technical path around it.
          </p>
          <Button asChild className="mt-9" size="xl" variant="brand">
            <Link href="/contact?type=client">
              Start a project conversation
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Container>
      </section>
    </>
  );
}

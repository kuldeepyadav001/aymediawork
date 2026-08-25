"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { BlogArticleSummary } from "@/lib/constants/blog";
import { formatBlogDate } from "@/lib/utils/blog";

const ALL_ARTICLES = "All stories" as const;
type ActiveCategory = typeof ALL_ARTICLES | string;

function JournalCard({ article }: { article: BlogArticleSummary }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] transition duration-300 hover:border-primary/30 hover:bg-white/[0.055] motion-safe:hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 94vw"
          className="object-cover transition duration-700 motion-safe:group-hover:scale-[1.035]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">
          <span className="text-primary">{article.category}</span>
          <span aria-hidden="true">/</span>
          <time dateTime={article.publishedAt}>
            {formatBlogDate(article.publishedAt)}
          </time>
          <span aria-hidden="true">/</span>
          <span>{article.readingMinutes} min read</span>
        </div>

        <h2 className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[1.7rem]">
          <Link
            href={`/blog/${article.slug}`}
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="absolute inset-0" aria-hidden="true" />
            <span className="relative">{article.title}</span>
          </Link>
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-7 text-sm font-semibold text-white">
          Read journal entry
          <span
            className="text-primary transition-transform duration-300 motion-safe:group-hover:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
        </div>
      </div>
    </article>
  );
}

export function BlogArchiveGrid({
  articles,
  categories: editorialCategories,
}: {
  articles: readonly BlogArticleSummary[];
  categories: readonly string[];
}) {
  const [activeCategory, setActiveCategory] =
    useState<ActiveCategory>(ALL_ARTICLES);
  const categories: readonly ActiveCategory[] = [
    ALL_ARTICLES,
    ...editorialCategories,
  ];
  const visibleArticles =
    activeCategory === ALL_ARTICLES
      ? articles
      : articles.filter((article) => article.category === activeCategory);

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter Studio Journal articles"
      >
        {categories.map((category) => {
          const isActive = category === activeCategory;

          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-white/[0.12] bg-white/[0.03] text-muted-foreground hover:border-white/25 hover:text-white"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visibleArticles.length}{" "}
        {visibleArticles.length === 1 ? "article" : "articles"}.
      </p>

      <div className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleArticles.map((article) => (
          <JournalCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

import type { MetadataRoute } from "next";

import {
  getPublishedBlogArticles,
  getPublishedProjects,
  getPublishedServices,
} from "@/lib/supabase/queries/public";
import { getSiteUrl } from "@/lib/utils/site-url";

export const revalidate = 3600;

const STATIC_ROUTES = [
  "/",
  "/services",
  "/work",
  "/about",
  "/testimonials",
  "/blog",
  "/contact",
  "/privacy",
  "/terms",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [services, projects, articles] = await Promise.all([
    getPublishedServices(),
    getPublishedProjects(),
    getPublishedBlogArticles(),
  ]);
  const paths = [
    ...STATIC_ROUTES,
    ...services.map((service) => `/services/${service.slug}` as const),
    ...projects.map((project) => `/work/${project.slug}` as const),
    ...articles.map((article) => `/blog/${article.slug}` as const),
  ];

  return paths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
  }));
}

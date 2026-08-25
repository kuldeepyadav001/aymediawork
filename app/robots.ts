import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/utils/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    host: siteUrl.origin,
    rules: {
      allow: "/",
      disallow: ["/admin", "/api"],
      userAgent: "*",
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}

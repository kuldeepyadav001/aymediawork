import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SERVICE_SLUGS } from "@/lib/constants/service-slugs";
import { WORK_SLUGS } from "@/lib/constants/work-slugs";

const routeSlugSets: Readonly<Record<string, ReadonlySet<string>>> = {
  services: new Set<string>(SERVICE_SLUGS),
  work: new Set<string>(WORK_SLUGS),
};

export function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const routeRoot = segments[0];
  const routeSlugs = routeRoot ? routeSlugSets[routeRoot] : undefined;
  const isIndex = Boolean(routeSlugs) && segments.length === 1;
  const slug = segments[1];
  const isKnownDetail =
    Boolean(routeSlugs) &&
    segments.length === 2 &&
    slug !== undefined &&
    routeSlugs?.has(slug);

  if (isIndex || isKnownDetail) {
    return NextResponse.next();
  }

  const notFoundUrl = request.nextUrl.clone();
  notFoundUrl.pathname = "/_not-found";
  notFoundUrl.search = "";

  return NextResponse.rewrite(notFoundUrl, { status: 404 });
}

export const config = {
  matcher: ["/services/:path*", "/work/:path*"],
};

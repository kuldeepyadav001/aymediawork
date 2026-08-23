import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SERVICE_SLUGS } from "@/lib/constants/service-slugs";

const serviceSlugSet = new Set<string>(SERVICE_SLUGS);

export function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const isServicesIndex = segments.length === 1;
  const isKnownService =
    segments.length === 2 &&
    segments[1] !== undefined &&
    serviceSlugSet.has(segments[1]);

  if (isServicesIndex || isKnownService) {
    return NextResponse.next();
  }

  const notFoundUrl = request.nextUrl.clone();
  notFoundUrl.pathname = "/_not-found";
  notFoundUrl.search = "";

  return NextResponse.rewrite(notFoundUrl, { status: 404 });
}

export const config = {
  matcher: ["/services/:path*"],
};

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

const CATALOG_ROOTS = new Set(["blog", "services", "work"]);
const PUBLIC_ADMIN_PATHS = new Set([
  "/admin/auth/callback",
  "/admin/login",
  "/admin/reset-password",
]);

function hardNotFound(request: NextRequest) {
  const notFoundUrl = request.nextUrl.clone();
  notFoundUrl.pathname = "/_not-found";
  notFoundUrl.search = "";
  return NextResponse.rewrite(notFoundUrl, { status: 404 });
}

function loginRedirect(request: NextRequest, reason?: "configuration") {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = "";

  if (request.nextUrl.pathname !== "/admin") {
    loginUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
  }
  if (reason) loginUrl.searchParams.set("error", reason);

  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const routeRoot = segments[0];

  if (routeRoot && CATALOG_ROOTS.has(routeRoot)) {
    return segments.length <= 2 ? NextResponse.next() : hardNotFound(request);
  }

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next();

  let publicConfig: ReturnType<typeof getSupabasePublicConfig>;
  try {
    publicConfig = getSupabasePublicConfig();
  } catch {
    return loginRedirect(request, "configuration");
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(
    publicConfig.url,
    publicConfig.publishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, options, value } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return loginRedirect(request);
  if (pathname === "/admin") {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/admin/dashboard";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/blog/:path*",
    "/services/:path*",
    "/work/:path*",
  ],
};

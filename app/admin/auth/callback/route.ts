import { NextResponse, type NextRequest } from "next/server";

import { safeAdminPath } from "@/lib/admin/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const destination = safeAdminPath(requestUrl.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/admin/login?error=Invalid+or+expired+authentication+link.",
        requestUrl,
      ),
    );
  }

  let error: { message: string } | null;
  try {
    const supabase = await createSupabaseServerClient();
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } catch {
    return NextResponse.redirect(
      new URL(
        "/admin/login?error=Admin+authentication+is+not+configured.",
        requestUrl,
      ),
    );
  }

  if (error) {
    return NextResponse.redirect(
      new URL(
        "/admin/login?error=Authentication+link+could+not+be+verified.",
        requestUrl,
      ),
    );
  }

  return NextResponse.redirect(new URL(destination, requestUrl));
}

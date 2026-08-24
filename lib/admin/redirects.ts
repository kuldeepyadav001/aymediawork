const ADMIN_ORIGIN = "https://admin-navigation.invalid";

function recursivelyDecodePath(pathname: string) {
  let decoded = pathname;
  for (let pass = 0; pass < pathname.length; pass += 1) {
    const next = decodeURIComponent(decoded);
    if (next === decoded) break;
    decoded = next;
  }
  return decoded;
}

export function safeAdminPath(
  value: string | null | undefined,
  fallback = "/admin/dashboard",
) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return fallback;
  }

  try {
    const url = new URL(value, ADMIN_ORIGIN);
    const decodedPathname = recursivelyDecodePath(url.pathname);
    const hasUnsafeSegment = decodedPathname
      .split("/")
      .some((segment) => segment === "." || segment === "..");

    if (
      url.origin !== ADMIN_ORIGIN ||
      !url.pathname.startsWith("/admin/") ||
      !decodedPathname.startsWith("/admin/") ||
      decodedPathname.includes("\\") ||
      hasUnsafeSegment
    ) {
      return fallback;
    }
    return `${url.pathname}${url.search}`;
  } catch {
    return fallback;
  }
}

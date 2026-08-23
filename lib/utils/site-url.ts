const LOCAL_SITE_URL = "http://localhost:3000";

function withProtocol(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function getSiteUrl() {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    LOCAL_SITE_URL;

  try {
    return new URL(withProtocol(candidate));
  } catch {
    return new URL(LOCAL_SITE_URL);
  }
}

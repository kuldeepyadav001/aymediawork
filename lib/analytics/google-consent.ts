declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

export const DENIED_GOOGLE_CONSENT = {
  ad_personalization: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  analytics_storage: "denied",
} as const;

export const GRANTED_ANALYTICS_CONSENT = {
  ...DENIED_GOOGLE_CONSENT,
  analytics_storage: "granted",
} as const;

export function googleAnalyticsWindow() {
  return window as unknown as Window & Record<string, unknown>;
}

function deleteGoogleAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name))
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));
  const hostname = window.location.hostname;
  const hostnameParts = hostname.split(".");
  const registrableDomain =
    hostnameParts.length > 2 ? hostnameParts.slice(-2).join(".") : hostname;
  const domains = [
    "",
    hostname,
    `.${hostname}`,
    registrableDomain,
    `.${registrableDomain}`,
  ];

  for (const name of cookieNames) {
    for (const domain of new Set(domains)) {
      const domainAttribute = domain ? `; domain=${domain}` : "";
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domainAttribute}`;
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax; Secure${domainAttribute}`;
    }
  }
}

export function disableGoogleAnalytics(measurementId?: string) {
  if (!measurementId || typeof window === "undefined") return;

  googleAnalyticsWindow()[`ga-disable-${measurementId}`] = true;
  window.gtag?.("consent", "update", DENIED_GOOGLE_CONSENT);
  deleteGoogleAnalyticsCookies();
}

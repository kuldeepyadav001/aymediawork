"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import type { AnalyticsConfiguration } from "@/lib/analytics/config";
import { hasStoredAnalyticsConsent } from "@/lib/analytics/consent";

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

const GOOGLE_COOKIE_MAX_AGE_SECONDS = 180 * 24 * 60 * 60;
const DENIED_GOOGLE_CONSENT = {
  ad_personalization: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  analytics_storage: "denied",
} as const;
const GRANTED_ANALYTICS_CONSENT = {
  ...DENIED_GOOGLE_CONSENT,
  analytics_storage: "granted",
} as const;

function googleWindow() {
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

  googleWindow()[`ga-disable-${measurementId}`] = true;
  window.gtag?.("consent", "update", DENIED_GOOGLE_CONSENT);
  deleteGoogleAnalyticsCookies();
}

function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    const runtimeWindow = googleWindow();
    runtimeWindow[`ga-disable-${measurementId}`] = false;
    window.dataLayer ??= [];
    window.gtag ??= (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };

    window.gtag("consent", "default", DENIED_GOOGLE_CONSENT);
    window.gtag("consent", "update", GRANTED_ANALYTICS_CONSENT);
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_ad_personalization_signals: false,
      allow_google_signals: false,
      cookie_expires: GOOGLE_COOKIE_MAX_AGE_SECONDS,
      cookie_flags: "SameSite=Lax;Secure",
      send_page_view: false,
    });

    return () => disableGoogleAnalytics(measurementId);
  }, [measurementId]);

  useEffect(() => {
    window.gtag?.("event", "page_view", {
      page_location: `${window.location.origin}${pathname}`,
      page_path: pathname,
      page_title: document.title,
    });
  }, [pathname]);

  return (
    <Script
      id="google-analytics"
      src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
      strategy="afterInteractive"
    />
  );
}

export function AnalyticsProviders({
  config,
}: {
  config: AnalyticsConfiguration;
}) {
  return (
    <>
      {config.googleAnalyticsId ? (
        <GoogleAnalytics measurementId={config.googleAnalyticsId} />
      ) : null}
      {config.vercelAnalytics ? (
        <Analytics
          beforeSend={(event) => (hasStoredAnalyticsConsent() ? event : null)}
        />
      ) : null}
      {config.vercelSpeedInsights ? (
        <SpeedInsights
          beforeSend={(event) => (hasStoredAnalyticsConsent() ? event : null)}
        />
      ) : null}
    </>
  );
}

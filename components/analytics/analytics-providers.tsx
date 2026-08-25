"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import type { AnalyticsConfiguration } from "@/lib/analytics/config";
import { hasStoredAnalyticsConsent } from "@/lib/analytics/consent";
import {
  DENIED_GOOGLE_CONSENT,
  disableGoogleAnalytics,
  googleAnalyticsWindow,
  GRANTED_ANALYTICS_CONSENT,
} from "@/lib/analytics/google-consent";

export { disableGoogleAnalytics } from "@/lib/analytics/google-consent";

const GOOGLE_COOKIE_MAX_AGE_SECONDS = 180 * 24 * 60 * 60;

function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    const runtimeWindow = googleAnalyticsWindow();
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

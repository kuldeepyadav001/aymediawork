import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/consent-fixture",
}));

vi.mock("next/script", () => ({
  default: () => null,
}));

import {
  AnalyticsProviders,
  disableGoogleAnalytics,
} from "@/components/analytics/analytics-providers";

afterEach(() => {
  cleanup();
  document.cookie = "_ga=; Max-Age=0; path=/";
  document.cookie = "_ga_TEST1234=; Max-Age=0; path=/";
  document.cookie = "essential_cookie=; Max-Age=0; path=/";
  delete window.gtag;
  delete window.dataLayer;
  delete (window as unknown as Record<string, unknown>)[
    "ga-disable-G-TEST1234"
  ];
});

describe("Google Analytics consent state", () => {
  it("queues denied defaults followed by an analytics-only grant", async () => {
    render(
      <AnalyticsProviders
        config={{
          googleAnalyticsId: "G-TEST1234",
          vercelAnalytics: false,
          vercelSpeedInsights: false,
        }}
      />,
    );

    await waitFor(() => expect(window.gtag).toBeTypeOf("function"));

    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        [
          "consent",
          "default",
          {
            ad_personalization: "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            analytics_storage: "denied",
          },
        ],
        [
          "consent",
          "update",
          {
            ad_personalization: "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            analytics_storage: "granted",
          },
        ],
      ]),
    );
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        [
          "config",
          "G-TEST1234",
          expect.objectContaining({
            allow_ad_personalization_signals: false,
            allow_google_signals: false,
            send_page_view: false,
          }),
        ],
        [
          "event",
          "page_view",
          expect.objectContaining({ page_path: "/consent-fixture" }),
        ],
      ]),
    );
  });

  it("sets the disable flag, denies all consent types, and removes accessible GA cookies", () => {
    document.cookie = "_ga=fixture; path=/";
    document.cookie = "_ga_TEST1234=fixture; path=/";
    document.cookie = "essential_cookie=retained; path=/";
    window.gtag = vi.fn();

    disableGoogleAnalytics("G-TEST1234");

    expect(
      (window as unknown as Record<string, unknown>)["ga-disable-G-TEST1234"],
    ).toBe(true);
    expect(window.gtag).toHaveBeenCalledWith("consent", "update", {
      ad_personalization: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      analytics_storage: "denied",
    });
    expect(document.cookie).not.toContain("_ga=");
    expect(document.cookie).not.toContain("_ga_TEST1234=");
    expect(document.cookie).toContain("essential_cookie=retained");
  });
});

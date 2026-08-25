import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

const providerMocks = vi.hoisted(() => ({
  disableGoogleAnalytics: vi.fn(),
}));

vi.mock("@/components/analytics/analytics-providers", () => ({
  AnalyticsProviders: () => <div data-testid="analytics-providers" />,
}));

vi.mock("@/lib/analytics/google-consent", () => ({
  disableGoogleAnalytics: providerMocks.disableGoogleAnalytics,
}));

import { AnalyticsConsentManager } from "@/components/privacy/analytics-consent-manager";
import {
  getAnalyticsConfiguration,
  getConfiguredProviderNames,
  hasConfiguredAnalytics,
} from "@/lib/analytics/config";
import {
  ANALYTICS_CONSENT_MAX_AGE_DAYS,
  ANALYTICS_CONSENT_STORAGE_KEY,
  ANALYTICS_CONSENT_VERSION,
  createConsentPreference,
  OPEN_ANALYTICS_PREFERENCES_EVENT,
  parseConsentPreference,
  persistConsentPreference,
  readConsentPreference,
} from "@/lib/analytics/consent";

const configuredAnalytics = {
  googleAnalyticsId: "G-TEST1234",
  vercelAnalytics: true,
  vercelSpeedInsights: true,
} as const;
const now = new Date("2026-08-25T12:00:00.000Z");

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("analytics configuration", () => {
  it("enables only explicit, valid public provider settings", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", " g-abcd1234 ");
    vi.stubEnv("NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED", " TRUE ");
    vi.stubEnv("NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ENABLED", "false");

    const config = getAnalyticsConfiguration();

    expect(config).toEqual({
      googleAnalyticsId: "G-ABCD1234",
      vercelAnalytics: true,
      vercelSpeedInsights: false,
    });
    expect(hasConfiguredAnalytics(config)).toBe(true);
    expect(getConfiguredProviderNames(config)).toEqual([
      "Google Analytics",
      "Vercel Web Analytics",
    ]);
  });

  it("fails closed when IDs and feature flags are absent or invalid", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "UA-legacy-id");
    vi.stubEnv("NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED", "1");
    vi.stubEnv("NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ENABLED", "yes");

    const config = getAnalyticsConfiguration();

    expect(config).toEqual({
      vercelAnalytics: false,
      vercelSpeedInsights: false,
    });
    expect(hasConfiguredAnalytics(config)).toBe(false);
    expect(getConfiguredProviderNames(config)).toEqual([]);
  });
});

describe("versioned analytics consent", () => {
  it("round-trips a current preference and rejects malformed records", () => {
    const preference = createConsentPreference(true, now);

    expect(
      parseConsentPreference(JSON.stringify(preference), now.getTime()),
    ).toEqual(preference);
    expect(parseConsentPreference("not-json", now.getTime())).toBeNull();
    expect(
      parseConsentPreference(
        JSON.stringify({ ...preference, analytics: "yes" }),
        now.getTime(),
      ),
    ).toBeNull();
    expect(
      parseConsentPreference(
        JSON.stringify({
          ...preference,
          version: ANALYTICS_CONSENT_VERSION + 1,
        }),
        now.getTime(),
      ),
    ).toBeNull();
    expect(
      parseConsentPreference(
        JSON.stringify({ ...preference, updatedAt: "2026-08-25" }),
        now.getTime(),
      ),
    ).toBeNull();
  });

  it("rejects expired and materially future-dated consent", () => {
    const expired = createConsentPreference(
      true,
      new Date(
        now.getTime() -
          (ANALYTICS_CONSENT_MAX_AGE_DAYS + 1) * 24 * 60 * 60 * 1000,
      ),
    );
    const future = createConsentPreference(
      true,
      new Date(now.getTime() + 6 * 60 * 1000),
    );

    expect(
      parseConsentPreference(JSON.stringify(expired), now.getTime()),
    ).toBeNull();
    expect(
      parseConsentPreference(JSON.stringify(future), now.getTime()),
    ).toBeNull();
  });

  it("removes an invalid stored record and fails closed when storage is unavailable", () => {
    window.localStorage.setItem(
      ANALYTICS_CONSENT_STORAGE_KEY,
      "expired-or-invalid",
    );
    expect(readConsentPreference()).toBeNull();
    expect(
      window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY),
    ).toBeNull();

    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    expect(persistConsentPreference(createConsentPreference(true, now))).toBe(
      false,
    );
  });
});

describe("analytics consent controls", () => {
  it("does not mount optional providers until the visitor opts in", async () => {
    const user = userEvent.setup();
    render(<AnalyticsConsentManager config={configuredAnalytics} />);

    expect(screen.queryByTestId("analytics-providers")).not.toBeInTheDocument();
    await screen.findByRole("region", { name: "Analytics consent" });

    await user.click(screen.getByRole("button", { name: "Accept analytics" }));

    expect(
      await screen.findByTestId("analytics-providers"),
    ).toBeInTheDocument();
    expect(
      parseConsentPreference(
        window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY),
      )?.analytics,
    ).toBe(true);
  });

  it("allows consent to be withdrawn from the persistent preference dialog", async () => {
    window.localStorage.setItem(
      ANALYTICS_CONSENT_STORAGE_KEY,
      JSON.stringify(createConsentPreference(true)),
    );
    const user = userEvent.setup();
    render(<AnalyticsConsentManager config={configuredAnalytics} />);

    expect(
      await screen.findByTestId("analytics-providers"),
    ).toBeInTheDocument();
    window.dispatchEvent(new Event(OPEN_ANALYTICS_PREFERENCES_EVENT));

    const checkbox = await screen.findByRole("checkbox", {
      name: "Analytics and performance",
    });
    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    await user.click(screen.getByRole("button", { name: "Save preferences" }));

    await waitFor(() =>
      expect(
        screen.queryByTestId("analytics-providers"),
      ).not.toBeInTheDocument(),
    );
    expect(providerMocks.disableGoogleAnalytics).toHaveBeenCalledWith(
      "G-TEST1234",
    );
    expect(
      parseConsentPreference(
        window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY),
      )?.analytics,
    ).toBe(false);
  });

  it("shows no consent prompt when no optional provider is configured", async () => {
    render(
      <AnalyticsConsentManager
        config={{ vercelAnalytics: false, vercelSpeedInsights: false }}
      />,
    );

    await waitFor(() =>
      expect(
        screen.queryByRole("region", { name: "Analytics consent" }),
      ).not.toBeInTheDocument(),
    );
    expect(screen.queryByTestId("analytics-providers")).not.toBeInTheDocument();
  });
});

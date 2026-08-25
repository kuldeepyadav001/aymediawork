export const ANALYTICS_CONSENT_STORAGE_KEY = "ay_media_work_consent";
export const ANALYTICS_CONSENT_VERSION = 1;
export const ANALYTICS_CONSENT_MAX_AGE_DAYS = 180;
export const OPEN_ANALYTICS_PREFERENCES_EVENT =
  "ay-media-work:open-analytics-preferences";

const MAX_AGE_MILLISECONDS =
  ANALYTICS_CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
const FUTURE_TOLERANCE_MILLISECONDS = 5 * 60 * 1000;

export type AnalyticsConsentPreference = {
  analytics: boolean;
  updatedAt: string;
  version: typeof ANALYTICS_CONSENT_VERSION;
};

export function createConsentPreference(
  analytics: boolean,
  now = new Date(),
): AnalyticsConsentPreference {
  return {
    analytics,
    updatedAt: now.toISOString(),
    version: ANALYTICS_CONSENT_VERSION,
  };
}

export function parseConsentPreference(
  value: string | null,
  now = Date.now(),
): AnalyticsConsentPreference | null {
  if (!value) return null;

  try {
    const candidate = JSON.parse(value) as Partial<AnalyticsConsentPreference>;
    const updatedAtValue = candidate.updatedAt;
    const updatedAt =
      typeof updatedAtValue === "string"
        ? Date.parse(updatedAtValue)
        : Number.NaN;

    if (
      candidate.version !== ANALYTICS_CONSENT_VERSION ||
      typeof candidate.analytics !== "boolean" ||
      !Number.isFinite(updatedAt) ||
      new Date(updatedAt).toISOString() !== updatedAtValue ||
      updatedAt > now + FUTURE_TOLERANCE_MILLISECONDS ||
      now - updatedAt > MAX_AGE_MILLISECONDS
    ) {
      return null;
    }

    return {
      analytics: candidate.analytics,
      updatedAt: updatedAtValue as string,
      version: ANALYTICS_CONSENT_VERSION,
    };
  } catch {
    return null;
  }
}

export function readConsentPreference() {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    const preference = parseConsentPreference(stored);
    if (!preference && stored) {
      window.localStorage.removeItem(ANALYTICS_CONSENT_STORAGE_KEY);
    }
    return preference;
  } catch {
    return null;
  }
}

export function persistConsentPreference(
  preference: AnalyticsConsentPreference,
) {
  try {
    window.localStorage.setItem(
      ANALYTICS_CONSENT_STORAGE_KEY,
      JSON.stringify(preference),
    );
    return true;
  } catch {
    return false;
  }
}

export function hasStoredAnalyticsConsent() {
  return readConsentPreference()?.analytics === true;
}

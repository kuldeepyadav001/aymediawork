"use client";

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { BarChart3, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getConfiguredProviderNames,
  hasConfiguredAnalytics,
  type AnalyticsConfiguration,
} from "@/lib/analytics/config";
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  createConsentPreference,
  OPEN_ANALYTICS_PREFERENCES_EVENT,
  parseConsentPreference,
  persistConsentPreference,
  readConsentPreference,
  type AnalyticsConsentPreference,
} from "@/lib/analytics/consent";
import { disableGoogleAnalytics } from "@/lib/analytics/google-consent";

const AnalyticsProviders = lazy(() =>
  import("@/components/analytics/analytics-providers").then((module) => ({
    default: module.AnalyticsProviders,
  })),
);

export function AnalyticsConsentManager({
  config,
}: {
  config: AnalyticsConfiguration;
}) {
  const [preference, setPreference] =
    useState<AnalyticsConsentPreference | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [draftAnalytics, setDraftAnalytics] = useState(false);
  const analyticsConfigured = hasConfiguredAnalytics(config);
  const providerNames = useMemo(
    () => getConfiguredProviderNames(config),
    [config],
  );

  useEffect(() => {
    const initialization = window.setTimeout(() => {
      const storedPreference = readConsentPreference();
      setPreference(storedPreference);
      setDraftAnalytics(storedPreference?.analytics ?? false);
      setIsReady(true);
    }, 0);
    return () => window.clearTimeout(initialization);
  }, []);

  useEffect(() => {
    const openPreferences = () => {
      setDraftAnalytics(preference?.analytics ?? false);
      setPreferencesOpen(true);
    };
    window.addEventListener(OPEN_ANALYTICS_PREFERENCES_EVENT, openPreferences);
    return () =>
      window.removeEventListener(
        OPEN_ANALYTICS_PREFERENCES_EVENT,
        openPreferences,
      );
  }, [preference]);

  useEffect(() => {
    const applyPreference = (
      nextPreference: AnalyticsConsentPreference | null,
    ) => {
      setPreference(nextPreference);
      setDraftAnalytics(nextPreference?.analytics ?? false);
      if (!nextPreference?.analytics) {
        disableGoogleAnalytics(config.googleAnalyticsId);
      }
    };
    const syncPreference = (event: StorageEvent) => {
      if (event.key !== ANALYTICS_CONSENT_STORAGE_KEY) return;
      applyPreference(parseConsentPreference(event.newValue));
    };
    const refreshPreference = () => applyPreference(readConsentPreference());
    const refreshVisiblePreference = () => {
      if (document.visibilityState === "visible") refreshPreference();
    };
    const refreshInterval = window.setInterval(
      refreshPreference,
      60 * 60 * 1000,
    );

    window.addEventListener("focus", refreshPreference);
    window.addEventListener("storage", syncPreference);
    document.addEventListener("visibilitychange", refreshVisiblePreference);
    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener("focus", refreshPreference);
      window.removeEventListener("storage", syncPreference);
      document.removeEventListener(
        "visibilitychange",
        refreshVisiblePreference,
      );
    };
  }, [config.googleAnalyticsId]);

  const savePreference = useCallback(
    (analytics: boolean) => {
      const requestedPreference = createConsentPreference(
        analyticsConfigured && analytics,
      );
      const wasPersisted = persistConsentPreference(requestedPreference);
      const effectivePreference = wasPersisted
        ? requestedPreference
        : createConsentPreference(false);
      setPreference(effectivePreference);
      setDraftAnalytics(effectivePreference.analytics);
      setPreferencesOpen(false);
      if (!effectivePreference.analytics) {
        disableGoogleAnalytics(config.googleAnalyticsId);
      }
    },
    [analyticsConfigured, config.googleAnalyticsId],
  );

  const showBanner = isReady && analyticsConfigured && preference === null;
  const analyticsAllowed =
    isReady && analyticsConfigured && preference?.analytics === true;

  return (
    <>
      {analyticsAllowed ? (
        <Suspense fallback={null}>
          <AnalyticsProviders config={config} />
        </Suspense>
      ) : null}

      {showBanner ? (
        <section
          aria-label="Analytics consent"
          className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-5xl rounded-2xl border border-white/[0.12] bg-[hsl(230_34%_5%/0.96)] p-5 shadow-panel backdrop-blur-2xl sm:inset-x-6 sm:bottom-6 sm:p-6"
          data-lenis-prevent
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <BarChart3 aria-hidden="true" className="size-4 text-primary" />
                Your analytics choice
              </p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Optional analytics and performance tools stay off unless you
                accept them. Essential security and form features continue to
                work. Read the{" "}
                <Link
                  className="font-medium text-foreground underline decoration-primary/60 underline-offset-4 hover:text-primary"
                  href="/privacy"
                >
                  Privacy notice
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
              <Button
                onClick={() => savePreference(false)}
                size="sm"
                variant="outline"
              >
                Essential only
              </Button>
              <Button
                onClick={() => {
                  setDraftAnalytics(false);
                  setPreferencesOpen(true);
                }}
                size="sm"
                variant="ghost"
              >
                Manage preferences
              </Button>
              <Button
                onClick={() => savePreference(true)}
                size="sm"
                variant="outline"
              >
                Accept analytics
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
        <DialogContent data-lenis-prevent>
          <DialogHeader>
            <DialogTitle>Analytics preferences</DialogTitle>
            <DialogDescription>
              Choose whether this site may load optional measurement providers.
              You can return here from the footer at any time.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex gap-4 rounded-xl border border-white/[0.09] bg-white/[0.025] p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-foreground">
                <LockKeyhole aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-4">
                  <label
                    className="font-semibold text-foreground"
                    htmlFor="essential-storage"
                  >
                    Essential
                  </label>
                  <input
                    checked
                    className="size-4 accent-primary"
                    disabled
                    id="essential-storage"
                    readOnly
                    type="checkbox"
                  />
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Required for security, form delivery, and remembering this
                  choice. These features cannot be switched off here.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-xl border border-white/[0.09] bg-white/[0.025] p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BarChart3 aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-4">
                  <label
                    className="font-semibold text-foreground"
                    htmlFor="analytics-storage"
                  >
                    Analytics and performance
                  </label>
                  <input
                    checked={analyticsConfigured && draftAnalytics}
                    className="size-4 accent-primary"
                    disabled={!analyticsConfigured}
                    id="analytics-storage"
                    onChange={(event) =>
                      setDraftAnalytics(event.currentTarget.checked)
                    }
                    type="checkbox"
                  />
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {analyticsConfigured
                    ? `Configured providers: ${providerNames.join(", ")}. These tools measure visits and performance only after opt-in.`
                    : "No optional analytics provider is configured for this deployment."}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs leading-6 text-muted-foreground">
            Google advertising storage and signals remain disabled. See the{" "}
            <Link
              className="font-medium text-foreground underline underline-offset-4"
              href="/privacy"
            >
              Privacy notice
            </Link>{" "}
            for provider and retention details.
          </p>

          <DialogFooter>
            <Button onClick={() => setPreferencesOpen(false)} variant="ghost">
              Cancel
            </Button>
            <Button
              onClick={() => savePreference(draftAnalytics)}
              variant="brand"
            >
              Save preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

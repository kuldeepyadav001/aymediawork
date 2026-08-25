export type AnalyticsConfiguration = Readonly<{
  googleAnalyticsId?: string;
  vercelAnalytics: boolean;
  vercelSpeedInsights: boolean;
}>;

export function isGoogleAnalyticsId(value: string | undefined) {
  return /^G-[A-Z0-9]{4,20}$/.test(value?.trim().toUpperCase() ?? "");
}

export function isEnabled(value: string | undefined) {
  return value?.trim().toLowerCase() === "true";
}

export function getAnalyticsConfiguration(): AnalyticsConfiguration {
  const candidate = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const googleAnalyticsId = isGoogleAnalyticsId(candidate)
    ? candidate?.trim().toUpperCase()
    : undefined;

  return {
    ...(googleAnalyticsId ? { googleAnalyticsId } : {}),
    vercelAnalytics: isEnabled(
      process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED,
    ),
    vercelSpeedInsights: isEnabled(
      process.env.NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ENABLED,
    ),
  };
}

export function hasConfiguredAnalytics(config: AnalyticsConfiguration) {
  return Boolean(
    config.googleAnalyticsId ||
    config.vercelAnalytics ||
    config.vercelSpeedInsights,
  );
}

export function getConfiguredProviderNames(config: AnalyticsConfiguration) {
  return [
    ...(config.googleAnalyticsId ? ["Google Analytics"] : []),
    ...(config.vercelAnalytics ? ["Vercel Web Analytics"] : []),
    ...(config.vercelSpeedInsights ? ["Vercel Speed Insights"] : []),
  ];
}

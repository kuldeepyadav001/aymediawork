export class SupabaseConfigurationError extends Error {
  constructor(message = "Supabase is not configured for this environment.") {
    super(message);
    this.name = "SupabaseConfigurationError";
  }
}

export function getSupabasePublicConfig() {
  const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!configuredUrl || !publishableKey) {
    throw new SupabaseConfigurationError();
  }

  try {
    const parsedUrl = new URL(configuredUrl);
    const isHttp =
      parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
    const isOriginOnly =
      parsedUrl.pathname === "/" && !parsedUrl.search && !parsedUrl.hash;

    if (!isHttp || !isOriginOnly || parsedUrl.username || parsedUrl.password) {
      throw new SupabaseConfigurationError();
    }

    return { publishableKey, url: parsedUrl.origin };
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) throw error;
    throw new SupabaseConfigurationError();
  }
}

export function isSupabasePublicConfigured() {
  try {
    getSupabasePublicConfig();
    return true;
  } catch {
    return false;
  }
}

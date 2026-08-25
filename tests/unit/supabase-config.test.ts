import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getSupabasePublicConfig,
  isSupabasePublicConfigured,
  SupabaseConfigurationError,
} from "@/lib/supabase/config";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Supabase public configuration", () => {
  it("normalizes a valid origin and trims the publishable key", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", " https://project.supabase.co/ ");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", " publishable-key ");

    expect(getSupabasePublicConfig()).toEqual({
      publishableKey: "publishable-key",
      url: "https://project.supabase.co",
    });
    expect(isSupabasePublicConfigured()).toBe(true);
  });

  it.each([
    "javascript:alert(1)",
    "https://user:secret@project.supabase.co",
    "https://project.supabase.co/rest/v1",
    "https://project.supabase.co?key=value",
  ])("rejects an unsafe or non-origin URL: %s", (url) => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", url);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable-key");

    expect(() => getSupabasePublicConfig()).toThrow(SupabaseConfigurationError);
    expect(isSupabasePublicConfigured()).toBe(false);
  });

  it("rejects missing and whitespace-only values", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", " ");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", " ");

    expect(() => getSupabasePublicConfig()).toThrow(SupabaseConfigurationError);
    expect(isSupabasePublicConfigured()).toBe(false);
  });
});

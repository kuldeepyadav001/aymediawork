import { afterEach, describe, expect, it, vi } from "vitest";

import { getSiteUrl } from "@/lib/utils/site-url";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getSiteUrl", () => {
  it("prefers the explicitly configured public site URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://aymediawork.example");
    vi.stubEnv(
      "NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL",
      "ay-media-work.vercel.app",
    );

    expect(getSiteUrl().origin).toBe("https://aymediawork.example");
  });

  it("normalizes Vercel's production project domain", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    vi.stubEnv(
      "NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL",
      "ay-media-work.vercel.app",
    );

    expect(getSiteUrl().origin).toBe("https://ay-media-work.vercel.app");
  });

  it("uses localhost when no deployment URL is available", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    vi.stubEnv("NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL", undefined);
    vi.stubEnv("NEXT_PUBLIC_VERCEL_URL", undefined);

    expect(getSiteUrl().origin).toBe("http://localhost:3000");
  });
});

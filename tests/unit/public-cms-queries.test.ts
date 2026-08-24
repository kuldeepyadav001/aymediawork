import { readFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const publicClientMocks = vi.hoisted(() => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/supabase/public", () => ({
  createSupabasePublicClient: publicClientMocks.createClient,
}));

import { SERVICE_CATALOG } from "@/lib/constants/services";
import {
  getPublicSiteProfile,
  getPublishedClientLogos,
  getPublishedServices,
} from "@/lib/supabase/queries/public";

type QueryResult = {
  data: unknown[] | null;
  error: { message: string } | null;
};

function query(result: QueryResult) {
  const builder: Record<string, unknown> & PromiseLike<QueryResult> = {
    then(onFulfilled, onRejected) {
      return Promise.resolve(result).then(onFulfilled, onRejected);
    },
  };

  for (const method of ["eq", "not", "order", "select"]) {
    builder[method] = vi.fn(() => builder);
  }

  return builder;
}

function useResults(results: Record<string, QueryResult>) {
  publicClientMocks.createClient.mockReturnValue({
    from: vi.fn((table: string) =>
      query(
        results[table] ?? {
          data: [],
          error: null,
        },
      ),
    ),
  });
}

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "test-publishable-key");
  useResults({});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("public CMS queries", () => {
  it("uses explicit public projections instead of wildcard table reads", () => {
    const source = readFileSync(
      join(process.cwd(), "lib/supabase/queries/public.ts"),
      "utf8",
    );

    expect(source).not.toMatch(/\.select\(["'`]\*["'`]\)/);
    expect(source).toContain("PUBLIC_PROJECT_COLUMNS");
    expect(source).toContain("PUBLIC_BLOG_COLUMNS");
    expect(source).toContain("PUBLIC_TESTIMONIAL_COLUMNS");
    expect(source).toContain("PUBLIC_CLIENT_LOGO_COLUMNS");
    expect(source).toContain('.order("featured", { ascending: false })');
  });

  it("preserves a successful empty CMS response instead of restoring defaults", async () => {
    useResults({ services: { data: [], error: null } });

    await expect(getPublishedServices()).resolves.toEqual([]);
  });

  it("uses provisional content only when Supabase is unavailable or fails", async () => {
    useResults({
      services: { data: null, error: { message: "database unavailable" } },
    });
    await expect(getPublishedServices()).resolves.toEqual(SERVICE_CATALOG);

    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    publicClientMocks.createClient.mockClear();
    await expect(getPublishedServices()).resolves.toEqual(SERVICE_CATALOG);
    expect(publicClientMocks.createClient).not.toHaveBeenCalled();
  });

  it("maps database service content into the public catalog contract", async () => {
    useResults({
      services: {
        data: [
          {
            approach: [{ description: "Review and refine.", title: "Review" }],
            description: "Database description",
            disciplines: ["Planning", "Delivery"],
            hero_title: "Database hero",
            id: "408a3e11-847d-49dc-b9e4-1eafbf927f04",
            image_alt: "Abstract test artwork",
            image_path: "/images/services/test-service.jpg",
            is_active: true,
            meta_description: "Database metadata",
            related_slugs: ["video-editing"],
            slug: "database-service",
            sort_order: 12,
            title: "Database Service",
            useful_for: ["Launches"],
          },
        ],
        error: null,
      },
    });

    await expect(getPublishedServices()).resolves.toEqual([
      expect.objectContaining({
        disciplines: ["Planning", "Delivery"],
        index: "12",
        slug: "database-service",
        title: "Database Service",
      }),
    ]);
  });

  it("drops unsafe client-logo destinations while retaining the logo", async () => {
    useResults({
      client_logos: {
        data: [
          {
            destination_url: "javascript:alert(1)",
            id: "a584411c-0df9-4c3f-8d89-fd1d81b57d40",
            image_alt: "Approved client mark",
            image_path: "/images/clients/example.png",
            name: "Example",
          },
          {
            destination_url: "HTTP://example.com/work",
            id: "d1dfaeb5-f298-42d8-85ef-39410e233ad2",
            image_alt: "Second approved client mark",
            image_path: "/images/clients/second.png",
            name: "Second",
          },
          {
            destination_url: "https://user:secret@example.com/work",
            id: "9a6d51ac-ed45-44c0-a1bb-5f3909c4340e",
            image_alt: "Third approved client mark",
            image_path: "/images/clients/third.png",
            name: "Third",
          },
        ],
        error: null,
      },
    });

    const logos = await getPublishedClientLogos();
    expect(logos[0]).not.toHaveProperty("destinationUrl");
    expect(logos[1]?.destinationUrl).toBe("http://example.com/work");
    expect(logos[2]).not.toHaveProperty("destinationUrl");
  });

  it("keeps a successful empty settings response empty", async () => {
    useResults({ site_settings: { data: [], error: null } });

    await expect(getPublicSiteProfile()).resolves.toEqual({
      brandLine: "",
      socialLinks: [],
    });
  });
});

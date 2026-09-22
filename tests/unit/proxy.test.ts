import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BLOG_SLUGS } from "@/lib/constants/blog-slugs";
import { SERVICE_SLUGS } from "@/lib/constants/service-slugs";
import { WORK_SLUGS } from "@/lib/constants/work-slugs";
import { proxy } from "@/proxy";

function request(pathname: string) {
  return new NextRequest(`https://aymediawork.example${pathname}`);
}

afterEach(() => {
  vi.unstubAllEnvs();
});

async function expectAllowed(pathname: string) {
  const response = await proxy(request(pathname));
  expect(response.status).toBe(200);
  expect(response.headers.get("x-middleware-next")).toBe("1");
}

async function expectHardNotFound(pathname: string) {
  const response = await proxy(request(pathname));
  expect(response.status).toBe(404);
  expect(response.headers.get("x-middleware-rewrite")).toBe(
    "https://aymediawork.example/_not-found",
  );
}

describe("admin route boundaries", () => {
  it("allows public authentication pages without Supabase configuration", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");

    await expectAllowed("/admin/login");
    await expectAllowed("/admin/reset-password");
  });

  it("redirects protected pages when Supabase configuration is invalid", async () => {
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_URL",
      "https://user:secret@project.supabase.co",
    );
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable-key");

    const response = await proxy(request("/admin/dashboard?view=recent"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://aymediawork.example/admin/login?next=%2Fadmin%2Fdashboard%3Fview%3Drecent&error=configuration",
    );
  });
});

describe("catalog route boundaries", () => {
  it("allows indexes, seeded slugs, and dynamic CMS detail slugs", async () => {
    await expectAllowed("/blog");
    await expectAllowed("/services");
    await expectAllowed("/work");

    for (const slug of BLOG_SLUGS) {
      await expectAllowed(`/blog/${slug}`);
    }
    for (const slug of SERVICE_SLUGS) {
      await expectAllowed(`/services/${slug}`);
    }
    for (const slug of WORK_SLUGS) {
      await expectAllowed(`/work/${slug}`);
    }

    await expectAllowed("/blog/new-cms-article");
    await expectAllowed("/services/new-cms-service");
    await expectAllowed("/work/new-cms-project");
  });

  it("rewrites nested catalog paths to a hard 404", async () => {
    for (const pathname of [
      "/blog/one-idea-many-outputs/extra",
      "/services/video-editing/extra",
      "/work/signal-in-the-noise/extra",
    ]) {
      await expectHardNotFound(pathname);
    }
  });
});

describe("deployment-host consolidation", () => {
  function vercelRequest(pathname: string) {
    return new NextRequest(`https://aymediawork.vercel.app${pathname}`, {
      headers: { host: "aymediawork.vercel.app" },
    });
  }

  it("permanently redirects public vercel.app pages to the canonical domain", async () => {
    for (const pathname of ["/", "/work", "/services/video-editing"]) {
      const response = await proxy(vercelRequest(pathname));
      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(
        `https://www.aymediawork.site${pathname}`,
      );
    }
  });

  it("keeps the Search Console verification file reachable on deployment hosts", async () => {
    const response = await proxy(vercelRequest("/google3e6201c9227841fc.html"));
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("keeps admin routes reachable on deployment hosts", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    const response = await proxy(vercelRequest("/admin/login"));
    expect(response.status).toBe(200);
  });

  it("never redirects the canonical production host", async () => {
    const response = await proxy(
      new NextRequest("https://www.aymediawork.site/work", {
        headers: { host: "www.aymediawork.site" },
      }),
    );
    expect(response.status).toBe(200);
  });
});

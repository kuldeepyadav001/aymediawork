import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { BLOG_SLUGS } from "@/lib/constants/blog-slugs";
import { SERVICE_SLUGS } from "@/lib/constants/service-slugs";
import { WORK_SLUGS } from "@/lib/constants/work-slugs";
import { proxy } from "@/proxy";

function request(pathname: string) {
  return new NextRequest(`https://aymediawork.example${pathname}`);
}

function expectAllowed(pathname: string) {
  const response = proxy(request(pathname));
  expect(response.status).toBe(200);
  expect(response.headers.get("x-middleware-next")).toBe("1");
}

function expectHardNotFound(pathname: string) {
  const response = proxy(request(pathname));
  expect(response.status).toBe(404);
  expect(response.headers.get("x-middleware-rewrite")).toBe(
    "https://aymediawork.example/_not-found",
  );
}

describe("catalog route boundaries", () => {
  it("allows both indexes and every approved detail slug", () => {
    expectAllowed("/blog");
    expectAllowed("/services");
    expectAllowed("/work");

    for (const slug of BLOG_SLUGS) {
      expectAllowed(`/blog/${slug}`);
    }
    for (const slug of SERVICE_SLUGS) {
      expectAllowed(`/services/${slug}`);
    }
    for (const slug of WORK_SLUGS) {
      expectAllowed(`/work/${slug}`);
    }
  });

  it("rewrites unknown or nested catalog paths to a hard 404", () => {
    for (const pathname of [
      "/blog/not-an-article",
      "/blog/one-idea-many-outputs/extra",
      "/services/not-a-service",
      "/services/video-editing/extra",
      "/work/not-a-study",
      "/work/signal-in-the-noise/extra",
    ]) {
      expectHardNotFound(pathname);
    }
  });
});

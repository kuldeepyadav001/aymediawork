import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { SERVICE_SLUGS } from "@/lib/constants/service-slugs";
import { proxy } from "@/proxy";

function request(pathname: string) {
  return new NextRequest(`https://aymediawork.example${pathname}`);
}

describe("services route boundary", () => {
  it("allows the services index and every current service slug", () => {
    expect(proxy(request("/services")).headers.get("x-middleware-next")).toBe(
      "1",
    );

    for (const slug of SERVICE_SLUGS) {
      const response = proxy(request(`/services/${slug}`));
      expect(response.status).toBe(200);
      expect(response.headers.get("x-middleware-next")).toBe("1");
    }
  });

  it("rewrites unknown or nested service paths to a hard 404", () => {
    for (const pathname of [
      "/services/not-a-service",
      "/services/video-editing/extra",
    ]) {
      const response = proxy(request(pathname));
      expect(response.status).toBe(404);
      expect(response.headers.get("x-middleware-rewrite")).toBe(
        "https://aymediawork.example/_not-found",
      );
    }
  });
});

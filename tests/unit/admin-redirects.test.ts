import { describe, expect, it } from "vitest";

import { safeAdminPath } from "@/lib/admin/redirects";

describe("admin redirect destinations", () => {
  it("preserves normalized internal admin paths and query strings", () => {
    expect(safeAdminPath("/admin/projects?status=draft")).toBe(
      "/admin/projects?status=draft",
    );
  });

  it.each([
    "https://evil.example/admin/dashboard",
    "//evil.example/admin/dashboard",
    "/admin/../outside",
    "/admin/%2e%2e/outside",
    "/admin/%252e%252e/outside",
    "/admin/%255coutside",
    "/admin\\evil.example",
    "/outside",
    "not-a-path",
  ])("rejects an unsafe destination: %s", (destination) => {
    expect(safeAdminPath(destination)).toBe("/admin/dashboard");
  });
});

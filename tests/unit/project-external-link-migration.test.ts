import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { externalPlatformLabel } from "@/lib/utils/youtube";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20260826120000_project_external_link.sql",
  ),
  "utf8",
)
  .replace(/\s+/g, " ")
  .toLowerCase();

describe("project external link migration", () => {
  it("runs inside a single transaction", () => {
    expect(migration).toContain(" begin; ");
    expect(migration.trimEnd().endsWith("commit;")).toBe(true);
  });

  it("adds a nullable https-only external_url column", () => {
    expect(migration).toContain(
      "alter table public.projects add column if not exists external_url text",
    );
    expect(migration).toContain("projects_external_url_format");
    expect(migration).toContain("external_url is null");
    expect(migration).toContain("'^https://[^\\s]+$'");
  });

  it("persists external_url through save_admin_project on insert and update", () => {
    expect(migration).toContain("security invoker");
    expect(migration).toContain("nullif(p_project ->> 'external_url', '')");
    expect(migration).toContain(
      "external_url = nullif(p_project ->> 'external_url', '')",
    );
    expect(migration).not.toContain("security definer");
  });
});

describe("external platform label", () => {
  it("recognises common creative platforms", () => {
    expect(
      externalPlatformLabel("https://www.instagram.com/reel/Cxyz123/"),
    ).toBe("Instagram");
    expect(externalPlatformLabel("https://vimeo.com/123456789")).toBe("Vimeo");
    expect(
      externalPlatformLabel("https://www.behance.net/gallery/1234/work"),
    ).toBe("Behance");
  });

  it("falls back to the hostname for unknown platforms and null for invalid values", () => {
    expect(externalPlatformLabel("https://portfolio.example.com/piece")).toBe(
      "portfolio.example.com",
    );
    expect(externalPlatformLabel("not a url")).toBeNull();
    expect(externalPlatformLabel(null)).toBeNull();
    expect(externalPlatformLabel(undefined)).toBeNull();
  });
});

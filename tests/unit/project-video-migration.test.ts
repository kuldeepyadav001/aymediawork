import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20260826090000_project_video_support.sql",
  ),
  "utf8",
)
  .replace(/\s+/g, " ")
  .toLowerCase();

describe("project video support migration", () => {
  it("runs inside a single transaction", () => {
    expect(migration).toContain(" begin; ");
    expect(migration.trimEnd().endsWith("commit;")).toBe(true);
  });

  it("adds a nullable video_url column constrained to YouTube formats", () => {
    expect(migration).toContain(
      "alter table public.projects add column if not exists video_url text",
    );
    expect(migration).toContain("projects_video_url_format");
    expect(migration).toContain("video_url is null");
    expect(migration).toContain("youtube\\.com/watch\\?v=");
    expect(migration).toContain("youtu\\.be/");
  });

  it("keeps save_admin_project security-invoker and writes video_url on insert and update", () => {
    expect(migration).toContain("security invoker");
    expect(migration).toContain("nullif(p_project ->> 'video_url', '')");
    expect(migration).toContain(
      "video_url = nullif(p_project ->> 'video_url', '')",
    );
    expect(migration).not.toContain("security definer");
  });
});

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260901090000_project_gallery.sql"),
  "utf8",
)
  .split("\n")
  .filter((line) => !line.trimStart().startsWith("--"))
  .join(" ")
  .replace(/\s+/g, " ")
  .toLowerCase();

describe("project gallery migration", () => {
  it("runs inside a single transaction", () => {
    expect(migration).toContain(" begin; ");
    expect(migration.trimEnd().endsWith("commit;")).toBe(true);
  });

  it("adds a shape-checked jsonb gallery column with the anon column grant", () => {
    expect(migration).toContain(
      "add column if not exists gallery jsonb not null default '[]'::jsonb",
    );
    expect(migration).toContain("projects_gallery_shape");
    expect(migration).toContain("cms_jsonb_is_string_array(gallery)");
    expect(migration).toContain(
      "grant select (gallery) on public.projects to anon",
    );
  });

  it("persists gallery through save_admin_project on insert and update", () => {
    expect(migration).toContain(
      "coalesce(p_project -> 'gallery', '[]'::jsonb)",
    );
    expect(migration).toContain(
      "gallery = coalesce(p_project -> 'gallery', '[]'::jsonb)",
    );
    expect(migration).toContain("security invoker");
    expect(migration).not.toContain("security definer");
  });
});

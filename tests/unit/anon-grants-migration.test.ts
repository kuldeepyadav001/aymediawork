import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20260826130000_anon_video_external_grants.sql",
  ),
  "utf8",
)
  .replace(/\s+/g, " ")
  .toLowerCase();

describe("anon presentation-column grant migration", () => {
  it("runs inside a single transaction", () => {
    expect(migration).toContain(" begin; ");
    expect(migration.trimEnd().endsWith("commit;")).toBe(true);
  });

  it("grants anon exactly the two presentation columns and nothing broader", () => {
    expect(migration).toContain(
      "grant select (video_url, external_url) on public.projects to anon",
    );
    expect(migration).not.toMatch(/grant select on public\.projects/);
    expect(migration).not.toContain("to authenticated");
    expect(migration).not.toContain("insert");
    expect(migration).not.toContain("update");
    expect(migration).not.toContain("delete");
  });
});

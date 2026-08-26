import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationSource = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20260826110000_move_role_helpers_private.sql",
  ),
  "utf8",
);
const migration = migrationSource
  .split("\n")
  .filter((line) => !line.trimStart().startsWith("--"))
  .join(" ")
  .replace(/\s+/g, " ")
  .toLowerCase();

describe("role helper relocation migration", () => {
  it("runs inside a single transaction", () => {
    expect(migration).toContain(" begin; ");
    expect(migration.trimEnd().endsWith("commit;")).toBe(true);
  });

  it("creates a locked-down internal schema usable by authenticated and service_role", () => {
    expect(migration).toContain("create schema if not exists internal");
    expect(migration).toContain("revoke all on schema internal from public");
    expect(migration).toContain(
      "grant usage on schema internal to authenticated, service_role",
    );
  });

  it("moves all three role helpers out of the exposed public schema", () => {
    expect(migration).toContain(
      "alter function public.current_admin_role() set schema internal",
    );
    expect(migration).toContain(
      "alter function public.is_active_admin() set schema internal",
    );
    expect(migration).toContain(
      "alter function public.has_admin_role(text[]) set schema internal",
    );
  });

  it("recreates dependent helper bodies against the internal schema without weakening them", () => {
    expect(migration).toContain(
      "select internal.current_admin_role() is not null",
    );
    expect(migration).toContain(
      "select coalesce(internal.current_admin_role() = any(allowed_roles), false)",
    );
    const definerCount = (migration.match(/security definer/g) ?? []).length;
    expect(definerCount).toBe(2);
    const searchPathCount = (migration.match(/set search_path = ''/g) ?? [])
      .length;
    expect(searchPathCount).toBe(2);
  });
});

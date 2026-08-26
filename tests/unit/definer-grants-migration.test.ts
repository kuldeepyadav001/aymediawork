import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20260826100000_harden_definer_function_grants.sql",
  ),
  "utf8",
)
  .replace(/\s+/g, " ")
  .toLowerCase();

describe("definer function grant hardening migration", () => {
  it("runs inside a single transaction", () => {
    expect(migration).toContain(" begin; ");
    expect(migration.trimEnd().endsWith("commit;")).toBe(true);
  });

  it("removes every direct-call grant from the trigger functions", () => {
    expect(migration).toContain(
      "revoke all on function public.protect_last_owner() from public, anon, authenticated",
    );
    expect(migration).toContain(
      "revoke all on function public.write_admin_audit_log() from public, anon, authenticated",
    );
    expect(migration).not.toContain("grant execute on function public.protect_last_owner");
    expect(migration).not.toContain(
      "grant execute on function public.write_admin_audit_log",
    );
  });

  it("keeps the RLS helper functions callable by authenticated but not anon", () => {
    for (const helper of [
      "public.current_admin_role()",
      "public.is_active_admin()",
      "public.has_admin_role(text[])",
    ]) {
      expect(migration).toContain(`revoke all on function ${helper} from public, anon`);
      expect(migration).toContain(
        `grant execute on function ${helper} to authenticated, service_role`,
      );
    }
    expect(migration).not.toContain("to anon");
  });
});

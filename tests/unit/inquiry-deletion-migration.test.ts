import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20260825140000_secure_inquiry_deletion.sql",
  ),
  "utf8",
)
  .replace(/\s+/g, " ")
  .toLowerCase();
const contactMigration = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20260824090000_contact_inquiries.sql",
  ),
  "utf8",
)
  .replace(/\s+/g, " ")
  .toLowerCase();

describe("secure inquiry deletion migration", () => {
  it("runs inside a single transaction", () => {
    expect(migration).toContain(" begin; ");
    expect(migration.trimEnd().endsWith("commit;")).toBe(true);
  });

  it("grants deletion only through the senior-admin RLS policy", () => {
    expect(migration).toContain(
      "create policy \"senior admins delete inquiries\" on public.inquiries for delete to authenticated using (public.has_admin_role(array['owner', 'admin']))",
    );
    expect(migration).toContain(
      "grant delete on public.inquiries to authenticated",
    );
    expect(migration).not.toContain("to anon");
    expect(migration).not.toContain("using (true)");
  });

  it("relies on the existing cascade to remove selected-service links", () => {
    expect(contactMigration).toContain(
      "inquiry_id uuid not null references public.inquiries(id) on delete cascade",
    );
  });
});

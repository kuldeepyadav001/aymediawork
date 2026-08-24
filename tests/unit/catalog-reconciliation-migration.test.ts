import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20260825120000_ensure_social_media_marketing_service.sql",
  ),
  "utf8",
);
const sql = migration.replace(/\s+/g, " ").toLowerCase();

describe("Social Media Marketing catalog reconciliation", () => {
  it("is transactional and upserts the stable service record", () => {
    expect(sql).toContain(" begin; ");
    expect(sql.trimEnd().endsWith("commit;")).toBe(true);
    expect(sql).toContain("insert into public.services");
    expect(sql).toContain("on conflict (id) do update");
    expect(sql).toContain("4d9b60c4-145b-4fc8-9195-9005dfe33cbf");
    expect(sql).toContain("social-media-marketing");
  });

  it("supplies every required CMS content field", () => {
    for (const field of [
      "description",
      "hero_title",
      "meta_description",
      "image_path",
      "image_alt",
      "disciplines",
      "useful_for",
      "approach",
      "related_slugs",
    ]) {
      expect(sql).toContain(field);
    }

    expect(sql).toContain("'social media marketing'");
    expect(sql).toContain("true, 8");
  });

  it("preserves the final paid-advertising and CGI catalog order", () => {
    expect(sql).toContain("when 'facebook-and-meta-ads' then 9");
    expect(sql).toContain("when 'cgi-and-vfx' then 10");
  });
});

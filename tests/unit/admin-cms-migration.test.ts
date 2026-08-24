import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/20260825110000_admin_cms.sql",
);
const migration = readFileSync(migrationPath, "utf8");
const sql = migration.replace(/\s+/g, " ").toLowerCase();

describe("Stage 10 admin CMS migration", () => {
  it("is transactional and enables RLS on every Stage 10 data table", () => {
    expect(sql).toContain(" begin; ");
    expect(sql.indexOf("begin;")).toBeLessThan(sql.indexOf("create table"));
    expect(sql.trimEnd().endsWith("commit;")).toBe(true);

    for (const table of [
      "admin_profiles",
      "projects",
      "project_services",
      "blog_posts",
      "blog_post_services",
      "testimonials",
      "client_logos",
      "site_settings",
      "media_assets",
      "admin_audit_logs",
    ]) {
      expect(sql).toContain(
        `alter table public.${table} enable row level security;`,
      );
    }
  });

  it("keeps editor permissions consistent across drafts and operations screens", () => {
    expect(sql).toContain(
      "public.current_admin_role() = 'editor' and status = 'draft'",
    );
    expect(sql).toContain(
      'create policy "admins read inquiries" on public.inquiries for select to authenticated using (public.is_active_admin())',
    );
    expect(sql).toContain(
      'create policy "admins read subscribers" on public.newsletter_subscribers for select to authenticated using (public.is_active_admin())',
    );
    expect(sql).toContain(
      'create policy "admins read audit history" on public.admin_audit_logs for select to authenticated using (public.is_active_admin())',
    );
    expect(sql).toContain(
      'create policy "admins read profiles" on public.admin_profiles for select to authenticated using (public.is_active_admin())',
    );
  });

  it("keeps owner-only user management and senior-only destructive actions", () => {
    expect(sql).toContain(
      "create policy \"owners create profiles\" on public.admin_profiles for insert to authenticated with check (public.current_admin_role() = 'owner')",
    );
    expect(sql).toContain(
      "using (public.has_admin_role(array['owner', 'admin']))",
    );
    expect(sql).toContain(
      "the final active owner cannot be removed or suspended",
    );
  });

  it("registers invited profiles and audit entries atomically for service-role callers", () => {
    expect(sql).toContain(
      "create or replace function public.register_admin_invitation(",
    );
    const start = sql.indexOf(
      "create or replace function public.register_admin_invitation(",
    );
    const body = sql.slice(start, sql.indexOf("$$;", start) + 3);
    expect(body).toContain("security definer");
    expect(body).toContain("insert into public.admin_profiles");
    expect(body).toContain("insert into public.admin_audit_logs");
    expect(sql).toContain(
      "grant execute on function public.register_admin_invitation(uuid, text, text, uuid) to service_role;",
    );
  });

  it("saves projects and blog relationships through atomic invoker RPCs", () => {
    for (const routine of ["save_admin_project", "save_admin_blog_post"]) {
      expect(sql).toContain(`create or replace function public.${routine}(`);
      const start = sql.indexOf(
        `create or replace function public.${routine}(`,
      );
      const body = sql.slice(start, sql.indexOf("$$;", start) + 3);
      expect(body).toContain("security invoker");
      expect(body).toContain("delete from public.");
      expect(body).toContain("insert into public.");
      expect(sql).toContain(
        `grant execute on function public.${routine}(jsonb, uuid[]) to authenticated, service_role;`,
      );
    }
  });

  it("initializes publication timestamps on inserts and updates", () => {
    expect(sql).toContain("if tg_op = 'insert'");
    expect(sql).toContain(
      "before insert or update on public.projects for each row execute function public.set_publication_timestamp()",
    );
    expect(sql).toContain(
      "before insert or update on public.blog_posts for each row execute function public.set_publication_timestamp()",
    );
  });

  it("restricts storage writes by bucket, MIME, size, role, and user folder", () => {
    expect(sql).toContain("'admin-media', 'admin-media', true, 10485760");
    for (const mime of [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ]) {
      expect(sql).toContain(`'${mime}'`);
    }
    expect(sql).toContain("(storage.foldername(name))[1] = auth.uid()::text");
    expect(sql).toContain("and path like auth.uid()::text || '/%'");
    expect(sql).toContain("public.has_admin_role(array['owner', 'admin'])");
    expect(sql).toContain(
      'create policy "active admins read cms media" on storage.objects for select',
    );
    expect(sql).toContain("and not exists ( select 1 from public.media_assets");
  });

  it("prevents admins from resubscribing someone without fresh consent", () => {
    expect(sql).toContain(
      "old.status = 'unsubscribed' and new.status = 'subscribed'",
    );
    expect(sql).toContain(
      "before update on public.newsletter_subscribers for each row execute function public.protect_newsletter_consent()",
    );
  });

  it("enforces structured JSON shapes at the database boundary", () => {
    expect(sql).toContain("cms_jsonb_is_string_array");
    expect(sql).toContain("cms_jsonb_is_approach_array");
    expect(sql).toContain("cms_jsonb_is_palette_array");
    expect(sql).toContain("services_approach_shape");
    expect(sql).toContain("projects_palette_shape");
    expect(sql).toContain("blog_posts_takeaways_shape");
  });

  it("separates anonymous publication reads from active-admin reads", () => {
    for (const [table, publicPolicy, adminPolicy] of [
      [
        "services",
        "public reads published services",
        "active admins read services",
      ],
      [
        "projects",
        "public reads published projects",
        "active admins read projects",
      ],
      [
        "blog_posts",
        "public reads published blog posts",
        "active admins read blog posts",
      ],
      [
        "testimonials",
        "public reads approved testimonials",
        "active admins read testimonials",
      ],
      [
        "client_logos",
        "public reads approved client logos",
        "active admins read client logos",
      ],
    ]) {
      expect(sql).toContain(
        `create policy "${publicPolicy}" on public.${table} for select to anon`,
      );
      expect(sql).toContain(
        `create policy "${adminPolicy}" on public.${table} for select to authenticated using (public.is_active_admin())`,
      );
    }
    expect(sql).toContain(
      'create policy "public reads project relationships" on public.project_services for select to anon',
    );
    expect(sql).toContain(
      'create policy "public reads blog relationships" on public.blog_post_services for select to anon',
    );
    expect(sql).toContain(
      'create policy "public reads public settings" on public.site_settings for select to anon using (is_public is true)',
    );
    expect(sql).not.toContain("for select to anon, authenticated");
  });

  it("limits anonymous API access to explicit public content columns", () => {
    expect(sql).toContain(
      "revoke select on public.services, public.projects, public.project_services",
    );
    expect(sql).toContain(
      "grant select ( id, slug, title, sort_order, description, hero_title, meta_description",
    );
    expect(sql).toContain(
      "grant select ( id, slug, title, sort_order, featured, category, format_label, description",
    );
    expect(sql).toContain(
      "grant select (key, value) on public.site_settings to anon",
    );
    expect(sql).not.toContain("grant select on public.services to anon");
    expect(sql).not.toContain(
      "public.testimonials, public.client_logos, public.site_settings to anon",
    );
  });

  it("contains the complete stable seed catalog", () => {
    expect(migration.match(/update public\.services/g)).toHaveLength(10);
    expect(
      migration.match(/insert into public\.projects \(id, slug/g),
    ).toHaveLength(6);
    expect(
      migration.match(/insert into public\.blog_posts \(id, slug/g),
    ).toHaveLength(4);
    expect(sql).toContain("4d9b60c4-145b-4fc8-9195-9005dfe33cbf");
    expect(sql).toContain("social-media-marketing");
  });
});

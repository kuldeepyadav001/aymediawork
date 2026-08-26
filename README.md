# AY Media Work

Production website and content management platform for AY Media Work, a creative media agency serving brands, businesses, and creators.

**Live site:** https://www.aymediawork.site

## Project status

**Launched — production live, maintenance and content phase.**

All twelve delivery stages are complete and deployed: the public website, secure inquiry and newsletter pipeline (Cloudflare Turnstile, honeypot, rate limiting, Resend notifications), the role-aware Supabase CMS with protected administration, SEO/structured data/legal routes, consent-gated analytics, and the performance-budgeted production build. Post-launch additions include secure inquiry/subscriber deletion, YouTube playback and external platform links on work entries, related work on service pages, and the verified studio track-record modules.

Content is owner-managed through `/admin` (services, work, blog, testimonials, client logos, media, inquiries, users, settings). Provisional concept content is replaced progressively with verified business content under [`docs/REAL_CONTENT_REPLACEMENT.md`](docs/REAL_CONTENT_REPLACEMENT.md).

## Compatibility baseline

| Tool         | Pinned version |
| ------------ | -------------- |
| Node.js      | 22.23.2        |
| npm          | 10.9.8         |
| Next.js      | 16.3.2         |
| React        | 19.2.8         |
| TypeScript   | 5.9.3          |
| Tailwind CSS | 3.4.19         |

Next.js 16 replaces the originally proposed Next.js 15 baseline because the latest available 15.x release contained unresolved high-severity transitive dependency advisories. All direct dependencies and the complete transitive dependency graph are pinned by `package.json` and `package-lock.json`.

## Local setup

### Requirements

- Node.js `22.23.2` (use `.nvmrc` or `.node-version`)
- npm `10.x`

### Install and run

```bash
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Public presentation routes can render locally without real credentials (code-level fallback content is served when Supabase is not configured). Persisted form submissions and the admin CMS require the provider configuration documented in [`DEPLOYMENT.md`](DEPLOYMENT.md). Never commit `.env.local` or any secret-bearing file.

## Quality commands

```bash
npm run format:check  # Verify formatting
npm run lint          # ESLint and Next.js rules
npm run typecheck     # Strict TypeScript check
npm run test               # Unit and interaction-oriented component tests
npm run build              # Production build
npm run performance:check  # Enforce budgets against the production build
npm run validate           # Formatting, lint, types, tests, build, and budgets
npm run runtime:check      # Audit a running production build/origin
npm audit --audit-level=high
```

`runtime:check` targets `http://localhost:3000` by default. Set `RUNTIME_AUDIT_BASE_URL` to audit an approved preview or production origin. A Husky pre-commit hook runs lint-staged checks. GitHub Actions runs the complete quality gate for pull requests and pushes to `main`.

## Architecture at a glance

- **Framework:** Next.js App Router; static generation with on-demand revalidation from CMS saves.
- **Data:** Supabase Postgres behind row-level security with column-scoped anonymous grants; all schema changes live as ordered, immutable migrations in `supabase/migrations/`.
- **Auth:** Supabase Auth with an owner/admin/editor role model, one-time first-owner bootstrap, and owner-only invitations.
- **Email:** Resend on a verified sending subdomain; inquiry persistence always precedes notification.
- **Anti-spam:** Cloudflare Turnstile (server-side Siteverify), honeypot, and pseudonymised rate limiting.
- **DNS:** Cloudflare authoritative with DNSSEC; Vercel serves the site directly (records unproxied).

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full picture and [`docs/FINAL_QA_HANDOVER.md`](docs/FINAL_QA_HANDOVER.md) for the operating runbook.

## Operational notes

- Applied database migrations are never edited or re-run; corrections ship as new forward migrations.
- Any new `public.projects` column consumed by the public site must also be added to the anonymous column-level `SELECT` grant, or public queries fail closed to fallback content.
- Content inserted directly through SQL does not trigger page revalidation; finish with one CMS save or a redeploy.
- Real client names, media, quotations, and logos are published only with recorded permission (enforced in the CMS for testimonials and client logos).

## Documentation

| Document                                                               | Purpose                                                 |
| ---------------------------------------------------------------------- | ------------------------------------------------------- |
| [`DEPLOYMENT.md`](DEPLOYMENT.md)                                       | Deployment, environment variables, rollback             |
| [`SECURITY.md`](SECURITY.md)                                           | Security policy and boundaries                          |
| [`docs/ADMIN_CMS.md`](docs/ADMIN_CMS.md)                               | Admin roles, first-owner bootstrap, publishing workflow |
| [`docs/CONTACT_INQUIRIES.md`](docs/CONTACT_INQUIRIES.md)               | Inquiry pipeline, notifications, deletion runbook       |
| [`docs/REAL_CONTENT_REPLACEMENT.md`](docs/REAL_CONTENT_REPLACEMENT.md) | Controlled process for verified business content        |
| [`docs/FINAL_QA_HANDOVER.md`](docs/FINAL_QA_HANDOVER.md)               | QA evidence and operational handover                    |

## License

Proprietary client work — see [`LICENSE`](LICENSE). Not open source; no reuse without written permission.

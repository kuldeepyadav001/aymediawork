# AY Media Work — Production Platform

**Live: [www.aymediawork.site](https://www.aymediawork.site)**

A complete production website + content management platform for AY Media Work, a creative media agency working with entrepreneurs, SaaS products, restaurants, and creators worldwide — built end-to-end as a custom platform, not a template.

> 🎬 **What it runs:** 18 real client projects with on-page video playback · a 10-service catalogue · role-based CMS the agency operates without a developer · secure inquiry pipeline with email notifications · verified 34M+ views track record — all on **₹0/month infrastructure**.

---

## Why this build is different

| Typical freelance website       | This platform                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Template + plugins              | Custom Next.js 16 build, 56 statically-generated pages                                                       |
| Auth checked only in app code   | **Row-Level Security in Postgres** + column-scoped grants — the database itself refuses to leak              |
| "Works on my machine"           | **172 automated tests** + CI quality gate on every push                                                      |
| Slowly bloats over time         | **Performance budgets that fail the build** when an image or bundle gets too heavy                           |
| Developer needed for every edit | Full CMS: projects, blog, testimonials, logos, media, users — with roles, invitations, and an audit trail    |
| SEO = a plugin                  | Engineered in: dynamic sitemap, JSON-LD structured data, canonical URLs, Open Graph, Search Console verified |

## Feature highlights

- **Two-tier portfolio engine** — hero projects get full case-study pages; quick entries need only a title, cover, and link. The page layout adapts to whatever content exists.
- **On-page video playback** — YouTube facade player loads the real iframe only on click; Instagram Reels and live sites get automatic "View on <platform>" buttons.
- **Bulletproof inquiry pipeline** — Cloudflare Turnstile (server-side Siteverify), honeypot, pseudonymised rate limiting; submissions persist to the database _before_ notification, so an email outage can never lose a lead.
- **Authenticated email** — Resend on a dedicated subdomain with SPF, DKIM, and DMARC all passing.
- **Consent-first analytics** — nothing loads until the visitor opts in; privacy and terms routes included.
- **Honest content rules** — no invented stats or testimonials; client names and logos published only with recorded permission (enforced by the CMS).

## Stack

| Layer       | Choice                                                              |
| ----------- | ------------------------------------------------------------------- |
| Framework   | Next.js 16 (App Router) · React 19 · TypeScript (strict)            |
| Styling     | Tailwind CSS · Radix UI primitives                                  |
| Data & Auth | Supabase (Postgres + RLS, Auth, Storage)                            |
| Email       | Resend (SPF/DKIM/DMARC-authenticated subdomain)                     |
| Security    | Cloudflare Turnstile · DNSSEC-signed DNS · CSP-grade headers        |
| Delivery    | Vercel · GitHub Actions CI · Husky + lint-staged                    |
| Testing     | Vitest + Testing Library — 172 tests incl. migration-content checks |

## Engineering discipline

- **Append-only migrations** — 13 versioned SQL migrations; applied once, never edited. Corrections ship as new forward migrations. The schema history reads like a ledger.
- **Least-privilege database access** — anonymous visitors can `SELECT` only the exact columns public pages need; role helpers live outside the API-exposed schema.
- **Quality gate** (`npm run validate`): formatting → zero-warning lint → strict types → 172 tests → production build → performance budgets. CI runs it on every push; a runtime auditor verifies the deployed origin.
- **Zero secrets in the repo** — verified across the entire git history, not just the working tree.
- **Performance as policy** — animation library deleted in favour of native IntersectionObserver (−110 KB JS); every page serves as a CDN hit; images capped per-file and in total.

## Compatibility baseline

| Tool         | Pinned  |
| ------------ | ------- |
| Node.js      | 22.23.2 |
| npm          | 10.9.8  |
| Next.js      | 16.3.2  |
| React        | 19.2.8  |
| TypeScript   | 5.9.3   |
| Tailwind CSS | 3.4.19  |

All direct and transitive dependencies are pinned by `package.json` and `package-lock.json`.

## Local setup

```bash
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Public routes render locally without credentials (code-level fallback content); the CMS and form persistence require the provider configuration in [`DEPLOYMENT.md`](DEPLOYMENT.md). Never commit `.env.local`.

### Quality commands

```bash
npm run validate           # format + lint + types + tests + build + budgets
npm run runtime:check      # audit a running production build/origin
npm audit --audit-level=high
```

## Documentation

| Document                                                 | Purpose                                           |
| -------------------------------------------------------- | ------------------------------------------------- |
| [`DEPLOYMENT.md`](DEPLOYMENT.md)                         | Deployment, environment variables, rollback       |
| [`SECURITY.md`](SECURITY.md)                             | Security policy and boundaries                    |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)           | System architecture                               |
| [`docs/ADMIN_CMS.md`](docs/ADMIN_CMS.md)                 | Roles, publishing workflow, first-owner bootstrap |
| [`docs/CONTACT_INQUIRIES.md`](docs/CONTACT_INQUIRIES.md) | Inquiry pipeline and operations                   |
| [`docs/FINAL_QA_HANDOVER.md`](docs/FINAL_QA_HANDOVER.md) | QA evidence and operational runbook               |

## Built by

**Kuldeep Yadav** — full-stack developer (Next.js · TypeScript · Supabase).
I design, build, secure, test, and hand over complete production platforms.

📩 Open to client work — reach me via [LinkedIn](https://www.linkedin.com/in/kuldeep-yadav-cse28/) or the [contact page](https://www.aymediawork.site/contact).

## License

Proprietary client work — see [`LICENSE`](LICENSE). Public for demonstration purposes; no reuse without written permission.

# AY Media Work

Production website and content management platform for AY Media Work, a creative media agency serving brands, businesses, and creators.

## Project status

**Stage 12 — Final QA, Performance & Handover (release candidate)**

The public website, secure inquiries, role-aware Supabase CMS, and protected administration system through Stage 10 are production-active. The local release candidate completes SEO, structured data, indexing, legal routes, consent-gated analytics, final security and accessibility reconciliation, performance optimization, production budgets, all-route runtime auditing, and the operational handover. It remains subject to explicit owner approval before the final push/deployment.

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

Public presentation routes can render locally without real credentials. Persisted form submissions require the Stage 9 provider configuration. Never commit `.env.local` or any secret-bearing file.

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

## Current structure

```text
app/                     Next.js App Router routes
  (public)/              Public website routes
  admin/(auth)/          Unprotected admin authentication routes
  admin/(protected)/     Protected admin dashboard routes
  api/                   Server endpoints
components/              UI, sections, forms, animation, and admin components
emails/                  Transactional email templates
lib/                     Supabase, validation, constants, hooks, and utilities
public/                  Fonts, images, and optimized video assets
supabase/migrations/     Versioned PostgreSQL migrations
tests/                   Vitest unit and integration-oriented component tests
types/                   Shared TypeScript types
```

The separated admin route groups ensure `/admin/login` remains accessible while dashboard routes receive authentication enforcement.

## Environment variables

`.env.example` documents every supported application variable. Configure values only for the corresponding enabled integration:

- Supabase database, authentication, and storage
- Resend email notifications and Turnstile anti-spam protection
- Consent-aware Google Analytics, Vercel Web Analytics, and Speed Insights
- Vercel preview and production environments

The Supabase project URL and publishable key may be used by browser code when Row Level Security is enabled. Supabase secret keys, email, and anti-spam secrets are server-only.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Homepage content and provenance](docs/HOMEPAGE_CONTENT.md)
- [Services content and provenance](docs/SERVICES_CONTENT.md)
- [Contact, inquiries, and provider setup](docs/CONTACT_INQUIRIES.md)
- [Admin dashboard and CMS operations](docs/ADMIN_CMS.md)
- [SEO, analytics, consent, and legal operations](docs/SEO_ANALYTICS_PRIVACY.md)
- [Final QA, performance, and handover](docs/FINAL_QA_HANDOVER.md)
- [Real-content replacement specification](docs/REAL_CONTENT_REPLACEMENT.md)
- [Work content and provenance](docs/WORK_CONTENT.md)
- [About and testimonials content](docs/ABOUT_TESTIMONIALS_CONTENT.md)
- [Studio Journal content](docs/BLOG_CONTENT.md)
- [Security policy](SECURITY.md)
- [Deployment, verification, and rollback](DEPLOYMENT.md)

## Ownership

This client project is unlicensed and proprietary. Source availability in a public repository does not grant permission to copy, modify, redistribute, or commercially use the code or supplied media.

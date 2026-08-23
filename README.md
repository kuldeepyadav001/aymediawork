# AY Media Work

Production website and content management platform for AY Media Work, a creative media agency serving brands, businesses, and creators.

## Project status

**Stage 1 — Foundation Setup**

The application scaffold, compatibility baseline, quality tooling, route structure, and environment template are configured. Public pages, the design system, Supabase integration, and admin features are implemented in later approved stages.

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

No real credentials are required until the Supabase stage. Never commit `.env.local` or other secret-bearing files.

## Quality commands

```bash
npm run format:check  # Verify formatting
npm run lint          # ESLint and Next.js rules
npm run typecheck     # Strict TypeScript check
npm run test          # Unit tests
npm run build         # Production build
npm run validate      # Run the complete quality gate
```

A Husky pre-commit hook runs lint-staged checks. GitHub Actions runs the complete quality gate for pull requests and pushes to `main`.

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
tests/                   Unit, integration, and end-to-end tests
types/                   Shared TypeScript types
```

The separated admin route groups ensure `/admin/login` remains accessible while dashboard routes receive authentication enforcement.

## Environment variables

`.env.example` documents every planned variable. Values are configured only when their integration stage begins:

- Stage 3: Supabase
- Stage 8: Resend and Turnstile
- Stage 11: Analytics
- Stage 12: Vercel production environment

Public Supabase values may be used by browser code. Service-role, email, anti-spam, and revalidation secrets are server-only.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Security policy](SECURITY.md)
- [Deployment baseline](DEPLOYMENT.md)

## Ownership

This client project is unlicensed and proprietary. Source availability in a public repository does not grant permission to copy, modify, redistribute, or commercially use the code or supplied media.

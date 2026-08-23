# AY Media Work

Production website and content management platform for AY Media Work, a creative media agency serving brands, businesses, and creators.

## Project status

**Stage 4 — Homepage**

The production foundation, shared visual language, public application shell, and cinematic homepage are configured. The homepage introduces AY Media Work with original non-factual copy and visual studies, a nine-service overview, a transparent studio process, separate client and partner conversion paths, responsive art direction, page metadata, and reduced-motion-safe entrance choreography.

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

No real credentials are required for the current public homepage. Never commit `.env.local` or other secret-bearing files.

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

`.env.example` documents every planned variable. Values are configured only when the corresponding integration is implemented:

- Supabase database, authentication, and storage
- Resend email notifications and Turnstile anti-spam protection
- Consent-aware analytics
- Vercel preview and production environments

The Supabase project URL and publishable key may be used by browser code when Row Level Security is enabled. Supabase secret keys, email, anti-spam, and revalidation secrets are server-only.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Homepage content and provenance](docs/HOMEPAGE_CONTENT.md)
- [Security policy](SECURITY.md)
- [Deployment baseline](DEPLOYMENT.md)

## Ownership

This client project is unlicensed and proprietary. Source availability in a public repository does not grant permission to copy, modify, redistribute, or commercially use the code or supplied media.

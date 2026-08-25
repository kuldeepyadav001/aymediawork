# Architecture Baseline

## Application boundaries

- **Public application:** SEO-focused Next.js routes under `app/(public)`.
- **Admin application:** authentication at `app/admin/(auth)` and protected management routes at `app/admin/(protected)`.
- **Server endpoints:** validated handlers under `app/api`; public inquiry and newsletter writes are implemented as same-origin server routes.
- **Data platform:** Supabase PostgreSQL, Auth, and Storage provide the persisted content, inquiry, role, audit, authentication, and media boundaries.
- **Email:** server-only Resend inquiry notifications are decoupled from successful database persistence.
- **Analytics:** optional Google Analytics, Vercel Web Analytics, and Speed Insights providers mount only after a versioned visitor opt-in.
- **Hosting:** Vercel-compatible build and runtime; the client selects the commercial Vercel plan before final handover.

## Route protection correction

A route group does not add a URL segment in Next.js. Placing `login/page.tsx` directly under an `(admin)` group would produce `/login`, not `/admin/login`. Protecting that group layout would also wrap the login page and risk a redirect loop.

The foundation therefore uses:

```text
app/admin/(auth)/login/             -> /admin/login
app/admin/(protected)/dashboard/    -> /admin/dashboard
app/admin/(protected)/projects/     -> /admin/projects
```

Only the `(protected)` layout enforces authentication and role authorization. PostgreSQL RLS and server-action role checks remain the final mutation boundaries.

## Security boundaries

- Secrets are server-only and excluded from Git.
- Client and server input share Zod schemas.
- PostgreSQL Row Level Security remains the final authorization boundary.
- Admin authorization uses protected `admin_profiles` role data and database policies, not editable user metadata.
- Public inquiry/newsletter submissions use same-origin checks, honeypots, Turnstile action and hostname verification, HMAC-pseudonymised identifiers, database rate controls, and server-only Supabase RPCs.
- User-provided Markdown is rendered through a sanitizing pipeline; database content does not execute as MDX.
- Optional analytics providers are absent before consent; malformed, expired, future-dated, or unwritable consent fails closed.
- Admin and API surfaces use page metadata and response headers to prevent indexing.

## Delivery workflow

Each stage is implemented and validated in isolation. A stage branch is shown for review and merged into `main` only after approval. Stage 1 is the exception because it establishes the repository's first `main` commit.

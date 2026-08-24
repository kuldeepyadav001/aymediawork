# Architecture Baseline

## Application boundaries

- **Public application:** SEO-focused Next.js routes under `app/(public)`.
- **Admin application:** authentication at `app/admin/(auth)` and protected management routes at `app/admin/(protected)`.
- **Server endpoints:** validated handlers under `app/api`; public inquiry and newsletter writes are implemented as same-origin server routes.
- **Data platform:** Supabase PostgreSQL is the Stage 9 persistence boundary. Auth and Storage join this boundary in the admin stage.
- **Email:** server-only Resend inquiry notifications are decoupled from successful database persistence.
- **Hosting:** Vercel-compatible build and runtime; the client selects the commercial Vercel plan before production launch.

## Route protection correction

A route group does not add a URL segment in Next.js. Placing `login/page.tsx` directly under an `(admin)` group would produce `/login`, not `/admin/login`. Protecting that group layout would also wrap the login page and risk a redirect loop.

The foundation therefore uses:

```text
app/admin/(auth)/login/             -> /admin/login
app/admin/(protected)/dashboard/    -> /admin/dashboard
app/admin/(protected)/projects/     -> /admin/projects
```

Only the `(protected)` layout will enforce authentication and role authorization.

## Security boundaries

- Secrets are server-only and excluded from Git.
- Client and server input share Zod schemas.
- PostgreSQL Row Level Security remains the final authorization boundary.
- Admin authorization will use protected app metadata or a dedicated role table, not editable user metadata.
- Public inquiry/newsletter submissions use same-origin checks, honeypots, Turnstile action and hostname verification, HMAC-pseudonymised identifiers, database rate controls, and server-only Supabase RPCs.
- User-provided Markdown will be rendered through a sanitizing pipeline; database content will not execute as MDX.

## Delivery workflow

Each stage is implemented and validated in isolation. A stage branch is shown for review and merged into `main` only after approval. Stage 1 is the exception because it establishes the repository's first `main` commit.

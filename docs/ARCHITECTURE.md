# Architecture Baseline

## Application boundaries

- **Public application:** SEO-focused Next.js routes under `app/(public)`.
- **Admin application:** authentication at `app/admin/(auth)` and protected management routes at `app/admin/(protected)`.
- **Server endpoints:** validated handlers under `app/api` for inquiries, revalidation, and generated media.
- **Data platform:** Supabase PostgreSQL, Auth, and Storage, introduced in Stage 3.
- **Email:** server-only Resend integration, introduced in Stage 8.
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
- Client and server input will share Zod schemas.
- PostgreSQL Row Level Security remains the final authorization boundary.
- Admin authorization will use protected app metadata or a dedicated role table, not editable user metadata.
- Public inquiry submission will include server validation, anti-spam verification, and rate controls.
- User-provided Markdown will be rendered through a sanitizing pipeline; database content will not execute as MDX.

## Delivery workflow

Each stage is implemented and validated in isolation. A stage branch is shown for review and merged into `main` only after approval. Stage 1 is the exception because it establishes the repository's first `main` commit.

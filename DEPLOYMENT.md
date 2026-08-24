# Deployment Baseline

Production deployment is completed in Stage 12 after functionality, performance, security, and SEO verification.

## Target

- **Platform:** Vercel, selected by the client
- **Runtime:** Node.js 22.x
- **Build command:** `npm run build`
- **Install command:** `npm ci`
- **Framework:** Next.js

## Production prerequisites

1. Client-approved Vercel plan suitable for commercial production use.
2. Final domain and DNS access.
3. Production Supabase project and server-side secrets.
4. Applied versioned Supabase migrations, including the Stage 9 inquiry schema.
5. Verified Resend sending domain and private notification address.
6. Cloudflare Turnstile widget restricted to the exact production hostname(s).
7. Independent production submission rate-limit secret.
8. Final analytics and consent configuration.
9. Passing `npm run validate` and zero unresolved high/critical audit findings.

Do not place credentials in this document or the repository. Configure them directly in Vercel project settings during the deployment stage.

The Stage 9 migration and exact Supabase, Resend, Turnstile, and Vercel setup sequence are documented in [`docs/CONTACT_INQUIRIES.md`](docs/CONTACT_INQUIRIES.md). The current runtime does not use or require `DATABASE_URL`.

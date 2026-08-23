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
4. Verified Resend sending domain and notification address.
5. Final analytics and consent configuration.
6. Passing `npm run validate` and zero unresolved high/critical audit findings.

Do not place credentials in this document or the repository. Configure them directly in Vercel project settings during the deployment stage.

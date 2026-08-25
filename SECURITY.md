# Security policy

## Reporting a vulnerability

Do not open a public GitHub issue containing exploit details, credentials, personal information, or customer data. Contact the repository owner privately with:

- the affected route, deployment, provider, or component;
- clear reproduction steps;
- expected and actual behavior;
- impact assessment and affected period; and
- a proposed mitigation, if available.

Do not test with destructive requests, real personal data, or access beyond the reporter’s own authorized account.

## Supported code

Security fixes are applied to the current production branch. Dependency or runtime changes must pass:

```bash
npm ci
npm run validate
npm audit --audit-level=high
```

A release also requires `npm run runtime:check` against the built production application and again against the approved production origin.

## Secret handling

- Never commit `.env.local`, API keys, database passwords, access tokens, private keys, provider exports, customer data, or personal inquiry records.
- Browser variables use `NEXT_PUBLIC_` only when intentionally public. A public key or provider ID still must not bypass authorization, Row Level Security, or consent.
- Supabase secret keys and Resend, Turnstile, and submission-rate secrets are server-only.
- Public inquiry and newsletter writes continue through validated same-origin server handlers; never grant public table writes to bypass them.
- Raw visitor network addresses are not persisted for rate limiting; only HMAC-pseudonymised identifiers are stored.
- Inquiry and newsletter records are personal data. Keep access role-restricted, audited, purpose-limited, and available only to approved operational users.
- Optional analytics remains gated behind an explicit valid visitor preference. A provider ID or deployment flag must never bypass the consent manager.
- Keep admin/API noindex headers and crawler rules in place. Indexing controls are defense in depth and do not replace authorization.
- CMS settings contain public presentation values only—never secrets.
- Rotate a credential immediately after suspected or confirmed exposure; update every intended Vercel scope and redeploy.

## Authorization and data boundaries

- The one-time Owner bootstrap is allowlisted in the server environment and refuses activation after an owner exists.
- Later administrators are invited only through `/admin/users`; do not add their emails to Vercel or manually create standalone Supabase Auth users.
- Assign the minimum role required and deactivate access promptly when no longer needed.
- Protected actions re-check the active profile and role server-side. Client UI visibility is not authorization.
- Supabase Row Level Security and restricted RPC/table access remain mandatory even when the application performs server checks.
- Draft CMS records, private inquiries, newsletter records, users, settings, and activity data must not leak through public queries.
- Media paths, URLs, Markdown, form payloads, and relationship IDs remain server-validated.

## Web and abuse controls

The production baseline includes:

- HTTPS plus one-year HSTS in production;
- frame denial, MIME-sniffing protection, strict-origin referrer policy, and restrictive camera/microphone/geolocation policy;
- origin/content-type/request-size/schema checks for public submissions;
- honeypot, Turnstile, and pseudonymous database-backed rate controls;
- persistence before optional Resend notification;
- safe constrained Markdown rendering;
- hard HTTP 404s for unknown public catalogue records;
- optimized-media boundaries restricted to local assets and the configured Supabase public-media bucket;
- audit activity and role-aware administration; and
- consent-time lazy loading for optional analytics.

Do not weaken a control merely to restore a failing provider. Use the documented graceful failure or disable the affected optional integration.

## Security review triggers

Perform a focused review after:

- adding a provider, browser script, webhook, upload type, role, public form field, or data purpose;
- changing authentication, RLS, middleware/proxy, cookies, consent, Markdown, media, or environment scopes;
- changing public contact/legal/retention practices;
- a framework/runtime major upgrade or security advisory;
- a suspected account, key, provider, or personal-data incident.

Review security headers and browser-script policy whenever optional third-party code changes. Header compatibility must be tested against Next.js, Supabase Auth, Turnstile, and explicitly enabled analytics rather than added or loosened blindly.

## Incident response

1. Record the affected deployment/provider and impact without copying personal data into public systems.
2. Contain: roll back code, disable the optional integration, or deactivate the affected user as appropriate.
3. Revoke/rotate exposed credentials in the provider; update Vercel scopes and redeploy.
4. Preserve provider and application audit evidence; follow the owner’s legal/privacy incident process.
5. Deploy a reviewed fix or known-good release and repeat production verification.
6. Privately document root cause and preventive action.

See [`docs/FINAL_QA_HANDOVER.md`](docs/FINAL_QA_HANDOVER.md) for provider-specific response, maintenance, ownership, and recovery. See [`DEPLOYMENT.md`](DEPLOYMENT.md) for release and rollback.

# Security Policy

## Reporting a vulnerability

Do not open a public GitHub issue containing exploit details, credentials, personal information, or customer data. Contact the repository owner privately with:

- the affected route or component;
- clear reproduction steps;
- expected and actual behavior;
- impact assessment; and
- a proposed mitigation, if available.

## Secret handling

- Never commit `.env.local`, API keys, database passwords, access tokens, private keys, or customer data.
- Browser variables must use the `NEXT_PUBLIC_` prefix only when they are intentionally public.
- Supabase secret/service-role credentials and Resend, Turnstile, rate-limit, and revalidation secrets are server-only.
- Public inquiry and newsletter writes must continue through validated same-origin server handlers; never grant public table writes to bypass them.
- Raw visitor network addresses are not persisted for Stage 9 rate limiting; only HMAC-pseudonymised identifiers are stored.
- Inquiry and newsletter records are personal data. Keep production access role-restricted, audited, and limited to approved operational users.
- Optional analytics must remain gated behind an explicit, valid visitor preference. A provider ID or deployment flag must never bypass the consent manager.
- Keep admin and API noindex headers in place; crawler controls are defense in depth and do not replace authorization.
- Rotate a credential immediately if it is accidentally exposed.

## Supported code

Security fixes are applied to the current production branch. Dependency changes must pass the complete `npm run validate` quality gate and `npm audit` before merge.

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
- Supabase service-role credentials and Resend, Turnstile, and revalidation secrets are server-only.
- Rotate a credential immediately if it is accidentally exposed.

## Supported code

Security fixes are applied to the current production branch. Dependency changes must pass the complete `npm run validate` quality gate and `npm audit` before merge.

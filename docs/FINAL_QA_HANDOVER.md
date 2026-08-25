# Final QA, performance, and handover

**Release candidate:** Stages 1–12
**QA date:** 25 August 2026
**Required runtime:** Node.js 22.23.2 / npm 10.9.8
**Launch deadline:** 31 August 2026, 11:59 PM IST

This is the release-candidate evidence and operating runbook. It contains no credentials. Provider secrets remain in the approved Vercel/Supabase/Cloudflare/Resend accounts.

## 1. Release status and approval boundary

- The application is production-ready as a local release candidate after the quality and runtime checks recorded below.
- The live production branch must not be updated from this candidate until the owner explicitly approves the Stage 12 result.
- A deployment is not complete merely because Vercel reports success. The post-deployment checks in section 9 are mandatory.
- Database migrations are versioned, forward-applied operational changes. Do not rerun, edit, or reverse an already-applied production migration during a code rollback.
- Verified real business content may replace provisional content only through [`REAL_CONTENT_REPLACEMENT.md`](REAL_CONTENT_REPLACEMENT.md).

## 2. Final automated evidence

| Gate                         | Result | Evidence                                                             |
| ---------------------------- | ------ | -------------------------------------------------------------------- |
| Formatting                   | PASS   | Prettier checked the repository                                      |
| Static analysis              | PASS   | ESLint completed with zero warnings                                  |
| Type safety                  | PASS   | strict `tsc --noEmit`                                                |
| Tests                        | PASS   | 25 files / 134 tests                                                 |
| Production build             | PASS   | 54 pages generated; compilation and TypeScript passed                |
| Performance budgets          | PASS   | image, CSS, route-JS-reference, and prerendered-HTML budgets         |
| Dependency audit             | PASS   | `npm audit --audit-level=high`: 0 vulnerabilities                    |
| Production runtime audit     | PASS   | 29 public HTML routes, 29 sitemap URLs, and 42 unique internal links |
| Hard missing-record behavior | PASS   | unknown service, work, and blog slugs return HTTP 404                |

Canonical commands:

```bash
npm ci
npm run validate
npm audit --audit-level=high
npm run start -- --hostname 0.0.0.0 --port 3000
npm run runtime:check
```

`npm run validate` already includes formatting, lint, typecheck, tests, build, and the production performance-budget check. `runtime:check` intentionally runs separately because it requires the built application to be listening at `RUNTIME_AUDIT_BASE_URL` (default `http://localhost:3000`).

**Tooling maintenance note:** `npm ci` currently prints the upstream end-of-support notice for ESLint 9.39.5. ESLint 10 is not yet a compatible replacement for this exact Next.js stack because bundled `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` peer ranges stop at ESLint 9. Keep the exact, passing tooling pin until a compatible Next.js lint stack is available; do not suppress peer conflicts with `--force`. ESLint is development-only, and the audited installed graph has zero known vulnerabilities.

## 3. QA coverage reconciliation

| Area                          | What was verified                                                                                                                                                                                                                                                          | Boundary / owner follow-up                                                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Public routes                 | Every sitemap HTML route returned successfully with one H1, title, description, canonical URL, viewport, English language, no accidental noindex, no unpublished contact token, no pre-consent analytics script, and no original full-size `<img>` delivery                | Repeat against the production origin after deployment                                                                            |
| Internal navigation           | 42 unique same-origin links discovered in public HTML returned 2xx/3xx                                                                                                                                                                                                     | Repeat after every route/slug change                                                                                             |
| Services, work, blog          | Approved catalogue/counts, archive/detail behavior, published sitemap entries, related content, and hard 404s for missing records                                                                                                                                          | Slug changes require redirects and a link/sitemap rerun                                                                          |
| Homepage, about, testimonials | Approved content provenance, one-H1 hierarchy, conversion paths, honest concept/empty states                                                                                                                                                                               | Owner must permission all future client-attributed material                                                                      |
| Forms                         | Client/partner fields, no commercial fields, optional unchecked newsletter consent, required inquiry consent, validation, same-origin handling, honeypot, Turnstile boundary, rate controls, persistence-before-notification behavior, and unsupported API-method failures | After deployment, submit controlled client, partner, and newsletter tests using non-sensitive test data                          |
| CMS/admin                     | Auth route separation, protected-route redirects, role validation, first-owner lockout, invitations, CMS schemas, media restrictions, activity logging, inquiry read/status behavior, and public draft filtering                                                           | The owner has already confirmed protected admin access; perform a controlled draft→preview→publish→unpublish cycle after release |
| Indexing/SEO                  | Metadata, canonical URLs, Open Graph, JSON-LD, 29-URL sitemap, robots rules, admin/API noindex, and missing-record 404s                                                                                                                                                    | Submit the production sitemap in the owner’s search console; monitor coverage                                                    |
| Consent/privacy               | Default denial, equal choices, remembered decision, withdrawal and cookie cleanup, lazy provider loading, optional analytics flags, privacy/terms routes                                                                                                                   | Verify network requests in a real production browser for reject, accept, and withdraw paths                                      |
| Security                      | Server-only secret boundary, RLS/service role architecture, origin validation, role checks, security headers, production HSTS, private-route noindex, safe Markdown, media/path validation, audit trail, and dependency graph                                              | Rotate/revoke credentials in provider dashboards; never store them in Git or CMS settings                                        |
| Accessibility                 | Semantic landmarks, skip link, one H1 per public route, labelled controls, focus-visible states, keyboard-oriented components, alt text, reduced-motion fallbacks, and no-JavaScript content visibility                                                                    | Final real-device checks with keyboard, screen reader, zoom, and contrast tooling remain an operational launch check             |
| Responsive behavior           | Existing approved responsive layout, fluid type/spacing, bounded media, mobile navigation, touch-sized controls, and CSS breakpoint/reduced-motion review                                                                                                                  | Final real-device checks at small phone, tablet, laptop, and wide desktop sizes remain an operational launch check               |
| Graceful failure              | Missing-CMS fallback, honest empty states, application errors, 404s, notification failure after persistence, provider-unconfigured states, reduced-motion/no-observer/no-Lenis fallbacks                                                                                   | Exercise provider outages only in a controlled preview or maintenance window—not by disrupting production accounts               |

No browser executable was available in the final sandbox. The release gate therefore combines code inspection, jsdom interaction tests, generated-build inspection, and HTTP production-runtime checks. Real-device/browser and secret-dependent production checks are explicitly retained in the launch checklist rather than claimed as automated.

## 4. Performance result

### 4.1 Changes

- Replaced the general-purpose Motion reveal/stagger runtime with native `IntersectionObserver` plus CSS while preserving the established component API and reduced-motion visibility.
- Removed the `motion` dependency and four transitive packages.
- Moved Lenis behind an idle-time dynamic import; native scroll remains available and reduced-motion users do not load it.
- Moved optional analytics providers behind consent-time lazy loading.
- Kept public imagery on Next.js image optimization with AVIF/WebP support.
- Added enforceable build budgets in `scripts/check-production-budgets.mjs`.

### 4.2 Measurements

- Generated raw JavaScript across the measured all-route asset set: **1,485,874 → 1,375,419 bytes**, a reduction of **110,455 bytes (7.43%)**.
- Optional Lenis chunk: **18,663 raw bytes** and skipped for reduced-motion users.
- Optional analytics-related chunk: **12,834 raw bytes** and loaded only after consent.
- Public images: **32 files / 3,588.4 KiB total**; largest **233.2 KiB** (budget: 300 KiB each / 4 MiB total).
- Generated CSS: **83.2 KiB raw / 15.8 KiB gzip** (budget: 100 KiB / 24 KiB gzip).
- Largest public-route JavaScript reference set: contact at **710.8 KiB raw / 217.1 KiB gzip** (budget: 250 KiB gzip). This is the aggregate set referenced by the build manifests, not a claim that every byte blocks initial rendering.
- Largest prerendered HTML: homepage at **154.4 KiB** (budget: 200 KiB).
- Optimized 640px homepage hero response: **7.9 KiB** in the local production audit.
- Local runtime median: **12 ms**; slowest measured route **`/contact` at 161 ms**. Local timings are regression evidence, not a substitute for production field Web Vitals.

Budget thresholds are committed and run in CI through `npm run validate`. Any intentional increase requires evidence, owner approval, and a reviewed threshold change; do not simply raise a limit to make CI green.

## 5. Operational ownership

| Area                                                  | Primary owner                       | Routine responsibility                                                                    |
| ----------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------- |
| Business facts, claims, logo, real media, permissions | AY Media Work owner                 | Approve source material and retain permission/evidence records                            |
| CMS publishing and inquiry handling                   | Owner / approved editor             | Draft, preview, publish; protect personal data; maintain read/status workflow             |
| Admin users and role changes                          | Owner only                          | Invite through `/admin/users`, grant minimum role, deactivate departures, review activity |
| Vercel deployment, domain, environment scopes         | Technical owner                     | Preview, promote/rollback, verify domains, inspect logs, keep Node/build settings aligned |
| Supabase data, Auth, RLS, backups                     | Technical owner + business owner    | Monitor, back up, audit users, protect secret key, apply only reviewed migrations         |
| Resend and notification mailbox                       | Business/technical owner            | Maintain domain verification, API key, sender, recipient, quotas, and delivery monitoring |
| Turnstile                                             | Technical owner                     | Restrict hostnames, maintain keys, monitor challenge failures                             |
| Privacy/legal/retention                               | Business owner + qualified reviewer | Confirm entity/jurisdiction/contact/retention wording and data-subject request process    |
| Analytics/search                                      | Business owner + technical owner    | Approve provider use, preserve consent, monitor Web Vitals and indexing                   |
| Code/security maintenance                             | Technical maintainer                | Review updates, run quality gate/audit, triage alerts, patch current production branch    |

Subsequent administrators must be invited through `/admin/users`; do not add their addresses to Vercel and do not create standalone Supabase Auth accounts outside the invitation workflow.

## 6. Maintenance schedule

### Every business day while actively receiving leads

- Review unread inquiries and notification failures in `/admin/inquiries`.
- Confirm the notification mailbox is available; database persistence remains the source of truth.
- Review unexpected admin activity and operational alerts.

### Weekly

- Check Vercel deployment/runtime errors, Supabase logs/usage, Resend delivery/quota, and Turnstile behavior.
- Check form success with one controlled non-sensitive submission if monitoring indicates a problem.
- Review drafts, stale content, broken external destinations, and newsletter consent requests.

### Monthly

- Run `npm ci`, `npm run validate`, and `npm audit --audit-level=high` on a clean maintenance branch.
- Review admin users, roles, inactive accounts, media rights, and activity records.
- Review Web Vitals, search coverage, 404s, internal links, quotas, and cost-plan boundaries.
- Confirm backups/restoration options in Supabase match the subscribed plan and business recovery needs.

### Quarterly and after any material provider/content change

- Perform keyboard, zoom, screen-reader, reduced-motion, phone/tablet/desktop, consent-network, and form checks.
- Review privacy/terms, processors, public contact details, retention practice, analytics settings, and content permissions.
- Rotate credentials according to provider policy and immediately after suspected exposure.
- Review dependencies and framework security advisories; do not perform unreviewed major upgrades directly in production.

## 7. Security and incident runbook

1. **Triage:** record time, affected route/provider, symptoms, deployment ID, and impact without copying personal data into tickets or chat.
2. **Contain:** disable the affected integration or roll back code. Deactivate a compromised admin account. Do not weaken RLS, role checks, Turnstile, origin validation, or consent to restore traffic.
3. **Credentials:** revoke/rotate the affected key in its provider, update every intended Vercel environment scope, and redeploy. A variable change does not affect an existing deployment until redeployment.
4. **Data:** preserve provider/audit logs and determine whether personal data was accessed. Follow the business owner’s legal incident process.
5. **Recover:** deploy a reviewed fix or known-good release; run the post-deployment checklist.
6. **Review:** document root cause, affected period, actions, owner, and preventive change privately.

Provider-specific first actions:

- **Supabase secret exposure:** rotate secret key, update Vercel scopes, redeploy, audit Auth/admin activity and data access.
- **Admin account compromise:** deactivate the profile through owner controls, restore mailbox security, review activity, then re-invite if appropriate.
- **Resend key exposure:** revoke key, issue a scoped replacement, review sends/domain state, update and redeploy.
- **Turnstile issue:** verify hostname allowlist and widget/secret pairing; rotate if exposed; keep fail-closed handling.
- **Spam/abuse:** inspect pseudonymous rate records and Turnstile outcomes; do not begin storing raw visitor IP addresses as an ad hoc fix.
- **Analytics consent regression:** disable all analytics flags/ID in affected Vercel scope, redeploy, investigate, and update privacy operations if data was transmitted improperly.

## 8. Backup and recovery boundary

- Application recovery comes from Git history, the committed lockfile, Vercel deployment history, and documented environment-variable names.
- Data recovery is a Supabase/provider responsibility and depends on the selected plan. Confirm backup retention and test restoration with provider-supported procedures; do not claim a backup exists without checking the dashboard.
- Media referenced by CMS records should have an approved source master outside the application in addition to provider storage.
- Secrets are intentionally not recoverable from this repository. Store them in approved owner-controlled password/secret management and rotate rather than sharing copies.
- Audit and inquiry exports contain personal or sensitive operational data. Encrypt, access-restrict, retain only as required, and never commit them.

## 9. Deployment and post-deployment acceptance

The exact release and rollback procedure lives in [`../DEPLOYMENT.md`](../DEPLOYMENT.md). After the approved production deployment:

1. Confirm the expected commit is the Vercel production deployment and all required production variables are present in the Production scope.
2. Run the runtime auditor against the public origin:

   ```bash
   RUNTIME_AUDIT_BASE_URL=https://www.aymediawork.site npm run runtime:check
   ```

3. Check homepage, services/detail, work/detail, blog/detail, about, testimonials, contact, privacy, terms, 404, admin login, protected admin redirect, robots, and sitemap in a real browser.
4. Submit controlled client, partner, and newsletter requests; confirm persistence, independent newsletter consent, notification state, inquiry read/status actions, and private recipient delivery.
5. Sign in as the existing owner; create/edit a draft, preview, publish, unpublish, and confirm the public route/sitemap behavior. Do not use real client claims for this test.
6. Test analytics before choice, reject, accept, withdraw, and revisit. Inspect network/storage as described in `SEO_ANALYTICS_PRIVACY.md`.
7. Verify custom-domain HTTPS/HSTS, social preview, canonical URLs, noindex on admin/API, and unknown-record hard 404s.
8. Check representative phone, tablet, desktop, keyboard, zoom, reduced motion, and screen-reader paths.
9. Record deployment ID, commit, tester, time, results, and any follow-up privately.

If a critical check fails, stop content/admin changes, roll back the code deployment, preserve valid persisted inquiries, and investigate. Do not reverse production migrations blindly.

## 10. Handover document map

- [`../README.md`](../README.md) — repository entry point and command map
- [`../DEPLOYMENT.md`](../DEPLOYMENT.md) — production release, verification, and rollback
- [`../SECURITY.md`](../SECURITY.md) — reporting and security baseline
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — runtime and trust boundaries
- [`CONTACT_INQUIRIES.md`](CONTACT_INQUIRIES.md) — forms, Supabase, Resend, and Turnstile operations
- [`ADMIN_CMS.md`](ADMIN_CMS.md) — authentication, roles, CMS, media, and recovery
- [`SEO_ANALYTICS_PRIVACY.md`](SEO_ANALYTICS_PRIVACY.md) — metadata, indexing, analytics, consent, and legal operations
- [`REAL_CONTENT_REPLACEMENT.md`](REAL_CONTENT_REPLACEMENT.md) — complete verified-content replacement inventory
- remaining `*_CONTENT.md` documents — implemented provisional content provenance and route-specific source notes

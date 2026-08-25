# Deployment, verification, and rollback

## 1. Target

- **Platform:** Vercel with the connected GitHub repository
- **Production branch:** `main`
- **Runtime:** Node.js 22.x (`22.23.2` release baseline)
- **Package manager:** npm 10.x (`10.9.8` release baseline)
- **Install command:** `npm ci`
- **Build command:** `npm run build`
- **Framework preset:** Next.js
- **Production origin:** `https://www.aymediawork.site`

Never put credential values in Git, documentation, issue comments, CMS settings, or chat. Configure secrets directly in the owner-controlled provider/Vercel dashboards.

## 2. Environment checklist

Configure each value in the correct Vercel **Production**, intended **Preview**, and **Development** scope. A changed environment variable applies only after a new deployment.

| Variable                                    | Visibility               | Production requirement                                                                               |
| ------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                      | Browser-visible          | Exact canonical HTTPS origin; no trailing path                                                       |
| `NEXT_PUBLIC_SUPABASE_URL`                  | Browser-visible          | Correct Supabase project URL                                                                         |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`      | Browser-visible          | Publishable key; RLS remains required                                                                |
| `SUPABASE_SECRET_KEY`                       | Server only              | Current privileged secret key; never expose to browser code                                          |
| `ADMIN_BOOTSTRAP_EMAIL`                     | Server only              | Existing first-owner allowlist value; bootstrap RPC is also database-locked after activation         |
| `RESEND_API_KEY`                            | Server only              | Current Resend credential when notifications are enabled                                             |
| `RESEND_FROM_EMAIL`                         | Server only              | Sender on the verified domain                                                                        |
| `INQUIRY_NOTIFICATION_EMAIL`                | Server only              | Approved private monitored recipient                                                                 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`            | Browser-visible          | Site key paired to the exact allowed production hostname                                             |
| `TURNSTILE_SECRET_KEY`                      | Server only              | Matching widget secret                                                                               |
| `SUBMISSION_RATE_LIMIT_SECRET`              | Server only              | Independent high-entropy production secret                                                           |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`             | Browser-visible optional | Valid GA4 ID only when owner-approved; still consent-gated                                           |
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED`      | Browser-visible optional | Exact `true` only when owner-approved                                                                |
| `NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ENABLED` | Browser-visible optional | Exact `true` only when owner-approved                                                                |
| `ALLOWED_DEV_ORIGINS`                       | Development only         | Comma-separated preview hosts only when locally necessary; do not use as a production access control |

The application does not use or require `DATABASE_URL`.

## 3. Provider prerequisites

Before releasing:

1. Vercel project, custom domain, HTTPS, and Git integration are healthy.
2. Versioned Supabase migrations through the CMS catalogue reconciliation are already applied exactly once.
3. The existing Owner can sign in and protected admin routes open.
4. Later administrators are invited only through `/admin/users`.
5. Supabase RLS, Auth redirect URLs, public-media bucket policies, and secret/publishable key pairing are correct.
6. Resend sending domain is verified; sender and private notification recipient are approved.
7. Turnstile allows the exact production hostname and uses the matching secret.
8. Analytics selection and consent verification are owner-approved.
9. Privacy/Terms wording and the real-content inventory have received the required business/legal review.
10. The quality gate and dependency audit have no unresolved high/critical result.

Detailed setup remains in:

- [`docs/CONTACT_INQUIRIES.md`](docs/CONTACT_INQUIRIES.md)
- [`docs/ADMIN_CMS.md`](docs/ADMIN_CMS.md)
- [`docs/SEO_ANALYTICS_PRIVACY.md`](docs/SEO_ANALYTICS_PRIVACY.md)
- [`docs/REAL_CONTENT_REPLACEMENT.md`](docs/REAL_CONTENT_REPLACEMENT.md)

## 4. Clean release-candidate verification

Use Node 22.23.2 and a clean worktree:

```bash
node --version
npm --version
git status --short
npm ci
npm run validate
npm audit --audit-level=high
```

Start exactly the generated production build and audit it:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run start -- --hostname 0.0.0.0 --port 3000
# In a second terminal:
npm run runtime:check
```

The runtime auditor covers all public sitemap routes, discovered internal links, metadata/indexing/consent boundaries, security headers, optimized image delivery, protected admin behavior, API method constraints, and missing-record hard 404s.

## 5. Preview procedure

When a branch preview is explicitly approved:

1. Push only the reviewed release branch.
2. Wait for GitHub Actions and the Vercel preview build to pass.
3. Confirm the preview uses the intended non-production environment scope. Do not submit real personal data to an unapproved preview.
4. Run:

   ```bash
   RUNTIME_AUDIT_BASE_URL=https://<approved-preview-host> npm run runtime:check
   ```

5. Perform real-browser keyboard, responsive, reduced-motion, consent-network, form, and protected-admin checks.
6. Record the preview deployment ID, candidate commit, tester, time, and result.

A preview passing does not authorize production by itself.

## 6. Production release procedure

Only after explicit owner approval:

```bash
git checkout main
git pull --ff-only origin main
git merge --no-ff stage/12-final-qa-performance-handover
git status --short
git log -1 --oneline
git push origin main
```

Then:

1. Confirm GitHub Actions passes for the pushed `main` commit.
2. In Vercel, confirm the deployment is built from the exact expected commit and reaches **Ready**.
3. Confirm `www.aymediawork.site` is assigned to that deployment and HTTPS is valid.
4. Do not apply old migrations or change provider keys merely because code was deployed.
5. Run the post-deployment checks below.

If remote `main` has changed, stop. Reconcile on a fresh branch, rerun the complete gate, and obtain approval for the new candidate. Do not force-push production history.

## 7. Automated production verification

```bash
RUNTIME_AUDIT_BASE_URL=https://www.aymediawork.site npm run runtime:check
```

Expected result: `PASS`. It must include all public HTML/sitemap routes, internal links, hard 404s, security/indexing assertions, API constraints, admin protection, consent boundaries, and image optimization.

Also inspect the production deployment logs for build/runtime errors without copying credentials or inquiry data into reports.

## 8. Real-browser production acceptance

Check these representative paths:

- `/`
- `/services` and at least one `/services/[slug]`
- `/work` and at least one `/work/[slug]`
- `/blog` and at least one `/blog/[slug]`
- `/about`, `/testimonials`, `/contact`, `/privacy`, `/terms`
- an unknown service, work, and blog slug (must show the 404 UI and return HTTP 404)
- `/robots.txt`, `/sitemap.xml`
- `/admin/login` and anonymous `/admin/dashboard` redirect

Then verify:

1. header, mobile menu, footer, filters, tabs, CTAs, internal/external links, focus order, and visible focus;
2. small phone, tablet, laptop, and wide desktop layout; 200% zoom; reduced-motion preference;
3. one controlled client inquiry, partner inquiry, and newsletter submission with non-sensitive data;
4. persistence, independent newsletter consent, notification status/delivery, and admin read/status workflow;
5. owner sign-in and a controlled draft → preview → publish → unpublish cycle using clearly provisional test content;
6. analytics before selection, reject, accept, withdrawal, and revisit using browser Network/Application panels;
7. canonical/metadata/social preview, sitemap, private noindex, HTTPS, and HSTS.

Record the deployment ID, commit, testers, timestamp, result, and any follow-up privately.

## 9. Rollback decision

Rollback immediately for any of the following when a safe forward fix cannot be deployed at once:

- broken public navigation or widespread 5xx responses;
- data loss/corruption risk;
- authorization, secret, privacy, or consent regression;
- valid inquiry submissions cannot persist;
- admin protection or public draft filtering fails;
- incorrect canonical/indexing behavior with material impact.

A Resend notification outage alone does not lose a persisted inquiry; inspect `/admin/inquiries` and notification status while deciding whether a code rollback is necessary.

## 10. Vercel rollback

1. In Vercel **Deployments**, identify the last known-good production deployment by commit and time.
2. Use the dashboard’s production rollback/promote control to restore that immutable deployment.
3. Confirm the custom domain points to the restored deployment.
4. Restore any separately changed environment value to its known-good value and redeploy that target if necessary.
5. Run the automated production runtime audit and representative real-browser checks.
6. Record the incident and rollback privately.

Vercel rollback restores code/build output, not Supabase data or migrations.

## 11. Git reconciliation after rollback

Do not leave `main` advertising a broken release:

```bash
git checkout main
git pull --ff-only origin main
git revert <bad-merge-or-commit>
npm ci
npm run validate
npm audit --audit-level=high
git push origin main
```

Use a reviewed revert or forward-fix commit; never rewrite/force-push shared production history. If a merge commit is reverted, use the correct mainline parent (`git revert -m 1 <merge-commit>`) only after checking the graph.

## 12. Database and data recovery warning

- Do not edit or reverse an already-applied production migration during a routine code rollback.
- Do not rerun versioned migrations “just in case.”
- If a schema/data incident occurs, stop writes where appropriate, preserve logs, and use the Supabase plan’s supported backup/point-in-time recovery with a reviewed recovery plan.
- Verify backup availability and retention in the provider dashboard; repository documentation cannot guarantee a provider backup.
- Preserve valid inquiries and consent evidence through code rollback.

## 13. Release closeout

A production release is complete only when:

- expected GitHub and Vercel checks pass;
- production runtime audit passes;
- provider-dependent forms/admin/consent checks pass;
- accessibility/responsive representative checks pass;
- no high/critical security finding is open;
- deployment/commit evidence is recorded;
- search sitemap submission and monitoring ownership are assigned; and
- the owner explicitly accepts the deployed release.

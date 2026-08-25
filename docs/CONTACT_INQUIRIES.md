# Contact, inquiries, and newsletter

## Approved public experience

Stage 9 provides two separate journeys on `/contact`:

### Client inquiry

- name;
- email;
- optional contact number;
- optional company or brand;
- one or more services selected from the ten approved service records;
- preferred timeline;
- project details;
- required purpose-specific privacy consent; and
- optional, unchecked newsletter consent.

The client explicitly directed Stage 9 to omit budget, pricing, and payment fields. This replaces the earlier draft requirement for a budget range. Nothing on the form collects payment information.

### Partner or collaborator inquiry

- name;
- email;
- optional contact number;
- primary specialty;
- portfolio URL;
- availability;
- one or more services offered;
- collaboration details;
- required purpose-specific privacy consent; and
- optional, unchecked newsletter consent.

No unconfirmed email address, telephone number, physical location, business hours, response-time promise, or commercial claim is published. The page uses original, non-factual form-led copy until approved business details are supplied.

A standalone newsletter form is also available in the global footer. It requires its own explicit consent and does not subscribe visitors automatically.

## Stable service IDs

Every public service has a committed UUID in `lib/constants/services.ts`. The same IDs seed `public.services` in the Stage 9 migration. Inquiry relationships persist UUIDs through `public.inquiry_services`, not mutable labels or route slugs. Public query-string preselection resolves an approved slug to its stable ID before the form renders.

Do not regenerate these IDs when editing a service title, copy, artwork, or slug. A future service must receive a new UUID and a migration.

## Data and security boundary

The browser never writes directly to Supabase and never receives the Supabase secret key. It submits JSON to validated same-origin Next.js route handlers:

- `POST /api/inquiries`
- `POST /api/newsletter`

The handlers apply:

1. content-type and body-size boundaries;
2. same-origin and Fetch Metadata checks;
3. an off-screen honeypot;
4. shared Zod validation;
5. Cloudflare Turnstile server-side Siteverify validation;
6. action and deployment-hostname matching;
7. HMAC-pseudonymised, database-backed rate limiting;
8. server-only Supabase persistence through atomic PostgreSQL functions; and
9. generic public errors that do not expose database, provider, or credential details.

The rate limiter allows five submissions per route category and pseudonymous address in each 15-minute database window. It does not store a raw IP address, and it opportunistically removes rate-limit rows that have been inactive for 24 hours.

All Stage 9 tables have Row Level Security enabled. The `anon` and `authenticated` roles receive no public table policy and cannot execute the privileged submission functions. Only the server-side `service_role` identity behind the current Supabase secret key can use those functions. Future admin policies must be additive and role-restricted.

Inquiry email notification is secondary to persistence. If database storage succeeds but Resend fails, the visitor still receives success, and `notification_status` records `failed`. If Resend is intentionally not configured, the record is marked `skipped`. This prevents an email provider outage from losing a valid inquiry.

## Database migration

Apply the versioned migrations to the connected Supabase project in timestamp order before testing production submissions:

```text
supabase/migrations/20260824090000_contact_inquiries.sql
supabase/migrations/20260825100000_add_social_media_marketing_service.sql
```

The first migration creates and secures:

- `services`;
- `inquiries`;
- `inquiry_services`;
- `newsletter_subscribers`;
- `submission_rate_limits`;
- atomic inquiry and newsletter functions; and
- the database-backed rate-limit function.

The second, forward-only migration inserts Social Media Marketing with its stable UUID and updates the final display positions. The Stage 9 migration is already applied in production and must not be edited to add this service.

### Dashboard application steps

1. Open the correct Supabase project.
2. Open **SQL Editor** and create a new query.
3. If Stage 9 is already installed, copy only `20260825100000_add_social_media_marketing_service.sql` into the editor. For a fresh database, apply both files in timestamp order.
4. Review that the target project name is correct, then select **Run** once for each unapplied migration.
5. Open **Table Editor** and confirm that `services` contains exactly the ten approved rows, including Social Media Marketing at sort order 8.
6. In **Database → Policies**, confirm that every new table has RLS enabled and no public `anon` insert/select policy was added.

Do not paste a database password, API key, or connection string into the SQL file.

## Exact environment-variable plan

### Browser-safe values

| Variable                               | Purpose                                                                               |
| -------------------------------------- | ------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | Canonical production URL, including `https://`                                        |
| `NEXT_PUBLIC_SUPABASE_URL`             | Public Supabase project URL                                                           |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Current `sb_publishable_...` key; safe for later browser Auth use when RLS is correct |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`       | Public Cloudflare Turnstile widget identifier                                         |

### Server-only values

| Variable                       | Purpose                                                                     |
| ------------------------------ | --------------------------------------------------------------------------- |
| `SUPABASE_SECRET_KEY`          | Current `sb_secret_...` key; bypasses RLS and must never reach browser code |
| `RESEND_API_KEY`               | Resend sending credential                                                   |
| `RESEND_FROM_EMAIL`            | Verified sender, for example `AY Media Work <inquiries@mail.example.com>`   |
| `INQUIRY_NOTIFICATION_EMAIL`   | Private destination for new inquiry alerts                                  |
| `TURNSTILE_SECRET_KEY`         | Server-side Siteverify credential                                           |
| `SUBMISSION_RATE_LIMIT_SECRET` | Independent random HMAC key used to pseudonymise rate-limit identifiers     |

Use the current Supabase publishable/secret key model, not new uses of the legacy `anon` and `service_role` JWT values. The secret key is backend-only and bypasses RLS.

`DATABASE_URL` is **not needed** by this application. Runtime persistence uses Supabase Data APIs and PostgreSQL RPC through `@supabase/supabase-js`. The migration can be applied through Supabase SQL Editor. Add a database URL only if a later approved tool truly requires a direct PostgreSQL connection; for a Vercel serverless client that would normally be the transaction pooler URL, never a browser variable.

No NextAuth variables are used. Authentication will use Supabase Auth in the admin stage, so do not add `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, or provider variables.

### Vercel scoping

- Add browser-safe values to the environments where the site should work.
- Add every server-only value directly in Vercel Project Settings; mark secrets as sensitive/non-readable where available.
- Configure Production and Preview separately. Do not assume a Preview secret automatically matches Production.
- Keep local values only in `.env.local`, which is Git-ignored.
- Redeploy after adding or changing an environment variable because an existing deployment does not receive the new value automatically.

Generate the rate-limit secret in your own terminal and paste the output directly into Vercel, never into chat or Git:

```bash
openssl rand -hex 32
```

## Provider cost boundary

No paid provider upgrade is selected by this stage. As published on 24 August 2026:

- Cloudflare Turnstile Free supports most production applications, up to 20 widgets, 10 managed hostnames per widget, and unlimited challenges.
- Resend Free includes 3,000 emails per month with a 100-email daily limit. A higher-volume plan must not be purchased without client approval.
- Supabase Free can pause an inactive project after one week. Review the existing project's plan and operational requirements before production handover; any upgrade requires client approval.

Recheck provider limits at launch because pricing and quotas can change.

## Resend setup

1. Create or open the AY Media Work Resend account.
2. In **Domains**, add a sending subdomain such as `mail.yourdomain.com`. A subdomain keeps sending reputation separate from the root domain.
3. Add the DNS records shown by Resend. If DNS is hosted by Vercel, Resend may offer automatic Domain Connect setup; manual DNS is also supported.
4. Wait until Resend reports the domain as verified.
5. Create an API key with only the sending access needed by this website.
6. Add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `INQUIRY_NOTIFICATION_EMAIL` to Vercel without exposing their values in chat.
7. Redeploy and send one controlled client-form test. Confirm both the Supabase row and the notification delivery.

Until a sending domain is verified, leave the Resend variables unset. Valid inquiries will still persist and will show `notification_status = 'skipped'`; production notification delivery is not considered verified until the controlled test passes.

## Cloudflare Turnstile setup

1. Open the Cloudflare dashboard and go to **Turnstile**.
2. Select **Add widget**.
3. Use a descriptive name such as `AY Media Work public forms`.
4. Add only controlled hostnames: the current production Vercel hostname, the final custom domain when ready, and any exact preview hostname intentionally used for testing.
5. Choose **Managed** mode and create the widget.
6. Put the public sitekey in `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
7. Put the private secret in `TURNSTILE_SECRET_KEY`.
8. Redeploy, submit each form once, and review Turnstile Analytics for the expected actions: `client-inquiry`, `partner-inquiry`, and `newsletter`.

The backend validates every token with Siteverify and checks both the expected action and the hostname that served the form. Production fails closed with a `503` setup message when Turnstile or the secure submission variables are absent.

## Secret-dependent acceptance test

After the migration and Vercel values are configured:

1. Submit one client inquiry with two service selections.
2. Confirm one `inquiries` row, two related `inquiry_services` rows, and `notification_status = 'sent'`.
3. Confirm the private notification email contains the same two service labels and no budget field.
4. Submit one partner inquiry and confirm partner-only details are stored.
5. Subscribe through the footer and confirm one `newsletter_subscribers` row.
6. Repeat the same newsletter email and confirm the existing row is refreshed rather than duplicated.
7. Confirm unchecked newsletter consent on an inquiry does not create a subscriber.
8. Confirm no raw visitor IP appears in the new tables.

Never use real client confidential information for this setup test. Delete or clearly mark controlled test records after verification.

## Permanent inquiry deletion

Owners and admins can permanently delete an inquiry from `/admin/inquiries` using the Delete inquiry control, after a confirmation prompt. Deletion removes the inquiry row and its `inquiry_services` links through the existing cascade; the audit history keeps a non-PII deletion record (actor, action, entity id, timestamp). Editors cannot delete inquiries — the server action refuses them, and Supabase RLS independently denies the operation. Deletion is irreversible; close or mark inquiries as spam instead when a record should be retained.

## Replacement and legal checklist

Before final launch, the client must approve:

- any public business email, telephone/WhatsApp number, location, and hours;
- the final notification recipient;
- the sender domain and sender label;
- the final privacy notice and data-retention period;
- who may access inquiry and newsletter data; and
- the operational process for access, correction, unsubscribe, and deletion requests.

The present form consent is purpose-specific and functional, but final legal text must be reviewed for the agency's actual operating jurisdictions and practices.

## Official references

- [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [Supabase pricing](https://supabase.com/pricing)
- [Resend with Vercel](https://resend.com/docs/knowledge-base/vercel)
- [Resend pricing](https://resend.com/pricing)
- [Cloudflare Turnstile widget management](https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/)
- [Cloudflare Turnstile server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Cloudflare Turnstile plans](https://developers.cloudflare.com/turnstile/plans/)
- [Vercel environment-variable scoping](https://vercel.com/docs/environment-variables/manage-across-environments)

# SEO, analytics, consent, and legal operations

Stage 11 provides the production SEO and privacy-control layer for the public AY Media Work site. It does not create unverified business facts, contact details, reviews, results, locations, awards, or operating history.

## Production behavior

### Metadata and social previews

- Public routes declare a canonical path, description, Open Graph data, and an X/Twitter preview.
- Principal static routes use the shared factory in `lib/seo/metadata.ts`.
- Published service, project, and article routes build metadata from the corresponding public CMS record.
- Social previews use existing approved or original provisional artwork. A CMS editor must keep each public record's metadata description and image alt text accurate.
- The root layout resolves relative canonical and image paths against `NEXT_PUBLIC_SITE_URL`.

Do not add claims to metadata that are not also approved for the visible page. Search descriptions are publication copy, not a place to introduce unsupported facts.

### Structured data

The public shell emits `Organization` and `WebSite` JSON-LD using only the verified brand name, canonical URL, brand description, logo, and active public profiles. Public content routes emit appropriate schemas:

- Services: `Service`
- Work studies: `CreativeWork`
- Blog index: `CollectionPage`
- Blog detail: `Article`
- Contact: `ContactPage`

All schemas must render through `components/seo/json-ld.tsx`, which escapes script-breaking `<` characters. Do not add address, telephone, price, rating, award, founder, client, or performance properties until the corresponding fact has been verified and approved for public use. Article modification dates must not be emitted unless the CMS stores a genuine independently meaningful modification timestamp.

### Sitemap and crawler controls

- `/sitemap.xml` contains the nine public static routes plus every active service and published project/article returned by the public CMS queries.
- The sitemap is revalidated at most hourly and is explicitly invalidated after relevant CMS mutations.
- `/robots.txt` permits public crawling, disallows `/admin` and `/api`, and declares the canonical sitemap.
- Admin metadata and `X-Robots-Tag` response headers keep admin and API surfaces out of indexing. A robots disallow rule alone is not treated as a noindex guarantee.
- Sitemap entries intentionally omit fabricated or unreliable `lastmod`, priority, and change-frequency values.

After the production deployment, submit `https://www.aymediawork.site/sitemap.xml` in the verified Google Search Console property. Submission helps discovery but does not guarantee indexing or ranking.

## Analytics configuration

All Stage 11 analytics variables are browser-visible configuration, not secrets. Configure them separately for the Vercel Production and intended Preview environments, then redeploy.

| Variable                                    | Accepted value                       | Effect                                              |
| ------------------------------------------- | ------------------------------------ | --------------------------------------------------- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`             | A GA4 web stream ID matching `G-...` | Makes Google Analytics available after consent      |
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED`      | Exact value `true`                   | Makes Vercel Web Analytics available after consent  |
| `NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ENABLED` | Exact value `true`                   | Makes Vercel Speed Insights available after consent |

Invalid IDs, blank values, `false`, `1`, and `yes` fail closed. When no optional provider is configured, no analytics provider or consent banner is rendered; the footer preference dialog explains that no optional provider is configured.

### Google Analytics activation

1. In the client-controlled Google Analytics account, create or select the correct GA4 property and web data stream for the production domain.
2. Copy only the public Measurement ID beginning with `G-`. Do not provide an account password, API credential, or service-account key to the application.
3. Add the ID as `NEXT_PUBLIC_GA_MEASUREMENT_ID` in the intended Vercel environment scopes.
4. Confirm the GA property data-retention and internal-traffic settings match the client's approved operating practice.
5. Redeploy and complete the consent verification below.

The application keeps Google advertising storage, advertising user data, ad personalization, Google signals, and ad-personalization signals denied. It grants analytics storage only after opt-in and configures accessible first-party GA cookies with a maximum age of 180 days.

### Vercel analytics activation

1. Open the correct Vercel project.
2. Enable Web Analytics and/or Speed Insights only if the client intends to use them and the current plan supports them. Do not approve a paid upgrade without client authorization.
3. Set the corresponding application flag to `true` in the same deployment environments.
4. Redeploy and complete the consent verification below.

The site applies a stored-consent guard to provider `beforeSend` callbacks as an additional boundary. The provider components are not mounted before opt-in.

## Consent lifecycle

- Browser storage key: `ay_media_work_consent`
- Schema version: `1`
- Maximum preference age: 180 days
- Choices: essential-only or analytics allowed

The parser rejects malformed JSON, unknown versions, non-boolean choices, non-canonical timestamps, expired records, and timestamps more than five minutes in the future. Invalid stored values are removed where browser storage permits it.

A storage write failure is treated as denial: optional providers remain off. The site rechecks the preference on tab visibility, window focus, cross-tab storage changes, and an hourly interval so an expired or revoked choice does not remain effective in a long-lived page.

The footer's **Analytics preferences** button is always available. Withdrawal unmounts optional provider components, sets Google's disable flag, sends a denied Consent Mode update when `gtag` is accessible, and attempts to remove accessible first-party `_ga` and `_ga_*` cookies on the current host and parent domain. Withdrawal cannot recall measurements already sent while consent was active.

Cloudflare Turnstile remains essential anti-abuse processing for public forms and is not controlled by the optional analytics choice.

## Production consent verification

Use a private/incognito browser session or clear only the test browser's site data before beginning. Do not use real client data.

1. Open the production site with DevTools **Network** and **Application/Storage** panels visible.
2. Before choosing, confirm there is no request for `googletagmanager.com/gtag/js` and no Vercel analytics or Speed Insights event request.
3. Confirm the banner can be reached by keyboard, has **Essential only**, **Manage preferences**, and **Accept analytics** actions, and does not obscure the primary experience at common mobile and desktop sizes.
4. Select **Essential only**. Reload and navigate between pages. Confirm optional requests remain absent.
5. Clear the `ay_media_work_consent` record and reload. Select **Accept analytics**. Confirm only the providers configured for that deployment begin sending expected requests.
6. Use **Analytics preferences** in the footer, turn analytics off, and save. Confirm new optional measurement stops and accessible `_ga`/`_ga_*` cookies are removed.
7. Open a second tab, change the choice in one tab, and confirm the other tab synchronizes.
8. Confirm `/privacy` and `/terms` are readable by keyboard and at mobile widths, and that their contact and preference controls work.

If a provider sends before consent, disable it immediately by removing its ID or setting its flag to `false`, redeploy, and investigate before re-enabling it.

## Search and metadata verification

After deployment:

1. Open `/robots.txt` and `/sitemap.xml`; confirm all URLs use the canonical production origin.
2. Confirm the sitemap contains only intended public routes and currently published CMS detail records.
3. Inspect representative Home, Service, Work, Blog, Contact, Privacy, and Terms pages. Confirm one canonical URL and correct title, description, preview image, and JSON-LD payload.
4. Confirm anonymous `/admin/...` requests remain protected and admin/API responses carry `X-Robots-Tag: noindex, nofollow, noarchive`.
5. Validate representative structured data with Google's Rich Results Test or Schema.org Validator. A schema can be valid without being eligible for a Google rich result.
6. Recheck previews after any image or metadata copy replacement.

## Legal-copy boundary

The Privacy notice and Website terms are operational drafts aligned to the implemented site behavior as of 25 August 2026. They deliberately avoid an unconfirmed address, public email, telephone, response-time promise, exclusive jurisdiction, and unsupported commercial claims.

Before final launch or a material operational change, the client must have the text reviewed for the agency's actual legal entity, operating jurisdictions, provider accounts, retention practices, data-subject request process, and approved public contact method. This repository documentation is not legal advice. Do not add a jurisdiction, registration detail, tax detail, or contact channel without verification.

Update the notice whenever the configured providers, purposes, retention, public contact method, or data-handling practice changes. Update the displayed review date only when a substantive review has actually occurred.

## Quality gate

From the repository root with the pinned Node.js runtime:

```bash
npm ci
npm run validate
```

Focused Stage 11 coverage includes analytics configuration, consent parsing and expiry, fail-closed storage, provider gating and revocation, sitemap and robots output, private noindex controls, metadata consistency, legal routes, and JSON-LD escaping.

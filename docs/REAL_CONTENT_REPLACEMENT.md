# Real-content replacement specification

**Owner:** AY Media Work
**Purpose:** one controlled inventory for replacing provisional public content with verified business content
**Last reviewed:** 25 August 2026

## 1. Non-negotiable publication rule

The current site intentionally uses original provisional copy, self-initiated concept work, original abstract artwork, and honest empty states where verified client material is unavailable. Do not replace any of it with a business claim merely to make the site look complete.

Before publication, every replacement must be:

1. factually confirmed by the AY Media Work owner;
2. supported by written permission when it names or depicts a client, person, partner, project, logo, quotation, or result;
3. free of invented statistics, testimonials, team members, history, locations, availability, prices, or outcomes;
4. supplied with ownership or usage rights for every image, logo, video frame, and document;
5. reviewed for spelling, accessibility, privacy, legal implications, and search metadata;
6. published first as a draft in the CMS where a draft workflow exists; and
7. checked in a Vercel preview before production.

Do not put secrets, API keys, passwords, private notes, personal data, or privileged URLs in public copy, media metadata, CMS settings, or Git.

## 2. Content source hierarchy

| Content class                                                    | Primary source                                   | Required update method                                                              |
| ---------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Services, work studies, blog, testimonials, client logos         | Supabase CMS under `/admin`                      | Draft, preview, permission check, then publish                                      |
| Supported site identity settings                                 | `/admin/settings` JSON settings editor           | Owner only; public values are presentation settings, never secrets                  |
| Page framing, navigation, forms, legal pages, empty/error states | Version-controlled React/TypeScript              | Pull request or isolated release branch, quality gate, preview, approval            |
| CMS outage fallback content                                      | `lib/constants/*.ts`                             | Keep aligned with the approved public baseline through code review                  |
| Images                                                           | `public/images` or Supabase public-media storage | Record rights, descriptive alt text, and attribution/permission evidence before use |

The public queries can fall back to `lib/constants/*.ts` when Supabase is unavailable. A permanent content replacement is therefore incomplete until the intended failure-state copy is also reviewed. Do not silently copy confidential client material into the repository merely to make it a fallback; retain the honest provisional fallback when rights or confidentiality make a local copy inappropriate.

## 3. Global identity and shell

### 3.1 Brand assets

- **Current approved logo source:** `/home/user/uploads/logo-AY media.jpeg` (preserved derivative: `public/images/brand/ay-media-work-logo-original.jpg`).
- **Original brand line:** `Ideas in motion. Stories that stay.`
- Supply only approved master logo exports, including transparent light/dark variants if the mark changes.
- For every replacement, confirm crop, clear space, legibility at mobile size, colour treatment, and accessible name.
- Do not change the brand line without explicit owner approval.

### 3.2 Owner-editable public settings

Location: `/admin/settings`. The owner-only editor stores valid JSON values and a public/private flag. Public shell reads are implemented in `lib/supabase/queries/public.ts`. For the string values below, enter a JSON string including quotation marks and keep **Publicly readable** checked.

| Setting                  | Supply/confirm                              | Current effect / publication condition                                                              |
| ------------------------ | ------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `brand.name`             | `"AY Media Work"`                           | Seeded identity record; the rendered site name remains code-managed and requires a code review      |
| `brand.line`             | Approved concise brand line                 | Footer brand line; preserve the original unless an explicit replacement is approved                 |
| `social.instagram`       | Canonical Instagram profile URL             | Keep the approved `https://www.instagram.com/aymediawork_/` unless the owner verifies a replacement |
| `social.ytjobs`          | Canonical YTJobs profile URL                | Link only; do not copy profile claims into site content without confirmation                        |
| `social.linkedin`        | Canonical live LinkedIn company/profile URL | Add only after the URL and profile are verified and ready for visitors                              |
| `social.linkedin_status` | `"coming_soon"` or an approved empty value  | Retain `"coming_soon"` while no verified LinkedIn URL is published                                  |

Only the supported keys above affect the current public shell. An arbitrary new setting does not add a public field to the website. No public email, phone, address, location, or business-hours setting is currently rendered; adding one requires a reviewed code change, owner verification, privacy/operational review, and the normal release gate. Settings must never contain credentials.

### 3.3 Code-managed shell content

Review in `lib/constants/navigation.ts`, `lib/constants/social.ts`, `lib/seo/metadata.ts`, `components/layout/site-header.tsx`, and `components/layout/site-footer.tsx`:

- site name and default site description;
- primary, footer, and legal navigation labels/order;
- header “Start a project” call to action;
- footer project CTA heading and button;
- newsletter heading, description, consent wording, success/error messages;
- footer brand line and copyright presentation;
- Instagram URL (`https://www.instagram.com/aymediawork_/`), YTJobs destination/note, and disabled LinkedIn state;
- default Open Graph image, logo alt text, and organization structured data.

Do not publish unconfirmed claims taken from YTJobs or any other external profile.

## 4. Homepage (`/`)

Code-managed framing lives in `components/sections/home/*`; CMS records feed the discipline line, service cards, and first three published work items.

| Section                       | Replacement package required                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| SEO                           | Approved page title, 140–160 character description, and share image/alt text                                       |
| Hero                          | Eyebrow, main headline, supporting paragraph, client/partner CTA labels, approved hero visual and factual alt text |
| Discipline ticker             | Confirm the published service titles and order in the Services CMS                                                 |
| Connected-studio introduction | Heading and supporting positioning copy that accurately describes the operating model                              |
| Capability cards              | Approved Services CMS records; see section 5                                                                       |
| Creative studies              | First three published Projects CMS records; see section 6                                                          |
| Process                       | Four real process steps with title and explanation; avoid guarantees and invented timelines                        |
| Work with AY                  | Client and collaborator invitation copy, CTA labels, and destination choices                                       |

If no verified client work is available, retain the current “original studio concept” positioning rather than relabelling concepts as client work.

## 5. Services (`/services` and `/services/[slug]`)

### 5.1 Code-managed archive framing

Review `app/(public)/services/page.tsx` and `components/sections/services/services-index.tsx`:

- archive title/description and social metadata;
- hero eyebrow, headline, introduction, and archive CTA;
- capability-index heading and original-artwork disclosure;
- four-step connected process;
- closing brief CTA.

Also review the fixed detail-page framing in `components/sections/services/service-detail.tsx`: breadcrumb and archive links, concept-art disclosure, capability/approach labels, related-service framing, and the final conversation CTA.

The approved core catalogue is exactly:

1. Video Editing
2. 2D and 3D Animation
3. SaaS Video
4. Graphics Designing
5. AI Animation
6. Web Development
7. AI Automation
8. Social Media Marketing
9. Facebook and Meta Ads
10. CGI and VFX

Do not reintroduce Scriptwriting or Thumbnail Design as core services. Keep organic Social Media Marketing separate from paid Facebook & Meta Ads.

### 5.2 CMS record package for every service

Location: `/admin/services`. Source form: `components/admin/service-form.tsx`.

Supply and verify:

- title;
- stable URL slug (changing it breaks existing links unless a redirect is added);
- sort order;
- active/inactive public state;
- hero title;
- concise archive-card description;
- unique meta description;
- public media path and descriptive image alt text;
- disciplines list;
- “useful for” list;
- approach steps (structured title/description pairs);
- related service slugs that resolve to active services.

Each service must explain scope without promising unverified outcomes. Social Media Marketing should cover organic strategy, content planning, calendars, publishing coordination, community coordination, reporting, and iteration. Paid Meta advertising belongs under Facebook & Meta Ads.

## 6. Work (`/work` and `/work/[slug]`)

### 6.1 Code-managed archive framing

Review `app/(public)/work/page.tsx` and `components/sections/work/work-index.tsx`:

- SEO and share image;
- archive hero, concept-work disclosure, archive CTA;
- selected-directions framing and filter language;
- “Premise / Visual system / Experience” explanatory cards;
- closing CTA.

Also review the fixed detail-page framing in `components/sections/work/work-detail.tsx`: breadcrumb and archive links, self-initiated-study disclosure, section labels, crop/palette presentation, related-capability framing, and the final project CTA.

Keep the self-initiated study disclosure until every displayed item is correctly classified and permissioned.

### 6.2 CMS record package for every project/study

Location: `/admin/projects`. Source form: `components/admin/project-form.tsx`.

Supply and verify:

- title and stable slug;
- category and format label;
- sort order, draft/published state, and featured state;
- summary description and unique meta description;
- hero/image path and factual alt text;
- premise question and premise context;
- direction, system, intended experience, and principle narratives;
- “explores” tags/list;
- tone list;
- palette values/labels;
- related service IDs.

For real client work, also retain outside the CMS: written display permission, approved client/project naming, image rights, confidentiality review, claim evidence, approval date, and approving person. Never convert a concept into an attributed case study without that evidence. Do not publish commercial results unless the client has approved both the result and the measurement basis.

## 7. About (`/about`)

This page is code-managed in `components/sections/about/about-index.tsx` with supporting constants in `lib/constants/about.ts`.

Replace or confirm every section as one approved package:

- SEO title/description and social image;
- hero eyebrow, headline, positioning paragraph, artwork, and alt text;
- studio-idea narrative;
- studio shape/layers cards;
- principles-in-practice cards;
- working-together narrative;
- flexible-studio-path explanation;
- links to work and services;
- client and collaborator closing CTAs.

If adding founders, staff, dates, location, awards, client counts, or history, supply verified names, roles, consent, factual source material, approved portraits/alt text, and effective dates. Omitting these details is valid until they are verified.

## 8. Testimonials and client logos (`/testimonials`)

### 8.1 Code-managed framing and empty state

Review `components/sections/testimonials/testimonials-index.tsx` and `lib/constants/testimonials.ts`:

- SEO title/description;
- hero and trust/permission explanation;
- honest no-testimonials state;
- feedback/publication process cards;
- client-logo section framing and its empty state;
- project CTA.

Never remove the empty state merely to make the page look populated.

### 8.2 Testimonial CMS package

Location: `/admin/testimonials`. Source form: `components/admin/testimonial-form.tsx`.

Supply and verify:

- exact approved quotation;
- attribution name;
- role and organisation;
- optional related project;
- project context;
- sort order and draft/published state;
- explicit permission confirmation.

Keep evidence of the speaker’s written approval, exact wording, attribution, organisation, intended channel, and approval date. Permission confirmation is mandatory before publication.

### 8.3 Client-logo CMS package

Location: `/admin/client-logos`. Source form: `components/admin/client-logo-form.tsx`.

Supply and verify:

- client/organisation name;
- optional approved destination URL;
- approved logo media path;
- alt text that identifies the organisation without decorative filler;
- sort order and draft/published state;
- explicit permission confirmation.

Use an official logo asset and confirm display rules, background, clear space, trademark requirements, linking permission, and approval duration.

## 9. Studio Journal (`/blog` and `/blog/[slug]`)

### 9.1 Code-managed archive framing

Review `app/(public)/blog/page.tsx`:

- SEO description and share image;
- journal hero and introduction;
- featured-entry label/CTA;
- browse/filter framing;
- closing CTA;
- disclosure that journal articles are original editorial material and not client/result claims.

Also review the code-managed article-detail framing in `app/(public)/blog/[slug]/page.tsx`: breadcrumb/archive links, byline/date/reading labels, original-artwork disclosure, related-capability and next-article framing, editorial disclaimer, and final project CTA.

### 9.2 CMS article package

Location: `/admin/blog`. Source form: `components/admin/blog-form.tsx`.

Supply and verify:

- article title and stable slug;
- category and author/byline;
- honest reading-time value;
- draft/published state and featured state;
- excerpt and unique meta description;
- image path and descriptive alt text;
- Markdown body;
- tags;
- key takeaways;
- related service IDs.

Validate sources and rights for quotations, statistics, screenshots, and third-party material. Do not paste unsafe HTML; the application intentionally renders a constrained Markdown format. Review article dates and the effect of changing a slug before publication.

## 10. Contact and forms (`/contact`)

Code-managed content lives in `app/(public)/contact/page.tsx`, `components/forms/contact-journeys.tsx`, `components/forms/inquiry-forms.tsx`, validation schemas, and `components/forms/newsletter-form.tsx`.

Review and approve:

- page SEO and hero;
- client and partner journey descriptions;
- all labels, help text, placeholders, validation errors, submission messages, and privacy text;
- “Share with care” security guidance;
- timeline and availability options;
- service options (fed by active Services CMS records);
- standalone newsletter wording;
- privacy-consent wording and links.

Required behavior must remain:

- no pricing, payment, budget, or budget-range fields;
- client form: name, email, optional contact number, optional company/brand, service interests, preferred timeline, project details;
- partner form: name, email, optional contact number, specialty, portfolio URL, availability, service interests, collaboration details;
- inquiry privacy consent is required;
- newsletter consent is separate, optional, explicit, and unchecked;
- newsletter consent is persisted independently;
- anti-spam, origin checks, rate controls, and Turnstile fail safely.

Any future public response-time promise, hours, email, phone, or address requires an operational owner and verification before publication.

## 11. Legal, consent, indexing, and machine-readable content

### 11.1 Privacy and terms

Code locations: `app/(public)/privacy/page.tsx` and `app/(public)/terms/page.tsx`.

Before launch and whenever operations change, the business owner and an appropriately qualified legal reviewer should confirm:

- responsible business/entity wording and jurisdiction;
- public privacy contact route;
- collected fields and purposes;
- processors (Vercel, Supabase, Cloudflare Turnstile, Resend, optional Google Analytics);
- international processing, retention, user-rights process, and security wording;
- website-use, intellectual-property, project-inquiry, third-party, liability, and governing-law wording;
- “last reviewed” date.

The current pages intentionally avoid an unverified legal entity, address, email, and exclusive jurisdiction. Do not add them without confirmation.

### 11.2 Consent interface

Review `components/privacy/*` whenever analytics providers, storage duration, cookie behavior, or legal wording changes. Preserve default denial, equal accept/reject choices, withdrawal access in the footer, and provider loading only after opt-in.

### 11.3 SEO and structured data

Review `lib/seo/*`, `app/sitemap.ts`, `app/robots.ts`, and page metadata when public content changes:

- canonical production origin (`NEXT_PUBLIC_SITE_URL`);
- site name, descriptions, titles, share images, and alt text;
- Organization and page/article structured data;
- sitemap inclusion, publication/update dates, and only published CMS records;
- `/admin` and `/api` crawler exclusions plus noindex headers;
- hard 404 behavior for missing services, projects, and articles.

Do not add telephone, email, address, founding date, aggregate rating, price range, or social profiles to structured data unless verified and public.

## 12. Error, loading, and empty states

Code-managed states are public content too. Review:

- `app/not-found.tsx`;
- `app/global-error.tsx` and route error boundaries;
- `app/admin/loading.tsx` and `app/(public)/contact/loading.tsx`;
- CMS-unavailable and empty archive states;
- form unavailable, rate-limited, validation, duplicate newsletter, and notification-failure messages;
- disabled LinkedIn “Coming soon” state.

Keep messages calm, truthful, actionable, and free of internal implementation details. Do not add a broad public loading boundary above dynamic catalogue pages; doing so can turn missing records into streamed HTTP 200 responses instead of hard 404s.

## 13. CMS operational records that are not marketing content

- **Inquiries (`/admin/inquiries`):** user-submitted records, read state, workflow status, consent evidence, and private handling actions. Do not copy into public pages without separate written permission.
- **Newsletter (`/admin/inquiries#subscribers`):** subscription and consent records. Use only for the consented purpose; honour withdrawal/deletion workflows.
- **Users (`/admin/users`):** administrator invitations and roles. Subsequent administrators are invited here—not added to Vercel and not manually created as standalone Supabase Auth users.
- **Activity (`/admin/activity`):** audit evidence; never repurpose as public content.
- **Media (`/admin/media`):** public-media storage references. Upload only approved public assets; filenames and metadata must not reveal confidential information.

## 14. Submission template for each replacement batch

Use this checklist for each page or CMS item:

- **Owner:**
- **Target route/CMS item:**
- **Current classification:** provisional / concept / empty / verified public
- **Approved copy:**
- **Approved media files:**
- **Alt text:**
- **Claim sources/evidence:**
- **Named-party permission evidence:**
- **Usage-rights/licence evidence:**
- **SEO title and description:**
- **Desired publish date:**
- **Approver and approval date:**
- **Expiry/review date, if any:**
- **Fallback-content decision:** retain provisional / approved repository-safe replacement
- **Preview URL and QA sign-off:**

## 15. Final replacement acceptance checklist

A replacement batch is complete only when:

- all required fields above are supplied;
- draft preview matches mobile, tablet, desktop, keyboard, and reduced-motion behavior;
- every image has meaningful alt text or is correctly decorative;
- all links resolve and no unpublished record is exposed;
- metadata, structured data, sitemap behavior, and hard 404s remain correct;
- permissions and claim evidence are retained outside the public repository;
- forms and consent behavior are unchanged unless specifically approved;
- `npm run validate`, dependency audit, production runtime audit, and post-deployment smoke checks pass; and
- the owner explicitly approves production publication.

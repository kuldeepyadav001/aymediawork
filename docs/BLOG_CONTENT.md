# Studio Journal content and provenance

Stage 8 introduces the public `/blog` archive and four route-backed Studio Journal articles.

## Current editorial status

The client approved original provisional articles with a balanced editorial direction across creative craft, digital systems, and responsible AI-assisted workflows. Every current article is publicly attributed to **AY Media Work**.

The articles are original, non-factual working-principle pieces. They do not present invented client engagements, measured outcomes, staff identities, business history, third-party endorsements, or external research as fact. Each public article carries a short provenance note so provisional editorial material cannot be mistaken for a case study or client claim.

Current entries:

1. **One Idea, Many Outputs** — `/blog/one-idea-many-outputs`
2. **Motion That Carries Meaning** — `/blog/motion-that-carries-meaning`
3. **Automation With a Human Thread** — `/blog/automation-with-a-human-thread`
4. **Designing a Website as a Living System** — `/blog/website-as-a-living-system`

All entries use the publication date `2026-08-24`, the date this provisional collection was created. Replace that value with the real publication schedule when approved articles are supplied.

## Original replaceable artwork

The following abstract cover images were generated specifically for the AY Media Work Studio Journal during Stage 8:

- `public/images/blog/one-idea-many-outputs.jpg`
- `public/images/blog/motion-that-carries-meaning.jpg`
- `public/images/blog/automation-with-human-thread.jpg`
- `public/images/blog/website-as-living-system.jpg`

The images are original concept artwork. They contain no client material, real product interface, staff portrait, third-party logo, or attributed portfolio work. Article pages visibly identify them as replaceable original Studio Journal artwork.

## Current data architecture

- `lib/constants/blog-slugs.ts` defines the approved static route boundary.
- `lib/constants/blog.ts` contains typed article records and summary projections.
- Stable provisional IDs are separate from public slugs so database UUIDs can replace them without changing URLs.
- Every record contains title, slug, author, publication date, category, excerpt, meta description, cover image and alt text, tags, related service slugs, reading time, key takeaways, featured status, and Markdown body.
- The archive passes summaries without article bodies to its client-side category filter, avoiding unnecessary article-body hydration.
- `generateStaticParams()` prerenders the current four detail routes.
- `proxy.ts` allows only the Blog index and approved slugs; unknown or nested Blog paths receive a hard HTTP 404.

A future Supabase-backed Blog manager can map these fields to database records, use stable service IDs for relationships, and replace the local allowlist with published-record lookup while preserving public slugs.

## Safe Markdown boundary

Article bodies are rendered at runtime with `react-markdown`, `remark-gfm`, and `rehype-sanitize`. They are not executable MDX. Raw embedded HTML is not enabled, unsafe URL protocols are removed, and external links receive `noopener`/`noreferrer` protection.

When the Blog CRUD editor is introduced, server-side validation must retain this boundary. Do not allow arbitrary JSX, scripts, inline event handlers, iframes, or unsanitized HTML inside article content.

## Search and sharing behaviour

- The archive has unique canonical and social metadata plus `CollectionPage` and `ItemList` structured data.
- Each article has a unique title, description, canonical URL, social image, public byline, publication date, tags, and `Article` structured data.
- The archive can be filtered by editorial category with keyboard-accessible pressed states and an announced result count.
- Every article links to related capabilities, the next journal entry, the archive, and the client inquiry journey.

## Real article replacement checklist

For each approved article, collect:

1. final title and preferred public slug;
2. author display name and whether the author is a person or organisation;
3. author biography, portrait, and profile link if a named person will be shown;
4. publication date, optional updated date, and desired scheduling timezone;
5. editorial category, tags, featured status, and archive ordering;
6. short archive excerpt and search/social meta description;
7. final Markdown body with heading hierarchy, lists, quotations, and link destinations;
8. cover image in the requested production crop, descriptive alt text, source, creator credit, licence or ownership confirmation, and publication permission;
9. optional in-article media with captions, alt text, source, credit, permission, and mobile crop guidance;
10. related service and project records using stable database IDs;
11. citations and source links for factual assertions, research, statistics, product statements, or quoted third parties;
12. exact quotation permissions and attribution for any third-party comment;
13. canonical-source decision if the article is republished elsewhere;
14. approval owner, approval date, publication status, and any embargo or expiry instruction.

Do not migrate an article from draft to published until factual claims, external links, media rights, byline permission, and publication approval are confirmed.

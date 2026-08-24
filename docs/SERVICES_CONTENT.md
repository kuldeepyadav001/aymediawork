# Services content and provenance

Stage 5 establishes the public service architecture at `/services` and the nine detail routes listed below.

## Current service taxonomy

1. Video Editing — `/services/video-editing`
2. 2D & 3D Animation — `/services/2d-and-3d-animation`
3. SaaS Video — `/services/saas-video`
4. Graphic Design — `/services/graphic-design`
5. AI Animation — `/services/ai-animation`
6. Web Development — `/services/web-development`
7. AI Automation — `/services/ai-automation`
8. Facebook & Meta Ads — `/services/facebook-and-meta-ads`
9. CGI & VFX — `/services/cgi-and-vfx`

This catalog reflects the agency's current focus and replaces the earlier working taxonomy. The labels, copy, ordering, and media remain editable business content rather than permanent assumptions about what the agency may offer.

## Future service data model

The Stage 5 catalog is a typed local source so the public experience can be reviewed before the database and admin stages. When Supabase content management is introduced:

- every service record will receive a stable database ID;
- the admin service area will support creating and managing additional services;
- public slugs will remain readable route identifiers rather than database relationships;
- published service records will supply their own page copy, media, status, and ordering;
- inquiry submissions will store selected service IDs after resolving any route slug or preselection;
- removing or changing a display label will not damage historical inquiry relationships.

Until that migration, `lib/constants/services.ts` is the content source of truth, `lib/constants/service-slugs.ts` defines the approved route boundary, and `generateStaticParams()` prebuilds the current nine pages. The lightweight root `proxy.ts` rejects unknown or nested service paths with a hard 404 before they enter Next.js rendering. The database migration will replace this local route boundary so newly published admin records can become live without editing the source catalog.

## Copy boundary

The client authorised original draft copy for all nine service pages. The content describes possible capabilities, contexts, and working approaches without publishing unconfirmed clients, metrics, outcomes, turnaround promises, revision limits, team credentials, or guaranteed advertising and automation results.

## Original service artwork

The following images were generated specifically for AY Media Work during Stage 5:

- `public/images/services/video-editing.jpg`
- `public/images/services/2d-and-3d-animation.jpg`
- `public/images/services/saas-video.jpg`
- `public/images/services/graphic-design.jpg`
- `public/images/services/ai-animation.jpg`
- `public/images/services/web-development.jpg`
- `public/images/services/ai-automation.jpg`
- `public/images/services/facebook-and-meta-ads.jpg`
- `public/images/services/cgi-and-vfx.jpg`

They contain no attributed client work, platform logo, real software interface, testimonial, or performance claim. Each detail page identifies its visual as original studio concept artwork.

## Route and metadata behaviour

- The service index and every current detail route have unique titles, descriptions, canonicals, Open Graph metadata, and Twitter metadata.
- `generateStaticParams()` prerenders the current service catalog.
- `proxy.ts` allows the index and approved slugs, while unknown or nested service paths receive the site 404 with an HTTP 404 status.
- The later database-backed route will replace the local slug boundary so an administrator can publish additional service records.
- Service CTAs preserve the selected public slug in the query string. The final inquiry journey will resolve that slug to the service record and persist the stable database ID.

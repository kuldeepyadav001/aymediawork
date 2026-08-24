# Work archive content boundary

Stage 6 introduces the `/work` archive and six route-backed case-study experiences.

## Current content status

All six entries are self-initiated, original studio concepts created for AY Media Work. They demonstrate creative thinking, visual direction, systems, and craft territories; they do not represent commissioned client work, verified commercial outcomes, or delivered engagements.

The archive intentionally does not publish:

- invented clients or brand attribution;
- unconfirmed portfolio titles or links from third-party profiles;
- views, likes, conversion data, or other performance metrics;
- testimonials or production claims;
- pricing, turnaround promises, or scope guarantees.

The YTJobs profile may inform broad creative direction, but its project claims, metrics, testimonial, and client information remain unpublished until the client confirms what may be used.

## Content architecture

- Public slugs are centralized in `lib/constants/work-slugs.ts`.
- Study content is centralized in `lib/constants/work.ts`.
- Every study has a stable provisional content ID, public slug, category, format, service relationships, original image, premise, direction, system, experience, design principle, exploratory points, tone, and palette.
- A future database migration can issue UUID primary keys while preserving public slugs and service relationships.
- Unknown or nested `/work` paths are rejected by the shared route boundary in `proxy.ts`.

## Replacement plan

When approved client material arrives, replace concept content only after confirming:

1. public project and client naming;
2. approved copy and project role;
3. licensed images, video, and external links;
4. approved results or metrics with their measurement context;
5. testimonial wording and attribution, if applicable;
6. services associated with the project.

Concept studies may remain as clearly labelled studio explorations alongside approved client case studies.

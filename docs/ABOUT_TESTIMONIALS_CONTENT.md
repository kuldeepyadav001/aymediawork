# About and testimonials content boundary

Stage 7 introduces the production About page and the testimonial experience.

## About page status

The About page uses original, non-factual positioning copy. It describes AY Media Work as a connected multidisciplinary creative studio and explains its intended principles, studio model, collaboration values, and relationship between creative direction and specialist craft.

Until approved business and team information is supplied, the page does not publish:

- founding dates, years of experience, office locations, or team size;
- staff names, titles, biographies, portraits, or employment claims;
- client counts, awards, certifications, or commercial performance;
- unsupported delivery, availability, or turnaround promises;
- third-party imagery or attributed client work.

The images in `public/images/about/` are original studio concept artwork created for AY Media Work.

## Testimonial status

`APPROVED_TESTIMONIALS` in `lib/constants/testimonials.ts` intentionally remains empty. No placeholder quotation is presented as real feedback.

The public page explains that feedback will be published only after confirming:

1. the exact quotation and any approved edit;
2. the contributor's approved display name;
3. role and organisation attribution, if permitted;
4. relevant project context, if permitted;
5. explicit permission for public use.

The current page presents working-experience principles as studio intent, not as customer claims.

## Future replacement data

For final About content, collect the approved studio story, founding context, location or remote model, team profiles, portraits, roles, languages, operating details, credentials, and publication permissions.

For every testimonial, collect the exact quotation, attribution fields, linked project if applicable, permission status, approval date, and any restrictions. A future database migration can replace the constants while retaining the public content boundary and empty-state behaviour.

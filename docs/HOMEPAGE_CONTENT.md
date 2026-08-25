# Homepage content and provenance

Stage 4 replaces the temporary design-system review surface with the production homepage composition.

## Approved drafting boundary

The client authorised original draft copy and abstract visual direction for Stage 4. The homepage therefore uses non-factual positioning language and does not publish unconfirmed statistics, client logos, testimonials, awards, project results, or third-party portfolio claims.

## Service taxonomy

The homepage derives its capability cards from the current Stage 5 service catalog:

1. Video Editing — `/services/video-editing`
2. 2D & 3D Animation — `/services/2d-and-3d-animation`
3. SaaS Video — `/services/saas-video`
4. Graphic Design — `/services/graphic-design`
5. AI Animation — `/services/ai-animation`
6. Web Development — `/services/web-development`
7. AI Automation — `/services/ai-automation`
8. Social Media Marketing — `/services/social-media-marketing`
9. Facebook & Meta Ads — `/services/facebook-and-meta-ads`
10. CGI & VFX — `/services/cgi-and-vfx`

These labels and routes reflect the agency's expanded focus. The later Supabase-backed service manager will assign stable database IDs, support additional services, and keep display content editable without using labels as relationships.

## Original homepage visuals

The hero uses `public/images/home/hero-cinematic-frame.jpg`, generated specifically for AY Media Work during Stage 4. Stage 6 connects the homepage creative-study grid to the first three entries in the centralized work archive, including their original artwork and detail routes.

The homepage identifies all supporting images as original studio concepts, not client case studies. Confirmed client media will be introduced only after the client supplies or approves the source, attribution, claims, and publication rights. The earlier Stage 4 study assets remain in the repository as original source material but are no longer rendered by the homepage.

## Hero composition, motion, and interaction

- The public header uses a compact 64 px mobile / 72 px larger-screen height with the public layout offset kept in sync. Its translucent surface, highlight gradient, blur, and restrained scrolled state visually relate it to the site's glass panels.
- Homepage and service heroes use compact, content-centred spacing so the primary message and artwork enter the initial viewport earlier without changing the established composition.
- The hero artwork uses a slow transform-only drift animation. Its “Built around the idea” glass card sits higher within the artwork and uses a separate subtle transform-only float.
- Both hero motions stop automatically when `prefers-reduced-motion: reduce` is active.
- Capability cards use a restrained hover and keyboard-focus lift without changing document flow or causing layout shift.
- No treatment animates layout properties or large filters.

## Published social destinations

- Instagram: `https://www.instagram.com/aymediawork_/`
- YTJobs: `https://ytjobs.co/talent/profile/439676?r=253`
- LinkedIn: a non-interactive “Coming soon” label; no destination is published until the client supplies an approved profile.

The YTJobs destination is linked only as a profile. Its metrics, testimonials, project outcomes, and other factual claims are not reproduced on the site.

## Conversion paths

- Client project inquiries route to `/contact?type=client`.
- Partner and collaborator inquiries route to `/contact?type=partner`.
- The final forms and persistence are implemented in their dedicated stages; the distinct routes are established here so the journeys remain separate from the outset.

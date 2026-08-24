export const BLOG_SLUGS = [
  "one-idea-many-outputs",
  "motion-that-carries-meaning",
  "automation-with-a-human-thread",
  "website-as-a-living-system",
] as const;

export type BlogSlug = (typeof BLOG_SLUGS)[number];

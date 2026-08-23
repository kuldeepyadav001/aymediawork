export const SERVICE_SLUGS = [
  "video-editing",
  "2d-and-3d-animation",
  "saas-video",
  "graphic-design",
  "ai-animation",
  "web-development",
  "ai-automation",
  "facebook-and-meta-ads",
  "cgi-and-vfx",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

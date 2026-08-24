export const WORK_SLUGS = [
  "signal-in-the-noise",
  "interface-in-motion",
  "worlds-between-frames",
  "identity-in-rhythm",
  "connected-by-design",
  "impossible-made-visible",
] as const;

export type WorkSlug = (typeof WORK_SLUGS)[number];

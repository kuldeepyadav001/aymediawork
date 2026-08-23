export const MOTION_DURATION = {
  instant: 0.16,
  fast: 0.24,
  base: 0.42,
  slow: 0.7,
  cinematic: 1,
} as const;

export const MOTION_EASE = {
  enter: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 1, 1],
  standard: [0.65, 0, 0.35, 1],
} as const;

export const MOTION_DISTANCE = {
  subtle: 12,
  base: 24,
  expressive: 48,
} as const;

export const MOTION_STAGGER = {
  tight: 0.045,
  base: 0.08,
  relaxed: 0.12,
} as const;

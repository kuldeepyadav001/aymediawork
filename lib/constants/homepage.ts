export type HomepageService = {
  description: string;
  index: string;
  slug: string;
  title: string;
};

export type CreativeStudy = {
  alt: string;
  category: string;
  description: string;
  image: string;
  title: string;
};

export type ProcessStep = {
  description: string;
  index: string;
  title: string;
};

export const HOMEPAGE_SERVICES: readonly HomepageService[] = [
  {
    index: "01",
    slug: "video-editing",
    title: "Video Editing",
    description:
      "Story-led cuts, intentional pacing, colour, and sound shaped into one clear viewing experience.",
  },
  {
    index: "02",
    slug: "shorts-and-reels",
    title: "Shorts & Reels",
    description:
      "Fast, focused vertical stories designed to earn attention without losing the idea behind them.",
  },
  {
    index: "03",
    slug: "youtube-production",
    title: "YouTube Production",
    description:
      "Long-form content shaped from structure and visual language through to a channel-ready final cut.",
  },
  {
    index: "04",
    slug: "motion-graphics",
    title: "Motion Graphics",
    description:
      "Titles, explainers, transitions, and visual systems that make information feel alive and legible.",
  },
  {
    index: "05",
    slug: "3d-animation",
    title: "3D Animation",
    description:
      "Dimensional visuals and crafted motion for ideas that need a world beyond the camera.",
  },
  {
    index: "06",
    slug: "thumbnail-design",
    title: "Thumbnail Design",
    description:
      "Distinct, high-clarity frames built to communicate the promise of a story at a glance.",
  },
  {
    index: "07",
    slug: "channel-management",
    title: "Channel Management",
    description:
      "A considered publishing rhythm that keeps creative output organised, consistent, and on-brand.",
  },
  {
    index: "08",
    slug: "scriptwriting",
    title: "Scriptwriting",
    description:
      "Narrative structure and language that give every frame a reason to exist before the edit begins.",
  },
  {
    index: "09",
    slug: "creative-direction",
    title: "Creative Direction",
    description:
      "One visual point of view connecting concept, format, design, and delivery across a project.",
  },
] as const;

export const CREATIVE_STUDIES: readonly CreativeStudy[] = [
  {
    alt: "Layered film strips crossing inside a dark editing studio",
    category: "Editing direction",
    description:
      "Rhythm, atmosphere, and narrative hierarchy brought into one composed frame.",
    image: "/images/home/study-story-editing.jpg",
    title: "Story in every cut",
  },
  {
    alt: "Chrome rings and violet glass forms floating in a dark space",
    category: "Motion exploration",
    description:
      "Dimensional form, controlled light, and movement designed to carry an idea.",
    image: "/images/home/study-motion-worlds.jpg",
    title: "Worlds in motion",
  },
  {
    alt: "Blue and red geometric frames layered over torn paper textures",
    category: "Social framing",
    description:
      "Bold composition and immediate visual hierarchy for the smallest, fastest screens.",
    image: "/images/home/study-social-frames.jpg",
    title: "Frames that hold attention",
  },
] as const;

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    index: "01",
    title: "Discover",
    description:
      "Start with the audience, the objective, and the feeling the work should leave behind.",
  },
  {
    index: "02",
    title: "Shape",
    description:
      "Turn the brief into a focused creative direction, format, and production plan.",
  },
  {
    index: "03",
    title: "Craft",
    description:
      "Build the story through edit, sound, motion, design, and careful visual detail.",
  },
  {
    index: "04",
    title: "Refine & deliver",
    description:
      "Review with purpose, polish the final experience, and prepare every required format.",
  },
] as const;

export const CREATIVE_DISCIPLINES = [
  "Editing",
  "Motion",
  "Design",
  "3D",
  "Strategy",
  "Story",
] as const;

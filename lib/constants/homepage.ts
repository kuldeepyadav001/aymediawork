import { SERVICE_CATALOG } from "@/lib/constants/services";

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

export const HOMEPAGE_SERVICES: readonly HomepageService[] =
  SERVICE_CATALOG.map(({ description, index, slug, title }) => ({
    description,
    index,
    slug,
    title,
  }));

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

export const CREATIVE_DISCIPLINES: readonly string[] = SERVICE_CATALOG.map(
  ({ title }) => title,
);

import { SERVICE_CATALOG } from "@/lib/constants/services";
import { WORK_STUDIES } from "@/lib/constants/work";

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
  href: string;
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

export const CREATIVE_STUDIES: readonly CreativeStudy[] = WORK_STUDIES.slice(
  0,
  3,
).map(({ category, description, image, slug, title }) => ({
  alt: image.alt,
  category,
  description,
  href: `/work/${slug}`,
  image: image.src,
  title,
}));

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

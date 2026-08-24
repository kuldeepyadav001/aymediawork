export type AboutPrinciple = {
  description: string;
  index: string;
  title: string;
};

export type StudioLayer = {
  description: string;
  label: string;
  title: string;
};

export const ABOUT_PRINCIPLES: readonly AboutPrinciple[] = [
  {
    index: "01",
    title: "Story before spectacle",
    description:
      "A striking frame matters more when the audience understands why it is there and what it should leave behind.",
  },
  {
    index: "02",
    title: "One direction across disciplines",
    description:
      "Editing, motion, design, development, automation, and delivery should feel like parts of one idea—not separate outputs.",
  },
  {
    index: "03",
    title: "Clarity throughout the process",
    description:
      "Useful questions, visible review points, and organised handoffs protect both the creative ambition and the practical work around it.",
  },
  {
    index: "04",
    title: "New tools, human judgement",
    description:
      "Technology can widen the creative path, but direction, continuity, context, and final responsibility stay with people.",
  },
] as const;

export const STUDIO_LAYERS: readonly StudioLayer[] = [
  {
    label: "Creative centre",
    title: "Direction",
    description:
      "The audience, objective, story, and visual language create one shared centre before the work expands into production.",
  },
  {
    label: "Craft network",
    title: "Specialist making",
    description:
      "The brief determines the right mix of editorial, motion, design, digital, advertising, automation, CGI, and VFX craft.",
  },
  {
    label: "Working rhythm",
    title: "Connected delivery",
    description:
      "Review, refinement, formats, and handoffs remain connected to the same direction from the first conversation to final delivery.",
  },
] as const;

export const COLLABORATION_VALUES = [
  "Ask useful questions before proposing answers",
  "Make decisions visible enough to review",
  "Protect focus when the brief becomes complex",
  "Treat feedback as part of the craft",
  "Keep human checkpoints around automated work",
  "Prepare final assets for the context in which they will live",
] as const;

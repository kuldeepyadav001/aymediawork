export type PublishedTestimonial = {
  approvedAt: string;
  attribution: {
    name: string;
    organisation?: string;
    role?: string;
  };
  id: string;
  projectContext?: string;
  projectSlug?: string;
  quote: string;
};

/**
 * Testimonials remain empty until exact wording, attribution, context, and
 * publication permission are confirmed by the client.
 */
export const APPROVED_TESTIMONIALS: readonly PublishedTestimonial[] = [];

export const FEEDBACK_PUBLISHING_STEPS = [
  {
    index: "01",
    title: "Keep the exact meaning",
    description:
      "Feedback is not rewritten into a stronger commercial claim. Any light edit for length or clarity must be approved.",
  },
  {
    index: "02",
    title: "Confirm the attribution",
    description:
      "The person, role, organisation, and project context are shown only at the level each contributor has approved.",
  },
  {
    index: "03",
    title: "Publish with permission",
    description:
      "A review appears publicly only after its wording, attribution, and intended use have been confirmed.",
  },
] as const;

export const WORKING_EXPERIENCE = [
  {
    index: "01",
    title: "Clear starts",
    description:
      "Align the audience, objective, source material, responsibilities, and review path before production gathers momentum.",
  },
  {
    index: "02",
    title: "Visible progress",
    description:
      "Share work at useful decision points so feedback can shape the direction while changes are still meaningful.",
  },
  {
    index: "03",
    title: "Thoughtful review",
    description:
      "Connect feedback to the brief, resolve competing notes, and keep the central idea visible through refinement.",
  },
  {
    index: "04",
    title: "Organised handoff",
    description:
      "Prepare agreed formats, final assets, and practical context so the work is ready for the place it needs to live.",
  },
] as const;

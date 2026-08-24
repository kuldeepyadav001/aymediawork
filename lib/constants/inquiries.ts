export const INQUIRY_TYPES = ["client", "partner"] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const PROJECT_TIMELINE_VALUES = [
  "as-soon-as-practical",
  "within-one-month",
  "one-to-three-months",
  "more-than-three-months",
  "flexible",
] as const;

export type ProjectTimeline = (typeof PROJECT_TIMELINE_VALUES)[number];

export const PROJECT_TIMELINE_OPTIONS: readonly {
  label: string;
  value: ProjectTimeline;
}[] = [
  { label: "As soon as practical", value: "as-soon-as-practical" },
  { label: "Within one month", value: "within-one-month" },
  { label: "One to three months", value: "one-to-three-months" },
  { label: "More than three months", value: "more-than-three-months" },
  { label: "Flexible / still planning", value: "flexible" },
];

export const PARTNER_AVAILABILITY_VALUES = [
  "available-now",
  "within-one-month",
  "future-projects",
  "project-dependent",
] as const;

export type PartnerAvailability = (typeof PARTNER_AVAILABILITY_VALUES)[number];

export const PARTNER_AVAILABILITY_OPTIONS: readonly {
  label: string;
  value: PartnerAvailability;
}[] = [
  { label: "Available now", value: "available-now" },
  { label: "Available within one month", value: "within-one-month" },
  { label: "Open to future projects", value: "future-projects" },
  { label: "Depends on the project", value: "project-dependent" },
];

export function getProjectTimelineLabel(value: ProjectTimeline) {
  return PROJECT_TIMELINE_OPTIONS.find((option) => option.value === value)
    ?.label;
}

export function getPartnerAvailabilityLabel(value: PartnerAvailability) {
  return PARTNER_AVAILABILITY_OPTIONS.find((option) => option.value === value)
    ?.label;
}

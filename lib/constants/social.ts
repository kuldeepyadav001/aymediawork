type SocialLinkBase = {
  label: "Instagram" | "LinkedIn" | "YTJobs";
  note: string;
};

export type SocialLink = SocialLinkBase &
  (
    | {
        href: string;
        status: "active";
      }
    | {
        href?: never;
        status: "coming-soon";
      }
  );

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    href: "https://www.instagram.com/aymediawork_/",
    label: "Instagram",
    note: "@aymediawork_",
    status: "active",
  },
  {
    label: "LinkedIn",
    note: "Coming soon",
    status: "coming-soon",
  },
  {
    href: "https://ytjobs.co/talent/profile/439676?r=253",
    label: "YTJobs",
    note: "Portfolio profile",
    status: "active",
  },
] as const;

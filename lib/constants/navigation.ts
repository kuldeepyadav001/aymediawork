export type NavigationItem = {
  href: string;
  label: string;
};

export const PRIMARY_NAVIGATION: readonly NavigationItem[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export const FOOTER_NAVIGATION: readonly NavigationItem[] = [
  ...PRIMARY_NAVIGATION,
  { href: "/testimonials", label: "Testimonials" },
];

export const LEGAL_NAVIGATION: readonly NavigationItem[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export const BRAND_LINE = "Ideas in motion. Stories that stay.";

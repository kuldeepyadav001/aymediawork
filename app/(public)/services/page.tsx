import type { Metadata } from "next";

import { ServicesIndex } from "@/components/sections/services/services-index";

const title = "Creative Services";
const description =
  "Explore AY Media Work across video editing, animation, SaaS video, graphic design, web development, AI automation, Meta ads, CGI, and VFX.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: `${title} | AY Media Work`,
    description,
    type: "website",
    url: "/services",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | AY Media Work`,
    description,
  },
};

export default function ServicesPage() {
  return <ServicesIndex />;
}

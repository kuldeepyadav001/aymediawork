import type { Metadata } from "next";

import { AboutIndex } from "@/components/sections/about/about-index";

const title = "About the Studio";
const description =
  "Meet the connected studio model behind AY Media Work—bringing story, design, motion, digital experiences, automation, CGI, and VFX into one creative direction.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `${title} | AY Media Work`,
    description,
    images: [
      {
        alt: "Film, interface, graphic, and dimensional forms converging inside a dark creative space",
        height: 816,
        url: "/images/about/studio-convergence.jpg",
        width: 1312,
      },
    ],
    type: "website",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | AY Media Work`,
    description,
    images: ["/images/about/studio-convergence.jpg"],
  },
};

export default function AboutPage() {
  return <AboutIndex />;
}

import type { Metadata } from "next";

import { AboutIndex } from "@/components/sections/about/about-index";
import { createPageMetadata } from "@/lib/seo/metadata";

const title = "About the Studio";
const description =
  "Meet the connected studio model behind AY Media Work—bringing story, design, motion, digital experiences, automation, CGI, and VFX into one creative direction.";

export const metadata: Metadata = createPageMetadata({
  description,
  image: {
    alt: "Film, interface, graphic, and dimensional forms converging inside a dark creative space",
    height: 816,
    src: "/images/about/studio-convergence.jpg",
    width: 1312,
  },
  path: "/about",
  title,
});

export default function AboutPage() {
  return <AboutIndex />;
}

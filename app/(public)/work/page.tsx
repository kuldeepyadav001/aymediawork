import type { Metadata } from "next";

import { WorkIndex } from "@/components/sections/work/work-index";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getPublishedProjects } from "@/lib/supabase/queries/public";

const title = "Work & Original Studio Concepts";
const description =
  "Explore original AY Media Work direction studies across film, motion, product stories, campaigns, digital systems, AI animation, CGI, and VFX.";
const socialImage = {
  alt: "Layered film strips converging around a precise cobalt beam in a dark cinematic space",
  src: "/images/work/signal-in-the-noise.jpg",
};

export const metadata: Metadata = createPageMetadata({
  description,
  image: {
    alt: socialImage.alt,
    height: 816,
    src: socialImage.src,
    width: 1312,
  },
  path: "/work",
  title,
});

export default async function WorkPage() {
  const studies = await getPublishedProjects();
  return <WorkIndex studies={studies} />;
}

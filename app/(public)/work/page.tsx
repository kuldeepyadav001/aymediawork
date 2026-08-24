import type { Metadata } from "next";

import { WorkIndex } from "@/components/sections/work/work-index";
import { getPublishedProjects } from "@/lib/supabase/queries/public";

const title = "Work & Original Studio Concepts";
const description =
  "Explore original AY Media Work direction studies across film, motion, product stories, campaigns, digital systems, AI animation, CGI, and VFX.";
const socialImage = {
  alt: "Layered film strips converging around a precise cobalt beam in a dark cinematic space",
  src: "/images/work/signal-in-the-noise.jpg",
};

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: `${title} | AY Media Work`,
    description,
    images: [
      {
        alt: socialImage.alt,
        height: 816,
        url: socialImage.src,
        width: 1312,
      },
    ],
    type: "website",
    url: "/work",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | AY Media Work`,
    description,
    images: [socialImage.src],
  },
};

export default async function WorkPage() {
  const studies = await getPublishedProjects();
  return <WorkIndex studies={studies} />;
}

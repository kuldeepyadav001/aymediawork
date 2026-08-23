import type { Metadata } from "next";

import { CreativeStudies } from "@/components/sections/home/creative-studies";
import { HomeHero } from "@/components/sections/home/home-hero";
import { ServicesOverview } from "@/components/sections/home/services-overview";
import { StudioProcess } from "@/components/sections/home/studio-process";

export const metadata: Metadata = {
  title: "Creative Media Studio",
  description:
    "AY Media Work connects video, animation, design, web development, automation, advertising, CGI, and VFX for brands, businesses, and creators.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "AY Media Work — Creative Media Studio",
    description:
      "Stories built to move. Frames made to stay. Explore editing, motion, design, and digital storytelling by AY Media Work.",
    images: [
      {
        url: "/images/home/hero-cinematic-frame.jpg",
        width: 1312,
        height: 816,
        alt: "AY Media Work creative media studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AY Media Work — Creative Media Studio",
    description: "Ideas in motion. Stories that stay.",
    images: ["/images/home/hero-cinematic-frame.jpg"],
  },
};

export default function HomePage() {
  return (
    <div className="relative isolate overflow-hidden">
      <HomeHero />
      <ServicesOverview />
      <CreativeStudies />
      <StudioProcess />
    </div>
  );
}

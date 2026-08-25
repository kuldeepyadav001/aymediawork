import type { Metadata } from "next";

import { CreativeStudies } from "@/components/sections/home/creative-studies";
import { HomeHero } from "@/components/sections/home/home-hero";
import { ServicesOverview } from "@/components/sections/home/services-overview";
import { StudioProcess } from "@/components/sections/home/studio-process";
import {
  getPublishedProjects,
  getPublishedServices,
} from "@/lib/supabase/queries/public";

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

export default async function HomePage() {
  const [services, projects] = await Promise.all([
    getPublishedServices(),
    getPublishedProjects(),
  ]);
  const homepageServices = services.map(
    ({ description, index, slug, title }) => ({
      description,
      index,
      slug,
      title,
    }),
  );
  const creativeStudies = projects
    .slice(0, 3)
    .map(({ category, description, image, slug, title }) => ({
      alt: image.alt,
      category,
      description,
      href: `/work/${slug}`,
      image: image.src,
      title,
    }));

  return (
    <div className="relative isolate overflow-hidden">
      <HomeHero disciplines={services.map((service) => service.title)} />
      <ServicesOverview services={homepageServices} />
      <CreativeStudies studies={creativeStudies} />
      <StudioProcess />
    </div>
  );
}

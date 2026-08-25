import type { Metadata } from "next";

import { CreativeStudies } from "@/components/sections/home/creative-studies";
import { HomeHero } from "@/components/sections/home/home-hero";
import { ServicesOverview } from "@/components/sections/home/services-overview";
import { StudioProcess } from "@/components/sections/home/studio-process";
import { createPageMetadata, SITE_DESCRIPTION } from "@/lib/seo/metadata";
import {
  getPublishedProjects,
  getPublishedServices,
} from "@/lib/supabase/queries/public";

export const metadata: Metadata = createPageMetadata({
  description: SITE_DESCRIPTION,
  path: "/",
  title: "Creative Media Studio",
});

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

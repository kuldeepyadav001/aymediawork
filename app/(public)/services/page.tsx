import type { Metadata } from "next";

import { ServicesIndex } from "@/components/sections/services/services-index";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getPublishedServices } from "@/lib/supabase/queries/public";

const title = "Creative Services";
const description =
  "Explore AY Media Work across video editing, animation, SaaS video, graphic design, web development, AI automation, organic social media marketing, Meta ads, CGI, and VFX.";

export const metadata: Metadata = createPageMetadata({
  description,
  path: "/services",
  title,
});

export default async function ServicesPage() {
  const services = await getPublishedServices();
  return <ServicesIndex services={services} />;
}

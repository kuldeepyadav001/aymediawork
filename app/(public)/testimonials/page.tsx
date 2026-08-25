import type { Metadata } from "next";

import { TestimonialsIndex } from "@/components/sections/testimonials/testimonials-index";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  getPublishedClientLogos,
  getPublishedTestimonials,
} from "@/lib/supabase/queries/public";

const title = "Testimonials";
const description =
  "The client-feedback publishing standard at AY Media Work: exact words, confirmed attribution, useful context, and explicit approval before any testimonial goes live.";

export const metadata: Metadata = createPageMetadata({
  description,
  image: {
    alt: "Abstract translucent speech forms gathering around a luminous centre in a dark cinematic space",
    height: 816,
    src: "/images/testimonials/earned-words.jpg",
    width: 1312,
  },
  path: "/testimonials",
  title,
});

export default async function TestimonialsPage() {
  const [clientLogos, testimonials] = await Promise.all([
    getPublishedClientLogos(),
    getPublishedTestimonials(),
  ]);
  return (
    <TestimonialsIndex clientLogos={clientLogos} testimonials={testimonials} />
  );
}

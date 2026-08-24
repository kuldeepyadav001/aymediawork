import type { Metadata } from "next";

import { TestimonialsIndex } from "@/components/sections/testimonials/testimonials-index";

const title = "Testimonials";
const description =
  "The client-feedback publishing standard at AY Media Work: exact words, confirmed attribution, useful context, and explicit approval before any testimonial goes live.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/testimonials",
  },
  openGraph: {
    title: `${title} | AY Media Work`,
    description,
    images: [
      {
        alt: "Abstract translucent speech forms gathering around a luminous centre in a dark cinematic space",
        height: 816,
        url: "/images/testimonials/earned-words.jpg",
        width: 1312,
      },
    ],
    type: "website",
    url: "/testimonials",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | AY Media Work`,
    description,
    images: ["/images/testimonials/earned-words.jpg"],
  },
};

export default function TestimonialsPage() {
  return <TestimonialsIndex />;
}

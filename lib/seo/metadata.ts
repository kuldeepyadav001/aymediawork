import type { Metadata } from "next";

export const SITE_NAME = "AY Media Work";
export const SITE_DESCRIPTION =
  "AY Media Work connects video, animation, design, web development, automation, advertising, CGI, and VFX for brands, businesses, and creators.";

export const DEFAULT_SOCIAL_IMAGE = {
  alt: "AY Media Work creative media studio",
  height: 816,
  src: "/images/home/hero-cinematic-frame.jpg",
  width: 1312,
} as const;

type PageMetadataOptions = {
  description: string;
  image?: {
    alt: string;
    height?: number;
    src: string;
    width?: number;
  };
  path: `/${string}` | "/";
  title: string;
  twitterCard?: "summary" | "summary_large_image";
};

export function createPageMetadata({
  description,
  image = DEFAULT_SOCIAL_IMAGE,
  path,
  title,
  twitterCard = "summary_large_image",
}: PageMetadataOptions): Metadata {
  const socialTitle = `${title} | ${SITE_NAME}`;

  return {
    alternates: { canonical: path },
    description,
    openGraph: {
      description,
      images: [
        {
          alt: image.alt,
          ...(image.height ? { height: image.height } : {}),
          url: image.src,
          ...(image.width ? { width: image.width } : {}),
        },
      ],
      siteName: SITE_NAME,
      title: socialTitle,
      type: "website",
      url: path,
    },
    title,
    twitter: {
      card: twitterCard,
      description,
      images: [image.src],
      title: socialTitle,
    },
  };
}

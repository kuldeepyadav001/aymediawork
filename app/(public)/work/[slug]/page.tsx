import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WorkDetail } from "@/components/sections/work/work-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { WORK_STUDIES } from "@/lib/constants/work";
import {
  getPublishedProjectBySlug,
  getPublishedProjects,
  getPublishedServices,
} from "@/lib/supabase/queries/public";
import { getSiteUrl } from "@/lib/utils/site-url";

type WorkStudyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return WORK_STUDIES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WorkStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = await getPublishedProjectBySlug(slug);

  if (!study) {
    notFound();
  }

  const canonical = `/work/${study.slug}`;
  const title = `${study.title} — Original Studio Concept`;

  return {
    title,
    description: study.metaDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${title} | AY Media Work`,
      description: study.metaDescription,
      siteName: "AY Media Work",
      images: [
        {
          alt: study.image.alt,
          height: 816,
          url: study.image.src,
          width: 1312,
        },
      ],
      type: "article",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | AY Media Work`,
      description: study.metaDescription,
      images: [study.image.src],
    },
  };
}

export default async function WorkStudyPage({ params }: WorkStudyPageProps) {
  const { slug } = await params;
  const study = await getPublishedProjectBySlug(slug);

  if (!study) {
    notFound();
  }

  const [catalog, studies] = await Promise.all([
    getPublishedServices(),
    getPublishedProjects(),
  ]);
  const siteUrl = getSiteUrl();
  const studyUrl = new URL(`/work/${study.slug}`, siteUrl).toString();
  const structuredData = {
    "@context": "https://schema.org",
    "@id": `${studyUrl}#creative-work`,
    "@type": "CreativeWork",
    abstract: study.description,
    creator: { "@id": new URL("/#organization", siteUrl).toString() },
    description: study.metaDescription,
    image: new URL(study.image.src, siteUrl).toString(),
    name: study.title,
    url: studyUrl,
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <WorkDetail catalog={catalog} studies={studies} study={study} />
    </>
  );
}

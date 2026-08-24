import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WorkDetail } from "@/components/sections/work/work-detail";
import { getWorkStudyBySlug, WORK_STUDIES } from "@/lib/constants/work";

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
  const study = getWorkStudyBySlug(slug);

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
  const study = getWorkStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  return <WorkDetail study={study} />;
}

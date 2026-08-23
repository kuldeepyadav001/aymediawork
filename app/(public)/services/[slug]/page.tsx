import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceDetail } from "@/components/sections/services/service-detail";
import { getServiceBySlug, SERVICE_CATALOG } from "@/lib/constants/services";

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return SERVICE_CATALOG.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const canonical = `/services/${service.slug}`;
  const title = `${service.title} Services`;

  return {
    title,
    description: service.metaDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${title} | AY Media Work`,
      description: service.metaDescription,
      images: [
        {
          alt: service.image.alt,
          url: service.image.src,
        },
      ],
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | AY Media Work`,
      description: service.metaDescription,
      images: [service.image.src],
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetail service={service} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceDetail } from "@/components/sections/services/service-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { SERVICE_CATALOG } from "@/lib/constants/services";
import {
  getPublishedServiceBySlug,
  getPublishedProjects,
  getPublishedServices,
} from "@/lib/supabase/queries/public";
import { getSiteUrl } from "@/lib/utils/site-url";

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
  const service = await getPublishedServiceBySlug(slug);

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
      siteName: "AY Media Work",
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
  const service = await getPublishedServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const [catalog, projects] = await Promise.all([
    getPublishedServices(),
    getPublishedProjects(),
  ]);
  const relatedStudies = projects
    .filter((study) => study.services.includes(service.slug))
    .slice(0, 6);
  const siteUrl = getSiteUrl();
  const serviceUrl = new URL(`/services/${service.slug}`, siteUrl).toString();
  const structuredData = {
    "@context": "https://schema.org",
    "@id": `${serviceUrl}#service`,
    "@type": "Service",
    description: service.metaDescription,
    image: new URL(service.image.src, siteUrl).toString(),
    name: service.title,
    provider: { "@id": new URL("/#organization", siteUrl).toString() },
    serviceType: service.title,
    url: serviceUrl,
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <ServiceDetail
        catalog={catalog}
        relatedStudies={relatedStudies}
        service={service}
      />
    </>
  );
}

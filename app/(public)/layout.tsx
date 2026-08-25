import type { ReactNode } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AnalyticsConsentManager } from "@/components/privacy/analytics-consent-manager";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { getAnalyticsConfiguration } from "@/lib/analytics/config";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo/metadata";
import { getPublicSiteProfile } from "@/lib/supabase/queries/public";
import { getSiteUrl } from "@/lib/utils/site-url";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const siteProfile = await getPublicSiteProfile();
  const siteUrl = getSiteUrl();
  const organizationId = new URL("/#organization", siteUrl).toString();
  const sameAs = siteProfile.socialLinks.flatMap((link) =>
    link.status === "active" ? [link.href] : [],
  );
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@id": organizationId,
      "@type": "Organization",
      description: SITE_DESCRIPTION,
      logo: new URL(
        "/images/brand/ay-media-work-logo-original.jpg",
        siteUrl,
      ).toString(),
      name: SITE_NAME,
      ...(sameAs.length ? { sameAs } : {}),
      url: siteUrl.toString(),
    },
    {
      "@context": "https://schema.org",
      "@id": new URL("/#website", siteUrl).toString(),
      "@type": "WebSite",
      description: SITE_DESCRIPTION,
      name: SITE_NAME,
      publisher: { "@id": organizationId },
      url: siteUrl.toString(),
    },
  ];

  return (
    <SmoothScrollProvider>
      <JsonLd data={structuredData} />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main
        className="min-h-[60vh] pt-14 sm:pt-16"
        id="main-content"
        tabIndex={-1}
      >
        {children}
      </main>
      <SiteFooter
        brandLine={siteProfile.brandLine}
        socialLinks={siteProfile.socialLinks}
      />
      <AnalyticsConsentManager config={getAnalyticsConfiguration()} />
    </SmoothScrollProvider>
  );
}

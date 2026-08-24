import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { getPublicSiteProfile } from "@/lib/supabase/queries/public";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const siteProfile = await getPublicSiteProfile();

  return (
    <SmoothScrollProvider>
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
    </SmoothScrollProvider>
  );
}

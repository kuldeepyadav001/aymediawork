import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main
        className="min-h-[60vh] pt-16 sm:pt-[4.5rem]"
        id="main-content"
        tabIndex={-1}
      >
        {children}
      </main>
      <SiteFooter />
    </SmoothScrollProvider>
  );
}

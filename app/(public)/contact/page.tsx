import type { Metadata } from "next";
import { ArrowDown, Handshake, ShieldCheck, Sparkles } from "lucide-react";

import { ContactJourneys } from "@/components/forms/contact-journeys";
import { Reveal } from "@/components/animations/reveal";
import { Container } from "@/components/shared/container";
import type { InquiryType } from "@/lib/constants/inquiries";
import { getServiceBySlug } from "@/lib/constants/services";
import { getSiteUrl } from "@/lib/utils/site-url";

const title = "Contact the Studio";
const description =
  "Start a project or introduce your creative practice through the dedicated AY Media Work client and collaborator inquiry journeys.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `${title} | AY Media Work`,
    description,
    type: "website",
    url: "/contact",
  },
  twitter: {
    card: "summary",
    title: `${title} | AY Media Work`,
    description,
  },
};

type ContactPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : value?.[0];
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const query = await searchParams;
  const requestedType = getSingleValue(query.type);
  const initialType: InquiryType =
    requestedType === "partner" ? "partner" : "client";
  const requestedService = getSingleValue(query.service);
  const initialService = requestedService
    ? getServiceBySlug(requestedService)
    : undefined;
  const pageUrl = new URL("contact", getSiteUrl()).toString();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    description,
    mainEntity: {
      "@type": "Organization",
      name: "AY Media Work",
      url: getSiteUrl().toString(),
    },
    name: title,
    url: pageUrl,
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />

      <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_16%,hsl(252_91%_62%/0.18),transparent_34%),radial-gradient(circle_at_18%_82%,hsl(221_100%_58%/0.13),transparent_38%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(hsl(0_0%_100%/0.055)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%/0.055)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
        />

        <Container className="py-20 sm:py-28 lg:py-36">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.65fr)] lg:items-end">
            <Reveal>
              <p className="editorial-kicker mb-6">Contact the studio</p>
              <h1 className="max-w-5xl text-balance font-display text-display-xl">
                Two ways in. One clear place to begin.
              </h1>
              <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
                Bring a project that needs shape, or introduce the specialist
                craft you want to contribute. Choose the route that fits and
                share only the details available now.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <a
                className="group flex items-center justify-between gap-5 rounded-2xl border border-white/[0.1] bg-white/[0.035] p-5 text-sm text-foreground backdrop-blur-xl transition-[border-color,background-color] hover:border-primary/35 hover:bg-primary/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href="#inquiry-journeys"
              >
                <span>
                  <span className="block font-semibold">Choose a journey</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Project or collaboration
                  </span>
                </span>
                <span className="flex size-11 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:translate-y-1">
                  <ArrowDown aria-hidden="true" className="size-4" />
                </span>
              </a>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/[0.08] py-14 sm:py-20">
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-white/[0.09] bg-white/[0.025] p-6 sm:p-7">
                <span className="mb-6 flex size-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <Sparkles aria-hidden="true" className="size-5" />
                </span>
                <p className="editorial-kicker mb-3">Client inquiry</p>
                <h2 className="font-display text-2xl tracking-[-0.035em]">
                  Share the work you want to create.
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Choose one or more services, add your preferred timeline, and
                  explain the project. No budget, pricing, or payment details
                  are requested.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="h-full rounded-2xl border border-white/[0.09] bg-white/[0.025] p-6 sm:p-7">
                <span className="mb-6 flex size-11 items-center justify-center rounded-xl border border-brand-violet/25 bg-brand-violet/10 text-brand-violet">
                  <Handshake aria-hidden="true" className="size-5" />
                </span>
                <p className="editorial-kicker mb-3">Partner inquiry</p>
                <h2 className="font-display text-2xl tracking-[-0.035em]">
                  Introduce your practice and availability.
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Share your specialty, portfolio, service areas, availability,
                  and the kind of collaboration you would like to explore.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24" id="inquiry-journeys">
        <Container>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_17rem] xl:items-start">
            <Reveal>
              <div className="glass-panel rounded-2xl p-5 sm:p-8 lg:p-10">
                <ContactJourneys
                  initialServiceId={
                    initialType === "client" ? initialService?.id : undefined
                  }
                  initialType={initialType}
                  turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                />
              </div>
            </Reveal>

            <Reveal className="xl:sticky xl:top-24" delay={0.08}>
              <aside className="rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5 sm:p-6">
                <span className="flex size-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <ShieldCheck aria-hidden="true" className="size-5" />
                </span>
                <h2 className="mt-5 font-display text-xl tracking-[-0.025em]">
                  Share with care
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  <li>
                    Details are used to review and respond to your inquiry.
                  </li>
                  <li>Newsletter consent is separate and always optional.</li>
                  <li>
                    Do not send passwords, private keys, payment information, or
                    material you are not authorised to share.
                  </li>
                </ul>
              </aside>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}

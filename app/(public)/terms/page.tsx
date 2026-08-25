import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { createPageMetadata } from "@/lib/seo/metadata";

const DESCRIPTION =
  "Terms for visiting the AY Media Work website and submitting project or collaboration inquiries.";

export const metadata: Metadata = createPageMetadata({
  description: DESCRIPTION,
  path: "/terms",
  title: "Website terms",
});

const sections: readonly LegalSection[] = [
  {
    id: "acceptance",
    title: "About these terms",
    content: (
      <>
        <p>
          These terms apply when you visit this website or submit an inquiry
          through it. By using the site, you agree to use it lawfully and in
          accordance with these terms. If you do not agree, please stop using
          the site.
        </p>
        <p>
          The site presents AY Media Work&apos;s creative capabilities,
          provisional portfolio concepts, editorial material, and ways to begin
          a conversation. It does not itself create a client, employment,
          partnership, or agency relationship.
        </p>
      </>
    ),
  },
  {
    id: "content",
    title: "Website content",
    content: (
      <>
        <p>
          Content is provided for general information and presentation. AY Media
          Work aims to keep it useful and accurate but does not promise that
          every page will always be complete, current, uninterrupted, or free
          from error.
        </p>
        <p>
          Concept work is identified as original or provisional exploration and
          must not be interpreted as an unverified client engagement,
          endorsement, business result, or performance claim. Any future project
          scope, deliverables, timing, fees, usage rights, and acceptance terms
          must be agreed separately in writing.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <>
        <p>You must not:</p>
        <ul>
          <li>use the website for unlawful, deceptive, or harmful activity;</li>
          <li>
            attempt to bypass security, access private administration areas, or
            disrupt the site or its providers;
          </li>
          <li>
            submit malicious code, automated spam, false identity information,
            or content that infringes another person&apos;s rights;
          </li>
          <li>
            scrape, reproduce, or redistribute substantial site content in a way
            that violates applicable law or the rights of its owner; or
          </li>
          <li>misrepresent an association with AY Media Work.</li>
        </ul>
        <p>
          Access may be limited or blocked when reasonably necessary to protect
          the service, its users, or its providers.
        </p>
      </>
    ),
  },
  {
    id: "inquiries",
    title: "Inquiries and submitted material",
    content: (
      <>
        <p>
          You are responsible for ensuring the information you submit is
          accurate and that you are permitted to share it. Do not send trade
          secrets, unpublished credentials, payment data, or other sensitive
          material through the public forms.
        </p>
        <p>
          Submitting an inquiry is an invitation to discuss a possible project
          or collaboration. AY Media Work may accept or decline that
          conversation and does not promise a response time or availability.
          Newsletter enrollment is optional and requires a separate selection.
        </p>
        <p>
          Personal information submitted through the site is handled as
          described in the <Link href="/privacy">Privacy notice</Link>.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    content: (
      <>
        <p>
          The website&apos;s original design, copy, graphics, motion, concept
          presentations, and brand elements are protected by applicable
          intellectual-property laws. Third-party names, marks, tools, and
          linked materials remain the property of their respective owners.
        </p>
        <p>
          You may view and share links to public pages for personal or
          legitimate business evaluation. No ownership or broader licence is
          transferred by site access. Written permission is required before
          republishing, selling, modifying, or presenting protected site
          material as your own, except where applicable law permits otherwise.
        </p>
      </>
    ),
  },
  {
    id: "third-parties",
    title: "Third-party services and links",
    content: (
      <>
        <p>
          The site relies on infrastructure and security providers and may link
          to external profiles. External services have their own terms,
          availability, and privacy practices. AY Media Work does not control or
          endorse all material available through third-party destinations merely
          by linking to them.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Availability and responsibility",
    content: (
      <>
        <p>
          The website is provided on an “as available” basis. To the extent
          permitted by applicable law, AY Media Work is not responsible for
          indirect or consequential loss arising only from reliance on public
          website content, inability to access the site, or a third-party
          service outside its reasonable control.
        </p>
        <p>
          Nothing in these terms excludes or limits responsibility that cannot
          lawfully be excluded or limited. Your statutory rights, where they
          apply, are not affected.
        </p>
      </>
    ),
  },
  {
    id: "changes-contact",
    title: "Changes, applicable law, and questions",
    content: (
      <>
        <p>
          These terms may be updated as the website, services, or operating
          requirements change. The current review date appears above. Continued
          use after an update means the revised terms apply from their stated
          date.
        </p>
        <p>
          These terms are subject to applicable law. They do not select an
          exclusive court or jurisdiction that has not been operationally
          confirmed. Questions about these terms can be sent through the
          website&apos;s <Link href="/contact">contact form</Link>.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      description={DESCRIPTION}
      eyebrow="Terms"
      lastUpdated="25 August 2026"
      sections={sections}
      title="Website terms"
    />
  );
}

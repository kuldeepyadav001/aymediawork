import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { PrivacySettingsButton } from "@/components/privacy/privacy-settings-button";
import { createPageMetadata } from "@/lib/seo/metadata";

const DESCRIPTION =
  "How AY Media Work handles inquiries, newsletter choices, security data, and optional website analytics.";

export const metadata: Metadata = createPageMetadata({
  description: DESCRIPTION,
  path: "/privacy",
  title: "Privacy notice",
});

const sections: readonly LegalSection[] = [
  {
    id: "scope",
    title: "Scope and who handles your information",
    content: (
      <>
        <p>
          This notice describes how AY Media Work handles personal information
          submitted through this website and information used to operate and
          protect it. It applies to visitors, prospective clients,
          collaborators, and newsletter subscribers.
        </p>
        <p>
          AY Media Work is responsible for the website&apos;s use of this
          information. Verified public contact details have not yet been
          published, so privacy requests can be sent through the{" "}
          <Link href="/contact">contact form</Link>. Select the journey that
          best fits your request and clearly state that it concerns privacy.
        </p>
      </>
    ),
  },
  {
    id: "information",
    title: "Information collected",
    content: (
      <>
        <p>The website may collect:</p>
        <ul>
          <li>
            <strong>Client inquiries:</strong> name, email, optional contact
            number, optional company or brand, selected services, preferred
            timeline, project details, and your consent choices.
          </li>
          <li>
            <strong>Partner inquiries:</strong> name, email, optional contact
            number, specialty, portfolio URL, availability, selected services,
            collaboration details, and your consent choices.
          </li>
          <li>
            <strong>Newsletter requests:</strong> email address, consent,
            source, and subscription timestamps.
          </li>
          <li>
            <strong>Security information:</strong> request and challenge data
            needed to validate form submissions. A one-way keyed hash derived
            from the network address is temporarily used for rate limiting; the
            raw address is not stored in the website database for this purpose.
          </li>
          <li>
            <strong>Optional measurement information:</strong> page visits,
            device or browser context, approximate location, and performance
            measurements when a configured analytics provider is enabled and you
            have opted in.
          </li>
        </ul>
        <p>
          The forms do not request payment details, passwords, or budget
          information. Please do not include confidential, sensitive, or
          unnecessary personal information in free-text fields.
        </p>
      </>
    ),
  },
  {
    id: "purposes",
    title: "Why information is used",
    content: (
      <>
        <p>Information is used only as needed to:</p>
        <ul>
          <li>review, respond to, and manage an inquiry;</li>
          <li>
            record and administer a newsletter request you expressly selected;
          </li>
          <li>deliver forms, prevent abuse, and secure the website;</li>
          <li>operate, troubleshoot, and maintain the service; and</li>
          <li>
            understand website use and performance when optional analytics is
            configured and you consent.
          </li>
        </ul>
        <p>
          Inquiry privacy consent and newsletter consent are separate.
          Submitting an inquiry does not subscribe you unless you select the
          optional newsletter checkbox.
        </p>
      </>
    ),
  },
  {
    id: "providers",
    title: "Service providers",
    content: (
      <>
        <p>
          The website uses service providers only for specific operational
          functions. Depending on deployment configuration, these may include:
        </p>
        <ul>
          <li>
            <strong>Vercel</strong> for website hosting and, only after
            analytics consent, Web Analytics or Speed Insights;
          </li>
          <li>
            <strong>Supabase</strong> for secure inquiry, newsletter, and
            administrative data storage;
          </li>
          <li>
            <strong>Cloudflare Turnstile</strong> to distinguish valid form
            submissions from abuse; and
          </li>
          <li>
            <strong>Resend</strong> for private inquiry notifications when the
            notification service is configured.
          </li>
        </ul>
        <p>
          Google Analytics may also be enabled as an optional provider. It is
          not loaded before consent, advertising storage and advertising signals
          remain disabled, and this site configures its first-party analytics
          cookies with a maximum lifetime of 180 days.
        </p>
        <p>
          Providers may process information in locations where they or their
          infrastructure operate. Their handling is also governed by their own
          terms and privacy documentation.
        </p>
      </>
    ),
  },
  {
    id: "analytics",
    title: "Analytics choices and device storage",
    content: (
      <>
        <p>
          Optional analytics and performance providers are disabled unless they
          are explicitly configured for the deployment and you accept analytics.
          Rejecting analytics does not prevent you from viewing the site or
          sending a form.
        </p>
        <p>
          Your choice is stored in your browser for up to 180 days. You may
          change or withdraw it at any time. Withdrawing consent stops future
          optional measurement on this site and triggers removal of accessible
          first-party Google Analytics cookies. It cannot recall information
          already sent while consent was active.
        </p>
        <div className="not-prose mt-5">
          <PrivacySettingsButton className="text-sm font-semibold text-primary underline decoration-primary/50 underline-offset-4 hover:text-primary/80" />
        </div>
        <p>
          Essential browser storage and processing may still be used for form
          security and to remember your privacy selection. Cloudflare Turnstile
          is an essential anti-abuse control, not an optional analytics
          provider.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "Retention and security",
    content: (
      <>
        <p>
          Information is kept only for as long as reasonably needed to handle
          the purpose for which it was collected, maintain security, resolve
          disputes, and meet applicable obligations. Newsletter records remain
          until consent is withdrawn or the record is otherwise no longer
          required. Inactive rate-limit records are eligible for automated
          cleanup after 24 hours.
        </p>
        <p>
          The website uses access controls, row-level database security,
          server-side validation, same-site checks, abuse detection, and
          restricted administrative access. No internet service can promise
          absolute security, so only necessary information should be submitted.
        </p>
      </>
    ),
  },
  {
    id: "choices",
    title: "Your choices and requests",
    content: (
      <>
        <p>
          Subject to applicable law, you may ask for access, correction, or
          deletion of your personal information, object to or restrict certain
          processing, or withdraw consent. You may also request removal from the
          newsletter.
        </p>
        <p>
          Send a request through the <Link href="/contact">contact form</Link>
          and include enough detail to identify the relevant submission.
          Identity may need to be verified before a request is completed.
          Analytics consent can be changed immediately using the control above
          or the footer link.
        </p>
      </>
    ),
  },
  {
    id: "links-updates",
    title: "External links and updates",
    content: (
      <>
        <p>
          This website links to third-party profiles and services. Their privacy
          practices are outside AY Media Work&apos;s control, so review their
          notices before providing information.
        </p>
        <p>
          This notice may be revised when services or operating practices
          change. The current review date appears at the top of this page.
          Material changes should be reviewed before they take effect where
          required.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      description={DESCRIPTION}
      eyebrow="Privacy"
      lastUpdated="25 August 2026"
      sections={sections}
      title="Privacy notice"
    />
  );
}

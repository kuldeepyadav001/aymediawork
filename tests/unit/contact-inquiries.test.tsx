import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import ContactPage, { metadata } from "@/app/(public)/contact/page";
import { ContactJourneys } from "@/components/forms/contact-journeys";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { SERVICE_CATALOG } from "@/lib/constants/services";
import {
  clientInquirySchema,
  newsletterSchema,
  partnerInquirySchema,
} from "@/lib/validations/inquiries";

afterEach(cleanup);

const serviceIds = SERVICE_CATALOG.map(({ id }) => id);

describe("contact and inquiry journeys", () => {
  it("assigns a stable database ID to every approved service", () => {
    expect(SERVICE_CATALOG).toHaveLength(10);
    expect(new Set(serviceIds).size).toBe(10);

    for (const service of SERVICE_CATALOG) {
      expect(service.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
    }
  });

  it("validates client project details without any budget, pricing, or payment field", () => {
    const result = clientInquirySchema.safeParse({
      brief:
        "We need a clear SaaS product story for a new feature and several launch formats.",
      companyBrand: "Example product team",
      contactNumber: "",
      email: "hello@example.com",
      name: "Project lead",
      newsletterConsent: false,
      preferredTimeline: "one-to-three-months",
      privacyConsent: true,
      serviceIds: [SERVICE_CATALOG[2]?.id],
      turnstileToken: "test-token",
      type: "client",
      website: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("budget");
      expect(result.data).not.toHaveProperty("price");
      expect(result.data.serviceIds).toEqual([SERVICE_CATALOG[2]?.id]);
    }
  });

  it("requires complete partner craft, portfolio, availability, services, and consent details", () => {
    const valid = partnerInquirySchema.safeParse({
      availability: "future-projects",
      collaborationMessage:
        "I would like to support future animation work through modelling, lighting, and look development.",
      contactNumber: "+91 98765 43210",
      email: "artist@example.com",
      name: "Independent artist",
      newsletterConsent: true,
      portfolioUrl: "https://example.com/portfolio",
      privacyConsent: true,
      serviceIds: [SERVICE_CATALOG[1]?.id, SERVICE_CATALOG[8]?.id],
      specialty: "3D artist",
      turnstileToken: "test-token",
      type: "partner",
      website: "",
    });
    const unsafePortfolio = partnerInquirySchema.safeParse({
      availability: "future-projects",
      collaborationMessage:
        "I would like to support future animation work through modelling, lighting, and look development.",
      contactNumber: "",
      email: "artist@example.com",
      name: "Independent artist",
      newsletterConsent: false,
      portfolioUrl: "javascript:alert(1)",
      privacyConsent: true,
      serviceIds: [SERVICE_CATALOG[1]?.id],
      specialty: "3D artist",
      turnstileToken: "test-token",
      type: "partner",
      website: "",
    });

    expect(valid.success).toBe(true);
    expect(unsafePortfolio.success).toBe(false);
  });

  it("renders the client route with service preselection and no commercial fields", () => {
    const initialService = SERVICE_CATALOG[2];
    expect(initialService).toBeDefined();
    if (!initialService) throw new Error("Expected an approved service");

    render(
      <ContactJourneys
        initialServiceId={initialService.id}
        initialType="client"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Tell us what you want to make." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: initialService.title }),
    ).toBeChecked();
    expect(screen.getAllByRole("checkbox", { name: /./ })).toHaveLength(12);
    expect(
      screen.queryByLabelText(/budget|price|payment/i),
    ).not.toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/₹|\$\d|starting at/i);
  });

  it("switches to the separate partner journey", async () => {
    const user = userEvent.setup();
    render(<ContactJourneys initialType="client" />);

    await user.click(screen.getByRole("tab", { name: "Collaborate" }));

    expect(
      screen.getByRole("heading", {
        name: "Introduce your craft and availability.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Portfolio URL")).toBeInTheDocument();
    expect(screen.getByLabelText("Primary specialty")).toBeInTheDocument();
    expect(screen.getByLabelText("Availability")).toBeInTheDocument();
    expect(screen.queryByLabelText("Company / brand")).not.toBeInTheDocument();
  });

  it("renders the contact metadata, canonical, structured data, and approved disclosure", async () => {
    const page = await ContactPage({
      searchParams: Promise.resolve({
        service: "saas-video",
        type: "client",
      }),
    });
    const { container } = render(page);

    expect(metadata.alternates?.canonical).toBe("/contact");
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Two ways in. One clear place to begin.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No budget, pricing, or payment/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Do not send passwords, private keys/i),
    ).toBeInTheDocument();
    expect(
      container.querySelector('script[type="application/ld+json"]')
        ?.textContent,
    ).toContain('"@type":"ContactPage"');
  });

  it("requires explicit standalone newsletter consent", async () => {
    const user = userEvent.setup();
    render(<NewsletterForm />);

    await user.type(
      screen.getByLabelText("Email address"),
      "notes@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: "Subscribe to studio notes" }),
    );

    expect(
      await screen.findByText("Consent is required to send this form."),
    ).toBeInTheDocument();
    expect(
      newsletterSchema.safeParse({
        email: "notes@example.com",
        privacyConsent: false,
        turnstileToken: "",
        website: "",
      }).success,
    ).toBe(false);
  });

  it("keeps client and partner tabs inside one labelled inquiry selector", () => {
    render(<ContactJourneys initialType="partner" />);
    const tabList = screen.getByRole("tablist", { name: "Inquiry type" });

    expect(
      within(tabList).getByRole("tab", { name: "Start a project" }),
    ).toBeInTheDocument();
    expect(
      within(tabList).getByRole("tab", { name: "Collaborate" }),
    ).toHaveAttribute("aria-selected", "true");
  });
});

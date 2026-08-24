import { z } from "zod";

import {
  PARTNER_AVAILABILITY_VALUES,
  PROJECT_TIMELINE_VALUES,
} from "@/lib/constants/inquiries";

const nameSchema = z
  .string()
  .trim()
  .min(2, "Enter at least 2 characters.")
  .max(100, "Keep this under 100 characters.");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.")
  .max(254, "Keep this under 254 characters.");

const optionalPhoneSchema = z
  .string()
  .trim()
  .max(40, "Keep this under 40 characters.")
  .refine(
    (value) => value === "" || /^[+()\d][+()\d.\s-]{5,39}$/.test(value),
    "Enter a valid contact number or leave this blank.",
  );

const optionalShortTextSchema = z
  .string()
  .trim()
  .max(120, "Keep this under 120 characters.");

const serviceIdsSchema = z
  .array(z.string().uuid("Choose a valid service."))
  .min(1, "Choose at least one service.")
  .max(50, "Choose only the available services.")
  .refine(
    (serviceIds) => new Set(serviceIds).size === serviceIds.length,
    "Choose each service only once.",
  );

const privacyConsentSchema = z
  .boolean()
  .refine((value) => value, "Consent is required to send this form.");

const submissionSafetySchema = {
  privacyConsent: privacyConsentSchema,
  newsletterConsent: z.boolean(),
  turnstileToken: z.string().max(2048),
  website: z.string().max(0, "Leave this field empty."),
};

export const clientInquirySchema = z.object({
  type: z.literal("client"),
  name: nameSchema,
  email: emailSchema,
  contactNumber: optionalPhoneSchema,
  companyBrand: optionalShortTextSchema,
  serviceIds: serviceIdsSchema,
  preferredTimeline: z.enum(PROJECT_TIMELINE_VALUES, {
    message: "Choose a preferred timeline.",
  }),
  brief: z
    .string()
    .trim()
    .min(20, "Share at least 20 characters so we have useful context.")
    .max(5000, "Keep the project brief under 5,000 characters."),
  ...submissionSafetySchema,
});

export const partnerInquirySchema = z.object({
  type: z.literal("partner"),
  name: nameSchema,
  email: emailSchema,
  contactNumber: optionalPhoneSchema,
  specialty: z
    .string()
    .trim()
    .min(2, "Tell us your primary specialty.")
    .max(120, "Keep this under 120 characters."),
  portfolioUrl: z
    .string()
    .trim()
    .url("Enter a complete portfolio URL, including https://.")
    .max(500, "Keep this URL under 500 characters.")
    .refine((value) => {
      try {
        return ["http:", "https:"].includes(new URL(value).protocol);
      } catch {
        return false;
      }
    }, "Use an http or https portfolio URL."),
  availability: z.enum(PARTNER_AVAILABILITY_VALUES, {
    message: "Choose your availability.",
  }),
  serviceIds: serviceIdsSchema,
  collaborationMessage: z
    .string()
    .trim()
    .min(
      20,
      "Share at least 20 characters about how you would like to collaborate.",
    )
    .max(5000, "Keep the message under 5,000 characters."),
  ...submissionSafetySchema,
});

export const inquirySchema = z.discriminatedUnion("type", [
  clientInquirySchema,
  partnerInquirySchema,
]);

export const newsletterSchema = z.object({
  email: emailSchema,
  privacyConsent: privacyConsentSchema,
  turnstileToken: z.string().max(2048),
  website: z.string().max(0, "Leave this field empty."),
});

export type ClientInquiryInput = z.input<typeof clientInquirySchema>;
export type ClientInquiry = z.output<typeof clientInquirySchema>;
export type PartnerInquiryInput = z.input<typeof partnerInquirySchema>;
export type PartnerInquiry = z.output<typeof partnerInquirySchema>;
export type Inquiry = z.output<typeof inquirySchema>;
export type NewsletterInput = z.input<typeof newsletterSchema>;
export type NewsletterSubscription = z.output<typeof newsletterSchema>;

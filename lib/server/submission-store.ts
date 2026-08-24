import "server-only";

import type {
  Inquiry,
  NewsletterSubscription,
} from "@/lib/validations/inquiries";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SubmissionRateLimitError } from "@/lib/server/submission-security";
import type { Json } from "@/types/database";

export type NotificationStatus = "failed" | "sent" | "skipped";

export async function consumeSubmissionRateLimit(
  scope: "client-inquiry" | "newsletter" | "partner-inquiry",
  identifierHash: string,
) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc("consume_submission_rate_limit", {
    p_identifier_hash: identifierHash,
    p_max_requests: 5,
    p_scope: scope,
    p_window_seconds: 15 * 60,
  });

  if (error) {
    throw new Error("Unable to apply the submission rate limit", {
      cause: error,
    });
  }

  if (data !== true) {
    throw new SubmissionRateLimitError();
  }
}

export async function createInquiry(input: Inquiry) {
  const supabase = getSupabaseAdmin();
  const payload: Json =
    input.type === "client"
      ? {
          brief: input.brief,
          companyBrand: input.companyBrand,
          contactNumber: input.contactNumber,
          email: input.email,
          name: input.name,
          newsletterConsent: input.newsletterConsent,
          preferredTimeline: input.preferredTimeline,
          privacyConsent: input.privacyConsent,
          type: input.type,
        }
      : {
          availability: input.availability,
          collaborationMessage: input.collaborationMessage,
          contactNumber: input.contactNumber,
          email: input.email,
          name: input.name,
          newsletterConsent: input.newsletterConsent,
          portfolioUrl: input.portfolioUrl,
          privacyConsent: input.privacyConsent,
          specialty: input.specialty,
          type: input.type,
        };

  const { data, error } = await supabase.rpc("create_inquiry", {
    p_payload: payload,
    p_service_ids: input.serviceIds,
  });

  if (error || typeof data !== "string") {
    throw new Error("Unable to save the inquiry", { cause: error });
  }

  return data;
}

export async function updateNotificationStatus(
  inquiryId: string,
  notificationStatus: NotificationStatus,
) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("inquiries")
    .update({ notification_status: notificationStatus })
    .eq("id", inquiryId);

  if (error) {
    throw new Error("Unable to update inquiry notification status", {
      cause: error,
    });
  }
}

export async function subscribeToNewsletter(
  input: NewsletterSubscription,
  source = "footer",
) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc("subscribe_newsletter", {
    p_consent_granted: input.privacyConsent,
    p_email: input.email,
    p_source: source,
  });

  if (error || typeof data !== "string") {
    throw new Error("Unable to save the newsletter subscription", {
      cause: error,
    });
  }

  return data;
}

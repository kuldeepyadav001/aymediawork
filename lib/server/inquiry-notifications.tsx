import "server-only";

import { Resend } from "resend";

import {
  getInquiryNotificationText,
  InquiryNotificationEmail,
} from "@/emails/inquiry-notification";
import { SERVICE_CATALOG } from "@/lib/constants/services";
import type { NotificationStatus } from "@/lib/server/submission-store";
import type { Inquiry } from "@/lib/validations/inquiries";

export async function sendInquiryNotification(
  inquiry: Inquiry,
  inquiryId: string,
): Promise<NotificationStatus> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.INQUIRY_NOTIFICATION_EMAIL;

  if (!apiKey || !from || !to) return "skipped";

  const primaryService = SERVICE_CATALOG.find(
    (service) => service.id === inquiry.serviceIds[0],
  )?.title;
  const safeName = inquiry.name.replace(/[\r\n]+/g, " ");
  const subject = `[AY Media Work] New ${inquiry.type} inquiry — ${safeName}${
    primaryService ? ` / ${primaryService}` : ""
  }`;
  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: inquiry.email,
      subject,
      react: (
        <InquiryNotificationEmail inquiry={inquiry} inquiryId={inquiryId} />
      ),
      text: getInquiryNotificationText(inquiry, inquiryId),
    });

    return error ? "failed" : "sent";
  } catch {
    return "failed";
  }
}

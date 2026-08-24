import { NextResponse, type NextRequest } from "next/server";

import { sendInquiryNotification } from "@/lib/server/inquiry-notifications";
import {
  assertSameSiteRequest,
  getRateLimitIdentifier,
  hasFilledHoneypot,
  readJsonBody,
  SubmissionConfigurationError,
  SubmissionOriginError,
  SubmissionRateLimitError,
  verifyTurnstile,
} from "@/lib/server/submission-security";
import {
  consumeSubmissionRateLimit,
  createInquiry,
  updateNotificationStatus,
} from "@/lib/server/submission-store";
import { inquirySchema } from "@/lib/validations/inquiries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const responseHeaders = { "Cache-Control": "no-store" };

function errorResponse(message: string, status: number, retryAfter?: string) {
  return NextResponse.json(
    { message, ok: false },
    {
      status,
      headers: {
        ...responseHeaders,
        ...(retryAfter ? { "Retry-After": retryAfter } : {}),
      },
    },
  );
}

export async function POST(request: NextRequest) {
  try {
    assertSameSiteRequest(request);
    const rawBody = await readJsonBody(request);

    if (hasFilledHoneypot(rawBody)) {
      return NextResponse.json(
        {
          message: "Thanks. Your details have been received.",
          ok: true,
        },
        { headers: responseHeaders },
      );
    }

    const parsed = inquirySchema.safeParse(rawBody);
    if (!parsed.success) {
      return errorResponse("Check the highlighted details and try again.", 400);
    }

    const inquiry = parsed.data;
    const turnstilePassed = await verifyTurnstile(
      inquiry.turnstileToken,
      `${inquiry.type}-inquiry`,
      request,
    );

    if (!turnstilePassed) {
      return errorResponse(
        "The spam check could not be completed. Refresh and try again.",
        400,
      );
    }

    await consumeSubmissionRateLimit(
      `${inquiry.type}-inquiry`,
      getRateLimitIdentifier(request),
    );
    const inquiryId = await createInquiry(inquiry);
    const notificationStatus = await sendInquiryNotification(
      inquiry,
      inquiryId,
    );

    try {
      await updateNotificationStatus(inquiryId, notificationStatus);
    } catch {
      // Persistence already succeeded. A dashboard audit can reconcile this state.
    }

    return NextResponse.json(
      {
        message:
          inquiry.type === "client"
            ? "Thanks — your project details have been received for review."
            : "Thanks — your collaboration details have been received for review.",
        ok: true,
      },
      { headers: responseHeaders },
    );
  } catch (error) {
    if (error instanceof SubmissionOriginError) {
      return errorResponse("Cross-site submissions are not accepted.", 403);
    }

    if (error instanceof SubmissionRateLimitError) {
      return errorResponse(
        "Too many submissions were received. Please wait before trying again.",
        429,
        "900",
      );
    }

    if (error instanceof SubmissionConfigurationError) {
      return errorResponse(
        "Secure submissions are being configured. Please try again later.",
        503,
      );
    }

    if (error instanceof SyntaxError || error instanceof RangeError) {
      return errorResponse("The submission could not be read.", 400);
    }

    return errorResponse(
      "We could not save your details right now. Please try again later.",
      500,
    );
  }
}

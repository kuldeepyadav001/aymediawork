import { NextResponse, type NextRequest } from "next/server";

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
  subscribeToNewsletter,
} from "@/lib/server/submission-store";
import { newsletterSchema } from "@/lib/validations/inquiries";

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
    const rawBody = await readJsonBody(request, 8_000);

    if (hasFilledHoneypot(rawBody)) {
      return NextResponse.json(
        { message: "Thanks. Your subscription is recorded.", ok: true },
        { headers: responseHeaders },
      );
    }

    const parsed = newsletterSchema.safeParse(rawBody);
    if (!parsed.success) {
      return errorResponse(
        "Enter a valid email and confirm your consent.",
        400,
      );
    }

    const subscription = parsed.data;
    const turnstilePassed = await verifyTurnstile(
      subscription.turnstileToken,
      "newsletter",
      request,
    );

    if (!turnstilePassed) {
      return errorResponse(
        "The spam check could not be completed. Refresh and try again.",
        400,
      );
    }

    await consumeSubmissionRateLimit(
      "newsletter",
      getRateLimitIdentifier(request),
    );
    await subscribeToNewsletter(subscription);

    return NextResponse.json(
      {
        message: "You’re subscribed to AY Media Work studio notes.",
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
        "Too many attempts were received. Please wait before trying again.",
        429,
        "900",
      );
    }

    if (error instanceof SubmissionConfigurationError) {
      return errorResponse(
        "Newsletter signup is being configured. Please try again later.",
        503,
      );
    }

    if (error instanceof SyntaxError || error instanceof RangeError) {
      return errorResponse("The signup request could not be read.", 400);
    }

    return errorResponse(
      "We could not save your subscription right now. Please try again later.",
      500,
    );
  }
}

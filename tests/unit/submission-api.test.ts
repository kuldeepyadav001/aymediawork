import { readFileSync } from "node:fs";
import { join } from "node:path";

import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const storeMocks = vi.hoisted(() => ({
  consumeSubmissionRateLimit: vi.fn(),
  createInquiry: vi.fn(),
  subscribeToNewsletter: vi.fn(),
  updateNotificationStatus: vi.fn(),
}));

const notificationMocks = vi.hoisted(() => ({
  sendInquiryNotification: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/server/submission-store", () => storeMocks);
vi.mock("@/lib/server/inquiry-notifications", () => notificationMocks);

import { POST as submitInquiry } from "@/app/api/inquiries/route";
import { POST as subscribeNewsletter } from "@/app/api/newsletter/route";
import { SERVICE_CATALOG } from "@/lib/constants/services";
import {
  SubmissionConfigurationError,
  SubmissionRateLimitError,
  verifyTurnstile,
} from "@/lib/server/submission-security";

const validClientInquiry = {
  brief:
    "We need a clear product story for a new software feature and several launch formats.",
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
};

function createRequest(
  path: string,
  body: unknown,
  extraHeaders?: HeadersInit,
) {
  return new NextRequest(`https://aymediawork.example${path}`, {
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      origin: "https://aymediawork.example",
      ...extraHeaders,
    },
    method: "POST",
  });
}

beforeEach(() => {
  storeMocks.consumeSubmissionRateLimit.mockResolvedValue(undefined);
  storeMocks.createInquiry.mockResolvedValue(
    "3b6fcce9-2172-4c71-adc0-561debf346c3",
  );
  storeMocks.subscribeToNewsletter.mockResolvedValue(
    "c8dccb52-0100-4ee0-9e64-bfbaf2961874",
  );
  storeMocks.updateNotificationStatus.mockResolvedValue(undefined);
  notificationMocks.sendInquiryNotification.mockResolvedValue("sent");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("submission API boundaries", () => {
  it("validates, rate-limits, persists, and notifies for a client inquiry", async () => {
    const response = await submitInquiry(
      createRequest("/api/inquiries", validClientInquiry),
    );
    const result = (await response.json()) as { message: string; ok: boolean };

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(result.ok).toBe(true);
    expect(storeMocks.consumeSubmissionRateLimit).toHaveBeenCalledWith(
      "client-inquiry",
      expect.stringMatching(/^[a-f0-9]{64}$/),
    );
    expect(storeMocks.createInquiry).toHaveBeenCalledWith(
      expect.not.objectContaining({ budget: expect.anything() }),
    );
    expect(notificationMocks.sendInquiryNotification).toHaveBeenCalledOnce();
    expect(storeMocks.updateNotificationStatus).toHaveBeenCalledWith(
      "3b6fcce9-2172-4c71-adc0-561debf346c3",
      "sent",
    );
  });

  it("rejects unknown service IDs before persistence", async () => {
    const response = await submitInquiry(
      createRequest("/api/inquiries", {
        ...validClientInquiry,
        serviceIds: ["408a3e11-847d-49dc-b9e4-1eafbf927f04"],
      }),
    );

    expect(response.status).toBe(400);
    expect(storeMocks.createInquiry).not.toHaveBeenCalled();
  });

  it("silently accepts a filled honeypot without storing personal data", async () => {
    const response = await submitInquiry(
      createRequest("/api/inquiries", {
        ...validClientInquiry,
        website: "https://spam.example",
      }),
    );

    expect(response.status).toBe(200);
    expect(storeMocks.consumeSubmissionRateLimit).not.toHaveBeenCalled();
    expect(storeMocks.createInquiry).not.toHaveBeenCalled();
  });

  it("rejects cross-site form posts", async () => {
    const response = await submitInquiry(
      createRequest("/api/inquiries", validClientInquiry, {
        "sec-fetch-site": "cross-site",
      }),
    );

    expect(response.status).toBe(403);
    expect(storeMocks.createInquiry).not.toHaveBeenCalled();
  });

  it("returns a retry boundary when the database rate limit is reached", async () => {
    storeMocks.consumeSubmissionRateLimit.mockRejectedValueOnce(
      new SubmissionRateLimitError(),
    );

    const response = await submitInquiry(
      createRequest("/api/inquiries", validClientInquiry),
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("900");
    expect(storeMocks.createInquiry).not.toHaveBeenCalled();
  });

  it("requires standalone newsletter consent and saves a valid opt-in", async () => {
    const rejected = await subscribeNewsletter(
      createRequest("/api/newsletter", {
        email: "notes@example.com",
        privacyConsent: false,
        turnstileToken: "test-token",
        website: "",
      }),
    );
    const accepted = await subscribeNewsletter(
      createRequest("/api/newsletter", {
        email: "notes@example.com",
        privacyConsent: true,
        turnstileToken: "test-token",
        website: "",
      }),
    );

    expect(rejected.status).toBe(400);
    expect(accepted.status).toBe(200);
    expect(storeMocks.subscribeToNewsletter).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "notes@example.com",
        privacyConsent: true,
      }),
    );
  });

  it("accepts Turnstile only when success, action, and request hostname match", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          action: "client-inquiry",
          hostname: "aymediawork.example",
          success: true,
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          action: "client-inquiry",
          hostname: "unrelated.example",
          success: true,
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          action: "newsletter",
          hostname: "aymediawork.example",
          success: true,
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
    const request = createRequest("/api/inquiries", validClientInquiry);

    await expect(
      verifyTurnstile("valid-token", "client-inquiry", request),
    ).resolves.toBe(true);
    await expect(
      verifyTurnstile("wrong-host-token", "client-inquiry", request),
    ).resolves.toBe(false);
    await expect(
      verifyTurnstile("wrong-action-token", "client-inquiry", request),
    ).resolves.toBe(false);

    expect(fetchMock).toHaveBeenCalledTimes(3);
    const firstBody = fetchMock.mock.calls[0]?.[1]?.body as URLSearchParams;
    expect(firstBody.get("secret")).toBe("test-secret");
    expect(firstBody.get("response")).toBe("valid-token");
    expect(firstBody.get("remoteip")).toBeNull();
  });

  it("fails closed when production Turnstile configuration is incomplete", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");

    await expect(
      verifyTurnstile(
        "unverified-token",
        "client-inquiry",
        createRequest("/api/inquiries", validClientInquiry),
      ),
    ).rejects.toBeInstanceOf(SubmissionConfigurationError);
  });

  it("defines RLS-denied public tables and service-role-only submission functions", () => {
    const migration = readFileSync(
      join(
        process.cwd(),
        "supabase/migrations/20260824090000_contact_inquiries.sql",
      ),
      "utf8",
    );

    for (const table of [
      "services",
      "inquiries",
      "inquiry_services",
      "newsletter_subscribers",
      "submission_rate_limits",
    ]) {
      expect(migration).toContain(
        `alter table public.${table} enable row level security;`,
      );
      expect(migration).toContain(
        `revoke all on table public.${table} from anon, authenticated;`,
      );
    }

    expect(migration).toContain(
      "revoke all on function public.create_inquiry(jsonb, uuid[])\n  from public, anon, authenticated;",
    );
    expect(migration).toContain(
      "grant execute on function public.create_inquiry(jsonb, uuid[]) to service_role;",
    );
    expect(migration).toContain(
      "revoke all on function public.subscribe_newsletter(text, text, boolean)\n  from public, anon, authenticated;",
    );
    expect(migration).toContain("consent_granted boolean not null");
    expect(migration).toContain(
      "constraint newsletter_consent_required check (consent_granted is true)",
    );
    expect(migration).toContain("notification_status");
    expect(migration).toContain("is_read boolean not null default false");
  });
});

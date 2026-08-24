import "server-only";

import { createHmac } from "node:crypto";

import type { NextRequest } from "next/server";

export class SubmissionConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SubmissionConfigurationError";
  }
}

export class SubmissionRateLimitError extends Error {
  constructor() {
    super("Submission rate limit reached");
    this.name = "SubmissionRateLimitError";
  }
}

export class SubmissionOriginError extends Error {
  constructor() {
    super("Submission origin rejected");
    this.name = "SubmissionOriginError";
  }
}

export function assertSameSiteRequest(request: NextRequest) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") {
    throw new SubmissionOriginError();
  }

  const origin = request.headers.get("origin");
  if (!origin) return;

  const forwardedHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProtocol =
    request.headers.get("x-forwarded-proto") ??
    request.nextUrl.protocol.slice(0, -1);
  const requestOrigin = forwardedHost
    ? `${forwardedProtocol}://${forwardedHost}`
    : request.nextUrl.origin;

  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  const allowedOrigins = new Set(
    [requestOrigin, configuredOrigin]
      .filter((value): value is string => Boolean(value))
      .map((value) => value.replace(/\/$/, "")),
  );

  if (!allowedOrigins.has(origin.replace(/\/$/, ""))) {
    throw new SubmissionOriginError();
  }
}

export async function readJsonBody(
  request: NextRequest,
  maxCharacters = 20_000,
) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    throw new SyntaxError("Expected an application/json request");
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > maxCharacters) {
    throw new RangeError("Request body is too large");
  }

  const body = await request.text();
  if (body.length > maxCharacters) {
    throw new RangeError("Request body is too large");
  }

  return JSON.parse(body) as unknown;
}

export function hasFilledHoneypot(value: unknown) {
  if (!value || typeof value !== "object") return false;
  const website = Reflect.get(value, "website");
  return typeof website === "string" && website.trim().length > 0;
}

function getExpectedHostname(request: NextRequest) {
  const forwardedHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (forwardedHost) {
    return forwardedHost.split(",")[0]?.trim().split(":")[0];
  }

  return request.nextUrl.hostname;
}

function getClientAddress(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const address =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim();

  return address?.slice(0, 128);
}

export function getRateLimitIdentifier(request: NextRequest) {
  const configuredSecret = process.env.SUBMISSION_RATE_LIMIT_SECRET;
  const secret =
    configuredSecret ||
    (process.env.NODE_ENV === "production"
      ? undefined
      : "ay-media-work-development-rate-limit-secret");

  if (!secret) {
    throw new SubmissionConfigurationError(
      "SUBMISSION_RATE_LIMIT_SECRET is not configured",
    );
  }

  return createHmac("sha256", secret)
    .update(getClientAddress(request) ?? "address-unavailable")
    .digest("hex");
}

export async function verifyTurnstile(
  token: string,
  expectedAction: string,
  request: NextRequest,
) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (process.env.NODE_ENV === "production" && (!secret || !siteKey)) {
    throw new SubmissionConfigurationError(
      "Turnstile submission variables are not configured",
    );
  }

  if (!secret) return true;

  if (!token) return false;

  const payload = new URLSearchParams({ secret, response: token });
  const clientAddress = getClientAddress(request);
  if (clientAddress) payload.set("remoteip", clientAddress);

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      body: payload,
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      cache: "no-store",
      signal: AbortSignal.timeout(6_000),
    },
  );

  if (!response.ok) return false;

  const result = (await response.json()) as {
    action?: string;
    hostname?: string;
    success?: boolean;
  };

  return (
    result.success === true &&
    result.action === expectedAction &&
    result.hostname === getExpectedHostname(request)
  );
}

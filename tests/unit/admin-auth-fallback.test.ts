import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const serverClientMocks = vi.hoisted(() => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: serverClientMocks.createClient,
}));

import { GET as authCallback } from "@/app/admin/auth/callback/route";
import { getAuthenticatedUser } from "@/lib/supabase/session";

beforeEach(() => {
  serverClientMocks.createClient.mockImplementation(() => {
    throw new Error("Supabase is not configured");
  });
});

describe("admin authentication fallback", () => {
  it("treats missing public Supabase configuration as unauthenticated", async () => {
    await expect(getAuthenticatedUser()).resolves.toBeNull();
  });

  it("redirects an auth callback to a safe login error", async () => {
    const response = await authCallback(
      new NextRequest(
        "https://aymediawork.example/admin/auth/callback?code=test-code&next=https://evil.example",
      ),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://aymediawork.example/admin/login?error=Admin+authentication+is+not+configured.",
    );
  });
});

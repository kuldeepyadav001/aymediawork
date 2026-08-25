import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { SubmissionConfigurationError } from "@/lib/server/submission-security";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

let adminClient: SupabaseClient<Database> | undefined;

export function getSupabaseAdmin() {
  if (adminClient) return adminClient;

  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();
  let url: string;

  try {
    url = getSupabasePublicConfig().url;
  } catch {
    throw new SubmissionConfigurationError(
      "Supabase server submission variables are not configured",
    );
  }

  if (!secretKey) {
    throw new SubmissionConfigurationError(
      "Supabase server submission variables are not configured",
    );
  }

  adminClient = createClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  return adminClient;
}

import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { SubmissionConfigurationError } from "@/lib/server/submission-security";
import type { Database } from "@/types/database";

let adminClient: SupabaseClient<Database> | undefined;

export function getSupabaseAdmin() {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
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

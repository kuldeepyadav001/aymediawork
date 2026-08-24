import "server-only";

import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/types/database";

export type AdminContext = {
  displayName: string;
  email: string;
  role: AdminRole;
  userId: string;
};

export const getAuthenticatedUser = cache(async () => {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;
    return user;
  } catch {
    // Public builds and local previews can intentionally omit Supabase.
    return null;
  }
});

export const getAdminContext = cache(async (): Promise<AdminContext | null> => {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("display_name, role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data?.is_active) return null;

  return {
    displayName: data.display_name,
    email: user.email ?? "Authenticated user",
    role: data.role,
    userId: user.id,
  };
});

export function canPublish(role: AdminRole) {
  return role === "owner" || role === "admin";
}

export function canManageUsers(role: AdminRole) {
  return role === "owner";
}

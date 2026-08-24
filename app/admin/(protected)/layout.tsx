import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminContext, getAuthenticatedUser } from "@/lib/supabase/session";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/admin/login?error=Sign+in+to+continue.");
  }

  const context = await getAdminContext();

  if (!context) {
    redirect("/admin/setup");
  }

  return <AdminShell context={context}>{children}</AdminShell>;
}

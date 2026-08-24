"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl rounded-xl border border-destructive/30 bg-destructive/10 p-7">
      <p className="eyebrow text-destructive">Admin data unavailable</p>
      <h1 className="mt-3 font-display text-2xl font-semibold">
        This screen could not be loaded.
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Check the Supabase connection and permissions, then try again. No
        changes were made.
      </p>
      <Button className="mt-5" onClick={reset} type="button">
        Try again
      </Button>
    </div>
  );
}

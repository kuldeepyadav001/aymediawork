"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
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
    <html className="dark" lang="en">
      <body className="bg-background font-[Arial,sans-serif] text-foreground antialiased">
        <main className="relative flex min-h-dvh items-center overflow-hidden px-4 py-20 sm:px-8">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[140px]"
          />
          <div className="relative mx-auto w-full max-w-2xl">
            <p className="editorial-kicker mb-6">Application error</p>
            <h1 className="text-balance font-display text-heading-xl">
              We lost the frame, not the story.
            </h1>
            <p className="mt-6 max-w-xl text-lead text-muted-foreground">
              Please try again. If this continues, return to the home page and
              begin again.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-brand-linear px-6 text-sm font-semibold text-background shadow-glow transition-[filter,transform] duration-300 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-safe:hover:-translate-y-0.5"
                onClick={reset}
                type="button"
              >
                Try again
              </button>
              <Link
                className="inline-flex h-12 items-center justify-center rounded-full border border-border/90 bg-surface/50 px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href="/"
              >
                Return home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

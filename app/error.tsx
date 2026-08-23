"use client";

import { useEffect } from "react";

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
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="max-w-lg text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-white/50">
          Something went wrong
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          We could not load this page.
        </h1>
        <p className="mt-4 text-white/60">
          Please try again. If the problem continues, contact AY Media Work.
        </p>
        <button
          className="mt-8 rounded-lg border border-white/15 px-5 py-3 text-sm font-medium transition-colors hover:border-white/30 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </section>
    </main>
  );
}

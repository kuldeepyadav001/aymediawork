"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
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
    <main className="min-h-dvh" id="main-content">
      <Container className="flex min-h-dvh items-center py-20">
        <div className="max-w-2xl">
          <p className="editorial-kicker mb-6">Something went wrong</p>
          <h1 className="text-balance font-display text-heading-xl">
            The story paused unexpectedly.
          </h1>
          <p className="mt-6 max-w-xl text-lead text-muted-foreground">
            Try loading this view again. If the problem continues, return home
            and start from there.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button onClick={reset} variant="brand">
              <RotateCcw aria-hidden="true" />
              Try again
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Return home</Link>
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}

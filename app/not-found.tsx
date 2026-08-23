import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BrandLockup } from "@/components/layout/brand";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative min-h-dvh overflow-hidden" id="main-content">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/3 size-[32rem] -translate-x-1/2 rounded-full bg-brand-violet/15 blur-[140px]"
      />
      <Container className="relative flex min-h-dvh flex-col py-7 sm:py-9">
        <Link
          aria-label="AY Media Work — home"
          className="w-fit rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/"
        >
          <BrandLockup priority />
        </Link>

        <div className="my-auto max-w-3xl py-20">
          <p className="editorial-kicker mb-6">Error 404</p>
          <h1 className="text-balance font-display text-display-lg">
            This frame is missing.
          </h1>
          <p className="mt-7 max-w-xl text-lead text-muted-foreground">
            The page may have moved, or the address may be incomplete. Head home
            to continue exploring AY Media Work.
          </p>
          <Button asChild className="mt-9" size="lg" variant="brand">
            <Link href="/">
              <ArrowLeft aria-hidden="true" />
              Return home
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Ideas in motion. Stories that stay.
        </p>
      </Container>
    </main>
  );
}

import { Container } from "@/components/shared/container";

export default function Loading() {
  return (
    <main className="min-h-dvh" id="main-content">
      <Container
        aria-busy="true"
        aria-live="polite"
        className="flex min-h-dvh items-center py-20"
        role="status"
      >
        <div className="w-full animate-pulse">
          <div className="mb-7 h-3 w-24 rounded-full bg-primary/35" />
          <div className="h-12 w-full max-w-2xl rounded-lg bg-white/[0.08] sm:h-20" />
          <div className="mt-5 h-5 w-full max-w-lg rounded-full bg-white/[0.06]" />
          <div className="mt-3 h-5 w-3/4 max-w-md rounded-full bg-white/[0.06]" />
          <span className="sr-only">Loading page</span>
        </div>
      </Container>
    </main>
  );
}

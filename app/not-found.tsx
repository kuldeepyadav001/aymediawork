import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="max-w-lg text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-white/50">
          Error 404
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-4 text-white/60">
          The page may have moved or the address may be incorrect.
        </p>
        <Link
          className="mt-8 inline-flex rounded-lg border border-white/15 px-5 py-3 text-sm font-medium transition-colors hover:border-white/30 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          href="/"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}

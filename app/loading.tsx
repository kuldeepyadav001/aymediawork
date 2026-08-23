export default function Loading() {
  return (
    <div
      aria-label="Loading page"
      className="flex min-h-screen items-center justify-center"
      role="status"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-blue-500" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

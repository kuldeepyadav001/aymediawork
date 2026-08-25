export function AdminNotice({
  error,
  success,
}: {
  error?: string;
  success?: string;
}) {
  if (!error && !success) return null;

  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm ${
        error
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-success/30 bg-success/10 text-success"
      }`}
      role={error ? "alert" : "status"}
    >
      {error ?? success}
    </div>
  );
}

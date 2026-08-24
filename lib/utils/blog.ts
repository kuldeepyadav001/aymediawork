export function formatBlogDate(publishedAt: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${publishedAt}T00:00:00.000Z`));
}

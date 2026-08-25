const YOUTUBE_URL_PATTERN =
  /^https:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,20})(?:[&?][A-Za-z0-9_=&-]*)?$/;

export function extractYouTubeVideoId(url: string | null | undefined) {
  if (!url) return null;
  const match = YOUTUBE_URL_PATTERN.exec(url.trim());
  return match?.[1] ?? null;
}

export function isYouTubeUrl(url: string) {
  return YOUTUBE_URL_PATTERN.test(url.trim());
}

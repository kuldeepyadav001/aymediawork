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

const PLATFORM_LABELS: readonly [RegExp, string][] = [
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)youtube\.com$|(^|\.)youtu\.be$/, "YouTube"],
  [/(^|\.)vimeo\.com$/, "Vimeo"],
  [/(^|\.)behance\.net$/, "Behance"],
  [/(^|\.)dribbble\.com$/, "Dribbble"],
  [/(^|\.)x\.com$|(^|\.)twitter\.com$/, "X"],
  [/(^|\.)facebook\.com$/, "Facebook"],
  [/(^|\.)linkedin\.com$/, "LinkedIn"],
  [/(^|\.)tiktok\.com$/, "TikTok"],
];

export function externalPlatformLabel(url: string | null | undefined) {
  if (!url) return null;
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    for (const [pattern, label] of PLATFORM_LABELS) {
      if (pattern.test(hostname)) return label;
    }
    return hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

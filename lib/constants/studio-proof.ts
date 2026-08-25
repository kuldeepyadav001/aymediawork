/**
 * Verified studio track record sourced from the public AY Media Work
 * YTJobs profile (linked in the site footer). The owner approved this
 * material for publication on 26 August 2026. Re-check the live profile
 * before updating any number; never inflate beyond the public source.
 */

export const YTJOBS_PROFILE_URL =
  "https://ytjobs.co/talent/profile/439676?r=253";

export type StudioStat = {
  label: string;
  note: string;
  value: string;
};

export const STUDIO_STATS: readonly StudioStat[] = [
  {
    value: "34M+",
    label: "Views generated",
    note: "Across published portfolio edits",
  },
  {
    value: "1.2M+",
    label: "Likes earned",
    note: "Audience response to the work",
  },
  {
    value: "34",
    label: "Portfolio videos",
    note: "Published on our verified profile",
  },
  {
    value: "2025",
    label: "Studio established",
    note: "Working with creators since 2024",
  },
] as const;

export const STUDIO_STORY: readonly string[] = [
  "Established in 2025, AY Media Work is a creative media team dedicated to delivering high-quality digital content and professional visual solutions. We specialise in video editing, cinematic short-form and long-form content, custom thumbnail design, motion graphics, and 3D animation.",
  "With a strong focus on creativity, precision, and modern storytelling, we create impactful content that helps brands, businesses, and creators build a strong digital presence — transforming ideas into premium visual experiences with quality-driven execution and attention to detail.",
] as const;

export type ToolkitGroup = {
  items: readonly string[];
  title: string;
};

export const STUDIO_TOOLKIT: readonly ToolkitGroup[] = [
  {
    title: "Craft tools",
    items: [
      "Adobe Premiere Pro",
      "After Effects",
      "DaVinci Resolve",
      "Photoshop",
      "Lightroom",
      "Figma",
      "Blender",
      "Unreal Engine",
    ],
  },
  {
    title: "AI-assisted workflow",
    items: [
      "Sora",
      "Veo",
      "ElevenLabs",
      "Leonardo AI",
      "Higgsfield",
      "Descript",
      "ChatGPT",
      "Perplexity",
    ],
  },
] as const;

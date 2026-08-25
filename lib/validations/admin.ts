import { z } from "zod";

import { isYouTubeUrl } from "@/lib/utils/youtube";

const requiredText = (label: string, maximum = 5000) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(maximum, `${label} is too long.`);

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function hasSafePathSegments(pathname: string) {
  try {
    return decodeURIComponent(pathname)
      .split("/")
      .filter(Boolean)
      .every(
        (segment) =>
          segment !== "." &&
          segment !== ".." &&
          /^[a-zA-Z0-9._-]+$/.test(segment),
      );
  } catch {
    return false;
  }
}

function isApprovedImagePath(value: string) {
  if (
    value.startsWith("/images/") &&
    !value.includes("\\") &&
    !value.includes("?") &&
    !value.includes("#") &&
    hasSafePathSegments(value)
  ) {
    return true;
  }

  const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!configuredUrl) return false;

  try {
    const imageUrl = new URL(value);
    const supabaseUrl = new URL(configuredUrl);
    return (
      imageUrl.origin === supabaseUrl.origin &&
      !imageUrl.username &&
      !imageUrl.password &&
      imageUrl.pathname.startsWith("/storage/v1/object/public/admin-media/") &&
      imageUrl.search === "" &&
      imageUrl.hash === "" &&
      hasSafePathSegments(imageUrl.pathname)
    );
  } catch {
    return false;
  }
}

const imagePathSchema = requiredText("Image path", 1000).refine(
  isApprovedImagePath,
  "Use a local /images path or an admin-media public URL.",
);

const optionalHttpUrlSchema = z
  .string()
  .trim()
  .max(1000)
  .refine((value) => value === "" || isHttpUrl(value), {
    message: "Use a complete http or https URL.",
  })
  .transform((value) => (value === "" ? "" : new URL(value).toString()));

export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug.");

export const publicationStatusSchema = z.enum([
  "archived",
  "draft",
  "published",
]);

export const adminRoleSchema = z.enum(["admin", "editor", "owner"]);

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(200),
});

export const serviceAdminSchema = z.object({
  approach: z.array(
    z.object({
      description: requiredText("Approach description", 1000),
      title: requiredText("Approach title", 120),
    }),
  ),
  description: requiredText("Description", 1000),
  disciplines: z.array(requiredText("Discipline", 200)).min(1),
  heroTitle: requiredText("Hero title", 300),
  id: z.string().uuid().optional(),
  imageAlt: requiredText("Image alt text", 300),
  imagePath: imagePathSchema,
  isActive: z.boolean(),
  metaDescription: requiredText("Meta description", 320),
  relatedSlugs: z.array(slugSchema),
  slug: slugSchema,
  sortOrder: z.number().int().min(1).max(999),
  title: requiredText("Title", 120),
  usefulFor: z.array(requiredText("Useful-for item", 300)).min(1),
});

export const projectAdminSchema = z.object({
  category: requiredText("Category", 100),
  description: requiredText("Description", 1000),
  direction: requiredText("Direction", 5000),
  experience: requiredText("Experience", 5000),
  explores: z.array(requiredText("Exploration", 300)).min(1),
  featured: z.boolean(),
  formatLabel: requiredText("Format", 160),
  id: z.string().uuid().optional(),
  imageAlt: requiredText("Image alt text", 300),
  imagePath: imagePathSchema,
  metaDescription: requiredText("Meta description", 320),
  palette: z.array(
    z.object({
      hex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      name: requiredText("Palette name", 100),
    }),
  ),
  premiseContext: requiredText("Premise context", 5000),
  premiseQuestion: requiredText("Premise question", 1000),
  principle: requiredText("Principle", 1000),
  serviceIds: z.array(z.string().uuid()),
  slug: slugSchema,
  sortOrder: z.number().int().min(1).max(999),
  status: publicationStatusSchema,
  system: requiredText("System", 5000),
  title: requiredText("Title", 160),
  tone: z.array(requiredText("Tone", 100)).min(1),
  videoUrl: z
    .string()
    .trim()
    .max(1000)
    .refine((value) => value === "" || isYouTubeUrl(value), {
      message:
        "Use a YouTube link such as https://youtu.be/VIDEOID or https://www.youtube.com/watch?v=VIDEOID.",
    })
    .optional()
    .default(""),
});

export const blogPostAdminSchema = z.object({
  author: requiredText("Author", 100),
  body: requiredText("Body", 100_000),
  category: requiredText("Category", 100),
  excerpt: requiredText("Excerpt", 1000),
  featured: z.boolean(),
  id: z.string().uuid().optional(),
  imageAlt: requiredText("Image alt text", 300),
  imagePath: imagePathSchema,
  metaDescription: requiredText("Meta description", 320),
  readingMinutes: z.number().int().min(1).max(120),
  serviceIds: z.array(z.string().uuid()),
  slug: slugSchema,
  status: publicationStatusSchema,
  tags: z.array(requiredText("Tag", 100)).min(1),
  takeaways: z.array(requiredText("Takeaway", 500)).min(1),
  title: requiredText("Title", 200),
});

export const testimonialAdminSchema = z.object({
  attributionName: requiredText("Attribution name", 100),
  attributionOrganisation: z.string().trim().max(160),
  attributionRole: z.string().trim().max(160),
  id: z.string().uuid().optional(),
  permissionConfirmed: z.boolean(),
  projectContext: z.string().trim().max(1000),
  projectId: z.string().uuid().or(z.literal("")),
  quote: requiredText("Quote", 2000).min(10),
  sortOrder: z.number().int().min(1).max(999),
  status: publicationStatusSchema,
});

export const clientLogoAdminSchema = z.object({
  destinationUrl: optionalHttpUrlSchema,
  id: z.string().uuid().optional(),
  imageAlt: requiredText("Image alt text", 300),
  imagePath: imagePathSchema,
  name: requiredText("Name", 160),
  permissionConfirmed: z.boolean(),
  sortOrder: z.number().int().min(1).max(999),
  status: publicationStatusSchema,
});

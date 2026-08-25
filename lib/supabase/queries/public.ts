import "server-only";

import type { BlogArticle } from "@/lib/constants/blog";
import { BLOG_ARTICLES } from "@/lib/constants/blog";
import type { Service, ServiceApproachStep } from "@/lib/constants/services";
import { SERVICE_CATALOG } from "@/lib/constants/services";
import type { PublishedTestimonial } from "@/lib/constants/testimonials";
import { APPROVED_TESTIMONIALS } from "@/lib/constants/testimonials";
import { BRAND_LINE } from "@/lib/constants/navigation";
import type { SocialLink } from "@/lib/constants/social";
import type { WorkStudy } from "@/lib/constants/work";
import { WORK_STUDIES } from "@/lib/constants/work";
import { isSupabasePublicConfigured } from "@/lib/supabase/config";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { Database, Json } from "@/types/database";

type BlogRow = Pick<
  Database["public"]["Tables"]["blog_posts"]["Row"],
  | "author"
  | "body"
  | "category"
  | "created_at"
  | "excerpt"
  | "featured"
  | "id"
  | "image_alt"
  | "image_path"
  | "meta_description"
  | "published_at"
  | "reading_minutes"
  | "slug"
  | "tags"
  | "takeaways"
  | "title"
>;
type ProjectRow = Pick<
  Database["public"]["Tables"]["projects"]["Row"],
  | "category"
  | "description"
  | "direction"
  | "experience"
  | "explores"
  | "featured"
  | "format_label"
  | "id"
  | "image_alt"
  | "image_path"
  | "meta_description"
  | "palette"
  | "premise_context"
  | "premise_question"
  | "principle"
  | "slug"
  | "sort_order"
  | "system"
  | "title"
  | "tone"
>;
type ServiceRow = Pick<
  Database["public"]["Tables"]["services"]["Row"],
  | "approach"
  | "description"
  | "disciplines"
  | "hero_title"
  | "id"
  | "image_alt"
  | "image_path"
  | "meta_description"
  | "related_slugs"
  | "slug"
  | "sort_order"
  | "title"
  | "useful_for"
>;
type TestimonialRow = Pick<
  Database["public"]["Tables"]["testimonials"]["Row"],
  | "attribution_name"
  | "attribution_organisation"
  | "attribution_role"
  | "id"
  | "permission_confirmed_at"
  | "project_context"
  | "project_id"
  | "quote"
>;
type ClientLogoRow = Pick<
  Database["public"]["Tables"]["client_logos"]["Row"],
  "destination_url" | "id" | "image_alt" | "image_path" | "name"
>;

export type PublicClientLogo = {
  destinationUrl?: string;
  id: string;
  image: { alt: string; src: string };
  name: string;
};

export type PublicSiteProfile = {
  brandLine: string;
  socialLinks: readonly SocialLink[];
};

const PUBLIC_PROJECT_COLUMNS =
  "id,slug,title,sort_order,featured,category,format_label,description,meta_description,image_path,image_alt,premise_context,premise_question,direction,system,experience,principle,explores,tone,palette" as const;
const PUBLIC_BLOG_COLUMNS =
  "id,slug,title,excerpt,body,category,author,reading_minutes,image_path,image_alt,meta_description,tags,takeaways,featured,published_at,created_at" as const;
const PUBLIC_TESTIMONIAL_COLUMNS =
  "id,quote,attribution_name,attribution_role,attribution_organisation,project_context,project_id,permission_confirmed_at" as const;
const PUBLIC_CLIENT_LOGO_COLUMNS =
  "id,name,image_path,image_alt,destination_url" as const;

const FALLBACK_PUBLIC_SETTINGS = new Map<string, Json>([
  ["brand.line", BRAND_LINE],
  ["social.instagram", "https://www.instagram.com/aymediawork_/"],
  ["social.linkedin_status", "coming_soon"],
  ["social.ytjobs", "https://ytjobs.co/talent/profile/439676?r=253"],
]);

function reportFallback(area: string, error: unknown) {
  if (process.env.NODE_ENV !== "test") {
    console.error(
      `Public CMS ${area} query failed; using provisional content.`,
      error,
    );
  }
}

function stringArray(value: Json): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function approachArray(value: Json): ServiceApproachStep[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || Array.isArray(item) || typeof item !== "object") return [];
    const title = item.title;
    const description = item.description;
    return typeof title === "string" && typeof description === "string"
      ? [{ description, title }]
      : [];
  });
}

function paletteArray(value: Json): { hex: string; name: string }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || Array.isArray(item) || typeof item !== "object") return [];
    const name = item.name;
    const hex = item.hex;
    return typeof name === "string" && typeof hex === "string"
      ? [{ hex, name }]
      : [];
  });
}

function mapService(row: ServiceRow): Service {
  return {
    approach: approachArray(row.approach),
    description: row.description,
    disciplines: stringArray(row.disciplines),
    heroTitle: row.hero_title,
    id: row.id,
    image: { alt: row.image_alt, src: row.image_path },
    index: String(row.sort_order).padStart(2, "0"),
    metaDescription: row.meta_description,
    relatedSlugs: row.related_slugs,
    slug: row.slug,
    title: row.title,
    usefulFor: stringArray(row.useful_for),
  };
}

async function serviceSlugMap() {
  const client = createSupabasePublicClient();
  const { data, error } = await client.from("services").select("id,slug");
  if (error) throw error;
  return new Map((data ?? []).map((service) => [service.id, service.slug]));
}

export async function getPublishedServices(): Promise<Service[]> {
  if (!isSupabasePublicConfigured()) return [...SERVICE_CATALOG];
  try {
    const client = createSupabasePublicClient();
    const { data, error } = await client
      .from("services")
      .select(
        "id,slug,title,sort_order,description,hero_title,meta_description,image_path,image_alt,disciplines,useful_for,approach,related_slugs",
      )
      .order("sort_order");
    if (error) throw error;
    return (data ?? []).map(mapService);
  } catch (error) {
    reportFallback("services", error);
    return [...SERVICE_CATALOG];
  }
}

export async function getPublishedServiceBySlug(slug: string) {
  const services = await getPublishedServices();
  return services.find((service) => service.slug === slug);
}

async function projectServiceSlugs() {
  const client = createSupabasePublicClient();
  const [{ data, error }, slugs] = await Promise.all([
    client
      .from("project_services")
      .select("project_id,service_id,sort_order")
      .order("sort_order"),
    serviceSlugMap(),
  ]);
  if (error) throw error;
  const byProject = new Map<string, string[]>();
  for (const relation of data ?? []) {
    const slug = slugs.get(relation.service_id);
    if (!slug) continue;
    byProject.set(relation.project_id, [
      ...(byProject.get(relation.project_id) ?? []),
      slug,
    ]);
  }
  return byProject;
}

function mapProject(row: ProjectRow, services: readonly string[]): WorkStudy {
  return {
    category: row.category,
    description: row.description,
    direction: row.direction,
    experience: row.experience,
    explores: stringArray(row.explores),
    format: row.format_label,
    id: row.id,
    image: { alt: row.image_alt, src: row.image_path },
    index: String(row.sort_order).padStart(2, "0"),
    metaDescription: row.meta_description,
    palette: paletteArray(row.palette),
    premise: { context: row.premise_context, question: row.premise_question },
    principle: row.principle,
    services,
    slug: row.slug,
    system: row.system,
    title: row.title,
    tone: stringArray(row.tone),
  };
}

export async function getPublishedProjects(): Promise<WorkStudy[]> {
  if (!isSupabasePublicConfigured()) return [...WORK_STUDIES];
  try {
    const client = createSupabasePublicClient();
    const [{ data, error }, services] = await Promise.all([
      client
        .from("projects")
        .select(PUBLIC_PROJECT_COLUMNS)
        .order("featured", { ascending: false })
        .order("sort_order"),
      projectServiceSlugs(),
    ]);
    if (error) throw error;
    return (data ?? []).map((row) =>
      mapProject(row, services.get(row.id) ?? []),
    );
  } catch (error) {
    reportFallback("projects", error);
    return [...WORK_STUDIES];
  }
}

export async function getPublishedProjectBySlug(slug: string) {
  const projects = await getPublishedProjects();
  return projects.find((project) => project.slug === slug);
}

async function blogServiceSlugs() {
  const client = createSupabasePublicClient();
  const [{ data, error }, slugs] = await Promise.all([
    client
      .from("blog_post_services")
      .select("blog_post_id,service_id,sort_order")
      .order("sort_order"),
    serviceSlugMap(),
  ]);
  if (error) throw error;
  const byPost = new Map<string, string[]>();
  for (const relation of data ?? []) {
    const slug = slugs.get(relation.service_id);
    if (!slug) continue;
    byPost.set(relation.blog_post_id, [
      ...(byPost.get(relation.blog_post_id) ?? []),
      slug,
    ]);
  }
  return byPost;
}

function mapBlogPost(
  row: BlogRow,
  relatedServices: readonly string[],
): BlogArticle {
  return {
    author: row.author,
    body: row.body,
    category: row.category,
    excerpt: row.excerpt,
    featured: row.featured,
    id: row.id,
    image: { alt: row.image_alt, src: row.image_path },
    metaDescription: row.meta_description,
    publishedAt: row.published_at ?? row.created_at,
    readingMinutes: row.reading_minutes,
    relatedServices,
    slug: row.slug,
    tags: stringArray(row.tags),
    takeaways: stringArray(row.takeaways),
    title: row.title,
  };
}

export async function getPublishedBlogArticles(): Promise<BlogArticle[]> {
  if (!isSupabasePublicConfigured()) return [...BLOG_ARTICLES];
  try {
    const client = createSupabasePublicClient();
    const [{ data, error }, services] = await Promise.all([
      client
        .from("blog_posts")
        .select(PUBLIC_BLOG_COLUMNS)
        .order("published_at", { ascending: false }),
      blogServiceSlugs(),
    ]);
    if (error) throw error;
    return (data ?? []).map((row) =>
      mapBlogPost(row, services.get(row.id) ?? []),
    );
  } catch (error) {
    reportFallback("blog", error);
    return [...BLOG_ARTICLES];
  }
}

export async function getPublishedBlogArticleBySlug(slug: string) {
  const articles = await getPublishedBlogArticles();
  return articles.find((article) => article.slug === slug);
}

export async function getPublishedTestimonials(): Promise<
  PublishedTestimonial[]
> {
  if (!isSupabasePublicConfigured()) return [...APPROVED_TESTIMONIALS];
  try {
    const client = createSupabasePublicClient();
    const [{ data, error }, { data: projects, error: projectError }] =
      await Promise.all([
        client
          .from("testimonials")
          .select(PUBLIC_TESTIMONIAL_COLUMNS)
          .order("sort_order"),
        client.from("projects").select("id,slug"),
      ]);
    if (error) throw error;
    if (projectError) throw projectError;
    const projectSlugs = new Map(
      (projects ?? []).map((project) => [project.id, project.slug]),
    );
    return (data ?? []).map((row: TestimonialRow) => {
      if (!row.permission_confirmed_at) {
        throw new Error("Published testimonial is missing consent evidence.");
      }
      return {
        approvedAt: row.permission_confirmed_at,
        attribution: {
          name: row.attribution_name,
          ...(row.attribution_organisation
            ? { organisation: row.attribution_organisation }
            : {}),
          ...(row.attribution_role ? { role: row.attribution_role } : {}),
        },
        id: row.id,
        ...(row.project_context ? { projectContext: row.project_context } : {}),
        ...(row.project_id && projectSlugs.get(row.project_id)
          ? { projectSlug: projectSlugs.get(row.project_id) }
          : {}),
        quote: row.quote,
      };
    });
  } catch (error) {
    reportFallback("testimonials", error);
    return [...APPROVED_TESTIMONIALS];
  }
}

export async function getPublishedClientLogos(): Promise<PublicClientLogo[]> {
  if (!isSupabasePublicConfigured()) return [];
  try {
    const client = createSupabasePublicClient();
    const { data, error } = await client
      .from("client_logos")
      .select(PUBLIC_CLIENT_LOGO_COLUMNS)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []).map((row: ClientLogoRow) => {
      const destinationUrl = safeExternalUrl(row.destination_url);
      return {
        ...(destinationUrl ? { destinationUrl } : {}),
        id: row.id,
        image: { alt: row.image_alt, src: row.image_path },
        name: row.name,
      };
    });
  } catch (error) {
    reportFallback("client logos", error);
    return [];
  }
}

export async function getPublicSiteSettings() {
  if (!isSupabasePublicConfigured()) return new Map(FALLBACK_PUBLIC_SETTINGS);
  try {
    const client = createSupabasePublicClient();
    const { data, error } = await client
      .from("site_settings")
      .select("key,value");
    if (error) throw error;
    return new Map((data ?? []).map((setting) => [setting.key, setting.value]));
  } catch (error) {
    reportFallback("settings", error);
    return new Map(FALLBACK_PUBLIC_SETTINGS);
  }
}

function settingString(settings: ReadonlyMap<string, Json>, key: string) {
  const value = settings.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function safeExternalUrl(value: string | null | undefined) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") &&
      !url.username &&
      !url.password
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

export async function getPublicSiteProfile(): Promise<PublicSiteProfile> {
  const settings = await getPublicSiteSettings();
  const socialLinks: SocialLink[] = [];
  const instagram = safeExternalUrl(
    settingString(settings, "social.instagram"),
  );
  const ytjobs = safeExternalUrl(settingString(settings, "social.ytjobs"));
  const linkedIn = safeExternalUrl(settingString(settings, "social.linkedin"));
  const linkedInStatus = settingString(settings, "social.linkedin_status");

  if (instagram) {
    socialLinks.push({
      href: instagram,
      label: "Instagram",
      note: "@aymediawork_",
      status: "active",
    });
  }
  if (linkedIn) {
    socialLinks.push({
      href: linkedIn,
      label: "LinkedIn",
      note: "Studio profile",
      status: "active",
    });
  } else if (linkedInStatus === "coming_soon") {
    socialLinks.push({
      label: "LinkedIn",
      note: "Coming soon",
      status: "coming-soon",
    });
  }
  if (ytjobs) {
    socialLinks.push({
      href: ytjobs,
      label: "YTJobs",
      note: "Portfolio profile",
      status: "active",
    });
  }

  return {
    brandLine: settingString(settings, "brand.line"),
    socialLinks,
  };
}

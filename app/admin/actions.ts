"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { safeAdminPath } from "@/lib/admin/redirects";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/utils/site-url";
import {
  canManageUsers,
  canPublish,
  getAdminContext,
  getAuthenticatedUser,
} from "@/lib/supabase/session";
import {
  adminRoleSchema,
  blogPostAdminSchema,
  clientLogoAdminSchema,
  loginSchema,
  projectAdminSchema,
  serviceAdminSchema,
  testimonialAdminSchema,
} from "@/lib/validations/admin";
import type { Database, Json, PublicationStatus } from "@/types/database";

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function optionalId(formData: FormData) {
  const value = text(formData, "id");
  return value || undefined;
}

function numberValue(formData: FormData, name: string) {
  return Number(text(formData, name));
}

function checked(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function lines(formData: FormData, name: string) {
  return text(formData, name)
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean);
}

function jsonValue(formData: FormData, name: string): unknown {
  try {
    return JSON.parse(text(formData, name));
  } catch {
    return null;
  }
}

function withMessage(path: string, type: "error" | "success", message: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${type}=${encodeURIComponent(message)}`;
}

function mutationError(path: string, message: string): never {
  redirect(withMessage(path, "error", message));
}

function mutationSuccess(path: string, message: string): never {
  redirect(withMessage(path, "success", message));
}

async function requireAdmin() {
  const context = await getAdminContext();
  if (!context) redirect("/admin/login");
  return context;
}

function ensurePublishPermission(
  role: "admin" | "editor" | "owner",
  status: PublicationStatus,
  path: string,
) {
  if (!canPublish(role) && status !== "draft") {
    mutationError(
      path,
      "Editors can save drafts but cannot publish or archive content.",
    );
  }
}

function revalidateContent(...paths: string[]) {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  for (const path of paths) revalidatePath(path);
}

async function createAuthClient(errorPath: string) {
  try {
    return await createSupabaseServerClient();
  } catch {
    mutationError(
      errorPath,
      "Admin authentication is not configured for this environment.",
    );
  }
}

function createPrivilegedAdminClient(errorPath: string) {
  try {
    return getSupabaseAdmin();
  } catch {
    mutationError(
      errorPath,
      "Privileged admin operations are not configured for this environment.",
    );
  }
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: text(formData, "email"),
    password: text(formData, "password"),
  });
  const nextPath = safeAdminPath(text(formData, "next"));

  if (!parsed.success) {
    mutationError("/admin/login", "Enter a valid email and password.");
  }

  const supabase = await createAuthClient("/admin/login");
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error)
    mutationError("/admin/login", "The email or password was not accepted.");
  redirect(nextPath);
}

export async function logoutAction() {
  const supabase = await createAuthClient("/admin/login");
  await supabase.auth.signOut();
  redirect("/admin/login?success=Signed%20out");
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = text(formData, "email").trim();
  const siteUrl = getSiteUrl().origin;
  if (!loginSchema.shape.email.safeParse(email).success) {
    mutationError("/admin/login", "Enter a valid email address.");
  }

  const supabase = await createAuthClient("/admin/login");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/admin/auth/callback?next=/admin/reset-password`,
  });
  if (error)
    mutationError("/admin/login", "The reset email could not be sent.");
  mutationSuccess(
    "/admin/login",
    "If the account exists, a reset link has been sent.",
  );
}

export async function updatePasswordAction(formData: FormData) {
  const password = text(formData, "password");
  if (password.length < 12 || password.length > 200) {
    mutationError(
      "/admin/reset-password",
      "Use a password between 12 and 200 characters.",
    );
  }

  const supabase = await createAuthClient("/admin/reset-password");
  const { error } = await supabase.auth.updateUser({ password });
  if (error)
    mutationError(
      "/admin/reset-password",
      "The password could not be updated.",
    );
  mutationSuccess("/admin/dashboard", "Password updated.");
}

export async function bootstrapOwnerAction(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/admin/login");

  const bootstrapEmail =
    process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  if (!bootstrapEmail || user.email?.toLowerCase() !== bootstrapEmail) {
    mutationError(
      "/admin/setup",
      "This account is not authorized for first-owner setup.",
    );
  }

  const displayName = text(formData, "displayName").trim();
  if (displayName.length < 2 || displayName.length > 100) {
    mutationError(
      "/admin/setup",
      "Enter a display name between 2 and 100 characters.",
    );
  }

  const admin = createPrivilegedAdminClient("/admin/setup");
  const { error } = await admin.rpc("bootstrap_first_owner", {
    p_display_name: displayName,
    p_user_id: user.id,
  });
  if (error)
    mutationError(
      "/admin/setup",
      "Owner setup is unavailable or already complete.",
    );
  mutationSuccess("/admin/dashboard", "Owner account activated.");
}

export async function saveServiceAction(formData: FormData) {
  const context = await requireAdmin();
  const id = optionalId(formData);
  const returnPath = safeAdminPath(
    id ? `/admin/services/${id}` : "/admin/services/new",
    "/admin/services/new",
  );
  const parsed = serviceAdminSchema.safeParse({
    approach: jsonValue(formData, "approach"),
    description: text(formData, "description"),
    disciplines: lines(formData, "disciplines"),
    heroTitle: text(formData, "heroTitle"),
    id,
    imageAlt: text(formData, "imageAlt"),
    imagePath: text(formData, "imagePath"),
    isActive: checked(formData, "isActive"),
    metaDescription: text(formData, "metaDescription"),
    relatedSlugs: lines(formData, "relatedSlugs"),
    slug: text(formData, "slug"),
    sortOrder: numberValue(formData, "sortOrder"),
    title: text(formData, "title"),
    usefulFor: lines(formData, "usefulFor"),
  });

  if (!parsed.success)
    mutationError(
      returnPath,
      parsed.error.issues[0]?.message ?? "Invalid service.",
    );
  if (!canPublish(context.role) && parsed.data.isActive) {
    mutationError(returnPath, "Editors can only save inactive service drafts.");
  }

  const supabase = await createSupabaseServerClient();
  let previousSlug: string | undefined;
  if (parsed.data.id) {
    const { data: existing, error: existingError } = await supabase
      .from("services")
      .select("slug")
      .eq("id", parsed.data.id)
      .maybeSingle();
    if (existingError || !existing) {
      mutationError(returnPath, "The current service could not be loaded.");
    }
    previousSlug = existing.slug;
  }

  const payload: Database["public"]["Tables"]["services"]["Insert"] = {
    approach: parsed.data.approach,
    description: parsed.data.description,
    disciplines: parsed.data.disciplines,
    hero_title: parsed.data.heroTitle,
    image_alt: parsed.data.imageAlt,
    image_path: parsed.data.imagePath,
    is_active: parsed.data.isActive,
    meta_description: parsed.data.metaDescription,
    related_slugs: parsed.data.relatedSlugs,
    slug: parsed.data.slug,
    sort_order: parsed.data.sortOrder,
    title: parsed.data.title,
    updated_by: context.userId,
    ...(parsed.data.id
      ? { id: parsed.data.id }
      : { created_by: context.userId }),
    useful_for: parsed.data.usefulFor,
  };
  const { data, error } = await supabase
    .from("services")
    .upsert(payload)
    .select("id")
    .single();

  if (error || !data)
    mutationError(returnPath, error?.message ?? "Service could not be saved.");
  revalidateContent(
    "/services",
    `/services/${parsed.data.slug}`,
    ...(previousSlug && previousSlug !== parsed.data.slug
      ? [`/services/${previousSlug}`]
      : []),
  );
  mutationSuccess(`/admin/services/${data.id}`, "Service saved.");
}

export async function saveProjectAction(formData: FormData) {
  const context = await requireAdmin();
  const id = optionalId(formData);
  const returnPath = safeAdminPath(
    id ? `/admin/projects/${id}` : "/admin/projects/new",
    "/admin/projects/new",
  );
  const parsed = projectAdminSchema.safeParse({
    category: text(formData, "category"),
    description: text(formData, "description"),
    externalUrl: text(formData, "externalUrl"),
    direction: text(formData, "direction"),
    experience: text(formData, "experience"),
    explores: lines(formData, "explores"),
    featured: checked(formData, "featured"),
    formatLabel: text(formData, "formatLabel"),
    id,
    imageAlt: text(formData, "imageAlt"),
    imagePath: text(formData, "imagePath"),
    metaDescription: text(formData, "metaDescription"),
    palette: jsonValue(formData, "palette"),
    premiseContext: text(formData, "premiseContext"),
    premiseQuestion: text(formData, "premiseQuestion"),
    principle: text(formData, "principle"),
    serviceIds: formData.getAll("serviceIds"),
    slug: text(formData, "slug"),
    sortOrder: numberValue(formData, "sortOrder"),
    status: text(formData, "status"),
    system: text(formData, "system"),
    title: text(formData, "title"),
    tone: lines(formData, "tone"),
    videoUrl: text(formData, "videoUrl"),
  });

  if (!parsed.success)
    mutationError(
      returnPath,
      parsed.error.issues[0]?.message ?? "Invalid project.",
    );
  ensurePublishPermission(context.role, parsed.data.status, returnPath);

  const supabase = await createSupabaseServerClient();
  let previousSlug: string | undefined;
  if (parsed.data.id) {
    const { data: existing, error: existingError } = await supabase
      .from("projects")
      .select("slug")
      .eq("id", parsed.data.id)
      .maybeSingle();
    if (existingError || !existing)
      mutationError(returnPath, "The current project could not be loaded.");
    previousSlug = existing.slug;
  }

  const payload: Database["public"]["Tables"]["projects"]["Insert"] = {
    category: parsed.data.category,
    description: parsed.data.description,
    direction: parsed.data.direction,
    experience: parsed.data.experience,
    explores: parsed.data.explores,
    featured: parsed.data.featured,
    format_label: parsed.data.formatLabel,
    image_alt: parsed.data.imageAlt,
    image_path: parsed.data.imagePath,
    meta_description: parsed.data.metaDescription,
    palette: parsed.data.palette,
    premise_context: parsed.data.premiseContext,
    premise_question: parsed.data.premiseQuestion,
    principle: parsed.data.principle,
    slug: parsed.data.slug,
    sort_order: parsed.data.sortOrder,
    status: parsed.data.status,
    system: parsed.data.system,
    title: parsed.data.title,
    external_url: parsed.data.externalUrl || null,
    tone: parsed.data.tone,
    updated_by: context.userId,
    video_url: parsed.data.videoUrl || null,
    ...(parsed.data.id
      ? { id: parsed.data.id }
      : { created_by: context.userId }),
  };
  const { data: savedId, error } = await supabase.rpc("save_admin_project", {
    p_project: payload as Json,
    p_service_ids: parsed.data.serviceIds,
  });
  if (error || !savedId)
    mutationError(returnPath, error?.message ?? "Project could not be saved.");

  revalidateContent(
    "/work",
    `/work/${parsed.data.slug}`,
    ...(previousSlug && previousSlug !== parsed.data.slug
      ? [`/work/${previousSlug}`]
      : []),
  );
  mutationSuccess(`/admin/projects/${savedId}`, "Project saved.");
}

export async function saveBlogPostAction(formData: FormData) {
  const context = await requireAdmin();
  const id = optionalId(formData);
  const returnPath = safeAdminPath(
    id ? `/admin/blog/${id}` : "/admin/blog/new",
    "/admin/blog/new",
  );
  const parsed = blogPostAdminSchema.safeParse({
    author: text(formData, "author"),
    body: text(formData, "body"),
    category: text(formData, "category"),
    excerpt: text(formData, "excerpt"),
    featured: checked(formData, "featured"),
    id,
    imageAlt: text(formData, "imageAlt"),
    imagePath: text(formData, "imagePath"),
    metaDescription: text(formData, "metaDescription"),
    readingMinutes: numberValue(formData, "readingMinutes"),
    serviceIds: formData.getAll("serviceIds"),
    slug: text(formData, "slug"),
    status: text(formData, "status"),
    tags: lines(formData, "tags"),
    takeaways: lines(formData, "takeaways"),
    title: text(formData, "title"),
  });

  if (!parsed.success)
    mutationError(
      returnPath,
      parsed.error.issues[0]?.message ?? "Invalid post.",
    );
  ensurePublishPermission(context.role, parsed.data.status, returnPath);

  const supabase = await createSupabaseServerClient();
  let previousSlug: string | undefined;
  if (parsed.data.id) {
    const { data: existing, error: existingError } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("id", parsed.data.id)
      .maybeSingle();
    if (existingError || !existing)
      mutationError(returnPath, "The current post could not be loaded.");
    previousSlug = existing.slug;
  }

  const payload: Database["public"]["Tables"]["blog_posts"]["Insert"] = {
    author: parsed.data.author,
    body: parsed.data.body,
    category: parsed.data.category,
    excerpt: parsed.data.excerpt,
    featured: parsed.data.featured,
    image_alt: parsed.data.imageAlt,
    image_path: parsed.data.imagePath,
    meta_description: parsed.data.metaDescription,
    reading_minutes: parsed.data.readingMinutes,
    slug: parsed.data.slug,
    status: parsed.data.status,
    tags: parsed.data.tags,
    takeaways: parsed.data.takeaways,
    title: parsed.data.title,
    updated_by: context.userId,
    ...(parsed.data.id
      ? { id: parsed.data.id }
      : { created_by: context.userId }),
  };
  const { data: savedId, error } = await supabase.rpc("save_admin_blog_post", {
    p_post: payload as Json,
    p_service_ids: parsed.data.serviceIds,
  });
  if (error || !savedId)
    mutationError(returnPath, error?.message ?? "Post could not be saved.");

  revalidateContent(
    "/blog",
    `/blog/${parsed.data.slug}`,
    ...(previousSlug && previousSlug !== parsed.data.slug
      ? [`/blog/${previousSlug}`]
      : []),
  );
  mutationSuccess(`/admin/blog/${savedId}`, "Blog post saved.");
}

export async function saveTestimonialAction(formData: FormData) {
  const context = await requireAdmin();
  const id = optionalId(formData);
  const returnPath = safeAdminPath(
    id ? `/admin/testimonials/${id}` : "/admin/testimonials/new",
    "/admin/testimonials/new",
  );
  const parsed = testimonialAdminSchema.safeParse({
    attributionName: text(formData, "attributionName"),
    attributionOrganisation: text(formData, "attributionOrganisation"),
    attributionRole: text(formData, "attributionRole"),
    id,
    permissionConfirmed: checked(formData, "permissionConfirmed"),
    projectContext: text(formData, "projectContext"),
    projectId: text(formData, "projectId"),
    quote: text(formData, "quote"),
    sortOrder: numberValue(formData, "sortOrder"),
    status: text(formData, "status"),
  });
  if (!parsed.success)
    mutationError(
      returnPath,
      parsed.error.issues[0]?.message ?? "Invalid testimonial.",
    );
  ensurePublishPermission(context.role, parsed.data.status, returnPath);
  if (parsed.data.status === "published" && !parsed.data.permissionConfirmed) {
    mutationError(
      returnPath,
      "Publication permission must be confirmed first.",
    );
  }

  const supabase = await createSupabaseServerClient();
  let existingPermission: string | null = null;
  if (parsed.data.id) {
    const { data: existing, error: existingError } = await supabase
      .from("testimonials")
      .select("permission_confirmed_at")
      .eq("id", parsed.data.id)
      .maybeSingle();
    if (existingError || !existing) {
      mutationError(returnPath, "The current testimonial could not be loaded.");
    }
    existingPermission = existing.permission_confirmed_at;
  }

  const { data, error } = await supabase
    .from("testimonials")
    .upsert({
      attribution_name: parsed.data.attributionName,
      attribution_organisation: parsed.data.attributionOrganisation || null,
      attribution_role: parsed.data.attributionRole || null,
      permission_confirmed_at: parsed.data.permissionConfirmed
        ? (existingPermission ?? new Date().toISOString())
        : null,
      project_context: parsed.data.projectContext || null,
      project_id: parsed.data.projectId || null,
      quote: parsed.data.quote,
      sort_order: parsed.data.sortOrder,
      status: parsed.data.status,
      updated_by: context.userId,
      ...(parsed.data.id
        ? { id: parsed.data.id }
        : { created_by: context.userId }),
    })
    .select("id")
    .single();
  if (error || !data)
    mutationError(
      returnPath,
      error?.message ?? "Testimonial could not be saved.",
    );
  revalidateContent("/testimonials");
  mutationSuccess(`/admin/testimonials/${data.id}`, "Testimonial saved.");
}

export async function saveClientLogoAction(formData: FormData) {
  const context = await requireAdmin();
  const id = optionalId(formData);
  const returnPath = safeAdminPath(
    id ? `/admin/client-logos/${id}` : "/admin/client-logos/new",
    "/admin/client-logos/new",
  );
  const parsed = clientLogoAdminSchema.safeParse({
    destinationUrl: text(formData, "destinationUrl"),
    id,
    imageAlt: text(formData, "imageAlt"),
    imagePath: text(formData, "imagePath"),
    name: text(formData, "name"),
    permissionConfirmed: checked(formData, "permissionConfirmed"),
    sortOrder: numberValue(formData, "sortOrder"),
    status: text(formData, "status"),
  });
  if (!parsed.success)
    mutationError(
      returnPath,
      parsed.error.issues[0]?.message ?? "Invalid logo.",
    );
  ensurePublishPermission(context.role, parsed.data.status, returnPath);
  if (parsed.data.status === "published" && !parsed.data.permissionConfirmed) {
    mutationError(
      returnPath,
      "Publication permission must be confirmed first.",
    );
  }

  const supabase = await createSupabaseServerClient();
  let existingPermission: string | null = null;
  if (parsed.data.id) {
    const { data: existing, error: existingError } = await supabase
      .from("client_logos")
      .select("permission_confirmed_at")
      .eq("id", parsed.data.id)
      .maybeSingle();
    if (existingError || !existing) {
      mutationError(returnPath, "The current client logo could not be loaded.");
    }
    existingPermission = existing.permission_confirmed_at;
  }

  const { data, error } = await supabase
    .from("client_logos")
    .upsert({
      destination_url: parsed.data.destinationUrl || null,
      image_alt: parsed.data.imageAlt,
      image_path: parsed.data.imagePath,
      name: parsed.data.name,
      permission_confirmed_at: parsed.data.permissionConfirmed
        ? (existingPermission ?? new Date().toISOString())
        : null,
      sort_order: parsed.data.sortOrder,
      status: parsed.data.status,
      updated_by: context.userId,
      ...(parsed.data.id
        ? { id: parsed.data.id }
        : { created_by: context.userId }),
    })
    .select("id")
    .single();
  if (error || !data)
    mutationError(
      returnPath,
      error?.message ?? "Client logo could not be saved.",
    );
  revalidateContent("/");
  mutationSuccess(`/admin/client-logos/${data.id}`, "Client logo saved.");
}

const deletableEntities = {
  blog: {
    path: "/admin/blog",
    publicDetailRoot: "/blog",
    table: "blog_posts",
  },
  clientLogo: { path: "/admin/client-logos", table: "client_logos" },
  project: {
    path: "/admin/projects",
    publicDetailRoot: "/work",
    table: "projects",
  },
  service: {
    path: "/admin/services",
    publicDetailRoot: "/services",
    table: "services",
  },
  testimonial: { path: "/admin/testimonials", table: "testimonials" },
} as const;

export async function deleteContentAction(formData: FormData) {
  const context = await requireAdmin();
  const entity = text(formData, "entity") as keyof typeof deletableEntities;
  const config = deletableEntities[entity];
  if (!config) mutationError("/admin/dashboard", "Unsupported content type.");
  if (!canPublish(context.role))
    mutationError(config.path, "Editors cannot delete records.");

  const id = text(formData, "id");
  const supabase = await createSupabaseServerClient();
  let deletedDetailPath: string | undefined;

  if ("publicDetailRoot" in config) {
    const { data: existing, error: existingError } = await supabase
      .from(config.table)
      .select("slug")
      .eq("id", id)
      .maybeSingle();
    if (existingError || !existing) {
      mutationError(config.path, "The record could not be loaded.");
    }
    deletedDetailPath = `${config.publicDetailRoot}/${existing.slug}`;
  }

  const { data: deleted, error } = await supabase
    .from(config.table)
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error || !deleted) {
    mutationError(
      config.path,
      error?.message ?? "The record was not found or could not be deleted.",
    );
  }
  revalidateContent(
    "/services",
    "/work",
    "/blog",
    "/testimonials",
    ...(deletedDetailPath ? [deletedDetailPath] : []),
  );
  mutationSuccess(config.path, "Record deleted.");
}

export async function deleteInquiryAction(formData: FormData) {
  const context = await requireAdmin();
  if (!canPublish(context.role))
    mutationError("/admin/inquiries", "Editors cannot delete inquiries.");

  const id = text(formData, "id");
  const supabase = await createSupabaseServerClient();
  const { data: deleted, error } = await supabase
    .from("inquiries")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error || !deleted) {
    mutationError(
      "/admin/inquiries",
      error?.message ?? "The inquiry was not found or could not be deleted.",
    );
  }
  mutationSuccess("/admin/inquiries", "Inquiry deleted.");
}

export async function updateInquiryAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!["closed", "in_progress", "new", "spam"].includes(status)) {
    mutationError("/admin/inquiries", "Invalid inquiry status.");
  }

  const supabase = await createSupabaseServerClient();
  const { data: updated, error } = await supabase
    .from("inquiries")
    .update({ is_read: true, status })
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error || !updated) {
    mutationError(
      "/admin/inquiries",
      error?.message ?? "The inquiry was not found or could not be updated.",
    );
  }
  mutationSuccess("/admin/inquiries", "Inquiry updated.");
}

export async function updateSubscriberAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (text(formData, "status") !== "unsubscribed") {
    mutationError(
      "/admin/inquiries",
      "A subscriber can be reactivated only through fresh explicit consent.",
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: updated, error } = await supabase
    .from("newsletter_subscribers")
    .update({
      status: "unsubscribed",
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error || !updated) {
    mutationError(
      "/admin/inquiries",
      error?.message ?? "The subscriber was not found or could not be updated.",
    );
  }
  mutationSuccess("/admin/inquiries", "Subscriber unsubscribed.");
}

export async function deleteSubscriberAction(formData: FormData) {
  const context = await requireAdmin();
  if (!canPublish(context.role))
    mutationError("/admin/inquiries", "Editors cannot delete subscribers.");

  const id = text(formData, "id");
  const supabase = await createSupabaseServerClient();
  const { data: deleted, error } = await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error || !deleted) {
    mutationError(
      "/admin/inquiries",
      error?.message ?? "The subscriber was not found or could not be deleted.",
    );
  }
  mutationSuccess("/admin/inquiries", "Subscriber deleted.");
}

export async function saveSettingAction(formData: FormData) {
  const context = await requireAdmin();
  if (!canManageUsers(context.role))
    mutationError("/admin/settings", "Only the owner can manage settings.");

  const key = text(formData, "key").trim();
  const rawValue = text(formData, "value");
  if (!/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(key)) {
    mutationError("/admin/settings", "Use a lowercase dotted setting key.");
  }

  let value: Json;
  try {
    value = JSON.parse(rawValue) as Json;
  } catch {
    mutationError("/admin/settings", "Setting value must be valid JSON.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("site_settings").upsert({
    is_public: checked(formData, "isPublic"),
    key,
    updated_by: context.userId,
    value,
  });
  if (error) mutationError("/admin/settings", error.message);
  revalidateContent("/");
  mutationSuccess("/admin/settings", "Setting saved.");
}

export async function inviteAdminAction(formData: FormData) {
  const context = await requireAdmin();
  if (!canManageUsers(context.role))
    mutationError("/admin/users", "Only the owner can invite users.");

  const email = text(formData, "email").trim();
  const displayName = text(formData, "displayName").trim();
  const role = adminRoleSchema.safeParse(text(formData, "role"));
  if (
    !loginSchema.shape.email.safeParse(email).success ||
    displayName.length < 2 ||
    displayName.length > 100 ||
    !role.success
  ) {
    mutationError(
      "/admin/users",
      "Enter a valid email, display name, and role.",
    );
  }

  const admin = createPrivilegedAdminClient("/admin/users");
  const siteUrl = getSiteUrl().origin;
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { display_name: displayName },
    redirectTo: `${siteUrl}/admin/auth/callback?next=/admin/reset-password`,
  });
  if (error || !data.user)
    mutationError("/admin/users", error?.message ?? "Invitation failed.");

  const { error: registrationError } = await admin.rpc(
    "register_admin_invitation",
    {
      p_display_name: displayName,
      p_invited_by: context.userId,
      p_role: role.data,
      p_user_id: data.user.id,
    },
  );
  if (registrationError) {
    const { error: cleanupError } = await admin.auth.admin.deleteUser(
      data.user.id,
    );
    mutationError(
      "/admin/users",
      cleanupError
        ? "Profile and audit registration failed, and the incomplete invited user could not be removed. Check Supabase Auth before retrying."
        : "Profile and audit registration failed, so the incomplete invitation was removed. Please retry.",
    );
  }

  mutationSuccess("/admin/users", "Invitation sent.");
}

export async function updateAdminProfileAction(formData: FormData) {
  const context = await requireAdmin();
  if (!canManageUsers(context.role))
    mutationError("/admin/users", "Only the owner can manage users.");

  const userId = text(formData, "userId");
  const role = adminRoleSchema.safeParse(text(formData, "role"));
  if (!role.success) mutationError("/admin/users", "Invalid role.");

  const supabase = await createSupabaseServerClient();
  const { data: updated, error } = await supabase
    .from("admin_profiles")
    .update({ is_active: checked(formData, "isActive"), role: role.data })
    .eq("user_id", userId)
    .select("user_id")
    .maybeSingle();
  if (error || !updated) {
    mutationError(
      "/admin/users",
      error?.message ??
        "The user profile was not found or could not be updated.",
    );
  }
  mutationSuccess("/admin/users", "User access updated.");
}

const mediaExtensions = new Map([
  ["image/avif", "avif"],
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function uploadMediaAction(formData: FormData) {
  const context = await requireAdmin();
  const file = formData.get("file");
  const altText = text(formData, "altText").trim();
  if (!(file instanceof File) || file.size === 0) {
    mutationError("/admin/media", "Choose an image to upload.");
  }
  const extension = mediaExtensions.get(file.type);
  if (file.size > 10 * 1024 * 1024 || !extension) {
    mutationError(
      "/admin/media",
      "Use a JPEG, PNG, WebP, or AVIF image up to 10 MB.",
    );
  }
  if (altText.length > 300) {
    mutationError("/admin/media", "Alt text must be 300 characters or fewer.");
  }

  const path = `${context.userId}/${randomUUID()}.${extension}`;
  const supabase = await createSupabaseServerClient();
  const { error: uploadError } = await supabase.storage
    .from("admin-media")
    .upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });
  if (uploadError) mutationError("/admin/media", uploadError.message);

  const { error: metadataError } = await supabase.from("media_assets").insert({
    alt_text: altText || null,
    bucket: "admin-media",
    created_by: context.userId,
    mime_type: file.type,
    path,
    size_bytes: file.size,
  });
  if (metadataError) {
    const { error: cleanupError } = await supabase.storage
      .from("admin-media")
      .remove([path]);
    mutationError(
      "/admin/media",
      cleanupError
        ? "Media metadata and temporary-object cleanup both failed. Ask an owner or admin to inspect the admin-media bucket."
        : metadataError.message,
    );
  }
  mutationSuccess("/admin/media", "Image uploaded.");
}

export async function deleteMediaAction(formData: FormData) {
  const context = await requireAdmin();
  if (!canPublish(context.role))
    mutationError("/admin/media", "Editors cannot delete media.");

  const id = text(formData, "id");
  const supabase = await createSupabaseServerClient();
  const { data: asset, error: assetError } = await supabase
    .from("media_assets")
    .select("path")
    .eq("id", id)
    .maybeSingle();
  if (assetError || !asset)
    mutationError("/admin/media", "The media record could not be loaded.");

  const { error: storageError } = await supabase.storage
    .from("admin-media")
    .remove([asset.path]);
  if (storageError) mutationError("/admin/media", storageError.message);
  const { data: deleted, error } = await supabase
    .from("media_assets")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error || !deleted) {
    mutationError(
      "/admin/media",
      error?.message ??
        "The Storage object was removed, but its media record was not found. Refresh the library before retrying.",
    );
  }
  mutationSuccess("/admin/media", "Image deleted.");
}

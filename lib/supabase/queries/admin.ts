import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type TableName = keyof Database["public"]["Tables"];

function ensure<T>(
  data: T | null,
  error: { message: string } | null,
  label: string,
): T {
  if (error || data === null) {
    throw new Error(
      `${label} could not be loaded${error ? `: ${error.message}` : "."}`,
    );
  }
  return data;
}

export async function getDashboardData() {
  const supabase = await createSupabaseServerClient();
  const [projects, posts, inquiries, subscribers, recentInquiries, activity] =
    await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false),
      supabase
        .from("newsletter_subscribers")
        .select("id", { count: "exact", head: true })
        .eq("status", "subscribed"),
      supabase
        .from("inquiries")
        .select("id,name,email,inquiry_type,status,is_read,created_at")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("admin_audit_logs")
        .select("id,action,entity_type,actor_user_id,created_at")
        .order("created_at", { ascending: false })
        .limit(7),
    ]);

  for (const result of [projects, posts, inquiries, subscribers]) {
    if (result.error)
      throw new Error(
        `Dashboard counts could not be loaded: ${result.error.message}`,
      );
  }

  return {
    activity: ensure(activity.data, activity.error, "Recent activity"),
    counts: {
      activeSubscribers: subscribers.count ?? 0,
      blogPosts: posts.count ?? 0,
      projects: projects.count ?? 0,
      unreadInquiries: inquiries.count ?? 0,
    },
    recentInquiries: ensure(
      recentInquiries.data,
      recentInquiries.error,
      "Recent inquiries",
    ),
  };
}

export async function listRows<T extends TableName>(
  table: T,
  orderColumn: string,
  ascending = true,
) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(orderColumn, {
      ascending,
    });
  return ensure(data, error, table);
}

export async function getRow<T extends TableName>(table: T, id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id" as never, id as never)
    .maybeSingle();
  if (error) throw new Error(`${table} could not be loaded: ${error.message}`);
  return data;
}

export async function getServices() {
  return listRows("services", "sort_order");
}

export async function getProjectEditorData(id?: string) {
  const supabase = await createSupabaseServerClient();
  const [services, project, relations] = await Promise.all([
    supabase.from("services").select("id,title,slug").order("sort_order"),
    id
      ? supabase.from("projects").select("*").eq("id", id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    id
      ? supabase
          .from("project_services")
          .select("service_id,sort_order")
          .eq("project_id", id)
          .order("sort_order")
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (project.error)
    throw new Error(`Project could not be loaded: ${project.error.message}`);

  return {
    project: project.data,
    selectedServiceIds: ensure(
      relations.data,
      relations.error,
      "Project services",
    ).map((item) => item.service_id),
    services: ensure(services.data, services.error, "Services"),
  };
}

export async function getBlogEditorData(id?: string) {
  const supabase = await createSupabaseServerClient();
  const [services, post, relations] = await Promise.all([
    supabase.from("services").select("id,title,slug").order("sort_order"),
    id
      ? supabase.from("blog_posts").select("*").eq("id", id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    id
      ? supabase
          .from("blog_post_services")
          .select("service_id,sort_order")
          .eq("blog_post_id", id)
          .order("sort_order")
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (post.error)
    throw new Error(`Blog post could not be loaded: ${post.error.message}`);

  return {
    post: post.data,
    selectedServiceIds: ensure(
      relations.data,
      relations.error,
      "Post services",
    ).map((item) => item.service_id),
    services: ensure(services.data, services.error, "Services"),
  };
}

export async function getInquiryData() {
  const supabase = await createSupabaseServerClient();
  const [inquiries, relations, services, subscribers] = await Promise.all([
    supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("inquiry_services").select("inquiry_id,service_id"),
    supabase.from("services").select("id,title"),
    supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const serviceNames = new Map(
    ensure(services.data, services.error, "Services").map((service) => [
      service.id,
      service.title,
    ]),
  );
  const inquiryServices = new Map<string, string[]>();
  for (const relation of ensure(
    relations.data,
    relations.error,
    "Inquiry services",
  )) {
    const names = inquiryServices.get(relation.inquiry_id) ?? [];
    const name = serviceNames.get(relation.service_id);
    if (name) names.push(name);
    inquiryServices.set(relation.inquiry_id, names);
  }

  return {
    inquiries: ensure(inquiries.data, inquiries.error, "Inquiries").map(
      (inquiry) => ({
        ...inquiry,
        services: inquiryServices.get(inquiry.id) ?? [],
      }),
    ),
    subscribers: ensure(subscribers.data, subscribers.error, "Subscribers"),
  };
}

export async function getAuditActivity(limit = 100) {
  const supabase = await createSupabaseServerClient();
  const [logs, profiles] = await Promise.all([
    supabase
      .from("admin_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase.from("admin_profiles").select("user_id,display_name"),
  ]);
  const names = new Map(
    ensure(profiles.data, profiles.error, "Admin profiles").map((profile) => [
      profile.user_id,
      profile.display_name,
    ]),
  );

  return ensure(logs.data, logs.error, "Audit activity").map((log) => ({
    ...log,
    actorName: log.actor_user_id
      ? (names.get(log.actor_user_id) ?? "Former user")
      : "System",
  }));
}

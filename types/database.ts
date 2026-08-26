export type Json =
  | boolean
  | null
  | number
  | string
  | Json[]
  | { [key: string]: Json | undefined };

type TableDefinition<Row extends Record<string, unknown>> = {
  Row: Row;
  Insert: Partial<Row>;
  Relationships: [];
  Update: Partial<Row>;
};

export type AdminRole = "admin" | "editor" | "owner";
export type PublicationStatus = "archived" | "draft" | "published";

export type Database = {
  public: {
    Tables: {
      admin_audit_logs: TableDefinition<{
        action: string;
        actor_user_id: string | null;
        created_at: string;
        details: Json;
        entity_id: string | null;
        entity_type: string;
        id: number;
      }>;
      admin_profiles: TableDefinition<{
        created_at: string;
        display_name: string;
        invited_by: string | null;
        is_active: boolean;
        role: AdminRole;
        updated_at: string;
        user_id: string;
      }>;
      blog_post_services: TableDefinition<{
        blog_post_id: string;
        service_id: string;
        sort_order: number;
      }>;
      blog_posts: TableDefinition<{
        author: string;
        body: string;
        category: string;
        created_at: string;
        created_by: string | null;
        excerpt: string;
        featured: boolean;
        id: string;
        image_alt: string;
        image_path: string;
        meta_description: string;
        published_at: string | null;
        reading_minutes: number;
        slug: string;
        status: PublicationStatus;
        tags: Json;
        takeaways: Json;
        title: string;
        updated_at: string;
        updated_by: string | null;
      }>;
      client_logos: TableDefinition<{
        created_at: string;
        created_by: string | null;
        destination_url: string | null;
        id: string;
        image_alt: string;
        image_path: string;
        name: string;
        permission_confirmed_at: string | null;
        sort_order: number;
        status: PublicationStatus;
        updated_at: string;
        updated_by: string | null;
      }>;
      inquiries: TableDefinition<{
        availability: string | null;
        brief: string | null;
        collaboration_message: string | null;
        company_brand: string | null;
        contact_number: string | null;
        created_at: string;
        email: string;
        id: string;
        inquiry_type: string;
        is_read: boolean;
        name: string;
        newsletter_consent: boolean;
        notification_status: string;
        portfolio_url: string | null;
        preferred_timeline: string | null;
        privacy_consent: boolean;
        specialty: string | null;
        status: string;
        submitted_from: string;
        updated_at: string;
      }>;
      inquiry_services: TableDefinition<{
        created_at: string;
        inquiry_id: string;
        service_id: string;
      }>;
      media_assets: TableDefinition<{
        alt_text: string | null;
        bucket: string;
        created_at: string;
        created_by: string | null;
        id: string;
        mime_type: string;
        path: string;
        size_bytes: number;
      }>;
      newsletter_subscribers: TableDefinition<{
        consent_at: string;
        consent_granted: boolean;
        created_at: string;
        email: string;
        email_normalized: string;
        id: string;
        last_source: string;
        status: string;
        unsubscribed_at: string | null;
        updated_at: string;
      }>;
      project_services: TableDefinition<{
        project_id: string;
        service_id: string;
        sort_order: number;
      }>;
      projects: TableDefinition<{
        category: string;
        created_at: string;
        created_by: string | null;
        description: string;
        direction: string;
        experience: string;
        explores: Json;
        featured: boolean;
        format_label: string;
        id: string;
        image_alt: string;
        image_path: string;
        meta_description: string;
        palette: Json;
        premise_context: string;
        premise_question: string;
        principle: string;
        published_at: string | null;
        slug: string;
        sort_order: number;
        status: PublicationStatus;
        system: string;
        title: string;
        tone: Json;
        updated_at: string;
        updated_by: string | null;
        video_url: string | null;
        external_url: string | null;
      }>;
      services: TableDefinition<{
        approach: Json;
        created_at: string;
        created_by: string | null;
        description: string;
        disciplines: Json;
        hero_title: string;
        id: string;
        image_alt: string;
        image_path: string;
        is_active: boolean;
        meta_description: string;
        related_slugs: string[];
        slug: string;
        sort_order: number;
        title: string;
        updated_at: string;
        updated_by: string | null;
        useful_for: Json;
      }>;
      site_settings: TableDefinition<{
        created_at: string;
        is_public: boolean;
        key: string;
        updated_at: string;
        updated_by: string | null;
        value: Json;
      }>;
      submission_rate_limits: TableDefinition<{
        identifier_hash: string;
        request_count: number;
        scope: string;
        updated_at: string;
        window_started_at: string;
      }>;
      testimonials: TableDefinition<{
        attribution_name: string;
        attribution_organisation: string | null;
        attribution_role: string | null;
        created_at: string;
        created_by: string | null;
        id: string;
        permission_confirmed_at: string | null;
        project_context: string | null;
        project_id: string | null;
        quote: string;
        sort_order: number;
        status: PublicationStatus;
        updated_at: string;
        updated_by: string | null;
      }>;
    };
    Views: Record<never, never>;
    Functions: {
      bootstrap_first_owner: {
        Args: { p_display_name: string; p_user_id: string };
        Returns: undefined;
      };
      consume_submission_rate_limit: {
        Args: {
          p_identifier_hash: string;
          p_max_requests: number;
          p_scope: string;
          p_window_seconds: number;
        };
        Returns: boolean;
      };
      create_inquiry: {
        Args: { p_payload: Json; p_service_ids: string[] };
        Returns: string;
      };
      current_admin_role: {
        Args: Record<never, never>;
        Returns: string | null;
      };
      has_admin_role: { Args: { allowed_roles: string[] }; Returns: boolean };
      is_active_admin: { Args: Record<never, never>; Returns: boolean };
      register_admin_invitation: {
        Args: {
          p_display_name: string;
          p_invited_by: string;
          p_role: string;
          p_user_id: string;
        };
        Returns: undefined;
      };
      save_admin_blog_post: {
        Args: { p_post: Json; p_service_ids?: string[] };
        Returns: string;
      };
      save_admin_project: {
        Args: { p_project: Json; p_service_ids?: string[] };
        Returns: string;
      };
      subscribe_newsletter: {
        Args: {
          p_consent_granted: boolean;
          p_email: string;
          p_source: string;
        };
        Returns: string;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

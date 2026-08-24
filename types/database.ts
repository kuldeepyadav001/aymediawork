export type Json =
  | boolean
  | null
  | number
  | string
  | Json[]
  | { [key: string]: Json | undefined };

export type Database = {
  public: {
    Tables: {
      inquiries: {
        Row: {
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
        };
        Insert: {
          availability?: string | null;
          brief?: string | null;
          collaboration_message?: string | null;
          company_brand?: string | null;
          contact_number?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          inquiry_type: string;
          is_read?: boolean;
          name: string;
          newsletter_consent?: boolean;
          notification_status?: string;
          portfolio_url?: string | null;
          preferred_timeline?: string | null;
          privacy_consent: boolean;
          specialty?: string | null;
          status?: string;
          submitted_from?: string;
          updated_at?: string;
        };
        Relationships: [];
        Update: {
          availability?: string | null;
          brief?: string | null;
          collaboration_message?: string | null;
          company_brand?: string | null;
          contact_number?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          inquiry_type?: string;
          is_read?: boolean;
          name?: string;
          newsletter_consent?: boolean;
          notification_status?: string;
          portfolio_url?: string | null;
          preferred_timeline?: string | null;
          privacy_consent?: boolean;
          specialty?: string | null;
          status?: string;
          submitted_from?: string;
          updated_at?: string;
        };
      };
      inquiry_services: {
        Row: {
          created_at: string;
          inquiry_id: string;
          service_id: string;
        };
        Insert: {
          created_at?: string;
          inquiry_id: string;
          service_id: string;
        };
        Relationships: [];
        Update: {
          created_at?: string;
          inquiry_id?: string;
          service_id?: string;
        };
      };
      newsletter_subscribers: {
        Row: {
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
        };
        Insert: {
          consent_at?: string;
          consent_granted: boolean;
          created_at?: string;
          email: string;
          id?: string;
          last_source: string;
          status?: string;
          unsubscribed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
        Update: {
          consent_at?: string;
          consent_granted?: boolean;
          created_at?: string;
          email?: string;
          id?: string;
          last_source?: string;
          status?: string;
          unsubscribed_at?: string | null;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          slug: string;
          sort_order: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          is_active?: boolean;
          slug: string;
          sort_order: number;
          title: string;
          updated_at?: string;
        };
        Relationships: [];
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          slug?: string;
          sort_order?: number;
          title?: string;
          updated_at?: string;
        };
      };
      submission_rate_limits: {
        Row: {
          identifier_hash: string;
          request_count: number;
          scope: string;
          updated_at: string;
          window_started_at: string;
        };
        Insert: {
          identifier_hash: string;
          request_count?: number;
          scope: string;
          updated_at?: string;
          window_started_at: string;
        };
        Relationships: [];
        Update: {
          identifier_hash?: string;
          request_count?: number;
          scope?: string;
          updated_at?: string;
          window_started_at?: string;
        };
      };
    };
    Views: Record<never, never>;
    Functions: {
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

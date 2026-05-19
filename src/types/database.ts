export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type UserRole = 'individual' | 'institution' | 'admin'
export type SubscriptionTier = 'free' | 'pro' | 'enterprise'
export type SubscriptionStatus = 'active' | 'inactive' | 'trialing' | 'past_due' | 'canceled'
export type InterviewStatus = 'in_progress' | 'complete'
export type ContractStatus = 'prospect' | 'active' | 'complete'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          username: string | null
          role: UserRole
          subscription_tier: SubscriptionTier
          stripe_customer_id: string | null
          subscription_status: SubscriptionStatus
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          username?: string | null
          role?: UserRole
          subscription_tier?: SubscriptionTier
          stripe_customer_id?: string | null
          subscription_status?: SubscriptionStatus
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          username?: string | null
          role?: UserRole
          subscription_tier?: SubscriptionTier
          stripe_customer_id?: string | null
          subscription_status?: SubscriptionStatus
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          headline: string | null
          bio: string | null
          location: string | null
          film_url: string | null
          film_thumbnail_url: string | null
          landing_page_slug: string | null
          is_published: boolean
          published_at: string | null
          cta_label: string | null
          cta_url: string | null
          links: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          headline?: string | null
          bio?: string | null
          location?: string | null
          film_url?: string | null
          film_thumbnail_url?: string | null
          landing_page_slug?: string | null
          is_published?: boolean
          published_at?: string | null
          cta_label?: string | null
          cta_url?: string | null
          links?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          headline?: string | null
          bio?: string | null
          location?: string | null
          film_url?: string | null
          film_thumbnail_url?: string | null
          landing_page_slug?: string | null
          is_published?: boolean
          published_at?: string | null
          cta_label?: string | null
          cta_url?: string | null
          links?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      qr_codes: {
        Row: {
          id: string
          profile_id: string
          user_id: string
          redirect_url: string
          short_code: string
          design_config: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          user_id: string
          redirect_url: string
          short_code: string
          design_config?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          user_id?: string
          redirect_url?: string
          short_code?: string
          design_config?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      scans: {
        Row: {
          id: string
          qr_code_id: string | null
          profile_id: string
          scanned_at: string
          ip_address: string | null
          country: string | null
          city: string | null
          device_type: string | null
          referrer: string | null
          watch_duration_seconds: number | null
        }
        Insert: {
          id?: string
          qr_code_id?: string | null
          profile_id: string
          scanned_at?: string
          ip_address?: string | null
          country?: string | null
          city?: string | null
          device_type?: string | null
          referrer?: string | null
          watch_duration_seconds?: number | null
        }
        Update: {
          id?: string
          qr_code_id?: string | null
          profile_id?: string
          scanned_at?: string
          ip_address?: string | null
          country?: string | null
          city?: string | null
          device_type?: string | null
          referrer?: string | null
          watch_duration_seconds?: number | null
        }
        Relationships: []
      }
      interview_sessions: {
        Row: {
          id: string
          user_id: string
          messages: Json
          story_brief: string | null
          script_framework: string | null
          shot_list: string | null
          status: InterviewStatus
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          messages?: Json
          story_brief?: string | null
          script_framework?: string | null
          shot_list?: string | null
          status?: InterviewStatus
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          messages?: Json
          story_brief?: string | null
          script_framework?: string | null
          shot_list?: string | null
          status?: InterviewStatus
          created_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          id: string
          institution_name: string
          contact_name: string
          contact_email: string
          tier: SubscriptionTier
          value: number | null
          status: ContractStatus
          cohort_size: number | null
          profiles_produced: number | null
          start_date: string | null
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          institution_name: string
          contact_name: string
          contact_email: string
          tier?: SubscriptionTier
          value?: number | null
          status?: ContractStatus
          cohort_size?: number | null
          profiles_produced?: number | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          institution_name?: string
          contact_name?: string
          contact_email?: string
          tier?: SubscriptionTier
          value?: number | null
          status?: ContractStatus
          cohort_size?: number | null
          profiles_produced?: number | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type UserRow = Database['public']['Tables']['users']['Row']
export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type QRCodeRow = Database['public']['Tables']['qr_codes']['Row']
export type ScanRow = Database['public']['Tables']['scans']['Row']
export type InterviewSessionRow = Database['public']['Tables']['interview_sessions']['Row']
export type ContractRow = Database['public']['Tables']['contracts']['Row']

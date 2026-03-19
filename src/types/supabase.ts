export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      api_consumer_plan_assignments: {
        Row: {
          consumer_id: string
          end_at: string | null
          id: string
          quota_plan_id: string
          start_at: string
          status: string | null
        }
        Insert: {
          consumer_id: string
          end_at?: string | null
          id?: string
          quota_plan_id: string
          start_at?: string
          status?: string | null
        }
        Update: {
          consumer_id?: string
          end_at?: string | null
          id?: string
          quota_plan_id?: string
          start_at?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_consumer_plan_assignments_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "api_consumers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_consumer_plan_assignments_quota_plan_id_fkey"
            columns: ["quota_plan_id"]
            isOneToOne: false
            referencedRelation: "api_quota_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      api_consumers: {
        Row: {
          consumer_type: string
          created_at: string
          description: string | null
          id: string
          name: string
          owner_user_id: string | null
          status: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          consumer_type: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_user_id?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          consumer_type?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_user_id?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_consumers_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_consumers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      api_credentials: {
        Row: {
          consumer_id: string
          created_at: string
          credential_type: string | null
          expires_at: string | null
          id: string
          key_prefix: string
          last_used_at: string | null
          revoked_at: string | null
          secret_hash: string
          status: string | null
        }
        Insert: {
          consumer_id: string
          created_at?: string
          credential_type?: string | null
          expires_at?: string | null
          id?: string
          key_prefix: string
          last_used_at?: string | null
          revoked_at?: string | null
          secret_hash: string
          status?: string | null
        }
        Update: {
          consumer_id?: string
          created_at?: string
          credential_type?: string | null
          expires_at?: string | null
          id?: string
          key_prefix?: string
          last_used_at?: string | null
          revoked_at?: string | null
          secret_hash?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_credentials_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "api_consumers"
            referencedColumns: ["id"]
          },
        ]
      }
      api_quota_plans: {
        Row: {
          created_at: string
          daily_quota: number
          data_transfer_limit_mb: number | null
          id: string
          monthly_quota: number
          plan_code: string
          plan_name: string
          webhook_limit: number | null
        }
        Insert: {
          created_at?: string
          daily_quota?: number
          data_transfer_limit_mb?: number | null
          id?: string
          monthly_quota?: number
          plan_code: string
          plan_name: string
          webhook_limit?: number | null
        }
        Update: {
          created_at?: string
          daily_quota?: number
          data_transfer_limit_mb?: number | null
          id?: string
          monthly_quota?: number
          plan_code?: string
          plan_name?: string
          webhook_limit?: number | null
        }
        Relationships: []
      }
      api_rate_limit_policies: {
        Row: {
          burst_limit: number | null
          concurrent_limit: number | null
          created_at: string
          id: string
          policy_name: string
          requests_per_hour: number | null
          requests_per_minute: number | null
          scope_type: string | null
        }
        Insert: {
          burst_limit?: number | null
          concurrent_limit?: number | null
          created_at?: string
          id?: string
          policy_name: string
          requests_per_hour?: number | null
          requests_per_minute?: number | null
          scope_type?: string | null
        }
        Update: {
          burst_limit?: number | null
          concurrent_limit?: number | null
          created_at?: string
          id?: string
          policy_name?: string
          requests_per_hour?: number | null
          requests_per_minute?: number | null
          scope_type?: string | null
        }
        Relationships: []
      }
      api_request_logs: {
        Row: {
          consumer_id: string | null
          created_at: string
          id: number
          ip_address: unknown
          latency_ms: number | null
          method: string
          path: string
          request_id: string
          request_size_bytes: number | null
          response_size_bytes: number | null
          route_id: string | null
          source_type: string | null
          status_code: number
          tenant_id: string | null
          trace_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          consumer_id?: string | null
          created_at?: string
          id?: number
          ip_address?: unknown
          latency_ms?: number | null
          method: string
          path: string
          request_id: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          route_id?: string | null
          source_type?: string | null
          status_code: number
          tenant_id?: string | null
          trace_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          consumer_id?: string | null
          created_at?: string
          id?: number
          ip_address?: unknown
          latency_ms?: number | null
          method?: string
          path?: string
          request_id?: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          route_id?: string | null
          source_type?: string | null
          status_code?: number
          tenant_id?: string | null
          trace_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_request_logs_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "api_consumers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_request_logs_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "api_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_request_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_request_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      api_routes: {
        Row: {
          auth_type: string | null
          created_at: string
          id: string
          is_active: boolean | null
          is_public: boolean | null
          method: string
          path_pattern: string
          permission_policy_id: string | null
          rate_limit_policy_id: string | null
          route_name: string
          service_id: string
          transform_request_rule: Json | null
          transform_response_rule: Json | null
          updated_at: string
          version: string | null
        }
        Insert: {
          auth_type?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          method: string
          path_pattern: string
          permission_policy_id?: string | null
          rate_limit_policy_id?: string | null
          route_name: string
          service_id: string
          transform_request_rule?: Json | null
          transform_response_rule?: Json | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          auth_type?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          method?: string
          path_pattern?: string
          permission_policy_id?: string | null
          rate_limit_policy_id?: string | null
          route_name?: string
          service_id?: string
          transform_request_rule?: Json | null
          transform_response_rule?: Json | null
          updated_at?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_routes_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "api_services"
            referencedColumns: ["id"]
          },
        ]
      }
      api_services: {
        Row: {
          base_url: string
          created_at: string
          environment: string | null
          health_check_url: string | null
          id: string
          is_active: boolean | null
          retry_policy: Json | null
          service_code: string
          service_name: string
          timeout_ms: number | null
          updated_at: string
        }
        Insert: {
          base_url: string
          created_at?: string
          environment?: string | null
          health_check_url?: string | null
          id?: string
          is_active?: boolean | null
          retry_policy?: Json | null
          service_code: string
          service_name: string
          timeout_ms?: number | null
          updated_at?: string
        }
        Update: {
          base_url?: string
          created_at?: string
          environment?: string | null
          health_check_url?: string | null
          id?: string
          is_active?: boolean | null
          retry_policy?: Json | null
          service_code?: string
          service_name?: string
          timeout_ms?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      api_usage_daily: {
        Row: {
          consumer_id: string | null
          error_count: number | null
          id: string
          request_count: number | null
          route_id: string | null
          success_count: number | null
          tenant_id: string | null
          total_data_mb: number | null
          total_latency_ms: number | null
          usage_date: string
        }
        Insert: {
          consumer_id?: string | null
          error_count?: number | null
          id?: string
          request_count?: number | null
          route_id?: string | null
          success_count?: number | null
          tenant_id?: string | null
          total_data_mb?: number | null
          total_latency_ms?: number | null
          usage_date?: string
        }
        Update: {
          consumer_id?: string | null
          error_count?: number | null
          id?: string
          request_count?: number | null
          route_id?: string | null
          success_count?: number | null
          tenant_id?: string | null
          total_data_mb?: number | null
          total_latency_ms?: number | null
          usage_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_daily_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "api_consumers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_usage_daily_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "api_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_usage_daily_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      app_modules: {
        Row: {
          category: string | null
          code: string
          created_at: string
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          code: string
          created_at?: string
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          code?: string
          created_at?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      asset_categories: {
        Row: {
          code: string
          color_code: string | null
          created_at: string
          default_uom: string | null
          depreciation_class: string | null
          icon_url: string | null
          id: string
          is_system_seed: boolean | null
          name_en: string | null
          name_th: string
          parent_id: string | null
          status: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          code: string
          color_code?: string | null
          created_at?: string
          default_uom?: string | null
          depreciation_class?: string | null
          icon_url?: string | null
          id?: string
          is_system_seed?: boolean | null
          name_en?: string | null
          name_th: string
          parent_id?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          color_code?: string | null
          created_at?: string
          default_uom?: string | null
          depreciation_class?: string | null
          icon_url?: string | null
          id?: string
          is_system_seed?: boolean | null
          name_en?: string | null
          name_th?: string
          parent_id?: string | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "asset_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_categories_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          asset_category_id: string | null
          asset_type: string | null
          created_at: string | null
          id: string
          location_id: string | null
          metadata: Json | null
          name: string
          owner_org_id: string | null
          purchase_date: string | null
          serial_number: string | null
          status: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          asset_category_id?: string | null
          asset_type?: string | null
          created_at?: string | null
          id?: string
          location_id?: string | null
          metadata?: Json | null
          name: string
          owner_org_id?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          asset_category_id?: string | null
          asset_type?: string | null
          created_at?: string | null
          id?: string
          location_id?: string | null
          metadata?: Json | null
          name?: string
          owner_org_id?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_asset_category_id_fkey"
            columns: ["asset_category_id"]
            isOneToOne: false
            referencedRelation: "asset_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_owner_org_id_fkey"
            columns: ["owner_org_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_event_changes: {
        Row: {
          audit_event_id: string
          change_type: string
          field_path: string
          id: string
          is_sensitive_masked: boolean
          new_value_json: Json | null
          new_value_text: string | null
          old_value_json: Json | null
          old_value_text: string | null
          sort_order: number
        }
        Insert: {
          audit_event_id: string
          change_type: string
          field_path: string
          id?: string
          is_sensitive_masked?: boolean
          new_value_json?: Json | null
          new_value_text?: string | null
          old_value_json?: Json | null
          old_value_text?: string | null
          sort_order?: number
        }
        Update: {
          audit_event_id?: string
          change_type?: string
          field_path?: string
          id?: string
          is_sensitive_masked?: boolean
          new_value_json?: Json | null
          new_value_text?: string | null
          old_value_json?: Json | null
          old_value_text?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "audit_event_changes_audit_event_id_fkey"
            columns: ["audit_event_id"]
            isOneToOne: false
            referencedRelation: "audit_events"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          actor_email: string | null
          actor_ip: unknown
          actor_name: string | null
          actor_role_snapshot: Json | null
          actor_type: string
          actor_user_agent: string | null
          actor_user_id: string | null
          correlation_id: string | null
          department_id: string | null
          event_action: string
          event_category: string
          event_result: string
          event_time: string
          hash_chain_prev: string | null
          hash_chain_self: string | null
          id: string
          ingested_at: string
          is_sensitive: boolean
          location_id: string | null
          metadata_json: Json | null
          module_code: string | null
          platform_code: string | null
          reason_code: string | null
          request_id: string | null
          session_id: string | null
          severity: string
          summary: string
          target_id: string | null
          target_name: string | null
          target_type: string | null
          tenant_id: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_ip?: unknown
          actor_name?: string | null
          actor_role_snapshot?: Json | null
          actor_type?: string
          actor_user_agent?: string | null
          actor_user_id?: string | null
          correlation_id?: string | null
          department_id?: string | null
          event_action: string
          event_category: string
          event_result: string
          event_time?: string
          hash_chain_prev?: string | null
          hash_chain_self?: string | null
          id?: string
          ingested_at?: string
          is_sensitive?: boolean
          location_id?: string | null
          metadata_json?: Json | null
          module_code?: string | null
          platform_code?: string | null
          reason_code?: string | null
          request_id?: string | null
          session_id?: string | null
          severity?: string
          summary: string
          target_id?: string | null
          target_name?: string | null
          target_type?: string | null
          tenant_id?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_ip?: unknown
          actor_name?: string | null
          actor_role_snapshot?: Json | null
          actor_type?: string
          actor_user_agent?: string | null
          actor_user_id?: string | null
          correlation_id?: string | null
          department_id?: string | null
          event_action?: string
          event_category?: string
          event_result?: string
          event_time?: string
          hash_chain_prev?: string | null
          hash_chain_self?: string | null
          id?: string
          ingested_at?: string
          is_sensitive?: boolean
          location_id?: string | null
          metadata_json?: Json | null
          module_code?: string | null
          platform_code?: string | null
          reason_code?: string | null
          request_id?: string | null
          session_id?: string | null
          severity?: string
          summary?: string
          target_id?: string | null
          target_name?: string | null
          target_type?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_events_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_export_jobs: {
        Row: {
          completed_at: string | null
          file_url: string | null
          filters_json: Json
          id: string
          requested_at: string
          requested_by_user_id: string
          status: string
          tenant_id: string | null
        }
        Insert: {
          completed_at?: string | null
          file_url?: string | null
          filters_json: Json
          id?: string
          requested_at?: string
          requested_by_user_id: string
          status?: string
          tenant_id?: string | null
        }
        Update: {
          completed_at?: string | null
          file_url?: string | null
          filters_json?: Json
          id?: string
          requested_at?: string
          requested_by_user_id?: string
          status?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_export_jobs_requested_by_user_id_fkey"
            columns: ["requested_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_export_jobs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_retention_policies: {
        Row: {
          archive_enabled: boolean
          created_at: string
          description: string | null
          event_category: string | null
          id: string
          policy_code: string
          retention_days: number
          severity: string | null
          updated_at: string
        }
        Insert: {
          archive_enabled?: boolean
          created_at?: string
          description?: string | null
          event_category?: string | null
          id?: string
          policy_code: string
          retention_days?: number
          severity?: string | null
          updated_at?: string
        }
        Update: {
          archive_enabled?: boolean
          created_at?: string
          description?: string | null
          event_category?: string | null
          id?: string
          policy_code?: string
          retention_days?: number
          severity?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      auth_identities: {
        Row: {
          access_metadata: Json
          created_at: string
          id: string
          identity_type: Database["public"]["Enums"]["identity_type"]
          identity_value: string
          is_primary: boolean | null
          is_verified: boolean | null
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          access_metadata?: Json
          created_at?: string
          id?: string
          identity_type: Database["public"]["Enums"]["identity_type"]
          identity_value: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          updated_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          access_metadata?: Json
          created_at?: string
          id?: string
          identity_type?: Database["public"]["Enums"]["identity_type"]
          identity_value?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auth_identities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      branding_profiles: {
        Row: {
          created_at: string
          custom_css_json: Json | null
          favicon_url: string | null
          id: string
          login_background_url: string | null
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          tenant_id: string
          theme_mode: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_css_json?: Json | null
          favicon_url?: string | null
          id?: string
          login_background_url?: string | null
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tenant_id: string
          theme_mode?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_css_json?: Json | null
          favicon_url?: string | null
          id?: string
          login_background_url?: string | null
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tenant_id?: string
          theme_mode?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "branding_profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_years: {
        Row: {
          created_at: string
          end_date: string
          id: string
          start_date: string
          status: string | null
          tenant_id: string
          updated_at: string
          year_code: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          start_date: string
          status?: string | null
          tenant_id: string
          updated_at?: string
          year_code: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          start_date?: string
          status?: string | null
          tenant_id?: string
          updated_at?: string
          year_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_years_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      connector_definitions: {
        Row: {
          auth_type: string
          capability_json: Json | null
          category: string
          code: string
          config_schema_json: Json | null
          created_at: string
          direction: string | null
          id: string
          mapping_schema_json: Json | null
          name: string
          protocol_type: string
          status: string | null
          updated_at: string
          version: string | null
        }
        Insert: {
          auth_type: string
          capability_json?: Json | null
          category: string
          code: string
          config_schema_json?: Json | null
          created_at?: string
          direction?: string | null
          id?: string
          mapping_schema_json?: Json | null
          name: string
          protocol_type: string
          status?: string | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          auth_type?: string
          capability_json?: Json | null
          category?: string
          code?: string
          config_schema_json?: Json | null
          created_at?: string
          direction?: string | null
          id?: string
          mapping_schema_json?: Json | null
          name?: string
          protocol_type?: string
          status?: string | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      connector_field_mappings: {
        Row: {
          connector_instance_id: string
          id: string
          is_required: boolean | null
          mapping_group: string | null
          sort_order: number | null
          source_field: string
          target_field: string
          transform_rule_json: Json | null
          transform_type: string | null
          validation_rule_json: Json | null
        }
        Insert: {
          connector_instance_id: string
          id?: string
          is_required?: boolean | null
          mapping_group?: string | null
          sort_order?: number | null
          source_field: string
          target_field: string
          transform_rule_json?: Json | null
          transform_type?: string | null
          validation_rule_json?: Json | null
        }
        Update: {
          connector_instance_id?: string
          id?: string
          is_required?: boolean | null
          mapping_group?: string | null
          sort_order?: number | null
          source_field?: string
          target_field?: string
          transform_rule_json?: Json | null
          transform_type?: string | null
          validation_rule_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "connector_field_mappings_connector_instance_id_fkey"
            columns: ["connector_instance_id"]
            isOneToOne: false
            referencedRelation: "connector_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      connector_instances: {
        Row: {
          advanced_config_json: Json | null
          auth_config_ref: string | null
          connection_config_json: Json | null
          created_at: string
          created_by: string | null
          definition_id: string
          environment: string | null
          id: string
          is_enabled: boolean | null
          last_sync_at: string | null
          last_tested_at: string | null
          name: string
          status: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          advanced_config_json?: Json | null
          auth_config_ref?: string | null
          connection_config_json?: Json | null
          created_at?: string
          created_by?: string | null
          definition_id: string
          environment?: string | null
          id?: string
          is_enabled?: boolean | null
          last_sync_at?: string | null
          last_tested_at?: string | null
          name: string
          status?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          advanced_config_json?: Json | null
          auth_config_ref?: string | null
          connection_config_json?: Json | null
          created_at?: string
          created_by?: string | null
          definition_id?: string
          environment?: string | null
          id?: string
          is_enabled?: boolean | null
          last_sync_at?: string | null
          last_tested_at?: string | null
          name?: string
          status?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connector_instances_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connector_instances_definition_id_fkey"
            columns: ["definition_id"]
            isOneToOne: false
            referencedRelation: "connector_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connector_instances_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      connector_sync_profiles: {
        Row: {
          batch_size: number | null
          conflict_policy: string | null
          connector_instance_id: string
          created_at: string
          cron_expression: string | null
          id: string
          last_watermark_value: string | null
          retry_policy_json: Json | null
          sync_mode: string | null
          timezone: string | null
          updated_at: string
          watermark_field: string | null
        }
        Insert: {
          batch_size?: number | null
          conflict_policy?: string | null
          connector_instance_id: string
          created_at?: string
          cron_expression?: string | null
          id?: string
          last_watermark_value?: string | null
          retry_policy_json?: Json | null
          sync_mode?: string | null
          timezone?: string | null
          updated_at?: string
          watermark_field?: string | null
        }
        Update: {
          batch_size?: number | null
          conflict_policy?: string | null
          connector_instance_id?: string
          created_at?: string
          cron_expression?: string | null
          id?: string
          last_watermark_value?: string | null
          retry_policy_json?: Json | null
          sync_mode?: string | null
          timezone?: string | null
          updated_at?: string
          watermark_field?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "connector_sync_profiles_connector_instance_id_fkey"
            columns: ["connector_instance_id"]
            isOneToOne: true
            referencedRelation: "connector_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string | null
          cost_center_code: string | null
          created_at: string
          deleted_at: string | null
          department_type: string | null
          id: string
          is_root: boolean | null
          manager_id: string | null
          name: string
          name_en: string | null
          parent_department_id: string | null
          sort_order: number | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          code?: string | null
          cost_center_code?: string | null
          created_at?: string
          deleted_at?: string | null
          department_type?: string | null
          id?: string
          is_root?: boolean | null
          manager_id?: string | null
          name: string
          name_en?: string | null
          parent_department_id?: string | null
          sort_order?: number | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          code?: string | null
          cost_center_code?: string | null
          created_at?: string
          deleted_at?: string | null
          department_type?: string | null
          id?: string
          is_root?: boolean | null
          manager_id?: string | null
          name?: string
          name_en?: string | null
          parent_department_id?: string | null
          sort_order?: number | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_parent_department_id_fkey"
            columns: ["parent_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      device_telemetry_latest: {
        Row: {
          device_id: string
          payload: Json
          recorded_at: string | null
        }
        Insert: {
          device_id: string
          payload: Json
          recorded_at?: string | null
        }
        Update: {
          device_id?: string
          payload?: Json
          recorded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_telemetry_latest_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: true
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      device_types: {
        Row: {
          code: string
          connectivity_type: string | null
          created_at: string
          firmware_schema_json: Json | null
          id: string
          is_system_seed: boolean | null
          manufacturer: string | null
          name: string
          status: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          code: string
          connectivity_type?: string | null
          created_at?: string
          firmware_schema_json?: Json | null
          id?: string
          is_system_seed?: boolean | null
          manufacturer?: string | null
          name: string
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          connectivity_type?: string | null
          created_at?: string
          firmware_schema_json?: Json | null
          id?: string
          is_system_seed?: boolean | null
          manufacturer?: string | null
          name?: string
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_types_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          asset_id: string | null
          config: Json | null
          created_at: string | null
          device_type: string | null
          device_type_id: string | null
          device_uid: string
          firmware_version: string | null
          id: string
          is_online: boolean | null
          last_heartbeat: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          asset_id?: string | null
          config?: Json | null
          created_at?: string | null
          device_type?: string | null
          device_type_id?: string | null
          device_uid: string
          firmware_version?: string | null
          id?: string
          is_online?: boolean | null
          last_heartbeat?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          asset_id?: string | null
          config?: Json | null
          created_at?: string | null
          device_type?: string | null
          device_type_id?: string | null
          device_uid?: string
          firmware_version?: string | null
          id?: string
          is_online?: boolean | null
          last_heartbeat?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_device_type_id_fkey"
            columns: ["device_type_id"]
            isOneToOne: false
            referencedRelation: "device_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      file_access_logs: {
        Row: {
          accessed_at: string
          action: string
          actor_user_id: string | null
          file_id: string
          id: string
          ip_address: string | null
          result: string | null
          tenant_id: string
          user_agent: string | null
        }
        Insert: {
          accessed_at?: string
          action: string
          actor_user_id?: string | null
          file_id: string
          id?: string
          ip_address?: string | null
          result?: string | null
          tenant_id: string
          user_agent?: string | null
        }
        Update: {
          accessed_at?: string
          action?: string
          actor_user_id?: string | null
          file_id?: string
          id?: string
          ip_address?: string | null
          result?: string | null
          tenant_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_access_logs_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_access_logs_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_access_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      file_links: {
        Row: {
          entity_id: string
          entity_type: string
          file_id: string
          id: string
          link_role: string
          linked_at: string
          linked_by: string | null
          tenant_id: string
        }
        Insert: {
          entity_id: string
          entity_type: string
          file_id: string
          id?: string
          link_role?: string
          linked_at?: string
          linked_by?: string | null
          tenant_id: string
        }
        Update: {
          entity_id?: string
          entity_type?: string
          file_id?: string
          id?: string
          link_role?: string
          linked_at?: string
          linked_by?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_links_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_links_linked_by_fkey"
            columns: ["linked_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_links_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      file_versions: {
        Row: {
          bucket_name: string
          change_note: string | null
          checksum: string | null
          file_id: string
          file_size_bytes: number
          id: string
          is_current: boolean
          storage_key: string
          uploaded_at: string
          uploaded_by: string | null
          version_no: number
        }
        Insert: {
          bucket_name: string
          change_note?: string | null
          checksum?: string | null
          file_id: string
          file_size_bytes?: number
          id?: string
          is_current?: boolean
          storage_key: string
          uploaded_at?: string
          uploaded_by?: string | null
          version_no: number
        }
        Update: {
          bucket_name?: string
          change_note?: string | null
          checksum?: string | null
          file_id?: string
          file_size_bytes?: number
          id?: string
          is_current?: boolean
          storage_key?: string
          uploaded_at?: string
          uploaded_by?: string | null
          version_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "file_versions_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_versions_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          bucket_name: string
          checksum: string | null
          current_version_no: number
          deleted_at: string | null
          deleted_by: string | null
          file_extension: string | null
          file_size_bytes: number
          id: string
          is_deleted: boolean
          mime_type: string | null
          module_key: string
          original_filename: string
          status: string
          storage_key: string
          stored_filename: string | null
          tenant_id: string
          updated_at: string
          uploaded_at: string
          uploaded_by: string | null
          visibility: string
        }
        Insert: {
          bucket_name: string
          checksum?: string | null
          current_version_no?: number
          deleted_at?: string | null
          deleted_by?: string | null
          file_extension?: string | null
          file_size_bytes?: number
          id?: string
          is_deleted?: boolean
          mime_type?: string | null
          module_key: string
          original_filename: string
          status?: string
          storage_key: string
          stored_filename?: string | null
          tenant_id: string
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string | null
          visibility?: string
        }
        Update: {
          bucket_name?: string
          checksum?: string | null
          current_version_no?: number
          deleted_at?: string | null
          deleted_by?: string | null
          file_extension?: string | null
          file_size_bytes?: number
          id?: string
          is_deleted?: boolean
          mime_type?: string | null
          module_key?: string
          original_filename?: string
          status?: string
          storage_key?: string
          stored_filename?: string | null
          tenant_id?: string
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_job_items: {
        Row: {
          action_type: string
          created_at: string
          error_code: string | null
          error_message: string | null
          external_record_id: string | null
          id: string
          internal_record_id: string | null
          job_id: string
          payload_hash: string | null
          status: string
        }
        Insert: {
          action_type: string
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          external_record_id?: string | null
          id?: string
          internal_record_id?: string | null
          job_id: string
          payload_hash?: string | null
          status: string
        }
        Update: {
          action_type?: string
          created_at?: string
          error_code?: string | null
          error_message?: string | null
          external_record_id?: string | null
          id?: string
          internal_record_id?: string | null
          job_id?: string
          payload_hash?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_job_items_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "integration_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_jobs: {
        Row: {
          connector_instance_id: string
          created_at: string
          created_by: string | null
          ended_at: string | null
          error_summary: string | null
          failed_count: number | null
          id: string
          job_type: string
          priority: number | null
          processed_count: number | null
          request_context_json: Json | null
          started_at: string | null
          status: string | null
          success_count: number | null
          trigger_type: string | null
        }
        Insert: {
          connector_instance_id: string
          created_at?: string
          created_by?: string | null
          ended_at?: string | null
          error_summary?: string | null
          failed_count?: number | null
          id?: string
          job_type: string
          priority?: number | null
          processed_count?: number | null
          request_context_json?: Json | null
          started_at?: string | null
          status?: string | null
          success_count?: number | null
          trigger_type?: string | null
        }
        Update: {
          connector_instance_id?: string
          created_at?: string
          created_by?: string | null
          ended_at?: string | null
          error_summary?: string | null
          failed_count?: number | null
          id?: string
          job_type?: string
          priority?: number | null
          processed_count?: number | null
          request_context_json?: Json | null
          started_at?: string | null
          status?: string | null
          success_count?: number | null
          trigger_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_jobs_connector_instance_id_fkey"
            columns: ["connector_instance_id"]
            isOneToOne: false
            referencedRelation: "connector_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integration_jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_state_store: {
        Row: {
          connector_instance_id: string
          id: string
          state_key: string
          state_value_json: Json
          updated_at: string
        }
        Insert: {
          connector_instance_id: string
          id?: string
          state_key: string
          state_value_json: Json
          updated_at?: string
        }
        Update: {
          connector_instance_id?: string
          id?: string
          state_key?: string
          state_value_json?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_state_store_connector_instance_id_fkey"
            columns: ["connector_instance_id"]
            isOneToOne: false
            referencedRelation: "connector_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_webhook_events: {
        Row: {
          connector_instance_id: string
          error_message: string | null
          event_name: string
          headers_json: Json | null
          id: string
          payload_json: Json
          processed_at: string | null
          received_at: string
          signature_valid: boolean | null
          source_event_id: string | null
          status: string | null
        }
        Insert: {
          connector_instance_id: string
          error_message?: string | null
          event_name: string
          headers_json?: Json | null
          id?: string
          payload_json: Json
          processed_at?: string | null
          received_at?: string
          signature_valid?: boolean | null
          source_event_id?: string | null
          status?: string | null
        }
        Update: {
          connector_instance_id?: string
          error_message?: string | null
          event_name?: string
          headers_json?: Json | null
          id?: string
          payload_json?: Json
          processed_at?: string | null
          received_at?: string
          signature_valid?: boolean | null
          source_event_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_webhook_events_connector_instance_id_fkey"
            columns: ["connector_instance_id"]
            isOneToOne: false
            referencedRelation: "connector_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          code: string | null
          created_at: string
          id: string
          latitude: number | null
          location_type: string | null
          longitude: number | null
          name: string
          parent_location_id: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          code?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          location_type?: string | null
          longitude?: number | null
          name: string
          parent_location_id?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          code?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          location_type?: string | null
          longitude?: number | null
          name?: string
          parent_location_id?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_parent_location_id_fkey"
            columns: ["parent_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      md_domains: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      md_external_mappings: {
        Row: {
          external_code: string
          external_name: string | null
          external_system: string
          id: string
          mapping_status: string | null
          md_record_id: string
          synced_at: string | null
        }
        Insert: {
          external_code: string
          external_name?: string | null
          external_system: string
          id?: string
          mapping_status?: string | null
          md_record_id: string
          synced_at?: string | null
        }
        Update: {
          external_code?: string
          external_name?: string | null
          external_system?: string
          id?: string
          mapping_status?: string | null
          md_record_id?: string
          synced_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "md_external_mappings_md_record_id_fkey"
            columns: ["md_record_id"]
            isOneToOne: false
            referencedRelation: "md_records"
            referencedColumns: ["id"]
          },
        ]
      }
      md_record_values: {
        Row: {
          field_key: string
          id: string
          md_record_id: string
          value_boolean: boolean | null
          value_date: string | null
          value_datetime: string | null
          value_json: Json | null
          value_number: number | null
          value_text: string | null
        }
        Insert: {
          field_key: string
          id?: string
          md_record_id: string
          value_boolean?: boolean | null
          value_date?: string | null
          value_datetime?: string | null
          value_json?: Json | null
          value_number?: number | null
          value_text?: string | null
        }
        Update: {
          field_key?: string
          id?: string
          md_record_id?: string
          value_boolean?: boolean | null
          value_date?: string | null
          value_datetime?: string | null
          value_json?: Json | null
          value_number?: number | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "md_record_values_md_record_id_fkey"
            columns: ["md_record_id"]
            isOneToOne: false
            referencedRelation: "md_records"
            referencedColumns: ["id"]
          },
        ]
      }
      md_records: {
        Row: {
          approval_status: string | null
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          effective_from: string | null
          effective_to: string | null
          id: string
          is_locked: boolean | null
          is_system_seed: boolean | null
          md_type_id: string
          name: string
          parent_record_id: string | null
          sort_order: number | null
          status: string | null
          tenant_id: string | null
          updated_at: string
          updated_by: string | null
          version_no: number | null
        }
        Insert: {
          approval_status?: string | null
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          is_locked?: boolean | null
          is_system_seed?: boolean | null
          md_type_id: string
          name: string
          parent_record_id?: string | null
          sort_order?: number | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
          updated_by?: string | null
          version_no?: number | null
        }
        Update: {
          approval_status?: string | null
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          is_locked?: boolean | null
          is_system_seed?: boolean | null
          md_type_id?: string
          name?: string
          parent_record_id?: string | null
          sort_order?: number | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
          updated_by?: string | null
          version_no?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "md_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_records_md_type_id_fkey"
            columns: ["md_type_id"]
            isOneToOne: false
            referencedRelation: "md_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_records_parent_record_id_fkey"
            columns: ["parent_record_id"]
            isOneToOne: false
            referencedRelation: "md_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_records_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_records_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      md_type_fields: {
        Row: {
          data_type: string
          default_value: string | null
          field_key: string
          id: string
          is_required: boolean | null
          is_searchable: boolean | null
          is_unique: boolean | null
          label: string
          md_type_id: string
          sort_order: number | null
          ui_config_json: Json | null
          validation_rule_json: Json | null
        }
        Insert: {
          data_type: string
          default_value?: string | null
          field_key: string
          id?: string
          is_required?: boolean | null
          is_searchable?: boolean | null
          is_unique?: boolean | null
          label: string
          md_type_id: string
          sort_order?: number | null
          ui_config_json?: Json | null
          validation_rule_json?: Json | null
        }
        Update: {
          data_type?: string
          default_value?: string | null
          field_key?: string
          id?: string
          is_required?: boolean | null
          is_searchable?: boolean | null
          is_unique?: boolean | null
          label?: string
          md_type_id?: string
          sort_order?: number | null
          ui_config_json?: Json | null
          validation_rule_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "md_type_fields_md_type_id_fkey"
            columns: ["md_type_id"]
            isOneToOne: false
            referencedRelation: "md_types"
            referencedColumns: ["id"]
          },
        ]
      }
      md_types: {
        Row: {
          approval_required: boolean | null
          code: string
          created_at: string
          description: string | null
          domain_id: string
          external_mapping_enabled: boolean | null
          hierarchy_enabled: boolean | null
          id: string
          name: string
          scope_level: string | null
          status: string | null
          storage_mode: string | null
          tenant_override_allowed: boolean | null
          updated_at: string
          version_enabled: boolean | null
        }
        Insert: {
          approval_required?: boolean | null
          code: string
          created_at?: string
          description?: string | null
          domain_id: string
          external_mapping_enabled?: boolean | null
          hierarchy_enabled?: boolean | null
          id?: string
          name: string
          scope_level?: string | null
          status?: string | null
          storage_mode?: string | null
          tenant_override_allowed?: boolean | null
          updated_at?: string
          version_enabled?: boolean | null
        }
        Update: {
          approval_required?: boolean | null
          code?: string
          created_at?: string
          description?: string | null
          domain_id?: string
          external_mapping_enabled?: boolean | null
          hierarchy_enabled?: boolean | null
          id?: string
          name?: string
          scope_level?: string | null
          status?: string | null
          storage_mode?: string | null
          tenant_override_allowed?: boolean | null
          updated_at?: string
          version_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "md_types_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "md_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      md_version_history: {
        Row: {
          change_type: string
          changed_at: string
          changed_by: string | null
          changed_fields_json: Json | null
          id: string
          md_record_id: string
          snapshot_json: Json
          version_no: number
        }
        Insert: {
          change_type: string
          changed_at?: string
          changed_by?: string | null
          changed_fields_json?: Json | null
          id?: string
          md_record_id: string
          snapshot_json: Json
          version_no: number
        }
        Update: {
          change_type?: string
          changed_at?: string
          changed_by?: string | null
          changed_fields_json?: Json | null
          id?: string
          md_record_id?: string
          snapshot_json?: Json
          version_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "md_version_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "md_version_history_md_record_id_fkey"
            columns: ["md_record_id"]
            isOneToOne: false
            referencedRelation: "md_records"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_role_scopes: {
        Row: {
          created_at: string
          id: string
          membership_role_id: string
          scope_ref_code: string | null
          scope_ref_id: string | null
          scope_type: Database["public"]["Enums"]["scope_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          membership_role_id: string
          scope_ref_code?: string | null
          scope_ref_id?: string | null
          scope_type: Database["public"]["Enums"]["scope_type"]
        }
        Update: {
          created_at?: string
          id?: string
          membership_role_id?: string
          scope_ref_code?: string | null
          scope_ref_id?: string | null
          scope_type?: Database["public"]["Enums"]["scope_type"]
        }
        Relationships: [
          {
            foreignKeyName: "membership_role_scopes_membership_role_id_fkey"
            columns: ["membership_role_id"]
            isOneToOne: false
            referencedRelation: "membership_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_role_scopes_membership_role_id_fkey"
            columns: ["membership_role_id"]
            isOneToOne: false
            referencedRelation: "v_membership_effective_permissions"
            referencedColumns: ["membership_role_id"]
          },
        ]
      }
      membership_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
          expires_at: string | null
          id: string
          membership_id: string
          role_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          membership_id: string
          role_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          membership_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_roles_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "v_membership_effective_permissions"
            referencedColumns: ["role_id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string
          default_department_id: string | null
          default_location_id: string | null
          employee_code: string | null
          end_date: string | null
          id: string
          invited_by: string | null
          is_primary: boolean | null
          job_title: string | null
          joined_at: string | null
          last_accessed_at: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["membership_status"]
          tenant_id: string
          updated_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          created_at?: string
          default_department_id?: string | null
          default_location_id?: string | null
          employee_code?: string | null
          end_date?: string | null
          id?: string
          invited_by?: string | null
          is_primary?: boolean | null
          job_title?: string | null
          joined_at?: string | null
          last_accessed_at?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["membership_status"]
          tenant_id: string
          updated_at?: string
          user_id: string
          user_type?: string
        }
        Update: {
          created_at?: string
          default_department_id?: string | null
          default_location_id?: string | null
          employee_code?: string | null
          end_date?: string | null
          id?: string
          invited_by?: string | null
          is_primary?: boolean | null
          job_title?: string | null
          joined_at?: string | null
          last_accessed_at?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["membership_status"]
          tenant_id?: string
          updated_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_default_department_id_fkey"
            columns: ["default_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_default_location_id_fkey"
            columns: ["default_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          app_id: string | null
          code: string
          created_at: string
          icon: string | null
          id: string
          name: string
          parent_menu_id: string | null
          required_permission_code: string | null
          route_path: string | null
          sort_order: number
          updated_at: string
          visibility_type: Database["public"]["Enums"]["visibility_type"]
        }
        Insert: {
          app_id?: string | null
          code: string
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          parent_menu_id?: string | null
          required_permission_code?: string | null
          route_path?: string | null
          sort_order?: number
          updated_at?: string
          visibility_type?: Database["public"]["Enums"]["visibility_type"]
        }
        Update: {
          app_id?: string | null
          code?: string
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          parent_menu_id?: string | null
          required_permission_code?: string | null
          route_path?: string | null
          sort_order?: number
          updated_at?: string
          visibility_type?: Database["public"]["Enums"]["visibility_type"]
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "app_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_parent_menu_id_fkey"
            columns: ["parent_menu_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_action_logs: {
        Row: {
          action_at: string
          action_type: string
          action_value: string | null
          id: string
          meta_json: Json | null
          notification_inbox_id: string | null
          tenant_id: string
          user_id: string
        }
        Insert: {
          action_at?: string
          action_type: string
          action_value?: string | null
          id?: string
          meta_json?: Json | null
          notification_inbox_id?: string | null
          tenant_id: string
          user_id: string
        }
        Update: {
          action_at?: string
          action_type?: string
          action_value?: string | null
          id?: string
          meta_json?: Json | null
          notification_inbox_id?: string | null
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_action_logs_notification_inbox_id_fkey"
            columns: ["notification_inbox_id"]
            isOneToOne: false
            referencedRelation: "notification_inbox"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_action_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_action_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_channels: {
        Row: {
          code: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          code: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          code?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      notification_event_types: {
        Row: {
          category: string
          code: string
          created_at: string
          description: string | null
          entity_type: string | null
          id: string
          is_active: boolean | null
          name: string
          severity_default: string | null
          updated_at: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          description?: string | null
          entity_type?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          severity_default?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          description?: string | null
          entity_type?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          severity_default?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notification_inbox: {
        Row: {
          category: string | null
          created_at: string
          deeplink_url: string | null
          entity_id: string | null
          entity_type: string | null
          event_type_id: string | null
          expires_at: string | null
          id: string
          is_archived: boolean | null
          is_pinned: boolean | null
          is_read: boolean | null
          message: string
          read_at: string | null
          severity: string | null
          tenant_id: string
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          deeplink_url?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type_id?: string | null
          expires_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_pinned?: boolean | null
          is_read?: boolean | null
          message: string
          read_at?: string | null
          severity?: string | null
          tenant_id: string
          title: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          deeplink_url?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type_id?: string | null
          expires_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_pinned?: boolean | null
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          severity?: string | null
          tenant_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_inbox_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "notification_event_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_inbox_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_inbox_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          channel_code: string | null
          created_at: string
          event_type_id: string | null
          id: string
          is_enabled: boolean | null
          mute_until: string | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          tenant_id: string
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          channel_code?: string | null
          created_at?: string
          event_type_id?: string | null
          id?: string
          is_enabled?: boolean | null
          mute_until?: string | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          tenant_id: string
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          channel_code?: string | null
          created_at?: string
          event_type_id?: string | null
          id?: string
          is_enabled?: boolean | null
          mute_until?: string | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          tenant_id?: string
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_channel_code_fkey"
            columns: ["channel_code"]
            isOneToOne: false
            referencedRelation: "notification_channels"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "notification_preferences_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "notification_event_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_preferences_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_providers: {
        Row: {
          channel_code: string | null
          config_json: Json
          created_at: string
          id: string
          is_default: boolean | null
          last_tested_at: string | null
          provider_name: string
          status: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          channel_code?: string | null
          config_json?: Json
          created_at?: string
          id?: string
          is_default?: boolean | null
          last_tested_at?: string | null
          provider_name: string
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          channel_code?: string | null
          config_json?: Json
          created_at?: string
          id?: string
          is_default?: boolean | null
          last_tested_at?: string | null
          provider_name?: string
          status?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_providers_channel_code_fkey"
            columns: ["channel_code"]
            isOneToOne: false
            referencedRelation: "notification_channels"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "notification_providers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_rules: {
        Row: {
          channel_policy_json: Json | null
          condition_json: Json | null
          cooldown_seconds: number | null
          created_at: string
          dedup_window_seconds: number | null
          event_type_id: string | null
          id: string
          is_active: boolean | null
          priority_order: number | null
          recipient_config_json: Json | null
          recipient_strategy: string
          rule_name: string
          severity_override: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          channel_policy_json?: Json | null
          condition_json?: Json | null
          cooldown_seconds?: number | null
          created_at?: string
          dedup_window_seconds?: number | null
          event_type_id?: string | null
          id?: string
          is_active?: boolean | null
          priority_order?: number | null
          recipient_config_json?: Json | null
          recipient_strategy: string
          rule_name: string
          severity_override?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          channel_policy_json?: Json | null
          condition_json?: Json | null
          cooldown_seconds?: number | null
          created_at?: string
          dedup_window_seconds?: number | null
          event_type_id?: string | null
          id?: string
          is_active?: boolean | null
          priority_order?: number | null
          recipient_config_json?: Json | null
          recipient_strategy?: string
          rule_name?: string
          severity_override?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_rules_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "notification_event_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_rules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          body_format: string | null
          body_template: string
          channel_code: string | null
          created_at: string
          event_type_id: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          language_code: string | null
          subject_template: string | null
          template_name: string
          tenant_id: string | null
          updated_at: string
          variables_schema_json: Json | null
        }
        Insert: {
          body_format?: string | null
          body_template: string
          channel_code?: string | null
          created_at?: string
          event_type_id?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          language_code?: string | null
          subject_template?: string | null
          template_name: string
          tenant_id?: string | null
          updated_at?: string
          variables_schema_json?: Json | null
        }
        Update: {
          body_format?: string | null
          body_template?: string
          channel_code?: string | null
          created_at?: string
          event_type_id?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          language_code?: string | null
          subject_template?: string | null
          template_name?: string
          tenant_id?: string | null
          updated_at?: string
          variables_schema_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_templates_channel_code_fkey"
            columns: ["channel_code"]
            isOneToOne: false
            referencedRelation: "notification_channels"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "notification_templates_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "notification_event_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          code: string
          created_at: string
          description: string | null
          group_name: string | null
          id: string
          resource: string
        }
        Insert: {
          action: string
          code: string
          created_at?: string
          description?: string | null
          group_name?: string | null
          id?: string
          resource: string
        }
        Update: {
          action?: string
          code?: string
          created_at?: string
          description?: string | null
          group_name?: string | null
          id?: string
          resource?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          effect: Database["public"]["Enums"]["role_effect"]
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          effect?: Database["public"]["Enums"]["role_effect"]
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          effect?: Database["public"]["Enums"]["role_effect"]
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "v_membership_effective_permissions"
            referencedColumns: ["permission_id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "v_membership_effective_permissions"
            referencedColumns: ["role_id"]
          },
        ]
      }
      roles: {
        Row: {
          app_id: string | null
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_system: boolean
          name: string
          parent_role_id: string | null
          role_scope: string | null
          role_type: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          app_id?: string | null
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          name: string
          parent_role_id?: string | null
          role_scope?: string | null
          role_type: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          app_id?: string | null
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          name?: string
          parent_role_id?: string | null
          role_scope?: string | null
          role_type?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "app_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roles_parent_role_id_fkey"
            columns: ["parent_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roles_parent_role_id_fkey"
            columns: ["parent_role_id"]
            isOneToOne: false
            referencedRelation: "v_membership_effective_permissions"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      scopes: {
        Row: {
          created_at: string
          id: string
          name: string
          scope_ref_code: string | null
          scope_ref_id: string | null
          scope_type: Database["public"]["Enums"]["scope_type"]
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          scope_ref_code?: string | null
          scope_ref_id?: string | null
          scope_type: Database["public"]["Enums"]["scope_type"]
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          scope_ref_code?: string | null
          scope_ref_id?: string | null
          scope_type?: Database["public"]["Enums"]["scope_type"]
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scopes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_domains: {
        Row: {
          created_at: string
          domain_name: string
          domain_type: string | null
          id: string
          is_primary: boolean | null
          ssl_status: string | null
          tenant_id: string
          updated_at: string
          verification_status: string | null
        }
        Insert: {
          created_at?: string
          domain_name: string
          domain_type?: string | null
          id?: string
          is_primary?: boolean | null
          ssl_status?: string | null
          tenant_id: string
          updated_at?: string
          verification_status?: string | null
        }
        Update: {
          created_at?: string
          domain_name?: string
          domain_type?: string | null
          id?: string
          is_primary?: boolean | null
          ssl_status?: string | null
          tenant_id?: string
          updated_at?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_domains_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_settings: {
        Row: {
          setting_key: string
          setting_value_json: Json
          tenant_id: string
          updated_at: string
        }
        Insert: {
          setting_key: string
          setting_value_json?: Json
          tenant_id: string
          updated_at?: string
        }
        Update: {
          setting_key?: string
          setting_value_json?: Json
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          activated_at: string | null
          country_code: string | null
          created_at: string
          currency_code: string | null
          deleted_at: string | null
          id: string
          legal_name: string | null
          locale: string | null
          name: string
          onboarding_status: string | null
          owner_user_id: string | null
          parent_tenant_id: string | null
          status: Database["public"]["Enums"]["tenant_status"]
          subscription_plan: string | null
          suspended_at: string | null
          tenant_code: string
          tenant_type: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          country_code?: string | null
          created_at?: string
          currency_code?: string | null
          deleted_at?: string | null
          id?: string
          legal_name?: string | null
          locale?: string | null
          name: string
          onboarding_status?: string | null
          owner_user_id?: string | null
          parent_tenant_id?: string | null
          status?: Database["public"]["Enums"]["tenant_status"]
          subscription_plan?: string | null
          suspended_at?: string | null
          tenant_code: string
          tenant_type: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          country_code?: string | null
          created_at?: string
          currency_code?: string | null
          deleted_at?: string | null
          id?: string
          legal_name?: string | null
          locale?: string | null
          name?: string
          onboarding_status?: string | null
          owner_user_id?: string | null
          parent_tenant_id?: string | null
          status?: Database["public"]["Enums"]["tenant_status"]
          subscription_plan?: string | null
          suspended_at?: string | null
          tenant_code?: string
          tenant_type?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenants_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenants_parent_tenant_id_fkey"
            columns: ["parent_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credentials: {
        Row: {
          created_at: string
          credential_type: Database["public"]["Enums"]["credential_type"]
          failed_attempt_count: number | null
          id: string
          locked_until: string | null
          mfa_enabled: boolean | null
          mfa_secret_encrypted: string | null
          password_algo: string | null
          password_hash: string | null
          password_updated_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credential_type: Database["public"]["Enums"]["credential_type"]
          failed_attempt_count?: number | null
          id?: string
          locked_until?: string | null
          mfa_enabled?: boolean | null
          mfa_secret_encrypted?: string | null
          password_algo?: string | null
          password_hash?: string | null
          password_updated_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credential_type?: Database["public"]["Enums"]["credential_type"]
          failed_attempt_count?: number | null
          id?: string
          locked_until?: string | null
          mfa_enabled?: boolean | null
          mfa_secret_encrypted?: string | null
          password_algo?: string | null
          password_hash?: string | null
          password_updated_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_credentials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          accepted_by_user_id: string | null
          created_at: string
          department_id: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          invited_role_id: string | null
          status: string | null
          tenant_id: string
          token_hash: string
        }
        Insert: {
          accepted_by_user_id?: string | null
          created_at?: string
          department_id?: string | null
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          invited_role_id?: string | null
          status?: string | null
          tenant_id: string
          token_hash: string
        }
        Update: {
          accepted_by_user_id?: string | null
          created_at?: string
          department_id?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          invited_role_id?: string | null
          status?: string | null
          tenant_id?: string
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_invited_role"
            columns: ["invited_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_invited_role"
            columns: ["invited_role_id"]
            isOneToOne: false
            referencedRelation: "v_membership_effective_permissions"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "user_invitations_accepted_by_user_id_fkey"
            columns: ["accepted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invitations_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invitations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          access_token_jti: string | null
          browser: string | null
          created_at: string
          device_name: string | null
          device_type: string | null
          expires_at: string
          id: string
          ip_address: unknown
          is_revoked: boolean | null
          last_activity_at: string | null
          location_hint: string | null
          os: string | null
          refresh_token_hash: string | null
          revoke_reason: string | null
          user_id: string
        }
        Insert: {
          access_token_jti?: string | null
          browser?: string | null
          created_at?: string
          device_name?: string | null
          device_type?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown
          is_revoked?: boolean | null
          last_activity_at?: string | null
          location_hint?: string | null
          os?: string | null
          refresh_token_hash?: string | null
          revoke_reason?: string | null
          user_id: string
        }
        Update: {
          access_token_jti?: string | null
          browser?: string | null
          created_at?: string
          device_name?: string | null
          device_type?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown
          is_revoked?: boolean | null
          last_activity_at?: string | null
          location_hint?: string | null
          os?: string | null
          refresh_token_hash?: string | null
          revoke_reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          display_name: string | null
          email: string
          first_name: string | null
          global_user_code: string | null
          id: string
          is_email_verified: boolean | null
          is_phone_verified: boolean | null
          last_login_at: string | null
          last_name: string | null
          phone: string | null
          preferred_language: string | null
          status: Database["public"]["Enums"]["user_status"]
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          display_name?: string | null
          email: string
          first_name?: string | null
          global_user_code?: string | null
          id: string
          is_email_verified?: boolean | null
          is_phone_verified?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          phone?: string | null
          preferred_language?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          display_name?: string | null
          email?: string
          first_name?: string | null
          global_user_code?: string | null
          id?: string
          is_email_verified?: boolean | null
          is_phone_verified?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          phone?: string | null
          preferred_language?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      webhook_delivery_logs: {
        Row: {
          attempt_no: number | null
          delivered_at: string | null
          event_id: string
          http_status: number | null
          id: string
          next_retry_at: string | null
          request_body: Json | null
          response_body: string | null
          status: string | null
          webhook_endpoint_id: string
        }
        Insert: {
          attempt_no?: number | null
          delivered_at?: string | null
          event_id: string
          http_status?: number | null
          id?: string
          next_retry_at?: string | null
          request_body?: Json | null
          response_body?: string | null
          status?: string | null
          webhook_endpoint_id: string
        }
        Update: {
          attempt_no?: number | null
          delivered_at?: string | null
          event_id?: string
          http_status?: number | null
          id?: string
          next_retry_at?: string | null
          request_body?: Json | null
          response_body?: string | null
          status?: string | null
          webhook_endpoint_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_delivery_logs_webhook_endpoint_id_fkey"
            columns: ["webhook_endpoint_id"]
            isOneToOne: false
            referencedRelation: "webhook_endpoints"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_endpoints: {
        Row: {
          callback_url: string
          consumer_id: string | null
          created_at: string
          event_type: string
          id: string
          is_active: boolean | null
          retry_policy: Json | null
          signing_secret_hash: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          callback_url: string
          consumer_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          is_active?: boolean | null
          retry_policy?: Json | null
          signing_secret_hash?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          callback_url?: string
          consumer_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          is_active?: boolean | null
          retry_policy?: Json | null
          signing_secret_hash?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_endpoints_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "api_consumers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_endpoints_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      work_order_tasks: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          id: string
          is_completed: boolean | null
          task_name: string
          work_order_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          id?: string
          is_completed?: boolean | null
          task_name: string
          work_order_id: string
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          id?: string
          is_completed?: boolean | null
          task_name?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_tasks_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_tasks_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_orders: {
        Row: {
          asset_id: string | null
          assigned_to: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          reported_by: string | null
          resolved_at: string | null
          status: string | null
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          asset_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          reported_by?: string | null
          resolved_at?: string | null
          status?: string | null
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          asset_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          reported_by?: string | null
          resolved_at?: string | null
          status?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_membership_effective_permissions: {
        Row: {
          effect: Database["public"]["Enums"]["role_effect"] | null
          expires_at: string | null
          membership_id: string | null
          membership_role_id: string | null
          permission_code: string | null
          permission_id: string | null
          role_code: string | null
          role_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_roles_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      v_membership_role_scope_permissions: {
        Row: {
          membership_id: string | null
          permission_code: string | null
          role_code: string | null
          scope_ref_code: string | null
          scope_ref_id: string | null
          scope_type: Database["public"]["Enums"]["scope_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_roles_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      is_tenant_member: { Args: { check_tenant_id: string }; Returns: boolean }
    }
    Enums: {
      credential_type: "password" | "totp" | "recovery_code" | "oauth_link"
      identity_type:
        | "email"
        | "phone"
        | "username"
        | "google"
        | "microsoft"
        | "line"
        | "citizen_id_stub"
        | "employee_code"
      membership_status:
        | "invited"
        | "active"
        | "suspended"
        | "removed"
        | "archived"
      role_effect: "allow" | "deny"
      scope_type:
        | "platform"
        | "tenant"
        | "app"
        | "department"
        | "location"
        | "resource"
      tenant_status: "active" | "suspended" | "archived"
      user_status:
        | "invited"
        | "active"
        | "suspended"
        | "locked"
        | "archived"
        | "deleted"
      visibility_type: "public" | "authenticated" | "permission_based"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          deleted_at: string | null
          format: string
          id: string
          name: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      buckets_vectors: {
        Row: {
          created_at: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      iceberg_namespaces: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          metadata: Json
          name: string
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          metadata?: Json
          name: string
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_namespaces_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      iceberg_tables: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          location: string
          name: string
          namespace_id: string
          remote_table_id: string | null
          shard_id: string | null
          shard_key: string | null
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          location: string
          name: string
          namespace_id: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          namespace_id?: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_tables_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iceberg_tables_namespace_id_fkey"
            columns: ["namespace_id"]
            isOneToOne: false
            referencedRelation: "iceberg_namespaces"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_indexes: {
        Row: {
          bucket_id: string
          created_at: string
          data_type: string
          dimension: number
          distance_metric: string
          id: string
          metadata_configuration: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          data_type: string
          dimension: number
          distance_metric: string
          id?: string
          metadata_configuration?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          data_type?: string
          dimension?: number
          distance_metric?: string
          id?: string
          metadata_configuration?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_indexes_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_vectors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_common_prefix: {
        Args: { p_delimiter: string; p_key: string; p_prefix: string }
        Returns: string
      }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          _bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: { Args: never; Returns: string }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_by_timestamp: {
        Args: {
          p_bucket_id: string
          p_level: number
          p_limit: number
          p_prefix: string
          p_sort_column: string
          p_sort_column_after: string
          p_sort_order: string
          p_start_after: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS" | "VECTOR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      credential_type: ["password", "totp", "recovery_code", "oauth_link"],
      identity_type: [
        "email",
        "phone",
        "username",
        "google",
        "microsoft",
        "line",
        "citizen_id_stub",
        "employee_code",
      ],
      membership_status: [
        "invited",
        "active",
        "suspended",
        "removed",
        "archived",
      ],
      role_effect: ["allow", "deny"],
      scope_type: [
        "platform",
        "tenant",
        "app",
        "department",
        "location",
        "resource",
      ],
      tenant_status: ["active", "suspended", "archived"],
      user_status: [
        "invited",
        "active",
        "suspended",
        "locked",
        "archived",
        "deleted",
      ],
      visibility_type: ["public", "authenticated", "permission_based"],
    },
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS", "VECTOR"],
    },
  },
} as const


export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attachments: {
        Row: {
          id: string
          name: string
          size: number | null
          startup_id: string | null
          type: string
          uploaded_at: string
          url: string
        }
        Insert: {
          id?: string
          name: string
          size?: number | null
          startup_id?: string | null
          type: string
          uploaded_at?: string
          url: string
        }
        Update: {
          id?: string
          name?: string
          size?: number | null
          startup_id?: string | null
          type?: string
          uploaded_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          name: string
          status: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      labels: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      startup_fields: {
        Row: {
          created_at: string
          field_name: string
          field_type: string
          field_value: Json | null
          id: string
          startup_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          field_name: string
          field_type: string
          field_value?: Json | null
          id?: string
          startup_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          field_name?: string
          field_type?: string
          field_value?: Json | null
          id?: string
          startup_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "startup_fields_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      startups: {
        Row: {
          accumulated_revenue_current_year: number | null
          assigned_to: string | null
          attention_points: string | null
          business_model: string | null
          category: string | null
          ceo_email: string | null
          ceo_linkedin: string | null
          ceo_name: string | null
          ceo_whatsapp: string | null
          city: string | null
          client_count: number | null
          competitors: string | null
          created_at: string
          description: string | null
          differentials: string | null
          due_date: string | null
          founding_date: string | null
          google_drive_link: string | null
          id: string
          market: string | null
          mrr: number | null
          name: string
          no_investment_reason: string | null
          observations: string | null
          origin_lead: string | null
          partner_count: number | null
          positive_points: string | null
          priority: string | null
          problem_solution: string | null
          problem_solved: string | null
          referred_by: string | null
          sam: number | null
          scangels_value_add: string | null
          sector: string | null
          som: number | null
          state: string | null
          status_id: string | null
          tam: number | null
          time_tracking: number | null
          total_revenue_last_year: number | null
          total_revenue_previous_year: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          accumulated_revenue_current_year?: number | null
          assigned_to?: string | null
          attention_points?: string | null
          business_model?: string | null
          category?: string | null
          ceo_email?: string | null
          ceo_linkedin?: string | null
          ceo_name?: string | null
          ceo_whatsapp?: string | null
          city?: string | null
          client_count?: number | null
          competitors?: string | null
          created_at?: string
          description?: string | null
          differentials?: string | null
          due_date?: string | null
          founding_date?: string | null
          google_drive_link?: string | null
          id?: string
          market?: string | null
          mrr?: number | null
          name: string
          no_investment_reason?: string | null
          observations?: string | null
          origin_lead?: string | null
          partner_count?: number | null
          positive_points?: string | null
          priority?: string | null
          problem_solution?: string | null
          problem_solved?: string | null
          referred_by?: string | null
          sam?: number | null
          scangels_value_add?: string | null
          sector?: string | null
          som?: number | null
          state?: string | null
          status_id?: string | null
          tam?: number | null
          time_tracking?: number | null
          total_revenue_last_year?: number | null
          total_revenue_previous_year?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          accumulated_revenue_current_year?: number | null
          assigned_to?: string | null
          attention_points?: string | null
          business_model?: string | null
          category?: string | null
          ceo_email?: string | null
          ceo_linkedin?: string | null
          ceo_name?: string | null
          ceo_whatsapp?: string | null
          city?: string | null
          client_count?: number | null
          competitors?: string | null
          created_at?: string
          description?: string | null
          differentials?: string | null
          due_date?: string | null
          founding_date?: string | null
          google_drive_link?: string | null
          id?: string
          market?: string | null
          mrr?: number | null
          name?: string
          no_investment_reason?: string | null
          observations?: string | null
          origin_lead?: string | null
          partner_count?: number | null
          positive_points?: string | null
          priority?: string | null
          problem_solution?: string | null
          problem_solved?: string | null
          referred_by?: string | null
          sam?: number | null
          scangels_value_add?: string | null
          sector?: string | null
          som?: number | null
          state?: string | null
          status_id?: string | null
          tam?: number | null
          time_tracking?: number | null
          total_revenue_last_year?: number | null
          total_revenue_previous_year?: number | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "startups_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "startups_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      startups_labels: {
        Row: {
          label_id: string
          startup_id: string
        }
        Insert: {
          label_id: string
          startup_id: string
        }
        Update: {
          label_id?: string
          startup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "startups_labels_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "startups_labels_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      statuses: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          position: number | null
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          name: string
          position?: number | null
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          position?: number | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          assigned_startups: number | null
          avatar: string | null
          created_at: string | null
          email: string
          id: string
          initials: string | null
          name: string
          permissions: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          assigned_startups?: number | null
          avatar?: string | null
          created_at?: string | null
          email: string
          id?: string
          initials?: string | null
          name: string
          permissions?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          assigned_startups?: number | null
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: string
          initials?: string | null
          name?: string
          permissions?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email: string
          id: string
          name: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      send_email: {
        Args: {
          to_email: string
          subject: string
          body: string
        }
        Returns: string
      }
    }
    Enums: {
      user_role: "admin" | "investor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

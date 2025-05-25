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
      activity_log: {,
        Row: {
          agreement_id: string | null
          created_at: string
          description: string | null
          id: string
          invitation_id: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          agreement_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          invitation_id?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          agreement_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          invitation_id?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      agreement_drafts: {
        Row: {
          created_at: string
          form_data: Json
          form_key: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          form_data: Json
          form_key: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          form_data?: Json
          form_key?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      executed_agreements: {
        Row: {
          created_at: string
          document_data: Json
          document_type: string
          id: string
          signed_at: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_data: Json
          document_type: string
          id?: string
          signed_at?: string | null
          status: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_data?: Json
          document_type?: string
          id?: string
          signed_at?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          expires_at: string
          id: string
          status: string
          token: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          expires_at: string
          id?: string
          status?: string
          token: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          expires_at?: string
          id?: string
          status?: string
          token?: string
        }
        Relationships: []
      }
      agreement_comments: {
        Row: {
          id: string;
          agreement_id: string;
          user_id: string;
          username: string;
          avatar_url?: string | null;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          agreement_id: string;
          user_id: string;
          username: string;
          avatar_url?: string | null;
          text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          agreement_id?: string;
          user_id?: string;
          username?: string;
          avatar_url?: string | null;
          text?: string;
          created_at?: string;
        };
        Relationships: [];
      },
      personal_guarantees: {
        Row: {
          agreement_id: string | null
          created_at: string | null
          guarantor_address: string
          guarantor_city: string
          guarantor_name: string
          guarantor_state: string
          guarantor_zip: string
          id: string
          updated_at: string | null
        }
        Insert: {
          agreement_id?: string | null
          created_at?: string | null
          guarantor_address: string
          guarantor_city: string
          guarantor_name: string
          guarantor_state: string
          guarantor_zip: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          agreement_id?: string | null
          created_at?: string | null
          guarantor_address?: string
          guarantor_city?: string
          guarantor_name?: string
          guarantor_state?: string
          guarantor_zip?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_guarantees_agreement_id_fkey"
            columns: ["agreement_id"]
            isOneToOne: false
            referencedRelation: "executed_agreements"
            referencedColumns: ["id"]
          },
        ]
      }
      physical_agreements: {
        Row: {
          created_at: string | null
          file_path: string
          id: string
          signed_date: string
          status: Database["public"]["Enums"]["agreement_status"] | null
          title: string
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_path: string
          id?: string
          signed_date: string
          status?: Database["public"]["Enums"]["agreement_status"] | null
          title: string
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_path?: string
          id?: string
          signed_date?: string
          status?: Database["public"]["Enums"]["agreement_status"] | null
          title?: string
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sub_agents: {
        Row: {
          agent_address: string
          agent_city: string
          agent_name: string
          agent_ssn: string
          agent_state: string
          agent_zip: string
          agreement_id: string | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          agent_address: string
          agent_city: string
          agent_name: string
          agent_ssn: string
          agent_state: string
          agent_zip: string
          agreement_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          agent_address?: string
          agent_city?: string
          agent_name?: string
          agent_ssn?: string
          agent_state?: string
          agent_zip?: string
          agreement_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_agents_agreement_id_fkey"
            columns: ["agreement_id"]
            isOneToOne: false
            referencedRelation: "executed_agreements"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_offices: {
        Row: {
          agreement_id: string | null
          created_at: string | null
          id: string
          office_address: string
          office_city: string
          office_name: string
          office_phone: string | null
          office_state: string
          office_zip: string
          updated_at: string | null
        }
        Insert: {
          agreement_id?: string | null
          created_at?: string | null
          id?: string
          office_address: string
          office_city: string
          office_name: string
          office_phone?: string | null
          office_state: string
          office_zip: string
          updated_at?: string | null
        }
        Update: {
          agreement_id?: string | null
          created_at?: string | null
          id?: string
          office_address?: string
          office_city?: string
          office_name?: string
          office_phone?: string | null
          office_state?: string
          office_zip?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_offices_agreement_id_fkey"
            columns: ["agreement_id"]
            isOneToOne: false
            referencedRelation: "executed_agreements"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      agreement_status: "draft" | "executed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agreement_status: ["draft", "executed"],
    },
  },
} as const

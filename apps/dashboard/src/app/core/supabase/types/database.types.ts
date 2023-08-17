export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      accounts: {
        Row: {
          balance: number
          bank_specific_type: string | null
          color: string | null
          created_at: string
          created_by: string
          currency_code: number
          id: string
          metadata: Json | null
          name: string
          provider: string
          type: string
          updated_at: string
        }
        Insert: {
          balance?: number
          bank_specific_type?: string | null
          color?: string | null
          created_at?: string
          created_by: string
          currency_code: number
          id?: string
          metadata?: Json | null
          name: string
          provider: string
          type: string
          updated_at?: string
        }
        Update: {
          balance?: number
          bank_specific_type?: string | null
          color?: string | null
          created_at?: string
          created_by?: string
          currency_code?: number
          id?: string
          metadata?: Json | null
          name?: string
          provider?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      budgets: {
        Row: {
          amount: number
          color: string | null
          created_at: string
          created_by: string
          currency_code: number
          from_date: string | null
          id: string
          name: string
          period: string
          to_date: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          color?: string | null
          created_at?: string
          created_by: string
          currency_code: number
          from_date?: string | null
          id?: string
          name?: string
          period: string
          to_date?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          color?: string | null
          created_at?: string
          created_by?: string
          currency_code?: number
          from_date?: string | null
          id?: string
          name?: string
          period?: string
          to_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          created_by: string
          icon: string | null
          id: string
          mcc_range_end: number | null
          mcc_range_start: number | null
          name: string
          parent_category: string | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by: string
          icon?: string | null
          id?: string
          mcc_range_end?: number | null
          mcc_range_start?: number | null
          name: string
          parent_category?: string | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string
          icon?: string | null
          id?: string
          mcc_range_end?: number | null
          mcc_range_start?: number | null
          name?: string
          parent_category?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_parent_category_fkey"
            columns: ["parent_category"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      records: {
        Row: {
          account: string
          amount: number
          balance: number
          category: string
          comment: string | null
          created_at: string
          created_by: string
          creation_type: string
          currency_code: number
          description: string | null
          id: string
          mcc: number | null
          metadata: Json | null
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          account: string
          amount: number
          balance?: number
          category: string
          comment?: string | null
          created_at?: string
          created_by: string
          creation_type?: string
          currency_code: number
          description?: string | null
          id?: string
          mcc?: number | null
          metadata?: Json | null
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          account?: string
          amount?: number
          balance?: number
          category?: string
          comment?: string | null
          created_at?: string
          created_by?: string
          creation_type?: string
          currency_code?: number
          description?: string | null
          id?: string
          mcc?: number | null
          metadata?: Json | null
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "records_account_fkey"
            columns: ["account"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_category_fkey"
            columns: ["category"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      settings: {
        Row: {
          billing_period_start_day_number: number
          created_at: string | null
          created_by: string
          default_currency_code: number
          id: string
          updated_at: string
        }
        Insert: {
          billing_period_start_day_number?: number
          created_at?: string | null
          created_by: string
          default_currency_code: number
          id?: string
          updated_at?: string
        }
        Update: {
          billing_period_start_day_number?: number
          created_at?: string | null
          created_by?: string
          default_currency_code?: number
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "settings_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
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
          public: boolean | null
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
          public?: boolean | null
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
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
          path_tokens: string[] | null
          updated_at: string | null
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
          path_tokens?: string[] | null
          updated_at?: string | null
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
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

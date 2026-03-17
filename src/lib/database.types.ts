export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      lores: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          category: string | null
          cover_image_url: string
          hero_image_url: string
          color: string
          page_count: number
          contributor_count: number
          is_public: boolean
          tags: string[]
          views: number
          trending: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string
          category?: string
          cover_image_url?: string
          hero_image_url?: string
          color?: string
          page_count?: number
          contributor_count?: number
          is_public?: boolean
          tags?: string[]
          views?: number
          trending?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          category?: string
          cover_image_url?: string
          hero_image_url?: string
          color?: string
          page_count?: number
          contributor_count?: number
          is_public?: boolean
          tags?: string[]
          views?: number
          trending?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          id: string
          lore_id: string
          slug: string
          title: string
          category: string | null
          content: string
          excerpt: string
          image_url: string | null
          tags: string[]
          completeness: number
          missing_fields: string[]
          views: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lore_id: string
          slug: string
          title: string
          category?: string
          content: string
          excerpt?: string
          image_url?: string | null
          tags?: string[]
          completeness?: number
          missing_fields?: string[]
          views?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lore_id?: string
          slug?: string
          title?: string
          category?: string
          content?: string
          excerpt?: string
          image_url?: string | null
          tags?: string[]
          completeness?: number
          missing_fields?: string[]
          views?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_lore_id_fkey"
            columns: ["lore_id"]
            isOneToOne: false
            referencedRelation: "lores"
            referencedColumns: ["id"]
          }
        ]
      }
      relationships: {
        Row: {
          source_page_id: string
          target_page_id: string
          type: string
          label: string | null
        }
        Insert: {
          source_page_id: string
          target_page_id: string
          type: string
          label?: string | null
        }
        Update: {
          source_page_id?: string
          target_page_id?: string
          type?: string
          label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relationships_source_page_id_fkey"
            columns: ["source_page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relationships_target_page_id_fkey"
            columns: ["target_page_id"]
            isOneToOne: false
            referencedRelation: "pages"
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
}

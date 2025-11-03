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
      profiles: {
        Row: {
          id: string
          created_at: string
          full_name: string | null
          email: string | null
          phone: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
        }
      }
      payments: {
        Row: {
          id: string // payment id do Mercado Pago (string para acomodar números grandes)
          external_reference: string | null
          status: string
          date_approved: string | null
          payer_email: string | null
          raw: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          external_reference?: string | null
          status: string
          date_approved?: string | null
          payer_email?: string | null
          raw?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          external_reference?: string | null
          status?: string
          date_approved?: string | null
          payer_email?: string | null
          raw?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
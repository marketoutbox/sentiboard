export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      stock_baskets: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
          updated_at: string
          source_weights: Json
          is_locked: boolean
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
          updated_at?: string
          source_weights?: Json
          is_locked?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
          updated_at?: string
          source_weights?: Json
          is_locked?: boolean
        }
      }
      basket_stocks: {
        Row: {
          id: string
          basket_id: string
          symbol: string
          name: string
          sector: string
          allocation: number
          is_locked: boolean
        }
        Insert: {
          id?: string
          basket_id: string
          symbol: string
          name: string
          sector: string
          allocation: number
          is_locked?: boolean
        }
        Update: {
          id?: string
          basket_id?: string
          symbol?: string
          name?: string
          sector?: string
          allocation?: number
          is_locked?: boolean
        }
      }
    }
  }
}

"use client"

import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

// Define the type for our Supabase client
let supabaseInstance: SupabaseClient | null = null

export function getSupabase() {
  // Only create the client in the browser
  if (typeof window !== "undefined") {
    // Initialize the client only once
    if (!supabaseInstance) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Supabase URL and Anon Key are required")
        throw new Error("Supabase URL and Anon Key are required")
      }

      // Create the Supabase client
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    }
    return supabaseInstance
  }

  // Return a mock client for SSR
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  } as unknown as SupabaseClient
}

// For backward compatibility
export const supabase = typeof window !== "undefined" ? getSupabase() : null

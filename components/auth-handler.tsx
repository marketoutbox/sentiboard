"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabase } from "@/utils/supabaseClient"

export function AuthHandler() {
  const [message, setMessage] = useState<string>("Processing authentication...")
  const router = useRouter()

  useEffect(() => {
    const handleHashChange = async () => {
      try {
        const supabase = getSupabase()

        // Check if we have a hash in the URL
        if (window.location.hash) {
          setMessage("Authenticating...")

          // Extract the access token from the URL
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get("access_token")
          const refreshToken = hashParams.get("refresh_token")
          const type = hashParams.get("type")

          if (accessToken && refreshToken) {
            // Set the session using the tokens
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })

            if (error) {
              console.error("Error setting session:", error)
              setMessage("Authentication failed. Please try again.")
              return
            }

            // Clear the hash from the URL
            window.history.replaceState(null, "", window.location.pathname)

            // Show success message
            setMessage("Authentication successful! Redirecting...")

            // Redirect to home page after a short delay
            setTimeout(() => {
              router.push("/")
            }, 1500)
          }
        }
      } catch (error) {
        console.error("Auth handler error:", error)
        setMessage("An error occurred during authentication.")
      }
    }

    handleHashChange()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50">
      <div className="w-full max-w-md rounded-lg bg-slate-900 p-8 shadow-lg border border-slate-800">
        <h1 className="mb-6 text-2xl font-bold text-center">{message}</h1>
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-amber-500"></div>
        </div>
      </div>
    </div>
  )
}

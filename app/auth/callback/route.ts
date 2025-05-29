import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

// This route is used for handling the OAuth callback
export async function GET(req: NextRequest) {
  try {
    const requestUrl = new URL(req.url)
    const code = requestUrl.searchParams.get("code")
    const next = requestUrl.searchParams.get("next") || "/"

    console.log("Auth callback received with code:", code ? "present" : "missing")

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Auth callback error:", error)
        // Redirect to login page with error
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin))
      }

      console.log("Auth callback successful, redirecting to:", next)
    } else {
      console.warn("No code found in callback URL")
    }

    // Redirect to the home page or the next page if specified
    return NextResponse.redirect(new URL(next, requestUrl.origin))
  } catch (error) {
    console.error("Unexpected auth callback error:", error)
    // Redirect to login page with generic error
    return NextResponse.redirect(new URL("/login?error=Authentication%20failed", req.url))
  }
}

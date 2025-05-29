"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabase } from "@/utils/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Github, Mail } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for error in URL params
    const errorParam = searchParams?.get("error")
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }

    // Check if we're already logged in
    const checkSession = async () => {
      const supabase = getSupabase()
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push("/")
      }
    }

    checkSession()
  }, [router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = getSupabase()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
      } else {
        router.push("/")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const supabase = getSupabase()

      // Get the origin for the redirect URL
      const origin = process.env.NEXT_PUBLIC_URL || window.location.origin
      const redirectTo = `${origin}/auth/callback`

      console.log("Signing in with Google, redirect to:", redirectTo)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            prompt: "select_account", // Forces Google to show the account selector
          },
        },
      })

      if (error) {
        console.error("Google sign in error:", error)
        setError(error.message)
        setIsLoading(false)
      }
      // Don't set isLoading to false here as we're redirecting away
    } catch (err: any) {
      console.error("Google sign in error:", err)
      setError(err.message || "Error signing in with Google")
      setIsLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    try {
      setIsLoading(true)
      const supabase = getSupabase()

      // Get the origin for the redirect URL
      const origin = process.env.NEXT_PUBLIC_URL || window.location.origin
      const redirectTo = `${origin}/auth/callback`

      console.log("Signing in with GitHub, redirect to:", redirectTo)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo },
      })

      if (error) {
        console.error("GitHub sign in error:", error)
        setError(error.message)
        setIsLoading(false)
      }
      // Don't set isLoading to false here as we're redirecting away
    } catch (err: any) {
      console.error("GitHub sign in error:", err)
      setError(err.message || "Error signing in with GitHub")
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white"
              onClick={handleGithubSignIn}
              disabled={isLoading}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-400">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-200">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-slate-200">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-amber-500 hover:text-amber-400">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-slate-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-amber-500 hover:text-amber-400">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

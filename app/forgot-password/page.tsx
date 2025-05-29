"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    if (!email) {
      setMessage("Please enter your email address.")
      setLoading(false)
      return
    }

    try {
      const { error } = await resetPasswordForEmail(email)

      if (error) {
        setMessage(error.message)
      } else {
        setMessage("Check your email for password reset instructions.")
        setEmail("") // Clear the email input after successful submission
      }
    } catch (error: any) {
      setMessage(error.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const resetPasswordForEmail = async (email: string) => {
    const redirectUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/reset-password`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })
    return { error }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        {message && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

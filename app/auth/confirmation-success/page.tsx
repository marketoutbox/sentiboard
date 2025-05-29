"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ConfirmationSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      router.push("/")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Email Confirmed!</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Your email has been successfully confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-slate-300">
          <p>You will be redirected to the homepage in a few seconds.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/")} className="bg-amber-500 hover:bg-amber-600 text-white">
            Go to Homepage
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { ToastProvider } from "@/components/toast-provider"
import { ThemeProvider } from "@/context/theme-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sentiment Dashboard",
  description: "Track market sentiment across multiple data sources",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

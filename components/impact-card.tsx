"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export function ImpactCard({
  title,
  description,
  value,
  comparison,
  icon,
}: {
  title: string
  description: string
  value: string
  comparison: string
  icon: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-slate-700 h-full">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="rounded-full bg-amber-500/20 p-3 mb-4">
            <div className="text-amber-500">{icon}</div>
          </div>
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-sm text-slate-400 mb-4">{description}</p>
          <div className="text-3xl font-bold text-amber-500 mb-1">{value}</div>
          <p className="text-sm text-slate-400">{comparison}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}


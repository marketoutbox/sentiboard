"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoIcon as InfoCircle } from "lucide-react"

export function CorrelationChart({ stocks, weights }) {
  // State for the selected basket
  const [selectedBasket, setSelectedBasket] = useState("all")

  // Generate correlation data for sources
  const sourceCorrelationData = [
    {
      name: "Google Trends",
      correlation: 0.92,
      impact: "Strong Positive",
      color: "#10b981", // emerald-500
    },
    {
      name: "Twitter",
      correlation: 0.65,
      impact: "Moderate Positive",
      color: "#f59e0b", // amber-500
    },
    {
      name: "Composite",
      correlation: 0.58,
      impact: "Moderate Positive",
      color: "#3b82f6", // blue-500
    },
    {
      name: "News",
      correlation: 0.15,
      impact: "Poor Correlation",
      color: "#ef4444", // red-500
    },
  ]

  // Define the correlation scale
  const correlationScale = [
    { label: "Poor", range: "0.0-0.29", color: "#ef4444" },
    { label: "Weak", range: "0.3-0.49", color: "#f59e0b" },
    { label: "Moderate", range: "0.5-0.79", color: "#eab308" },
    { label: "Strong", range: "0.8-1.0", color: "#10b981" },
  ]

  // Helper function to get the width percentage based on correlation value
  const getWidthPercentage = (value) => {
    return `${Math.min(value * 100, 100)}%`
  }

  // Helper function to get the color based on correlation value
  const getCorrelationColor = (value) => {
    if (value >= 0.8) return "#10b981" // Strong - emerald
    if (value >= 0.5) return "#f59e0b" // Moderate - amber
    if (value >= 0.3) return "#eab308" // Weak - yellow
    return "#ef4444" // Poor - red
  }

  // Helper function to get the text description based on correlation value
  const getCorrelationText = (value) => {
    if (value >= 0.8) return "Strong Positive"
    if (value >= 0.5) return "Moderate Positive"
    if (value >= 0.3) return "Weak Positive"
    return "Poor Correlation"
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 space-y-2 sm:space-y-0">
        <div className="max-w-[70%] sm:max-w-[60%]">
          <CardTitle className="text-2xl font-bold">Sentiment-Price Correlation</CardTitle>
          <CardDescription className="mt-1 text-slate-400">
            This table shows the relationship between the source of information and historical price
          </CardDescription>
        </div>
        <Select value={selectedBasket} onValueChange={setSelectedBasket}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Basket" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Basket (All Stocks)</SelectItem>
            <SelectItem value="tech">Tech Stocks</SelectItem>
            <SelectItem value="finance">Finance Stocks</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Header row */}
          <div className="grid grid-cols-2 gap-4 py-2 text-sm font-medium text-slate-400">
            <div>Source</div>
            <div className="flex items-center justify-end">
              Correlation Impact
              <InfoCircle className="ml-1 h-4 w-4" />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-800"></div>

          {/* Source rows */}
          {sourceCorrelationData.map((source, index) => (
            <div key={index} className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-lg font-medium">{source.name}</div>
                <div className="flex items-center justify-end text-lg font-medium" style={{ color: source.color }}>
                  {source.correlation.toFixed(2)} - {source.impact}
                </div>
              </div>

              {/* Progress bar background */}
              <div className="h-4 w-full rounded-full bg-slate-800/50">
                {/* Progress bar fill */}
                <div
                  className="h-full rounded-full"
                  style={{
                    width: getWidthPercentage(source.correlation),
                    backgroundColor: source.color,
                  }}
                ></div>
              </div>

              {/* Scale labels */}
              <div className="grid grid-cols-5 text-xs text-slate-400">
                <div>Poor (0.0)</div>
                <div className="text-center">Weak (0.3)</div>
                <div className="text-center">Moderate (0.5)</div>
                <div className="text-center">Strong (0.8)</div>
                <div className="text-right">Perfect (1.0)</div>
              </div>
            </div>
          ))}

          {/* Divider */}
          <div className="h-px bg-slate-800"></div>

          {/* Correlation Impact Scale */}
          <div className="space-y-2">
            <div className="text-lg font-medium">Correlation Impact Scale</div>

            {/* Scale bar */}
            <div className="flex h-6 w-full rounded-full overflow-hidden">
              {correlationScale.map((segment, index) => (
                <div
                  key={index}
                  className="h-full"
                  style={{
                    backgroundColor: segment.color,
                    width: "25%", // Equal width for each segment
                  }}
                ></div>
              ))}
            </div>

            {/* Scale labels */}
            <div className="grid grid-cols-4 text-sm">
              {correlationScale.map((segment, index) => (
                <div key={index} className={index === 0 ? "" : index === 3 ? "text-right" : "text-center"}>
                  <div className="font-medium" style={{ color: segment.color }}>
                    {segment.label}
                  </div>
                  <div className="text-xs text-slate-400">{segment.range}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

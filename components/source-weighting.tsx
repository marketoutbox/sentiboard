"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Activity } from "lucide-react"

interface SourceWeightingProps {
  initialWeights: {
    twitter: number
    googleTrends: number
    news: number
  }
  onWeightsChange: (weights: { twitter: number; googleTrends: number; news: number }) => void
}

export function SourceWeighting({ initialWeights, onWeightsChange }: SourceWeightingProps) {
  const [weights, setWeights] = useState({
    twitter: initialWeights.twitter,
    googleTrends: initialWeights.googleTrends,
    news: initialWeights.news,
  })

  // Function to handle weight changes while maintaining sum = 1
  const handleWeightChange = (source: keyof typeof weights, newValue: number) => {
    // Ensure newValue is between 0 and 1
    newValue = Math.max(0, Math.min(1, newValue))

    // Calculate how much we need to adjust other weights
    const currentTotal = Object.values(weights).reduce((sum, val) => sum + val, 0)
    const currentSourceValue = weights[source]
    const delta = newValue - currentSourceValue

    // If no change or minimal change, exit early
    if (Math.abs(delta) < 0.001) return

    // Create a new weights object
    const updatedWeights = { ...weights, [source]: newValue }

    // Get other sources to adjust
    const otherSources = Object.keys(weights).filter((key) => key !== source) as Array<keyof typeof weights>

    // Calculate the sum of other weights
    const otherWeightsSum = otherSources.reduce((sum, key) => sum + weights[key], 0)

    // If other weights sum to zero or very small, distribute evenly
    if (otherWeightsSum <= 0.001) {
      const remainingValue = Math.max(0, 1 - newValue)
      const evenShare = remainingValue / otherSources.length

      otherSources.forEach((key) => {
        updatedWeights[key] = evenShare
      })
    } else {
      // Otherwise, adjust proportionally
      const adjustmentFactor = (otherWeightsSum - delta) / otherWeightsSum

      otherSources.forEach((key) => {
        // Calculate new value while preserving proportions
        updatedWeights[key] = Math.max(0, weights[key] * adjustmentFactor)
      })
    }

    // Normalize to ensure sum is exactly 1
    const newTotal = Object.values(updatedWeights).reduce((sum, val) => sum + val, 0)
    if (newTotal > 0) {
      const normalizationFactor = 1 / newTotal
      Object.keys(updatedWeights).forEach((key) => {
        updatedWeights[key as keyof typeof weights] *= normalizationFactor
      })
    }

    setWeights(updatedWeights)
    onWeightsChange(updatedWeights)
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-50">
          <Activity className="h-5 w-5 text-primary" />
          Source Weighting
        </CardTitle>
        <CardDescription className="text-slate-400">
          Adjust the influence of each data source on the composite sentiment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Twitter Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-slate-300 font-medium">Twitter</label>
              <span className="text-sm font-medium bg-slate-800 text-slate-50 px-2 py-0.5 rounded">
                {(weights.twitter * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[weights.twitter]}
              max={1}
              step={0.01}
              onValueChange={(value) => handleWeightChange("twitter", value[0])}
              className="py-1"
            />
          </div>

          {/* Google Trends Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-slate-300 font-medium">Google Trends</label>
              <span className="text-sm font-medium bg-slate-800 text-slate-50 px-2 py-0.5 rounded">
                {(weights.googleTrends * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[weights.googleTrends]}
              max={1}
              step={0.01}
              onValueChange={(value) => handleWeightChange("googleTrends", value[0])}
              className="py-1"
            />
          </div>

          {/* News Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-slate-300 font-medium">News</label>
              <span className="text-sm font-medium bg-slate-800 text-slate-50 px-2 py-0.5 rounded">
                {(weights.news * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[weights.news]}
              max={1}
              step={0.01}
              onValueChange={(value) => handleWeightChange("news", value[0])}
              className="py-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

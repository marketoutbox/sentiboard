"use client"

import { useState } from "react"
import {
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PortfolioChangeChart({ stocks, timePeriod }) {
  // Generate portfolio change data
  const portfolioData = generatePortfolioData(stocks, timePeriod)

  // Generate contribution data
  const contributionData = generateContributionData(stocks, timePeriod)

  // State to track which chart to display
  const [activeTab, setActiveTab] = useState("cumulative")

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">Portfolio Performance</CardTitle>
            <CardDescription>How your portfolio sentiment changes over time with stock contributions</CardDescription>
          </div>
          <Tabs defaultValue="cumulative" value={activeTab} onValueChange={setActiveTab} className="w-[240px]">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="cumulative">Cumulative</TabsTrigger>
              <TabsTrigger value="contribution">Contribution</TabsTrigger>
            </TabsList>

            {/* These TabsContent elements are required for the Tabs component to work properly */}
            <TabsContent value="cumulative" className="hidden" />
            <TabsContent value="contribution" className="hidden" />
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "cumulative" ? (
              <ComposedChart data={portfolioData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8" }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={{ stroke: "#334155" }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8" }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={{ stroke: "#334155" }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    borderRadius: "0.375rem",
                    color: "#f8fafc",
                  }}
                  formatter={(value) => [`${value.toFixed(2)}%`, "Portfolio Change"]}
                  itemStyle={{ color: "#f8fafc" }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="portfolioChange"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#portfolioGradient)"
                />
              </ComposedChart>
            ) : (
              <ComposedChart data={contributionData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8" }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={{ stroke: "#334155" }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8" }}
                  axisLine={{ stroke: "#334155" }}
                  tickLine={{ stroke: "#334155" }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    borderRadius: "0.375rem",
                    color: "#f8fafc",
                  }}
                  formatter={(value, name) => [`${value.toFixed(2)}%`, name]}
                  itemStyle={{ color: "#f8fafc" }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Legend />
                <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
                {stocks.map((stock, index) => (
                  <Bar
                    key={stock.symbol}
                    dataKey={stock.symbol}
                    stackId="a"
                    fill={
                      [
                        "#10B981",
                        "#3B82F6",
                        "#F59E0B",
                        "#EF4444",
                        "#8B5CF6",
                        "#EC4899",
                        "#06B6D4",
                        "#84CC16",
                        "#F97316",
                        "#6366F1",
                      ][index % 10]
                    }
                  />
                ))}
                <Line type="monotone" dataKey="Total" stroke="#FFFFFF" strokeWidth={2} dot={false} />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to generate portfolio data
function generatePortfolioData(stocks, timePeriod) {
  const data = []
  const days = timePeriod === "1d" ? 24 : timePeriod === "1w" ? 7 : 30
  const now = new Date()
  let cumulativeChange = 0

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    if (timePeriod === "1d") {
      date.setHours(date.getHours() - i)
      date.setMinutes(0)
    } else {
      date.setDate(date.getDate() - i)
    }

    // Format date
    const formattedDate = timePeriod === "1d" ? `${date.getHours()}:00` : `${date.getMonth() + 1}/${date.getDate()}`

    // Add some randomness to portfolio change
    const dailyChange = Math.random() * 2 - 0.5 // Between -0.5% and 1.5%
    cumulativeChange += dailyChange

    data.push({
      date: formattedDate,
      portfolioChange: Number.parseFloat(cumulativeChange.toFixed(2)),
    })
  }

  return data
}

// Helper function to generate contribution data
function generateContributionData(stocks, timePeriod) {
  const data = []
  const days = timePeriod === "1d" ? 24 : timePeriod === "1w" ? 7 : 30
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    if (timePeriod === "1d") {
      date.setHours(date.getHours() - i)
      date.setMinutes(0)
    } else {
      date.setDate(date.getDate() - i)
    }

    // Format date
    const formattedDate = timePeriod === "1d" ? `${date.getHours()}:00` : `${date.getMonth() + 1}/${date.getDate()}`

    // Create data point with contributions from each stock
    const dataPoint = { date: formattedDate }
    let total = 0

    stocks.forEach((stock) => {
      const contribution = (Math.random() * 2 - 1) * 0.5 // Between -0.5% and 0.5%
      dataPoint[stock.symbol] = Number.parseFloat(contribution.toFixed(2))
      total += contribution
    })

    dataPoint.Total = Number.parseFloat(total.toFixed(2))
    data.push(dataPoint)
  }

  return data
}


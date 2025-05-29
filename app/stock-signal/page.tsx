"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, DollarSign, TrendingUp, BarChart, Calendar } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Function to generate mock stock price data
const generateStockPriceData = () => {
  const data = []
  const startDate = new Date("2024-01-01")
  let price = 175

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    // Add some random fluctuation to the price
    price = price + i * 0.5 + (Math.random() * 2 - 1)

    data.push({
      date: date.toISOString().split("T")[0],
      price: Number.parseFloat(price.toFixed(2)),
    })
  }

  return data
}

// Function to create a custom gauge chart component
const GaugeChart = ({ value, size = 200 }) => {
  const radius = size / 2
  const innerRadius = radius * 0.6
  const startAngle = 180
  const endAngle = 0

  // Calculate the angle for the needle based on the value (0-100)
  const needleAngle = startAngle - (value / 100) * (startAngle - endAngle)
  const needleLength = radius * 0.8

  // Calculate the needle endpoint using trigonometry
  const needleX = radius + needleLength * Math.cos((needleAngle * Math.PI) / 180)
  const needleY = radius + needleLength * Math.sin((needleAngle * Math.PI) / 180)

  // Create gauge segments data with updated colors
  const gaugeData = [
    { name: "Low", value: 50, color: "#ef4444" },
    { name: "Medium", value: 25, color: "#f59e0b" },
    { name: "High", value: 25, color: "#10b981" },
  ]

  return (
    <div className="relative" style={{ width: size, height: size, margin: "0 auto" }}>
      <PieChart width={size} height={size}>
        <Pie
          data={gaugeData}
          cx={radius}
          cy={radius}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius}
          outerRadius={radius}
          paddingAngle={0}
          dataKey="value"
        >
          {gaugeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>

      {/* Needle */}
      <div className="absolute top-0 left-0 w-full h-full">
        <svg width={size} height={size}>
          <line x1={radius} y1={radius} x2={needleX} y2={needleY} stroke="#6b7280" strokeWidth={2} />
          <circle cx={radius} cy={radius} r={5} fill="#6b7280" />
        </svg>
      </div>

      {/* Value text */}
      <div className="absolute bottom-8 left-0 w-full text-center">
        <span className="text-xl font-bold text-gray-900">{value}%</span>
      </div>
    </div>
  )
}

export default function StockSignalPage() {
  const [stockPriceData, setStockPriceData] = useState([])

  useEffect(() => {
    // Generate mock data when component mounts
    setStockPriceData(generateStockPriceData())
  }, [])

  // Twitter sentiment data for donut chart with updated colors
  const twitterSentimentData = [
    { name: "Positive", value: 45, color: "#10b981" },
    { name: "Negative", value: 30, color: "#ef4444" },
    { name: "Neutral", value: 25, color: "#f59e0b" },
  ]

  return (
    <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 min-h-screen">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Stock Signal</h1>
          <p className="text-gray-400 mt-1">Insights and Analysis from various models.</p>
        </div>

        {/* Summary Stats Card */}
        <Card className="bg-white rounded-lg shadow-lg overflow-hidden border-0 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-gray-100 p-2">
                    <BarChart className="h-5 w-5 text-gray-500" />
                  </div>
                  <span className="text-gray-500 text-sm">Stock Symbol</span>
                </div>
                <span className="text-gray-900 text-2xl font-bold mt-1">AAPL</span>
                <span className="text-gray-500 text-sm">Apple Inc.</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-gray-100 p-2">
                    <DollarSign className="h-5 w-5 text-gray-500" />
                  </div>
                  <span className="text-gray-500 text-sm">Current Price</span>
                </div>
                <span className="text-gray-900 text-2xl font-bold mt-1">$175.34</span>
                <span className="text-green-600 text-sm">+2.5% today</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-gray-100 p-2">
                    <TrendingUp className="h-5 w-5 text-gray-500" />
                  </div>
                  <span className="text-gray-500 text-sm">Sentiment Score</span>
                </div>
                <span className="text-gray-900 text-2xl font-bold mt-1">70%</span>
                <span className="text-green-600 text-sm">Positive</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Price Trend Chart */}
        <Card className="bg-white rounded-lg shadow-lg overflow-hidden border-0 mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-gray-900">Stock Price Trend</CardTitle>
            </div>
            <CardDescription className="text-gray-500">Historical price movement over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stockPriceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: "#6b7280" }} />
                  <YAxis stroke="#6b7280" tick={{ fill: "#6b7280" }} domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e5e7eb",
                      borderRadius: "0.375rem",
                      color: "#111827",
                    }}
                    formatter={(value) => [`$${value}`, "Price"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Twitter Sentiment Block */}
        <Card className="bg-white rounded-lg shadow-lg overflow-hidden border-0 mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-gray-900">Twitter Sentiment</CardTitle>
            </div>
            <CardDescription className="text-gray-500">Analysis of sentiment from Twitter mentions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Keywords Analyzed */}
              <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Keywords Analyzed</h3>
                <p className="text-3xl font-bold text-gray-900">145</p>
                <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
              </div>

              {/* Donut Chart */}
              <div className="flex justify-center">
                <div className="w-[200px] h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={twitterSentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {twitterSentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderColor: "#e5e7eb",
                          borderRadius: "0.375rem",
                          color: "#111827",
                        }}
                        formatter={(value) => [`${value}%`, (entry) => entry.name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sentiment Summary */}
              <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Overall Sentiment</h3>
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-6 w-6 text-green-600" />
                  <p className="text-3xl font-bold text-gray-900">Positive</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">Based on 145 tweets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* News Sentiment Block */}
        <Card className="bg-white rounded-lg shadow-lg overflow-hidden border-0 mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-gray-900">News Sentiment</CardTitle>
            </div>
            <CardDescription className="text-gray-500">Analysis of sentiment from news articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Positive Sentiment */}
              <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Positive Sentiment</h3>
                <p className="text-3xl font-bold text-gray-900">70%</p>
                <p className="text-sm text-gray-500 mt-1">Based on 32 articles</p>
              </div>

              {/* Speedometer */}
              <div className="flex justify-center">
                <GaugeChart value={70} />
              </div>

              {/* Sentiment Summary */}
              <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Overall Sentiment</h3>
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-6 w-6 text-green-600" />
                  <p className="text-3xl font-bold text-gray-900">Positive</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">Based on recent news</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

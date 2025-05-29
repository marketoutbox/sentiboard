"use client"
import { ArrowLeft, ArrowUp, ArrowDown, Activity } from "lucide-react"
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function StockDetailView({
  stock = {
    id: 0,
    symbol: "UNKNOWN",
    name: "Unknown Stock",
    sector: "Unknown",
    price: 100,
    change: 0,
    twitterSentiment: 0,
    googleTrendsSentiment: 0,
    newsSentiment: 0,
    compositeSentiment: 0,
  },
  onBack,
  timePeriod = "1w",
}: {
  stock: any
  onBack: () => void
  timePeriod?: string
}) {
  // Generate historical data for this stock
  const historicalData = generateHistoricalData(stock, timePeriod)

  // Generate news sentiment data
  const newsSentiment = generateNewsSentiment(stock)

  // Generate correlation data
  const correlationData = {
    price: 0.68,
    volume: 0.42,
    volatility: 0.53,
    marketCap: 0.61,
  }

  // Generate key metrics
  const keyMetrics = {
    marketCap: `$${(Math.random() * 1000 + 100).toFixed(2)}B`,
    peRatio: (Math.random() * 30 + 10).toFixed(2),
    dividend: `${(Math.random() * 3).toFixed(2)}%`,
    avgVolume: `${(Math.random() * 50 + 5).toFixed(1)}M`,
    beta: (Math.random() * 2).toFixed(2),
    yearHigh: `$${((stock?.price ?? 100) * (1 + Math.random() * 0.5)).toFixed(2)}`,
    yearLow: `$${((stock?.price ?? 100) * (1 - Math.random() * 0.5)).toFixed(2)}`,
    sentimentScore: (Math.random() * 2 - 1).toFixed(2),
  }

  // Get sentiment color
  const getSentimentColor = (value) => {
    const numValue = Number.parseFloat(value)
    if (numValue > 0.3) return "text-emerald-500"
    if (numValue >= -0.3) return "text-amber-500"
    return "text-red-500"
  }

  // Get sentiment icon
  const getSentimentIcon = (value) => {
    const numValue = Number.parseFloat(value)
    if (numValue > 0.3) return <ArrowUp className="h-4 w-4 text-emerald-500" />
    if (numValue >= -0.3) return <Activity className="h-4 w-4 text-amber-500" />
    return <ArrowDown className="h-4 w-4 text-red-500" />
  }

  // Get sentiment badge
  const getSentimentBadge = (value) => {
    const numValue = Number.parseFloat(value)
    if (numValue > 0.5) return { text: "Very Positive", color: "bg-emerald-500" }
    if (numValue > 0.2) return { text: "Positive", color: "bg-emerald-400" }
    if (numValue > -0.2) return { text: "Neutral", color: "bg-amber-400" }
    if (numValue > -0.5) return { text: "Negative", color: "bg-red-400" }
    return { text: "Very Negative", color: "bg-red-500" }
  }

  const sentimentBadge = getSentimentBadge(keyMetrics.sentimentScore)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              {stock?.symbol || "UNKNOWN"}
              <span className="text-xl text-slate-400 font-normal">{stock?.name || "Unknown Stock"}</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-lg font-semibold ${(stock?.change ?? 0) >= 0 ? "text-emerald-500" : "text-red-500"}`}
              >
                ${(stock?.price ?? 0).toFixed(2)}
              </span>
              <span
                className={`flex items-center gap-1 ${(stock?.change ?? 0) >= 0 ? "text-emerald-500" : "text-red-500"}`}
              >
                {(stock?.change ?? 0) >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                {(stock?.change ?? 0) >= 0 ? "+" : ""}
                {stock?.change ?? 0}%
              </span>
              <Badge className={`${sentimentBadge.color} ml-2`}>{sentimentBadge.text}</Badge>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 w-full md:w-[300px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Price and Sentiment Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Price and Sentiment Correlation</CardTitle>
                  <CardDescription>Stock price movement compared to sentiment indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={historicalData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                          dataKey="date"
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                          axisLine={{ stroke: "#334155" }}
                          tickLine={{ stroke: "#334155" }}
                        />
                        <YAxis
                          yAxisId="left"
                          domain={["auto", "auto"]}
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                          axisLine={{ stroke: "#334155" }}
                          tickLine={{ stroke: "#334155" }}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          domain={[-1, 1]}
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                          axisLine={{ stroke: "#334155" }}
                          tickLine={{ stroke: "#334155" }}
                          tickFormatter={(value) => value.toFixed(1)}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            borderColor: "#334155",
                            borderRadius: "0.375rem",
                            color: "#f8fafc",
                          }}
                          itemStyle={{ color: "#f8fafc" }}
                          labelStyle={{ color: "#94a3b8" }}
                        />
                        <Legend />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="price"
                          fill="#3b82f6"
                          stroke="#3b82f6"
                          fillOpacity={0.2}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="sentiment"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={false}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardDescription>Market Cap</CardDescription>
                    <CardTitle className="text-xl">{keyMetrics.marketCap}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardDescription>P/E Ratio</CardDescription>
                    <CardTitle className="text-xl">{keyMetrics.peRatio}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardDescription>Dividend Yield</CardDescription>
                    <CardTitle className="text-xl">{keyMetrics.dividend}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardDescription>Avg. Volume</CardDescription>
                    <CardTitle className="text-xl">{keyMetrics.avgVolume}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardDescription>Beta</CardDescription>
                    <CardTitle className="text-xl">{keyMetrics.beta}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardDescription>52-Week High</CardDescription>
                    <CardTitle className="text-xl">{keyMetrics.yearHigh}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardDescription>52-Week Low</CardDescription>
                    <CardTitle className="text-xl">{keyMetrics.yearLow}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardDescription>Sentiment Score</CardDescription>
                    <CardTitle
                      className={`text-xl flex items-center gap-1 ${getSentimentColor(keyMetrics.sentimentScore)}`}
                    >
                      {getSentimentIcon(keyMetrics.sentimentScore)}
                      {keyMetrics.sentimentScore}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sentiment" className="mt-6 space-y-6">
              {/* Sentiment Breakdown */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Sentiment Breakdown by Source</CardTitle>
                  <CardDescription>Sentiment analysis from different data sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { source: "Twitter", sentiment: Number.parseFloat((Math.random() * 2 - 1).toFixed(2)) },
                          { source: "Google Trends", sentiment: Number.parseFloat((Math.random() * 2 - 1).toFixed(2)) },
                          { source: "News", sentiment: Number.parseFloat((Math.random() * 2 - 1).toFixed(2)) },
                          { source: "Composite", sentiment: Number.parseFloat(keyMetrics.sentimentScore) },
                        ]}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                          dataKey="source"
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                          axisLine={{ stroke: "#334155" }}
                          tickLine={{ stroke: "#334155" }}
                        />
                        <YAxis
                          domain={[-1, 1]}
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                          axisLine={{ stroke: "#334155" }}
                          tickLine={{ stroke: "#334155" }}
                          tickFormatter={(value) => value.toFixed(1)}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            borderColor: "#334155",
                            borderRadius: "0.375rem",
                            color: "#f8fafc",
                          }}
                          formatter={(value) => [value.toFixed(2), "Sentiment"]}
                          itemStyle={{ color: "#f8fafc" }}
                          labelStyle={{ color: "#94a3b8" }}
                        />
                        <Bar dataKey="sentiment" radius={[4, 4, 0, 0]} maxBarSize={60}>
                          {[
                            { source: "Twitter", sentiment: Number.parseFloat((Math.random() * 2 - 1).toFixed(2)) },
                            {
                              source: "Google Trends",
                              sentiment: Number.parseFloat((Math.random() * 2 - 1).toFixed(2)),
                            },
                            { source: "News", sentiment: Number.parseFloat((Math.random() * 2 - 1).toFixed(2)) },
                            { source: "Composite", sentiment: Number.parseFloat(keyMetrics.sentimentScore) },
                          ].map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.sentiment > 0.3 ? "#10b981" : entry.sentiment > -0.3 ? "#f59e0b" : "#ef4444"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Sentiment Correlation */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Sentiment Correlation with Market Indicators</CardTitle>
                  <CardDescription>How sentiment correlates with different market metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Price", correlation: correlationData.price },
                          { name: "Volume", correlation: correlationData.volume },
                          { name: "Volatility", correlation: correlationData.volatility },
                          { name: "Market Cap", correlation: correlationData.marketCap },
                        ]}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                        <XAxis
                          type="number"
                          domain={[0, 1]}
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                          axisLine={{ stroke: "#334155" }}
                          tickLine={{ stroke: "#334155" }}
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                          axisLine={{ stroke: "#334155" }}
                          tickLine={{ stroke: "#334155" }}
                        />
                        <Tooltip
                          formatter={(value) => [value.toFixed(2), "Correlation"]}
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            borderColor: "#334155",
                            borderRadius: "0.375rem",
                            color: "#f8fafc",
                          }}
                        />
                        <Bar dataKey="correlation" radius={[0, 4, 4, 0]} barSize={20}>
                          {[
                            { name: "Price", correlation: correlationData.price },
                            { name: "Volume", correlation: correlationData.volume },
                            { name: "Volatility", correlation: correlationData.volatility },
                            { name: "Market Cap", correlation: correlationData.marketCap },
                          ].map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.correlation > 0.6
                                  ? "#10b981"
                                  : entry.correlation > 0.4
                                    ? "#3b82f6"
                                    : entry.correlation > 0.2
                                      ? "#f59e0b"
                                      : "#ef4444"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="news" className="mt-6 space-y-6">
              {/* News Sentiment Timeline */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>News Sentiment Timeline</CardTitle>
                  <CardDescription>Sentiment analysis of recent news articles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={newsSentiment} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                          dataKey="date"
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                          axisLine={{ stroke: "#334155" }}
                          tickLine={{ stroke: "#334155" }}
                        />
                        <YAxis
                          domain={[-1, 1]}
                          stroke="#94a3b8"
                          tick={{ fill: "#94a3b8" }}
                          axisLine={{ stroke: "#334155" }}
                          tickLine={{ stroke: "#334155" }}
                          tickFormatter={(value) => value.toFixed(1)}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            borderColor: "#334155",
                            borderRadius: "0.375rem",
                            color: "#f8fafc",
                          }}
                          formatter={(value) => [value.toFixed(2), "Sentiment"]}
                          itemStyle={{ color: "#f8fafc" }}
                          labelStyle={{ color: "#94a3b8" }}
                        />
                        <Line type="monotone" dataKey="sentiment" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent News */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent News Articles</CardTitle>
                  <CardDescription>Latest news articles with sentiment analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => {
                      const sentiment = Number.parseFloat((Math.random() * 2 - 1).toFixed(2))
                      return (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-lg border border-slate-800 hover:bg-slate-800/50 transition-colors"
                        >
                          <div
                            className={`mt-1 p-1.5 rounded-full ${
                              sentiment > 0.3
                                ? "bg-emerald-500/20 text-emerald-500"
                                : sentiment > -0.3
                                  ? "bg-amber-500/20 text-amber-500"
                                  : "bg-red-500/20 text-red-500"
                            }`}
                          >
                            {getSentimentIcon(sentiment)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">
                              {
                                [
                                  `${stock.name} Reports Strong Quarterly Earnings`,
                                  `Analysts Upgrade ${stock.symbol} Stock Rating`,
                                  `${stock.name} Announces New Product Line`,
                                  `${stock.name} CEO Discusses Future Growth Strategy`,
                                  `${stock.symbol} Expands into New Markets`,
                                ][i]
                              }
                            </h3>
                            <p className="text-sm text-slate-400 mt-1">
                              {
                                [
                                  `${stock.name} exceeded analyst expectations with quarterly revenue of $12.8B...`,
                                  `Several analysts have upgraded ${stock.symbol} citing strong growth potential...`,
                                  `The new product line is expected to contribute significantly to revenue growth...`,
                                  `During the interview, the CEO outlined plans for expansion into emerging markets...`,
                                  `The expansion represents a strategic move to capitalize on growing demand...`,
                                ][i]
                              }
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-slate-500">
                                {["Financial Times", "Wall Street Journal", "Bloomberg", "CNBC", "Reuters"][i]} •{" "}
                                {Math.floor(Math.random() * 12 + 1)}h ago
                              </span>
                              <Badge
                                variant="outline"
                                className={
                                  sentiment > 0.3
                                    ? "border-emerald-500/50 text-emerald-500"
                                    : sentiment > -0.3
                                      ? "border-amber-500/50 text-amber-500"
                                      : "border-red-500/50 text-red-500"
                                }
                              >
                                Sentiment: {sentiment.toFixed(2)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate historical data
function generateHistoricalData(stock, timePeriod) {
  const data = []
  const days = timePeriod === "1d" ? 24 : timePeriod === "1w" ? 7 : 30
  const now = new Date()
  let price = stock?.price ?? 100 // Use nullish coalescing for default value
  let sentiment = Number.parseFloat((Math.random() * 2 - 1).toFixed(2))

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

    // Add some randomness to price and sentiment
    const priceChange = (Math.random() * 2 - 1) * (price * 0.02)
    price += priceChange

    const sentimentChange = Math.random() * 0.2 - 0.1
    sentiment = Math.max(-1, Math.min(1, sentiment + sentimentChange))

    data.push({
      date: formattedDate,
      price: Number.parseFloat(price.toFixed(2)),
      sentiment: Number.parseFloat(sentiment.toFixed(2)),
    })
  }

  return data
}

// Helper function to generate news sentiment
function generateNewsSentiment(stock) {
  const data = []
  const now = new Date()

  for (let i = 14; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Format date as MM/DD
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`

    // Generate random sentiment
    const sentiment = Number.parseFloat((Math.random() * 2 - 1).toFixed(2))

    data.push({
      date: formattedDate,
      sentiment,
    })
  }

  return data
}


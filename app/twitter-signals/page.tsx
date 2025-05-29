"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Search, ChevronDown, ChevronUp, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts"

interface TwitterSignal {
  date: string
  comp_symbol: string
  analyzed_tweets: number
  sentiment_score: number
  sentiment: string
  entry_price: number
}

export default function TwitterSignalsPage() {
  const [data, setData] = useState<TwitterSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredData, setFilteredData] = useState<TwitterSignal[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sentimentFilter, setSentimentFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    lastUpdate: "",
    totalTweets: 0,
  })
  const [comparisonData, setComparisonData] = useState([])

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString

    try {
      const date = new Date(dateString)
      return date.toISOString().split("T")[0] // Returns YYYY-MM-DD
    } catch (e) {
      return dateString // Return original if parsing fails
    }
  }

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const res = await fetch("/api/twitter-signals")
        const data = await res.json()

        // Format dates in the data
        const formattedData = data.map((item: TwitterSignal) => ({
          ...item,
          date: formatDate(item.date),
        }))

        setData(formattedData)
        setFilteredData(formattedData)

        // Generate summary stats with formatted date
        const stats = {
          total: data.length,
          positive: data.filter((item: TwitterSignal) => item.sentiment.toLowerCase() === "positive").length,
          negative: data.filter((item: TwitterSignal) => item.sentiment.toLowerCase() === "negative").length,
          neutral: data.filter((item: TwitterSignal) => item.sentiment.toLowerCase() === "neutral").length,
          lastUpdate: data.length > 0 ? formatDate(data[0].date) : "N/A",
          totalTweets: data.reduce((sum: number, item: TwitterSignal) => sum + (item.analyzed_tweets || 0), 0),
        }
        setSummaryStats(stats)

        // Generate comparison data
        setComparisonData(generateComparisonData())
      } catch (err: any) {
        setError("Failed to load Twitter Signals.")
      } finally {
        setLoading(false)
      }
    }

    fetchSignals()
  }, [])

  useEffect(() => {
    // Apply filters and sorting
    let result = [...data]

    // Apply sentiment filter
    if (sentimentFilter !== "all") {
      result = result.filter((item) => item.sentiment.toLowerCase() === sentimentFilter.toLowerCase())
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((item) => item.comp_symbol.toLowerCase().includes(query))
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.date) > new Date(b.date) ? 1 : -1
      } else if (sortBy === "symbol") {
        return a.comp_symbol.localeCompare(b.comp_symbol)
      } else if (sortBy === "sentiment_score") {
        return a.sentiment_score - b.sentiment_score
      } else if (sortBy === "tweets") {
        return a.analyzed_tweets - b.analyzed_tweets
      }
      return 0
    })

    // Apply sort order
    if (sortOrder === "desc") {
      result.reverse()
    }

    setFilteredData(result)
  }, [data, searchQuery, sentimentFilter, sortBy, sortOrder])

  // Helper function to generate comparison data
  const generateComparisonData = () => {
    // Mock data comparing different signal sources
    return [
      { symbol: "AAPL", googleTrends: 0.5, twitter: 0.7, news: 0.6 },
      { symbol: "MSFT", googleTrends: 0.6, twitter: 0.7, news: 0.5 },
      { symbol: "AMZN", googleTrends: 0.4, twitter: 0.3, news: 0.2 },
      { symbol: "GOOGL", googleTrends: 0.6, twitter: 0.8, news: 0.7 },
      { symbol: "META", googleTrends: -0.3, twitter: -0.2, news: -0.1 },
      { symbol: "TSLA", googleTrends: 0.3, twitter: 0.4, news: 0.5 },
    ]
  }

  return (
    <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 min-h-screen">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">X Signals</h1>
          <p className="text-gray-400 mt-1">View the latest Twitter sentiment signals for each stock.</p>
        </div>

        {/* Summary Stats Card */}
        <Card className="bg-white rounded-lg shadow-lg overflow-hidden border-0 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Total Signals</span>
                <span className="text-gray-900 text-2xl font-bold">{summaryStats.total}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Analyzed Tweets</span>
                <span className="text-gray-900 text-2xl font-bold">{summaryStats.totalTweets.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Positive Signals</span>
                <span className="text-green-600 text-2xl font-bold">{summaryStats.positive}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Negative Signals</span>
                <span className="text-red-600 text-2xl font-bold">{summaryStats.negative}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-gray-500 text-sm">Last updated: {summaryStats.lastUpdate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Controls */}
        <Card className="bg-white rounded-lg shadow-lg overflow-hidden border-0 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by symbol..."
                    className="pl-10 bg-white border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                  <SelectTrigger className="w-[180px] bg-white border-gray-200">
                    <SelectValue placeholder="Filter by sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiments</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] bg-white border-gray-200">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="symbol">Symbol</SelectItem>
                    <SelectItem value="sentiment_score">Sentiment Score</SelectItem>
                    <SelectItem value="tweets">Analyzed Tweets</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white border-gray-200"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table View */}
        <Card className="bg-white rounded-lg shadow-lg overflow-hidden border-0 mb-6">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64 bg-white">
                <Loader2 className="animate-spin w-6 h-6 mr-2 text-amber-500" />
                <span className="text-gray-600">Loading sentiment data...</span>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64 bg-white">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Symbol</th>
                      <th className="px-6 py-4 font-medium text-right">Analyzed Tweets</th>
                      <th className="px-6 py-4 font-medium text-right">Sentiment Score</th>
                      <th className="px-6 py-4 text-center font-medium">Sentiment</th>
                      <th className="px-6 py-4 font-medium text-right">Entry Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((signal, i) => (
                      <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-800">{signal.date}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{signal.comp_symbol}</td>
                        <td className="px-6 py-4 text-right text-gray-800">{signal.analyzed_tweets}</td>
                        <td className="px-6 py-4 text-right text-gray-800">{signal.sentiment_score.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium inline-block
                              ${
                                signal.sentiment.toLowerCase() === "positive"
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : signal.sentiment.toLowerCase() === "negative"
                                    ? "bg-red-100 text-red-800 border border-red-200"
                                    : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}
                          >
                            {signal.sentiment}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-800">${signal.entry_price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 bg-white">
                <p className="text-gray-500">No Twitter signals found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Signal Source Comparison */}
        <Card className="bg-white rounded-lg shadow-lg overflow-hidden border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-gray-900">Signal Source Comparison</CardTitle>
            </div>
            <CardDescription className="text-gray-500">
              Compare Twitter with Google Trends and News signals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="symbol" stroke="#6b7280" tick={{ fill: "#6b7280" }} />
                  <YAxis stroke="#6b7280" tick={{ fill: "#6b7280" }} domain={[-1, 1]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e5e7eb",
                      borderRadius: "0.375rem",
                      color: "#111827",
                    }}
                    formatter={(value) => [value.toFixed(2), "Sentiment Score"]}
                  />
                  <Legend />
                  <Bar dataKey="googleTrends" name="Google Trends" fill="#10b981" />
                  <Bar dataKey="twitter" name="Twitter" fill="#3b82f6" />
                  <Bar dataKey="news" name="News" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

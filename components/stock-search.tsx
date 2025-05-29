"use client"

import type React from "react"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { StockDetailView } from "./stock-detail-view"

// Sample stock data for search results
const stockDatabase = [
  {
    id: 101,
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    price: 217.56,
    change: -2.51,
    twitterSentiment: 0.2,
    googleTrendsSentiment: 0.1,
    newsSentiment: -0.1,
    compositeSentiment: 0.04,
  },
  {
    id: 102,
    symbol: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology",
    price: 425.22,
    change: 1.2,
    twitterSentiment: 0.5,
    googleTrendsSentiment: 0.3,
    newsSentiment: 0.4,
    compositeSentiment: 0.4,
  },
  {
    id: 103,
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Technology",
    price: 175.98,
    change: 0.8,
    twitterSentiment: 0.3,
    googleTrendsSentiment: 0.6,
    newsSentiment: 0.2,
    compositeSentiment: 0.37,
  },
  {
    id: 104,
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    sector: "Consumer Cyclical",
    price: 185.07,
    change: -0.5,
    twitterSentiment: 0.1,
    googleTrendsSentiment: 0.2,
    newsSentiment: -0.3,
    compositeSentiment: 0,
  },
  {
    id: 105,
    symbol: "META",
    name: "Meta Platforms Inc.",
    sector: "Technology",
    price: 511.32,
    change: 2.1,
    twitterSentiment: 0.4,
    googleTrendsSentiment: 0.1,
    newsSentiment: 0.2,
    compositeSentiment: 0.23,
  },
  {
    id: 106,
    symbol: "TSLA",
    name: "Tesla Inc.",
    sector: "Automotive",
    price: 175.34,
    change: -1.8,
    twitterSentiment: -0.2,
    googleTrendsSentiment: 0.3,
    newsSentiment: -0.4,
    compositeSentiment: -0.1,
  },
  {
    id: 107,
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Technology",
    price: 950.02,
    change: 3.2,
    twitterSentiment: 0.8,
    googleTrendsSentiment: 0.7,
    newsSentiment: 0.6,
    compositeSentiment: 0.7,
  },
  {
    id: 108,
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    sector: "Financial Services",
    price: 198.47,
    change: 0.3,
    twitterSentiment: 0.1,
    googleTrendsSentiment: -0.1,
    newsSentiment: 0.2,
    compositeSentiment: 0.07,
  },
  {
    id: 109,
    symbol: "V",
    name: "Visa Inc.",
    sector: "Financial Services",
    price: 275.64,
    change: 0.5,
    twitterSentiment: 0.2,
    googleTrendsSentiment: 0.3,
    newsSentiment: 0.1,
    compositeSentiment: 0.2,
  },
  {
    id: 110,
    symbol: "WMT",
    name: "Walmart Inc.",
    sector: "Consumer Defensive",
    price: 68.92,
    change: 1.1,
    twitterSentiment: 0.3,
    googleTrendsSentiment: 0.2,
    newsSentiment: 0.4,
    compositeSentiment: 0.3,
  },
]

export function StockSearch({ onAddStock }: { onAddStock: (stock: any) => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedStock, setSelectedStock] = useState<any | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results = stockDatabase.filter(
      (stock) => stock.symbol.toLowerCase().includes(query) || stock.name.toLowerCase().includes(query),
    )
    setSearchResults(results)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  const handleStockPreview = (stock: any) => {
    setSelectedStock(stock)
    setPreviewOpen(true)
  }

  const handleAddStock = () => {
    if (selectedStock) {
      onAddStock(selectedStock)
      setPreviewOpen(false)
      setSelectedStock(null)
      setSearchQuery("")
      setSearchResults([])
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder="Search for stocks by symbol or name..."
          className="pl-10 pr-10 bg-slate-800 border-slate-700 focus-visible:ring-slate-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button type="submit" className="sr-only">
          Search
        </Button>
      </form>

      {searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full max-w-3xl bg-slate-800 border border-slate-700 rounded-md shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto">
            {searchResults.map((stock) => (
              <li
                key={stock.id}
                className="px-4 py-2 hover:bg-slate-700 cursor-pointer"
                onClick={() => handleStockPreview(stock)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{stock.symbol}</span>
                    <span className="ml-2 text-slate-400">{stock.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">${stock.price.toFixed(2)}</span>
                    <span className={`ml-2 ${stock.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change}%
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-800 text-white p-0">
          <div className="p-6">
            <StockDetailView
              stock={selectedStock}
              onBack={() => setPreviewOpen(false)}
              timePeriod="1w"
              previewMode={true}
              onAddStock={handleAddStock}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


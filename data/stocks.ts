export interface Stock {
  id: number
  symbol: string
  name: string
  sector: string
  price: number
  change: number
}

export const allStocks: Stock[] = [
  { id: 1, symbol: "AAPL", name: "Apple Inc.", sector: "Technology", price: 182.52, change: 1.25 },
  { id: 2, symbol: "MSFT", name: "Microsoft Corp.", sector: "Technology", price: 417.88, change: -0.52 },
  { id: 3, symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical", price: 178.75, change: 2.34 },
  { id: 4, symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive", price: 175.34, change: -1.23 },
  { id: 5, symbol: "META", name: "Meta Platforms Inc.", sector: "Technology", price: 474.99, change: 3.45 },
  { id: 6, symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology", price: 147.68, change: 0.87 },
  { id: 7, symbol: "NFLX", name: "Netflix Inc.", sector: "Entertainment", price: 602.75, change: 1.56 },
  { id: 8, symbol: "NVDA", name: "NVIDIA Corp.", sector: "Technology", price: 950.02, change: 5.23 },
  { id: 9, symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial Services", price: 198.47, change: -0.34 },
  { id: 10, symbol: "V", name: "Visa Inc.", sector: "Financial Services", price: 275.31, change: 0.45 },
  { id: 11, symbol: "WMT", name: "Walmart Inc.", sector: "Consumer Defensive", price: 59.86, change: 0.21 },
  { id: 12, symbol: "PG", name: "Procter & Gamble Co.", sector: "Consumer Defensive", price: 162.45, change: -0.12 },
  { id: 13, symbol: "DIS", name: "Walt Disney Co.", sector: "Entertainment", price: 112.73, change: 1.02 },
  { id: 14, symbol: "KO", name: "Coca-Cola Co.", sector: "Consumer Defensive", price: 60.12, change: 0.34 },
  { id: 15, symbol: "PEP", name: "PepsiCo Inc.", sector: "Consumer Defensive", price: 172.98, change: -0.25 },
  { id: 16, symbol: "ADBE", name: "Adobe Inc.", sector: "Technology", price: 492.46, change: 2.15 },
  { id: 17, symbol: "INTC", name: "Intel Corp.", sector: "Technology", price: 42.37, change: -1.45 },
  { id: 18, symbol: "CRM", name: "Salesforce Inc.", sector: "Technology", price: 284.89, change: 1.78 },
  { id: 19, symbol: "AMD", name: "Advanced Micro Devices Inc.", sector: "Technology", price: 158.76, change: 3.21 },
  { id: 20, symbol: "PYPL", name: "PayPal Holdings Inc.", sector: "Financial Services", price: 62.34, change: -0.87 },
  {
    id: 21,
    symbol: "BABA",
    name: "Alibaba Group Holding Ltd.",
    sector: "Consumer Cyclical",
    price: 85.23,
    change: 1.89,
  },
  {
    id: 22,
    symbol: "TSM",
    name: "Taiwan Semiconductor Manufacturing Co.",
    sector: "Technology",
    price: 98.45,
    change: 0.67,
  },
  { id: 23, symbol: "COST", name: "Costco Wholesale Corp.", sector: "Consumer Defensive", price: 789.12, change: 2.34 },
  { id: 24, symbol: "AVGO", name: "Broadcom Inc.", sector: "Technology", price: 1234.56, change: 15.67 },
  { id: 25, symbol: "CSCO", name: "Cisco Systems Inc.", sector: "Technology", price: 56.78, change: -0.89 },
]

// Helper function to get stocks grouped by sector
export const getStocksBySector = (): Record<string, Stock[]> => {
  return allStocks.reduce(
    (acc, stock) => {
      if (!acc[stock.sector]) {
        acc[stock.sector] = []
      }
      acc[stock.sector].push(stock)
      return acc
    },
    {} as Record<string, Stock[]>,
  )
}

// Helper function to get all unique sectors
export const getSectors = (): string[] => {
  const sectors = [...new Set(allStocks.map((stock) => stock.sector))]
  return sectors.sort()
}

// Helper function to search stocks
export const searchStocks = (query: string, sectorFilter?: string): Stock[] => {
  return allStocks.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(query.toLowerCase()) || stock.name.toLowerCase().includes(query.toLowerCase())

    const matchesSector = !sectorFilter || stock.sector === sectorFilter

    return matchesSearch && matchesSector
  })
}

// Helper function to get stock by symbol
export const getStockBySymbol = (symbol: string): Stock | undefined => {
  return allStocks.find((stock) => stock.symbol === symbol)
}

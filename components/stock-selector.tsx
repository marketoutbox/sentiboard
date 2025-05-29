"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, Plus, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Import stock data from the separate file
import { allStocks, getSectors } from "@/data/stocks"

// Get all sectors
const sectors = getSectors()

export function StockSelector({
  open,
  onOpenChange,
  initialStocks = [],
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialStocks: any[]
  onSave: (stocks: any[]) => void
}) {
  const [selectedStocks, setSelectedStocks] = useState(initialStocks)
  const [searchTerm, setSearchTerm] = useState("")
  const [sectorFilter, setSectorFilter] = useState<string | null>(null)
  const [basketName, setBasketName] = useState("Tech Leaders")

  // Reset selected stocks when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedStocks(initialStocks)
    }
  }, [open, initialStocks])

  // Filter stocks based on search term and sector
  const filteredStocks = allStocks.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSector = !sectorFilter || stock.sector === sectorFilter

    return matchesSearch && matchesSector
  })

  // Check if a stock is selected
  const isSelected = (stockId: number) => {
    return selectedStocks.some((stock) => stock.id === stockId)
  }

  // Toggle stock selection
  const toggleStock = (stock) => {
    if (isSelected(stock.id)) {
      setSelectedStocks(selectedStocks.filter((s) => s.id !== stock.id))
    } else {
      setSelectedStocks([...selectedStocks, stock])
    }
  }

  // Function to handle saving
  const handleSave = () => {
    // Ensure all selected stocks have valid properties
    const stocksToSave = selectedStocks.map((stock) => ({
      ...stock,
      allocation: stock.allocation || Math.floor(100 / selectedStocks.length), // Default allocation if not set
      locked: stock.locked || false, // Default to unlocked if not set
    }))

    onSave(stocksToSave)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Edit Stock Basket</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select stocks to include in your sentiment analysis basket.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
          {/* Left side - Available stocks */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 bg-background border-border text-foreground hover:bg-accent"
                  >
                    {sectorFilter || "All Sectors"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 bg-popover border-border" align="end">
                  <Command className="bg-popover">
                    <CommandList>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => setSectorFilter(null)}
                          className="flex items-center gap-2 text-popover-foreground hover:bg-accent"
                        >
                          {!sectorFilter && <Check className="h-4 w-4" />}
                          <span className={!sectorFilter ? "font-medium" : ""}>All Sectors</span>
                        </CommandItem>
                        {sectors.map((sector) => (
                          <CommandItem
                            key={sector}
                            onSelect={() => setSectorFilter(sector)}
                            className="flex items-center gap-2 text-popover-foreground hover:bg-accent"
                          >
                            {sectorFilter === sector && <Check className="h-4 w-4" />}
                            <span className={sectorFilter === sector ? "font-medium" : ""}>{sector}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <Card className="flex-1 overflow-hidden bg-card border-border">
              <CardHeader className="p-4">
                <CardTitle className="text-base text-card-foreground">Available Stocks</CardTitle>
              </CardHeader>
              <ScrollArea className="flex-1 h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="w-[80px] text-muted-foreground">Symbol</TableHead>
                      <TableHead className="text-muted-foreground">Name</TableHead>
                      <TableHead className="hidden md:table-cell text-muted-foreground">Sector</TableHead>
                      <TableHead className="text-right text-muted-foreground">Price</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStocks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No stocks found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStocks.map((stock) => (
                        <TableRow key={stock.id} className="group border-border hover:bg-accent">
                          <TableCell className="font-medium text-card-foreground">{stock.symbol}</TableCell>
                          <TableCell className="text-card-foreground">{stock.name}</TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">{stock.sector}</TableCell>
                          <TableCell className="text-right">
                            <span className={stock.change >= 0 ? "text-emerald-600" : "text-red-600"}>
                              ${stock.price.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={isSelected(stock.id) ? "default" : "outline"}
                              size="sm"
                              className={`w-full ${
                                isSelected(stock.id)
                                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                                  : "bg-background border-border text-foreground hover:bg-accent"
                              }`}
                              onClick={() => toggleStock(stock)}
                            >
                              {isSelected(stock.id) ? "Remove" : "Add"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </div>

          {/* Right side - Selected stocks */}
          <div className="w-full md:w-[300px] flex flex-col">
            <div className="mb-4">
              <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Basket Name</label>
              <Input
                value={basketName}
                onChange={(e) => setBasketName(e.target.value)}
                className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Card className="flex-1 bg-card border-border">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-card-foreground">Selected Stocks</CardTitle>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    {selectedStocks.length}
                  </Badge>
                </div>
              </CardHeader>
              <ScrollArea className="h-[300px]">
                {selectedStocks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground">
                    <div className="rounded-full bg-muted p-3 mb-3">
                      <Plus className="h-6 w-6" />
                    </div>
                    <p>No stocks selected</p>
                    <p className="text-sm">Add stocks from the list on the left</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    {selectedStocks.map((stock) => (
                      <div
                        key={stock.id}
                        className="flex items-center justify-between p-2 rounded-md bg-accent hover:bg-accent/80 group"
                      >
                        <div>
                          <div className="font-medium text-card-foreground">{stock.symbol}</div>
                          <div className="text-xs text-muted-foreground">{stock.name}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-50 group-hover:opacity-100 text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => toggleStock(stock)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-background border-border text-foreground hover:bg-accent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={selectedStocks.length === 0}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export type StockBasket = {
  id?: string
  name: string
  source_weights: { [key: string]: number }
  is_locked: boolean
  created_at?: string
  updated_at?: string
}

export type BasketStock = {
  symbol: string
  name: string
  sector?: string
  allocation: number
  is_locked: boolean
}

// Get the most recent basket for the current user
export async function getMostRecentBasket(): Promise<{
  basket: StockBasket | null
  stocks: BasketStock[] | null
  error: Error | null
}> {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { basket: null, stocks: null, error: new Error("User not authenticated") }
    }

    // Get the most recent basket
    const { data: baskets, error: basketError } = await supabase
      .from("stock_baskets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)

    if (basketError) {
      console.error("Error fetching baskets:", basketError)
      return { basket: null, stocks: null, error: basketError }
    }

    if (!baskets || baskets.length === 0) {
      return { basket: null, stocks: null, error: null }
    }

    const basket = baskets[0]

    // Get the stocks for this basket
    const { data: stocks, error: stocksError } = await supabase
      .from("basket_stocks")
      .select("*")
      .eq("basket_id", basket.id)

    if (stocksError) {
      console.error("Error fetching stocks:", stocksError)
      return { basket, stocks: null, error: stocksError }
    }

    return { basket, stocks, error: null }
  } catch (error) {
    console.error("Error getting most recent basket:", error)
    return { basket: null, stocks: null, error: error as Error }
  }
}

// Save a new basket or update an existing one
export async function saveBasket(
  basketData: StockBasket,
  stocks: BasketStock[],
): Promise<{ error: Error | null; basketId: string | null }> {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: new Error("User not authenticated"), basketId: null }
    }

    let basketId = basketData.id

    // If no basket ID, create a new basket
    if (!basketId) {
      basketId = uuidv4()

      // Insert the basket
      const { error: basketError } = await supabase.from("stock_baskets").insert({
        id: basketId,
        user_id: user.id,
        name: basketData.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source_weights: basketData.source_weights,
        is_locked: basketData.is_locked,
      })

      if (basketError) {
        console.error("Error creating basket:", basketError)
        return { error: basketError, basketId: null }
      }
    } else {
      // Update existing basket
      console.log("Updating existing basket:", basketId, "with data:", {
        name: basketData.name,
        source_weights: basketData.source_weights,
        is_locked: basketData.is_locked,
      })

      const { error: basketError } = await supabase
        .from("stock_baskets")
        .update({
          name: basketData.name,
          updated_at: new Date().toISOString(),
          source_weights: basketData.source_weights,
          is_locked: basketData.is_locked,
        })
        .eq("id", basketId)
        .eq("user_id", user.id)

      if (basketError) {
        console.error("Error updating basket:", basketError)
        return { error: basketError, basketId: null }
      }

      console.log("Basket updated successfully")
    }

    // Delete existing stocks for this basket (we'll replace them)
    if (basketId) {
      console.log("Deleting existing stocks for basket:", basketId)
      const { error: deleteError } = await supabase.from("basket_stocks").delete().eq("basket_id", basketId)

      if (deleteError) {
        console.error("Error deleting existing stocks:", deleteError)
        return { error: deleteError, basketId: null }
      }
      console.log("Existing stocks deleted successfully")
    }

    // Insert the stocks
    const stocksToInsert = stocks.map((stock) => ({
      id: uuidv4(),
      basket_id: basketId,
      symbol: stock.symbol,
      name: stock.name,
      sector: stock.sector || "Unknown",
      allocation: stock.allocation,
      is_locked: stock.is_locked,
    }))

    console.log("Inserting stocks:", stocksToInsert.length, "stocks")
    const { error: stocksError } = await supabase.from("basket_stocks").insert(stocksToInsert)

    if (stocksError) {
      console.error("Error inserting stocks:", stocksError)
      return { error: stocksError, basketId: null }
    }

    console.log("Stocks inserted successfully")

    return { error: null, basketId }
  } catch (error) {
    console.error("Error saving basket:", error)
    return { error: error as Error, basketId: null }
  }
}

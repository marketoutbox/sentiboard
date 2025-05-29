import mysql from "mysql2/promise"

export async function GET(req) {
  const url = new URL(req.url)
  const symbol = url.searchParams.get("symbol")
  const type = url.searchParams.get("type") // metrics, data, or cumulative-pl

  if (!symbol) {
    return Response.json({ error: "Symbol parameter is required" }, { status: 400 })
  }

  if (!type || !["metrics", "data", "cumulative-pl"].includes(type)) {
    return Response.json(
      { error: "Valid type parameter is required (metrics, data, or cumulative-pl)" },
      { status: 400 },
    )
  }

  try {
    const connection = await mysql.createConnection({
      host: "13.233.224.119",
      user: "stockstream_two",
      password: "stockstream_two",
      database: "stockstream_two",
    })

    let result

    if (type === "metrics") {
      // Win percentage query
      const [winPercentageRows] = await connection.execute(
        `
        SELECT (COUNT(CASE WHEN (\`30d_pl\` > 0 OR \`60d_pl\` > 0) AND sentiment != 'neutral' THEN 1 END) 
        / COUNT(CASE WHEN sentiment != 'neutral' THEN 1 END)) * 100 AS win_percentage
        FROM models_performance WHERE comp_symbol = ?;
      `,
        [symbol],
      )

      // Total trades query
      const [totalTradesRows] = await connection.execute(
        `
        SELECT COUNT(*) AS total_trades FROM models_performance
        WHERE comp_symbol = ? AND sentiment != 'neutral';
      `,
        [symbol],
      )

      // Profit factor query
      const [profitFactorRows] = await connection.execute(
        `
        SELECT COALESCE(SUM(CASE WHEN \`30d_pl\` > 0 AND sentiment != 'neutral' THEN \`30d_pl\` ELSE 0 END), 0) / 
        NULLIF(ABS(SUM(CASE WHEN \`30d_pl\` < 0 AND sentiment != 'neutral' THEN \`30d_pl\` ELSE 0 END)), 0) 
        AS profit_factor FROM models_performance WHERE comp_symbol = ?;
      `,
        [symbol],
      )

      const winPercentage =
        winPercentageRows[0].win_percentage !== null ? Math.round(winPercentageRows[0].win_percentage) : "N/A"

      const totalTrades = totalTradesRows[0].total_trades !== null ? totalTradesRows[0].total_trades : "N/A"

      const profitFactor =
        profitFactorRows[0].profit_factor !== null ? Number(profitFactorRows[0].profit_factor).toFixed(2) : "N/A"

      result = {
        win_percentage: winPercentage,
        total_trades: totalTrades,
        profit_factor: profitFactor,
      }
    } else if (type === "data") {
      const [rows] = await connection.execute(
        `
        SELECT date, sentiment, entry_price, \`30d_pl\`, \`60d_pl\`
        FROM models_performance
        WHERE comp_symbol = ? AND sentiment != 'neutral'
      `,
        [symbol],
      )

      result = rows
    } else if (type === "cumulative-pl") {
      const [rows] = await connection.execute(
        `
        SELECT date, SUM(\`30d_pl\`) AS daily_pl
        FROM models_performance
        WHERE comp_symbol = ? AND sentiment != 'neutral'
        GROUP BY date ORDER BY date;
      `,
        [symbol],
      )

      // Calculate cumulative P/L
      let cumulativePL = 0
      result = rows.map((row) => {
        cumulativePL += Number(row.daily_pl)
        return {
          date: row.date,
          daily_pl: Number(row.daily_pl),
          cumulative_pl: cumulativePL,
        }
      })
    }

    await connection.end()
    return Response.json(result)
  } catch (error) {
    console.error(`Error fetching ${type} data:`, error)
    return Response.json({ error: `Failed to fetch ${type} data` }, { status: 500 })
  }
}

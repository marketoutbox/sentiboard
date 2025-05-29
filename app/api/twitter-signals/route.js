import mysql from "mysql2/promise";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: "13.233.224.119",
      user: "stockstream_two",
      password: "stockstream_two",
      database: "stockstream_two",
    });

    const [rows] = await connection.execute(`
      SELECT date, comp_symbol, analyzed_tweets, sentiment_score, sentiment, entry_price
      FROM twitter_signals_full
      WHERE (comp_symbol, date) IN (
        SELECT comp_symbol, MAX(date)
        FROM twitter_signals_full
        GROUP BY comp_symbol
      );
    `);

    await connection.end();

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch Twitter signals", details: error.message }),
      { status: 500 }
    );
  }
}

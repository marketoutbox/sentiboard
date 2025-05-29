import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: '13.233.224.119',
      user: 'stockstream_two',
      password: 'stockstream_two',
      database: 'stockstream_two',
    });

    const [rows] = await connection.execute(`
      SELECT date, comp_symbol, analyzed_articles, sentiment_score, sentiment, entry_price
      FROM news_signals_full
      WHERE (comp_symbol, date) IN (
        SELECT comp_symbol, MAX(date)
        FROM news_signals_full
        GROUP BY comp_symbol
      )
    `);

    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch news signals' }, { status: 500 });
  }
}

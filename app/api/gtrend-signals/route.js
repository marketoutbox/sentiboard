// /app/api/gtrend-signals/route.js
import mysql from 'mysql2/promise';

export async function GET(req, res) {
    const connection = await mysql.createConnection({
        host: '13.233.224.119',
        user: 'stockstream_two',
        password: 'stockstream_two',
        database: 'stockstream_two'
    });

    try {
        const [rows] = await connection.execute(`
            SELECT date, comp_symbol, analyzed_keywords, sentiment_score, sentiment, entry_price
            FROM gtrend_signals_full
            WHERE (comp_symbol, date) IN (
                SELECT comp_symbol, MAX(date)
                FROM gtrend_signals_full
                GROUP BY comp_symbol
            );
        `);
        await connection.end();
        return Response.json(rows);
    } catch (error) {
        await connection.end();
        return Response.json({ error: error.message }, { status: 500 });
    }
}

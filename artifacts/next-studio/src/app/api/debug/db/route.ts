import { NextResponse } from 'next/server';
import { db, orders } from "@workspace/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const tableCheck = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const orderCount = await db.execute(sql`SELECT COUNT(*) FROM "orders"`);
    const lastOrders = await db.select().from(orders).limit(5);

    return NextResponse.json({
      tables: tableCheck.rows.map(r => r.table_name),
      count: orderCount.rows[0].count,
      lastOrders
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

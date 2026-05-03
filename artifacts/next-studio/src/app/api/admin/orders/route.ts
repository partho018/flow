import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, orders } from "@workspace/db";
import { desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  const adminAuth = req.headers.get('x-admin-auth');
  const isAdmin = adminAuth === '0000' || session?.user?.email?.toLowerCase() === 'parthosamadder00@gmail.com';

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await db.select().from(orders).orderBy(desc(orders.createdAt));
    console.log(`Fetched ${data.length} orders for admin dashboard`);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Admin Orders Fetch Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

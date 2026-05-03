import { NextResponse } from 'next/server';
import { db, orders } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    console.log(`Cancelling order: ${orderId}`);
    // Update order status to 'cancelled' if it's still 'pending'
    const result = await db.update(orders)
      .set({ status: 'cancelled' })
      .where(eq(orders.orderId, orderId));
    
    console.log(`Order ${orderId} status updated to cancelled`);
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Cancel Order Error:', error);
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}

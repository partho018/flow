import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db, orders, profiles } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update order status in DB
      await db.update(orders)
        .set({ status: 'completed', paymentId: razorpay_payment_id })
        .where(eq(orders.orderId, razorpay_order_id));

      // Update profile revenue and plan (Assuming order amount is in INR)
      const orderData = await db.select().from(orders).where(eq(orders.orderId, razorpay_order_id)).limit(1);
      if (orderData.length > 0 && orderData[0].userId) {
        await db.update(profiles)
          .set({ 
            rev: sql`${profiles.rev} + ${orderData[0].amount}`,
            plan: 'pro' // Upgrade to pro
          })
          .where(eq(profiles.userId, orderData[0].userId));
      }
      
      return NextResponse.json({ status: 'success' });
    } else {
      await db.update(orders)
        .set({ status: 'failed' })
        .where(eq(orders.orderId, razorpay_order_id));
        
      return NextResponse.json({ status: 'failed' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}

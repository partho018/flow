import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { db, orders } from "@workspace/db";
import { auth } from "@/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const { amount, currency = 'INR', billingDetails } = await req.json();

    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save order to database
    const session = await auth();
    console.log(`Creating order for user: ${session?.user?.id || 'Anonymous'}, Email: ${session?.user?.email || 'N/A'}`);
    
    try {
      await db.insert(orders).values({
        id: crypto.randomUUID(),
        userId: session?.user?.id,
        orderId: order.id,
        amount: amount,
        status: 'pending',
        userEmail: session?.user?.email,
        userName: billingDetails?.fullName || session?.user?.name,
        billedName: billingDetails?.fullName || null,
        billedPhone: billingDetails?.phone || null,
        billedCountry: billingDetails?.country || null,
        billedState: billingDetails?.state || null,
      });
      console.log(`Successfully saved pending order: ${order.id}`);
    } catch (dbErr) {
      console.error('Failed to save pending order to DB:', dbErr);
      // Try insert without billing fields if they don't exist in schema yet
      try {
        await db.insert(orders).values({
          id: crypto.randomUUID(),
          userId: session?.user?.id,
          orderId: order.id,
          amount: amount,
          status: 'pending',
          userEmail: session?.user?.email,
          userName: billingDetails?.fullName || session?.user?.name,
        });
        console.log(`Saved pending order without billing fields: ${order.id}`);
      } catch (dbErr2) {
        console.error('Failed to save order (fallback):', dbErr2);
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Razorpay Error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

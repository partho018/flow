import { NextResponse } from 'next/server';
import { db, orders } from "@workspace/db";
import { auth } from "@/auth";
import crypto from "crypto";

export async function GET() {
  try {
    const session = await auth();
    const orderId = `order_debug_${crypto.randomBytes(4).toString('hex')}`;
    
    console.log("Debug Create Order - Session:", JSON.stringify(session));
    
    try {
      const result = await db.insert(orders).values({
        id: crypto.randomUUID(),
        userId: session?.user?.id || null,
        orderId: orderId,
        amount: 499,
        status: 'pending',
        userEmail: session?.user?.email || 'debug@example.com',
        userName: session?.user?.name || 'Debug User',
        billedName: 'Debug Billed',
        billedPhone: '+910000000000',
        billedCountry: 'India',
        billedState: 'State',
      }).returning();
      
      return NextResponse.json({ success: true, result });
    } catch (dbErr) {
      console.error("DB Insert Error:", dbErr);
      return NextResponse.json({ 
        success: false, 
        error: (dbErr as Error).message,
        detail: (dbErr as any).detail,
        code: (dbErr as any).code,
        session: session
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

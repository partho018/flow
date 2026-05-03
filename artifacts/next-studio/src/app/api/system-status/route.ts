import { NextRequest, NextResponse } from "next/server";
import { db, settings } from "@workspace/db";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const [record] = await db
      .select()
      .from(settings)
      .where(eq(settings.id, "user_SYSTEM_GLOBAL"))
      .limit(1);

    const config = record?.data?.config || { maintenance: false };
    
    return NextResponse.json({ 
      maintenance: config.maintenance === true,
      signups: config.signups !== false 
    });
  } catch (error) {
    console.error("System status fetch error:", error);
    return NextResponse.json({ maintenance: false, signups: true });
  }
}

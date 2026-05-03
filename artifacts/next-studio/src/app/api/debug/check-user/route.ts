import { NextResponse } from 'next/server';
import { db } from "@workspace/db";
import { users } from "@workspace/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ authenticated: false, session });
    }

    const userInDb = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    
    return NextResponse.json({ 
      authenticated: true, 
      sessionUserId: session.user.id,
      foundInDb: userInDb.length > 0,
      user: userInDb[0] || null
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

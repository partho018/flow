import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

export const dynamic = 'force-dynamic';

// Debug endpoint - shows raw counts from DB to diagnose data issues
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Raw SQL query - NextAuth table is "user" (singular), profiles uses snake_case columns
    const userCountResult = await db.execute(sql`SELECT COUNT(*) as count FROM "user"`);
    
    let profileCountResult, userRows, profileRows;
    try {
      profileCountResult = await db.execute(sql`SELECT COUNT(*) as count FROM "profiles"`);
      profileRows = await db.execute(sql`SELECT id, user_id, name, email, plan, status FROM "profiles" LIMIT 10`);
    } catch(e) {
      profileCountResult = { rows: [{ count: 'TABLE_ERROR: ' + (e as Error).message }] };
      profileRows = { rows: [] };
    }

    userRows = await db.execute(sql`SELECT id, name, email, "emailVerified" FROM "user" LIMIT 10`);

    return NextResponse.json({
      userCount: userCountResult.rows[0]?.count,
      profileCount: profileCountResult.rows[0]?.count,
      users: userRows.rows,
      profiles: profileRows.rows,
      sessionUserId: session.user?.id,
      sessionUserEmail: session.user?.email,
    });
  } catch (error) {
    return NextResponse.json({ 
      error: (error as Error).message,
      stack: (error as Error).stack?.split('\n').slice(0, 5)
    }, { status: 500 });
  }

}

import { NextRequest, NextResponse } from "next/server";
import { db, settings, users } from "@workspace/db";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // We fetch global settings from the admin's record
    // Admin email is hardcoded in auth.ts
    const adminUser = await db.query.users.findFirst({
      where: eq(users.email, "parthosamadder00@gmail.com")
    });

    if (!adminUser) return NextResponse.json({ enabled: false });

    const record = await db.query.settings.findFirst({
      where: eq(settings.userId, adminUser.id)
    });

    if (!record || !record.data?.announcement) {
      return NextResponse.json({ enabled: false });
    }

    return NextResponse.json(record.data.announcement);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch announcement" }, { status: 500 });
  }
}

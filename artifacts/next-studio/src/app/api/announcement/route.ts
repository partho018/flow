import { NextRequest, NextResponse } from "next/server";
import { db, settings, users } from "@workspace/db";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const record = await db.query.settings.findFirst({
      where: eq(settings.userId, "SYSTEM_GLOBAL")
    });

    if (!record || !record.data?.announcement) {
      return NextResponse.json({ enabled: false });
    }

    return NextResponse.json(record.data.announcement);
  } catch (error) {
    console.error("Announcement fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch announcement" }, { status: 500 });
  }
}

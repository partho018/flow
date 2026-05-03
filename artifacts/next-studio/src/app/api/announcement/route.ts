import { NextRequest, NextResponse } from "next/server";
import { db, settings, users } from "@workspace/db";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Try to find settings by hardcoded admin email
    const adminUser = await db.query.users.findFirst({
      where: eq(users.email, "parthosamadder00@gmail.com")
    });

    let record;
    if (adminUser) {
      record = await db.query.settings.findFirst({
        where: eq(settings.userId, adminUser.id)
      });
    }

    // 2. If not found or not enabled, try to find ANY record with an enabled announcement
    // This handles cases where the admin might have used a different email or settings were saved with userId: null
    if (!record || !record.data?.announcement?.enabled) {
      const allSettings = await db.query.settings.findMany();
      record = allSettings.find(s => s.data?.announcement?.enabled);
    }

    if (!record || !record.data?.announcement) {
      return NextResponse.json({ enabled: false });
    }

    return NextResponse.json(record.data.announcement);
  } catch (error) {
    console.error("Announcement fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch announcement" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db, settings, users } from "@workspace/db";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const [record] = await db
      .select()
      .from(settings)
      .where(eq(settings.id, "user_SYSTEM_GLOBAL"))
      .limit(1);

    if (!record || !record.data || !record.data.announcement) {
      return NextResponse.json({ enabled: false });
    }

    // Return the announcement object, ensuring it has the expected fields
    return NextResponse.json({
      enabled: record.data.announcement.enabled ?? false,
      text: record.data.announcement.text ?? "",
      type: record.data.announcement.type ?? "update"
    });
  } catch (error) {
    console.error("Announcement fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch announcement" }, { status: 500 });
  }
}

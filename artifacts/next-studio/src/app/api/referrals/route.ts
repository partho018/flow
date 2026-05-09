import { NextRequest, NextResponse } from "next/server";
import { db, profiles } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use name as the referral code (slugified)
    const userSlug = session.user.name?.toLowerCase().replace(/\s+/g, '-') || "user";

    const referredUsers = await db.query.profiles.findMany({
      where: eq(profiles.referredBy, userSlug),
      columns: {
        name: true,
        email: true,
        plan: true,
        joined: true,
      }
    });

    return NextResponse.json({ referrals: referredUsers });
  } catch (err) {
    console.error("Referrals API Error:", err);
    return NextResponse.json({ error: "Failed to fetch referrals" }, { status: 500 });
  }
}

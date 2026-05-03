export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { db, followers, profiles, users } from "@workspace/db";
import { count, eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id)
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id)
    });
    
    // Create profile if missing
    if (!profile) {
      const newProfile = {
        id: `p_${session.user.id}`,
        userId: session.user.id,
        name: session.user.name || "User",
        email: session.user.email || "",
        plan: "free",
        status: "active",
        joined: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        dmsUsed: 0,
        dmsLimit: 100,
        followersCount: 0,
        rev: 0,
        autos: 0,
        creditBonus: 0,
        commentsCaught: 0
      };
      await db.insert(profiles).values(newProfile);
      profile = newProfile as any;
    }

    if (!profile) {
      return NextResponse.json({ error: "Could not establish user profile" }, { status: 500 });
    }

    // Try to get fresh data from Instagram if we have a token
    const token = (profile as any).accessToken;
    let currentFollowers = (profile as any).followersCount || 0;

    if (token) {
      try {
        const res = await fetch(`https://graph.instagram.com/v21.0/me?fields=id,username,profile_picture_url,followers_count,follows_count,media_count,name&access_token=${token}`);
        const data = await res.json();
        
        if (data.id) {
          const updateData = {
            followersCount: data.followers_count || 0,
            followsCount: data.follows_count || 0,
            mediaCount: data.media_count || 0,
            igImage: data.profile_picture_url || null,
            igUsername: data.username || null
          };
          
          await db.update(profiles).set(updateData).where(eq(profiles.id, profile.id));
          
          return NextResponse.json({
            status: profile.status,
            plan: profile.plan,
            dmsSent: profile.dmsUsed || 0,
            followersCount: data.followers_count || 0,
            followsCount: data.follows_count || 0,
            mediaCount: data.media_count || 0,
            commentsCaught: profile.commentsCaught || 0,
            igImage: data.profile_picture_url || null,
            igUsername: data.username || null,
            hasPassword: !!user.password
          });
        }
      } catch (e) {
        console.error("Failed to fetch fresh IG data", e);
      }
    }

    // Get number of NEW followers tracked since last refresh (optional logic)
    const newFollowersRes = await db.select({ value: count() }).from(followers).where(eq(followers.profileId, profile.id));
    const newFollowersCount = newFollowersRes[0]?.value || 0;

    return NextResponse.json({
      status: profile.status,
      plan: profile.plan,
      dmsSent: profile.dmsUsed || 0,
      followersCount: currentFollowers,
      commentsCaught: profile.commentsCaught || 0,
      igUsername: (profile as any).igUsername || null,
      igImage: (profile as any).igImage || null,
      linkClicks: 0,
      hasPassword: !!user.password
    });
  } catch (err) {
    console.error("Stats API Error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

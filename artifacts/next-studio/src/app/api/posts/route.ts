import { NextRequest, NextResponse } from "next/server";

interface IgMediaItem {
  id: string;
  caption?: string;
  media_type?: string;
  like_count?: number;
  comments_count?: number;
  timestamp?: string;
  thumbnail_url?: string;
  media_url?: string;
}

interface IgMediaResponse {
  data?: IgMediaItem[];
  error?: { message: string; type: string; code: number };
}

import { db, profiles } from "@workspace/db";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id)
    });

    const token = req.cookies.get("ig_token")?.value || profile?.accessToken || process.env.ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Instagram not connected" }, { status: 401 });
    }

    const url = new URL(`https://graph.instagram.com/v18.0/me/media`);
    url.searchParams.set("fields", "id,caption,media_type,like_count,comments_count,timestamp,thumbnail_url,media_url");
    url.searchParams.set("access_token", token);
    url.searchParams.set("limit", "20");
    const response = await fetch(url.toString());
    const data = (await response.json()) as IgMediaResponse;
    if (!response.ok) return NextResponse.json({ error: "Instagram API error" }, { status: 502 });
    const posts = (data.data || []).map((p) => {
      const rawThumb = p.thumbnail_url || p.media_url || null;
      return {
        id: p.id,
        caption: p.caption || "",
        type: p.media_type === "VIDEO" ? "REEL" : "POST",
        likes: p.like_count || 0,
        comments: p.comments_count || 0,
        thumbnail: rawThumb ? `/api/image?url=${encodeURIComponent(rawThumb)}` : null,
      };
    });
    return NextResponse.json({ posts }, { status: 200 });
  } catch (err) {
    console.error("Posts fetch error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

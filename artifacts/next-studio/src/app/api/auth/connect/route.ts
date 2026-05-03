import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const APP_URL = process.env.APP_URL || "http://localhost:3000";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized. Please login with Google first." }, { status: 401 });
  }

  const appId = process.env.FACEBOOK_APP_ID || INSTAGRAM_APP_ID;

  if (!appId) {
    return NextResponse.json({ error: "App ID not configured" }, { status: 500 });
  }
  const redirectUri = `${APP_URL}/api/auth/callback`;
  const scope = "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments";
  const url = `https://www.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;
  return NextResponse.redirect(url);
}

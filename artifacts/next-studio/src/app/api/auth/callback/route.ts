
import { NextRequest, NextResponse } from "next/server";
import { db, profiles } from "@workspace/db";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";


const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
const APP_URL = process.env.APP_URL || "http://localhost:3000";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized. Please login with Google first." }, { status: 401 });
  }

  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }


  const redirectUri = `${APP_URL}/api/auth/callback`;

  try {
    // 1. Exchange code for Short-Lived Access Token
    const tokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: String(INSTAGRAM_APP_ID),
        client_secret: String(INSTAGRAM_APP_SECRET),
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code: String(code),
      }),
    });
    const tokenData = await tokenRes.json();

    if (tokenData.error_message || tokenData.error) {
      console.error("Instagram token exchange error", tokenData);
      return NextResponse.redirect(new URL(`/?ig_error=${encodeURIComponent(tokenData.error_message || "Token exchange failed")}`, req.url));
    }

    const shortToken = tokenData.access_token;
    const igUserId = tokenData.user_id || "";

    if (!shortToken) {
      return NextResponse.redirect(new URL(`/?ig_error=${encodeURIComponent("No access token received")}`, req.url));
    }

    // 2. Exchange for Long-Lived Access Token (60 days)
    // For Instagram Login for Business, we use graph.facebook.com to exchange
    const longTokenRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${INSTAGRAM_APP_ID}&client_secret=${INSTAGRAM_APP_SECRET}&fb_exchange_token=${shortToken}`
    );
    const longTokenData = await longTokenRes.json();
    const finalToken = longTokenData.access_token || shortToken;

    // 3. Fetch Instagram Business Profile Details
    // We use graph.facebook.com/v18.0/me to get the business account info
    const profileRes = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,username,followers_count,profile_picture_url&access_token=${finalToken}`
    );
    const profileData = await profileRes.json();
    
    if (profileData.error) {
       console.error("Profile fetch error", profileData.error);
       // Fallback to basic me if business me fails
       const basicRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${finalToken}`);
       const basicData = await basicRes.json();
       profileData.username = basicData.username;
       profileData.id = basicData.id;
    }

    const username = profileData.username || igUserId || "user";
    const followersCount = profileData.followers_count || 0;
    const profileImage = profileData.profile_picture_url || "";

    // 4. SAVE/UPDATE PROFILE IN DATABASE
    // We store the token which will be used for replying to comments
    await db.insert(profiles).values({
      id: String(profileData.id || igUserId),
      userId: session.user.id,
      name: username,
      email: `${username}@instagram.com`,
      joined: new Date().toISOString(),
      plan: "free",
      status: "active",
      followersCount: followersCount,
      igUsername: username,
      igImage: profileImage,
      accessToken: finalToken,
      updatedAt: new Date()
    }).onConflictDoUpdate({
      target: profiles.id,
      set: {
        userId: session.user.id,
        name: username,
        followersCount: followersCount,
        igUsername: username,
        igImage: profileImage,
        accessToken: finalToken,
        updatedAt: new Date()
      }
    });


    const redirectUrl = new URL(`/?ig_connected=true&ig_username=${encodeURIComponent(username)}&ig_user_id=${profileData.id || igUserId}&ig_image=${encodeURIComponent(profileImage)}`, req.url);
    const response = NextResponse.redirect(redirectUrl);
    
    response.cookies.set("ig_token", finalToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    const errMsg = err?.message || "Connection failed. Please try again.";
    console.error("Instagram OAuth error:", errMsg, err);
    return NextResponse.redirect(new URL(`/?ig_error=${encodeURIComponent(errMsg)}`, req.url));
  }
}

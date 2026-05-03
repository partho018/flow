import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSettings, setSettings, SettingsStore } from "@/lib/settingsStore";

const ADMIN_EMAIL = "parthosamadder00@gmail.com";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const isGlobal = req.nextUrl.searchParams.get("global") === "true";
  
  // Only admin can access global settings
  if (isGlobal && session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId = isGlobal ? "SYSTEM_GLOBAL" : session.user.id;
  return NextResponse.json({ settings: await getSettings(userId) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const body = await req.json();
  if (!body.settings) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  
  const isGlobal = body.global === true;

  // Only admin can update global settings
  if (isGlobal && session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId = isGlobal ? "SYSTEM_GLOBAL" : session.user.id;
  await setSettings(userId, body.settings);
  return NextResponse.json({ ok: true });
}


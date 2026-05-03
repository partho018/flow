import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSettings, setSettings, SettingsStore } from "@/lib/settingsStore";

export async function GET(req: NextRequest) {
  const session = await auth();
  const adminAuth = req.headers.get('x-admin-auth');
  const isAdmin = adminAuth === '0000' || session?.user?.email?.toLowerCase() === 'parthosamadder00@gmail.com';
  const isGlobal = req.nextUrl.searchParams.get("global") === "true";

  if (isGlobal) {
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ settings: await getSettings("SYSTEM_GLOBAL") });
  }

  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ settings: await getSettings(session.user.id) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const adminAuth = req.headers.get('x-admin-auth');
  const isAdmin = adminAuth === '0000' || session?.user?.email?.toLowerCase() === 'parthosamadder00@gmail.com';
  
  const body = await req.json();
  const isGlobal = body.global === true;

  if (isGlobal) {
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!body.settings) return NextResponse.json({ error: "Invalid" }, { status: 400 });
    await setSettings("SYSTEM_GLOBAL", body.settings);
    return NextResponse.json({ ok: true });
  }

  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!body.settings) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  
  await setSettings(session.user.id, body.settings);
  return NextResponse.json({ ok: true });
}


import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSettings, setSettings, SettingsStore } from "@/lib/settingsStore";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ settings: await getSettings(session.user.id) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.settings) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  await setSettings(session.user.id, body.settings);
  return NextResponse.json({ ok: true });
}


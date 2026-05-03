
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  try {
    const response = await fetch(url);
    if (!response.ok) return NextResponse.json({ error: "Fetch failed" }, { status: response.status });
    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, {
      headers: { "Content-Type": response.headers.get("content-type") || "image/jpeg" }
    });
  } catch (err) {
    return NextResponse.json({ error: "Proxy error" }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@workspace/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;
    const secret = process.env.JWT_SECRET;
    if (!secret) return NextResponse.json({ error: "Missing config" }, { status: 500 });

    if (username === "admin" && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ username }, secret, { expiresIn: '1d' });
        return NextResponse.json({ token });
    }
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch(e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}


import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function verifyAuth(req: NextRequest): boolean {
  try {
    const auth = req.headers.get("authorization") || "";
    if (!auth.startsWith("Bearer ")) return false;
    const secret = process.env.JWT_SECRET;
    if (!secret) return false;
    jwt.verify(auth.slice(7), secret);
    return true;
  } catch {
    return false;
  }
}

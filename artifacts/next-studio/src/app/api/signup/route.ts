import { db } from "@workspace/db";
import { users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { normalizeEmail } from "@/lib/utils";

export async function POST(req: Request) {

  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account already exists with this email. Please login instead." },
        { status: 400 }
      );
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await db.insert(users).values({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


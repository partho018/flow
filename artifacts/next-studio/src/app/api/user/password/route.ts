import { db } from "@workspace/db";
import { users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { current, new: newPassword } = await req.json();

    if (!current || !newPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch user
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "User not found or no password set" },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(current, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Incorrect current password" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.update(users)
      .set({ password: hashedNewPassword })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

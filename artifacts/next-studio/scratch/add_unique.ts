import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

async function main() {
  try {
    console.log("Adding unique constraint to profiles(user_id)...");
    await db.execute(sql`ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id)`);
    console.log("Success!");
  } catch (e) {
    console.error("Failed:", e);
  }
}

main();

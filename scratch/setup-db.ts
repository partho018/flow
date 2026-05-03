import { db } from "../lib/db/src/index";
import { sql } from "drizzle-orm";

async function setup() {
  try {
    console.log("Creating orders table if it doesn't exist...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "orders" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text,
        "order_id" text NOT NULL,
        "payment_id" text,
        "amount" integer NOT NULL,
        "currency" text DEFAULT 'INR' NOT NULL,
        "status" text DEFAULT 'pending' NOT NULL,
        "user_email" text,
        "user_name" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("Table 'orders' ensured.");
  } catch (error) {
    console.error("Setup Error:", error);
  }
}

setup();

import { db, orders } from "../lib/db/src/index";
import { desc } from "drizzle-orm";

async function test() {
  try {
    console.log("Fetching orders...");
    const data = await db.select().from(orders).orderBy(desc(orders.createdAt));
    console.log("Total orders found:", data.length);
    console.log("Orders:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Database Error:", error);
  }
}

test();

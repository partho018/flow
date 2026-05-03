import { db, settings } from "@workspace/db";
import { eq } from "drizzle-orm";
async function check() {
  const global = await db.query.settings.findFirst({
    where: eq(settings.userId, "SYSTEM_GLOBAL")
  });
  console.log("GLOBAL SETTINGS:", JSON.stringify(global, null, 2));
  process.exit(0);
}
check();

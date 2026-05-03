import { db, users } from "@workspace/db";
async function check() {
  const allUsers = await db.select().from(users);
  console.log(JSON.stringify(allUsers, null, 2));
  process.exit(0);
}
check();

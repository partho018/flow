const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({ 
  connectionString: "postgresql://neondb_owner:npg_6DLvbRtoC7Yg@ep-wispy-dew-amw6judi-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" 
});

async function run() {
  try {
    console.log("Adding password column...");
    await pool.query('ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "password" text;');
    console.log("Column added successfully!");
  } catch (err) {
    console.error("Error adding column:", err);
  } finally {
    await pool.end();
  }
}

run();

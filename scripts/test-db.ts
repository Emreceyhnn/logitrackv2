import { config } from "dotenv";
import { sql } from "drizzle-orm";

config({ path: ".env" });

async function main() {
  try {
    const { db } = await import("../app/lib/db");
    console.log("⏳ Connecting to database...");
    const result = await db.execute(sql`SELECT NOW()`);
    console.log("✅ Connection Successful!", result);
  } catch (error) {
    console.error("❌ Connection Failed:", error);
    process.exit(1);
  }
}

main();

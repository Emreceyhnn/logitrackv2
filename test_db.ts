
import { db } from "./app/lib/db";

async function test() {
    try {
        console.log("Testing DB connection...");
        const userCount = await db.user.count();
        console.log("User count:", userCount);
        const companyCount = await db.company.count();
        console.log("Company count:", companyCount);
        console.log("DB connection successful!");
    } catch (error) {
        console.error("DB connection failed:", error);
        process.exit(1);
    } finally {
        await db.$disconnect();
    }
}

test();

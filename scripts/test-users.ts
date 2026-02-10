import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("⏳ Creating a test user...");
    const timestamp = Date.now();

    // Create role first
    const role = await prisma.role.upsert({
      where: { name: "TEST_ROLE" },
      update: {},
      create: { name: "TEST_ROLE" },
    });

    const newUser = await prisma.user.create({
      data: {
        username: `testuser_${timestamp}`,
        email: `test${timestamp}@example.com`,
        name: `Test`,
        surname: `User ${timestamp}`,
        roleId: role.id,
      },
    });
    console.log("✅ User created:", newUser);

    console.log("⏳ Fetching all users...");
    const allUsers = await prisma.user.findMany({
      include: { role: true },
    });
    console.log("✅ All Users:", allUsers);
  } catch (error) {
    console.error("❌ Test Failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

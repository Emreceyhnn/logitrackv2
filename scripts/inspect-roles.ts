import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.role.findMany({
    select: {
      id: true,
      name: true,
      permissions: true,
    },
  });
  console.log("Current Roles in Database:", JSON.stringify(roles, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.role.findMany();
  console.log("Roles found:", roles);

  const user = await prisma.user.findFirst({
    where: { id: "usr_001" },
    include: { role: true },
  });
  console.log("User usr_001:", user);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

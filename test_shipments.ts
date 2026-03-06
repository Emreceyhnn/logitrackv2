import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const companyId = "cmlgt985b0003x0cuhtyxoihd";
  const shipments = await prisma.shipment.findMany({
    where: { companyId },
  });
  console.log("Shipments found:", shipments.length);
  console.log("First shipment:", shipments[0]);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

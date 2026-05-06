import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const fifteenDaysFromNow = new Date();
  fifteenDaysFromNow.setDate(now.getDate() + 15);

  const expiringDocs = await prisma.document.findMany({
    where: {
      expiryDate: { lte: fifteenDaysFromNow },
    },
    include: {
      vehicle: true,
      driver: { include: { user: true } },
    }
  });

  console.log(`Found ${expiringDocs.length} expiring documents.`);
  expiringDocs.forEach(doc => {
    console.log(`- ID: ${doc.id}, Name: ${doc.name}, Expiry: ${doc.expiryDate}, CompanyId: ${doc.companyId}`);
  });

  const vehicles = await prisma.vehicle.findMany({
    where: {
      OR: [
        { registrationExpiry: { lte: fifteenDaysFromNow } },
        { inspectionExpiry: { lte: fifteenDaysFromNow } },
      ]
    }
  });

  console.log(`Found ${vehicles.length} vehicles with expiring registration/inspection.`);
  vehicles.forEach(v => {
    console.log(`- Plate: ${v.plate}, RegExpiry: ${v.registrationExpiry}, InspExpiry: ${v.inspectionExpiry}, CompanyId: ${v.companyId}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const COMPANY_ID = 'cmlgt985b0003x0cuhtyxoihd';

async function verify() {
    console.log(`🔍 Verifying data for Company ID: ${COMPANY_ID}`);

    const counts = {
        companies: await prisma.company.count({ where: { id: COMPANY_ID } }),
        users: await prisma.user.count({ where: { companyId: COMPANY_ID } }),
        warehouses: await prisma.warehouse.count({ where: { companyId: COMPANY_ID } }),
        customers: await prisma.customer.count({ where: { companyId: COMPANY_ID } }),
        vehicles: await prisma.vehicle.count({ where: { companyId: COMPANY_ID } }),
        drivers: await prisma.driver.count({ where: { companyId: COMPANY_ID } }),
        inventory: await prisma.inventory.count({ where: { companyId: COMPANY_ID } }),
        routes: await prisma.route.count({ where: { companyId: COMPANY_ID } }),
        shipments: await prisma.shipment.count({ where: { companyId: COMPANY_ID } }),
        issues: await prisma.issue.count({ where: { companyId: COMPANY_ID } }),
    };

    console.table(counts);

    if (Object.values(counts).some(c => c === 0)) {
        console.warn('⚠️ Some tables have 0 records!');
    } else {
        console.log('✅ All tables have data!');
    }
}

verify()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const MOCK_DATA_PATH = path.join(process.cwd(), 'app/lib/mockData.json');

async function main() {
    console.log('🌱 Starting database seeding...');

    // 1. Read Mock Data
    const rawData = fs.readFileSync(MOCK_DATA_PATH, 'utf-8');
    const mockData = JSON.parse(rawData);

    // 2. Define Default Company
    const COMPANY_ID = 'comp_logitrack_01';
    const COMPANY_NAME = 'LogiTrack Inc.';

    // 3. Clean Database (in reverse dependency order)
    console.log('🧹 Cleaning existing data...');
    await prisma.shipment.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.maintenanceRecord.deleteMany();
    await prisma.driver.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.warehouse.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    await prisma.company.deleteMany();

    // 4. Create Company
    console.log('🏢 Creating default company...');
    await prisma.company.create({
        data: {
            id: COMPANY_ID,
            name: COMPANY_NAME,
        },
    });

    // 5. Create Roles
    console.log(`👮 Creating ${mockData.auth.roles.length} roles...`);
    for (const role of mockData.auth.roles) {
        await prisma.role.create({
            data: {
                id: role.id,
                name: role.name,
                description: role.description,
                permissions: role.permissions,
            },
        });
    }

    // 6. Create Users
    console.log(`👤 Creating ${mockData.auth.users.length} users...`);
    const hashedPassword = await bcrypt.hash('password123', 10);
    const createdUserIds = new Set<string>();

    for (const user of mockData.auth.users) {
        await prisma.user.create({
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.fullName.split(' ')[0],
                surname: user.fullName.split(' ').slice(1).join(' '),
                password: hashedPassword,
                avatarUrl: user.avatarUrl,
                roleId: user.roleId,
                status: user.status,
                companyId: COMPANY_ID,
                lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : null,
            },
        });
        createdUserIds.add(user.id);
    }

    // 7. Create Warehouses
    console.log(`🏭 Creating ${mockData.warehouses.length} warehouses...`);
    for (const wh of mockData.warehouses) {
        let managerId = wh.managerId;
        if (managerId && !createdUserIds.has(managerId)) {
            console.warn(`⚠️ Warehouse manager ${managerId} not found in users. Skipping manager assignment.`);
            managerId = undefined;
        }

        await prisma.warehouse.create({
            data: {
                id: wh.id,
                code: wh.code,
                name: wh.name,
                type: wh.type,
                address: `${wh.address.line1}, ${wh.address.district}`,
                city: wh.address.city,
                country: wh.address.country,
                lat: wh.address.coordinates.lat,
                lng: wh.address.coordinates.lng,
                managerId: managerId,
                companyId: COMPANY_ID,
            },
        });
    }

    // 8. Create Customers
    console.log(`🤝 Creating ${mockData.customers.length} customers...`);
    for (const cust of mockData.customers) {
        await prisma.customer.create({
            data: {
                id: cust.id,
                code: cust.code,
                name: cust.name,
                industry: cust.industry,
                taxId: cust.taxId,
                email: cust.contacts[0]?.email,
                phone: cust.contacts[0]?.phone,
                address: cust.billingAddress ? `${cust.billingAddress.line1}, ${cust.billingAddress.district}, ${cust.billingAddress.city}` : undefined,
                companyId: COMPANY_ID,
            },
        });
    }

    // 9. Create Vehicles & Maintenance
    console.log(`🚛 Creating ${mockData.fleet.length} vehicles...`);
    for (const veh of mockData.fleet) {
        await prisma.vehicle.create({
            data: {
                id: veh.id,
                fleetNo: veh.fleetNo,
                plate: veh.plate,
                type: veh.type,
                brand: veh.brand,
                model: veh.model,
                year: veh.year,
                status: veh.status === 'IDLE' ? 'AVAILABLE' : veh.status, // Map 'IDLE' to 'AVAILABLE' if needed, assuming enum match
                maxLoadKg: veh.specs.maxLoadKg,
                fuelType: veh.specs.fuelType,
                currentLat: veh.currentStatus?.location?.lat,
                currentLng: veh.currentStatus?.location?.lng,
                fuelLevel: veh.currentStatus?.fuelLevelPct,
                odometerKm: veh.currentStatus?.odometerKm,
                companyId: COMPANY_ID,
                maintenanceRecords: {
                    create: veh.maintenance?.history?.map((hist: any) => ({
                        type: hist.serviceType,
                        date: new Date(hist.date),
                        cost: hist.cost,
                        description: `Technician: ${hist.technician}`,
                    })) || []
                }
            },
        });
    }

    // 10. Create Drivers
    console.log(`👨‍✈️ Creating ${mockData.staff.drivers.length} drivers...`);
    for (const drv of mockData.staff.drivers) {
        let userId = drv.userId;

        // Check if userId is valid or needs to be generated
        if (!userId) {
            // Driver has no assigned user. Since schema requires it, we create one.
            userId = `usr_gen_${drv.id}`;
            const newUserData = {
                id: userId,
                username: drv.email.split('@')[0],
                email: drv.email,
                name: drv.fullName.split(' ')[0],
                surname: drv.fullName.split(' ').slice(1).join(' '),
                password: hashedPassword,
                roleId: 'role_driver',
                status: 'ACTIVE',
                companyId: COMPANY_ID,
                // No avatar for generated users?
            };

            // Ensure role exists (it should from step 5)
            // Ensure email not taken
            const existingUser = await prisma.user.findUnique({ where: { email: drv.email } });
            if (existingUser) {
                console.log(`⚠️ User with email ${drv.email} already exists (${existingUser.id}). Linking driver ${drv.id} to it.`);
                userId = existingUser.id;
            } else {
                console.log(`➕ Generating user ${userId} for driver ${drv.id}...`);
                await prisma.user.create({ data: newUserData as any }); // Cast to any to avoid strict type issues with large object
                createdUserIds.add(userId);
            }
        } else if (userId && !createdUserIds.has(userId)) {
            console.warn(`⚠️ Driver linked user ${userId} not found in created users. Driver creation might fail.`);
        }

        await prisma.driver.create({
            data: {
                id: drv.id,
                userId: userId!, // We ensured it exists or created it
                employeeId: drv.employeeId,
                licenseNumber: drv.licenses?.[0]?.type || 'UNKNOWN',
                licenseType: drv.licenses?.map((l: any) => l.type).join(','),
                licenseExpiry: drv.licenses?.[0]?.expiresOn ? new Date(drv.licenses[0].expiresOn) : null,
                phone: drv.phone,
                status: drv.status,
                companyId: COMPANY_ID,
                currentVehicleId: drv.currentVehicleId,
                homeBaseWarehouseId: drv.homeBaseWarehouseId,
                safetyScore: drv.metrics?.safetyScore,
                efficiencyScore: drv.metrics?.efficiencyScore,
                rating: drv.rating?.avg,
            },
        });
    }
    // 11. Create Inventory
    console.log(`📦 Creating inventory items...`);
    for (const stock of mockData.inventory.stock) {
        const catalogItem = mockData.inventory.catalog.find((c: any) => c.id === stock.skuId);
        if (!catalogItem) {
            console.warn(`⚠️ Catalog item not found for stock SKU: ${stock.skuId}`);
            continue;
        }

        await prisma.inventory.create({
            data: {
                warehouseId: stock.warehouseId,
                sku: catalogItem.code,
                name: catalogItem.name,
                quantity: stock.quantity,
                minStock: catalogItem.reorderPoint || 0,
                companyId: COMPANY_ID,
            },
        });
    }

    // 12. Create Shipments
    console.log(`🚚 Creating ${mockData.shipments.length} shipments...`);
    for (const shp of mockData.shipments) {
        // Extract origin address string
        let originStr = "Unknown";
        if (shp.origin.type === 'WAREHOUSE') {
            const wh = mockData.warehouses.find((w: any) => w.id === shp.origin.warehouseId);
            originStr = wh ? wh.name : shp.origin.warehouseId;
        } else {
            originStr = shp.origin.address || "Unknown Origin";
        }

        // Extract destination address string
        let destStr = shp.destination.address || "Unknown Destination";

        // Resolve driver from route
        let driverId = undefined;
        if (shp.assignedTo?.routeId) {
            const route = mockData.routes?.find((r: any) => r.id === shp.assignedTo.routeId);
            if (route && route.driverId) {
                driverId = route.driverId;
            }
        }

        await prisma.shipment.create({
            data: {
                id: shp.id,
                trackingId: shp.id, // Using ID as tracking ID for now
                customerId: shp.customerId,
                driverId: driverId,
                status: shp.status,
                origin: originStr,
                destination: destStr,
                companyId: COMPANY_ID,
                createdAt: shp.dates.created ? new Date(shp.dates.created) : undefined,
            },
        });
    }

    console.log('✅ Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

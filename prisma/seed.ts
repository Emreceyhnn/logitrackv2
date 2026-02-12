import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const MOCK_DATA_PATH = path.join(process.cwd(), "app/lib/mockData.json");

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Read Mock Data
  const rawData = fs.readFileSync(MOCK_DATA_PATH, "utf-8");
  const mockData = JSON.parse(rawData);

  // 2. Define Default Company
  const COMPANY_ID = "cmlgt985b0003x0cuhtyxoihd";
  const COMPANY_NAME = "LogiTrack Inc.";

  // 3. Clean Database (in reverse dependency order)
  console.log("🧹 Cleaning existing data...");
  try {
    await prisma.issue.deleteMany();
    await prisma.document.deleteMany();
    await prisma.shipmentHistory.deleteMany();
    await prisma.shipment.deleteMany();
    await prisma.route.deleteMany();
    await prisma.inventoryMovement.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.maintenanceRecord.deleteMany();
    await prisma.driver.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.warehouse.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    await prisma.company.deleteMany();
  } catch (error) {
    console.warn("⚠️ Error cleaning data (migth be first run):", error);
  }

  // 4. Create Company
  console.log("🏢 Creating default company...");
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
  const hashedPassword = await bcrypt.hash("password123", 10);
  const createdUserIds = new Set<string>();

  for (const user of mockData.auth.users) {
    await prisma.user.create({
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.fullName.split(" ")[0],
        surname: user.fullName.split(" ").slice(1).join(" "),
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
        address: cust.billingAddress
          ? `${cust.billingAddress.line1}, ${cust.billingAddress.district}, ${cust.billingAddress.city}`
          : undefined,
        companyId: COMPANY_ID,
      },
    });
  }

  // 9. Create Vehicles & Maintenance
  console.log(`🚛 Creating ${mockData.fleet.length} vehicles...`);
  // Pre-create vehicles to be referenced by drivers
  for (const veh of mockData.fleet) {
    const currentOdometer = veh.currentStatus?.odometerKm || 0;
    const nextService =
      veh.maintenance?.nextServiceKm || currentOdometer + 10000;
    const avgConsumption = veh.specs?.mpg
      ? 235.21 / veh.specs.mpg
      : Math.random() * 5 + 8; // Random between 8-13 L/100km

    await prisma.vehicle.create({
      data: {
        id: veh.id,
        fleetNo: veh.fleetNo,
        plate: veh.plate,
        type: veh.type,
        brand: veh.brand,
        model: veh.model,
        year: veh.year,
        status: veh.status === "IDLE" ? "AVAILABLE" : veh.status,
        maxLoadKg: veh.specs.maxLoadKg,
        fuelType: veh.specs.fuelType,
        currentLat: veh.currentStatus?.location?.lat,
        currentLng: veh.currentStatus?.location?.lng,
        fuelLevel: veh.currentStatus?.fuelLevelPct,
        odometerKm: currentOdometer,
        nextServiceKm: nextService,
        avgFuelConsumption: parseFloat(avgConsumption.toFixed(1)),
        companyId: COMPANY_ID,
        maintenanceRecords: {
          create:
            veh.maintenance?.history?.map((hist: any) => ({
              type: hist.serviceType,
              date: new Date(hist.date),
              cost: hist.cost,
              description: `Technician: ${hist.technician}`,
            })) || [],
        },
        documents: {
          create:
            veh.documents?.map((doc: any) => {
              const expiryDate = doc.expiresOn ? new Date(doc.expiresOn) : null;
              const now = new Date();
              let docStatus = "ACTIVE";

              if (!expiryDate) {
                docStatus = "MISSING";
              } else if (expiryDate < now) {
                docStatus = "EXPIRED";
              } else {
                const oneMonthLater = new Date();
                oneMonthLater.setMonth(now.getMonth() + 1);
                if (expiryDate <= oneMonthLater) {
                  docStatus = "EXPIRING_SOON";
                }
              }

              return {
                type: doc.type,
                name: `${doc.type} for ${veh.plate}`,
                url: `/documents/${veh.plate}/${doc.type}.pdf`,
                expiryDate: expiryDate,
                status: docStatus,
                companyId: COMPANY_ID,
              };
            }) || [],
        },
      },
    });
  }

  // 10. Create Drivers
  console.log(`👨‍✈️ Creating ${mockData.staff.drivers.length} drivers...`);
  for (const drv of mockData.staff.drivers) {
    let userId = drv.userId;

    if (!userId) {
      userId = `usr_gen_${drv.id}`;
      const newUserData = {
        id: userId,
        username: drv.email.split("@")[0],
        email: drv.email,
        name: drv.fullName.split(" ")[0],
        surname: drv.fullName.split(" ").slice(1).join(" "),
        password: hashedPassword,
        roleId: "role_driver",
        status: "ACTIVE",
        companyId: COMPANY_ID,
      };

      const existingUser = await prisma.user.findUnique({
        where: { email: drv.email },
      });
      if (existingUser) {
        userId = existingUser.id;
      } else {
        await prisma.user.create({ data: newUserData as any });
        createdUserIds.add(userId);
      }
    }

    await prisma.driver.create({
      data: {
        id: drv.id,
        userId: userId!,
        employeeId: drv.employeeId,
        licenseNumber: drv.licenses?.[0]?.type || "UNKNOWN",
        licenseType: drv.licenses?.map((l: any) => l.type).join(","),
        licenseExpiry: drv.licenses?.[0]?.expiresOn
          ? new Date(drv.licenses[0].expiresOn)
          : null,
        phone: drv.phone,
        status: drv.status,
        companyId: COMPANY_ID,
        currentVehicleId: drv.currentVehicleId,
        homeBaseWarehouseId: drv.homeBaseWarehouseId,
        safetyScore: drv.metrics?.safetyScore,
        efficiencyScore: drv.metrics?.efficiencyScore,
        rating: drv.rating?.avg,
        documents: {
          create:
            drv.licenses?.map((lic: any) => {
              const expiryDate = lic.expiresOn ? new Date(lic.expiresOn) : null;
              const now = new Date();
              let docStatus = "ACTIVE";

              if (!expiryDate) {
                docStatus = "MISSING";
              } else if (expiryDate < now) {
                docStatus = "EXPIRED";
              } else {
                const oneMonthLater = new Date();
                oneMonthLater.setMonth(now.getMonth() + 1);
                if (expiryDate <= oneMonthLater) {
                  docStatus = "EXPIRING_SOON";
                }
              }

              return {
                type: "LICENSE",
                name: `License ${lic.type}`,
                url: `/documents/drivers/${drv.id}/${lic.type}.pdf`,
                expiryDate: expiryDate,
                status: docStatus,
                companyId: COMPANY_ID,
              };
            }) || [],
        },
      },
    });
  }

  // 11. Create Inventory
  console.log(`📦 Creating inventory items...`);
  for (const stock of mockData.inventory.stock) {
    const catalogItem = mockData.inventory.catalog.find(
      (c: any) => c.id === stock.skuId
    );
    if (!catalogItem) {
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

  // 12. Create Inventory Movements
  console.log(`🚚 Creating inventory movements...`);
  if (mockData.inventory.movements) {
    for (const mov of mockData.inventory.movements) {
      const catalogItem = mockData.inventory.catalog.find(
        (c: any) => c.id === mov.skuId
      );
      if (!catalogItem) {
        continue;
      }

      await prisma.inventoryMovement.create({
        data: {
          id: mov.id,
          warehouseId: mov.warehouseId,
          sku: catalogItem.code,
          quantity: mov.qty,
          type: mov.type,
          date: new Date(mov.timestamp),
          companyId: COMPANY_ID,
          // Optionally assign a user if available in mock data or pick a random one,
          // but for now leaving it null or assigning a default if needed.
          // The mock data doesn't seem to have userId for movements explicitly,
          // but we could assign it to a warehouse manager if we wanted to be fancy.
        },
      });
    }
  }

  // 12. Create Routes
  console.log(`📍 Creating ${mockData.routes?.length || 0} routes...`);
  if (mockData.routes) {
    for (const route of mockData.routes) {
      await prisma.route.create({
        data: {
          id: route.id,
          name: route.code,
          status:
            route.status === "IN_PROGRESS"
              ? "ACTIVE"
              : route.status === "PENDING"
                ? "PLANNED"
                : "COMPLETED", // Mapping
          date: new Date(route.schedule.plannedStart),
          startTime: new Date(route.schedule.plannedStart),
          endTime: new Date(route.schedule.plannedEnd),
          distanceKm: route.metrics.totalDistanceKm,
          durationMin: 0,
          driverId: route.driverId,
          vehicleId: route.vehicleId,
          companyId: COMPANY_ID,
        },
      });
    }
  }

  // 13. Create Shipments
  console.log(`🚚 Creating ${mockData.shipments.length} shipments...`);
  for (const shp of mockData.shipments) {
    let originStr = "Unknown";
    if (shp.origin.type === "WAREHOUSE") {
      const wh = mockData.warehouses.find(
        (w: any) => w.id === shp.origin.warehouseId
      );
      originStr = wh ? wh.name : shp.origin.warehouseId;
    } else {
      originStr = shp.origin.address || "Unknown Origin";
    }

    const destStr = shp.destination.address || "Unknown Destination";
    let driverId: string | undefined = undefined;
    let routeId: string | undefined = undefined;

    if (shp.assignedTo?.routeId) {
      const potentialRouteId = shp.assignedTo.routeId;
      const routeExists = mockData.routes?.some(
        (r: any) => r.id === potentialRouteId
      );

      if (routeExists) {
        routeId = potentialRouteId;
        const route = mockData.routes?.find((r: any) => r.id === routeId);
        if (route && route.driverId) {
          driverId = route.driverId;
        }
      } else {
        console.warn(
          `⚠️ Route ${potentialRouteId} not found for shipment ${shp.id}. Skipping route assignment.`
        );
      }
    }

    await prisma.shipment.create({
      data: {
        id: shp.id,
        trackingId: shp.id,
        customerId: shp.customerId,
        driverId: driverId,
        routeId: routeId,
        status: shp.status,
        origin: originStr,
        destination: destStr,
        itemsCount: shp.cargoDetails?.packageCount || 1,
        companyId: COMPANY_ID,
        createdAt: shp.dates.created ? new Date(shp.dates.created) : undefined,
        history: {
          create:
            shp.tracking?.milestones?.map((milestone: any) => ({
              status: milestone.status,
              location: "Unknown",
              description: milestone.status,
              createdAt: milestone.timestamp
                ? new Date(milestone.timestamp)
                : new Date(),
              createdBy: "SYSTEM",
            })) || [],
        },
      },
    });
  }

  // 14. Create Issues (Alerts)
  console.log(`⚠️ Creating queries/issues...`);
  if (mockData.monitoring?.alerts) {
    for (const alert of mockData.monitoring.alerts) {
      const vehicleId = alert.ref?.vehicleId;
      const driverId = alert.ref?.driverId;
      const shipmentId = alert.ref?.shipmentId;

      // Simple existence check or validation could go here
      // Mapping Priority/Severity
      let priority = "MEDIUM";
      if (alert.severity === "HIGH") priority = "HIGH";
      if (alert.severity === "CRITICAL") priority = "CRITICAL";
      if (alert.severity === "LOW") priority = "LOW";

      await prisma.issue.create({
        data: {
          id: alert.id,
          title: alert.type,
          description: alert.message,
          status: alert.status,
          priority: priority,
          type: alert.type,
          vehicleId: vehicleId,
          shipmentId: shipmentId,
          driverId: driverId,
          companyId: COMPANY_ID,
        },
      });
    }
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

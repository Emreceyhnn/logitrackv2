/**
 * LogiTrack v2 — Professional Seed Script
 * ======================================
 * Scale:
 * - 5 Companies
 * - 200 Vehicles (40 per company)
 * - 180 Drivers
 * - 25 Warehouses
 * - 100 Customers
 * - 1000+ Shipments
 * - Full operational history (Fuel, Maintenance, Issues, Audit Logs, Sessions)
 * - Firebase Realtime Database Sync
 * 
 * Password for all accounts: 3121283455Em!
 */

import { PrismaClient, DriverStatus, VehicleStatus, WarehouseType, RouteStatus, TrailerType, TrailerStatus, ShipmentPriority } from "@prisma/client";
import bcrypt from "bcryptjs";
import { adminDb } from "../app/lib/firebase-admin";
import rolesConfig from "../roles.json";

const prisma = new PrismaClient();

// --- Configuration ---
const HASH_ROUNDS = 10;
const PASSWORD = "3121283455Em!";
const VEHICLES_PER_COMPANY = 40;
const DRIVERS_PER_COMPANY = 36;
const WAREHOUSES_PER_COMPANY = 5;
const CUSTOMERS_PER_COMPANY = 20;

// --- Helpers ---
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
const daysFromNow = (n: number) => new Date(Date.now() + n * 86_400_000);
const pad = (n: number, len = 3) => String(n).padStart(len, "0");

// --- Static Data ---
const COMPANY_DEFS = [
  { name: "Atlas Global Logistics", slug: "ATL", city: "Istanbul" },
  { name: "Merkür Transcontinental", slug: "MRK", city: "Ankara" },
  { name: "Poseidon Maritime & Freight", slug: "PSN", city: "Izmir" },
  { name: "Titan Industrial Logistics", slug: "TCN", city: "Bursa" },
  { name: "Helios Express GmbH", slug: "HEX", city: "Antalya" },
];

const CITIES = [
  { name: "Istanbul", lat: 41.0082, lng: 28.9784 },
  { name: "Ankara", lat: 39.9208, lng: 32.8541 },
  { name: "Izmir", lat: 38.4192, lng: 27.1287 },
  { name: "Bursa", lat: 40.1885, lng: 29.0610 },
  { name: "Antalya", lat: 36.8969, lng: 30.7133 },
  { name: "Adana", lat: 37.0000, lng: 35.3213 },
  { name: "Konya", lat: 37.8746, lng: 32.4932 },
  { name: "Gaziantep", lat: 37.0662, lng: 37.3833 },
  { name: "Mersin", lat: 36.8000, lng: 34.6333 },
  { name: "Kayseri", lat: 38.7312, lng: 35.4787 },
];

const VEHICLE_BRANDS = [
  { brand: "Mercedes-Benz", models: ["Actros", "Arocs", "Atego", "Sprinter"] },
  { brand: "Volvo", models: ["FH16", "FH", "FM", "FE"] },
  { brand: "MAN", models: ["TGX", "TGS", "TGM", "TGL"] },
  { brand: "Scania", models: ["R 500", "R 450", "S 500", "P 360"] },
  { brand: "DAF", models: ["XF", "CF", "LF", "XG+"] },
];

const INVENTORY_ITEMS = [
  { sku: "PALET-STD", name: "Standard EURO Pallet (Mixed)", unit: "Pallet", cargo: "General Cargo", palletCount: 1, weightKg: 25, volumeM3: 1.2 },
  { sku: "KOLI-KRT-B", name: "Large Cardboard Box (Electronics)", unit: "Each", cargo: "General Cargo", palletCount: 20, weightKg: 15, volumeM3: 0.06 },
  { sku: "AKUM-12V", name: "High-Capacity Battery 12V", unit: "Each", cargo: "Automotive Parts", palletCount: 40, weightKg: 22, volumeM3: 0.025 },
  { sku: "GSDA-DON", name: "Frozen Meat (Industrial Bulk)", unit: "kg", cargo: "Perishable", palletCount: 600, weightKg: 1, volumeM3: 0.0018 },
  { sku: "KMKL-AZOT", name: "Nitrogen Cylinder (Industrial)", unit: "Cylinder", cargo: "Hazardous Material", palletCount: 8, weightKg: 65, volumeM3: 0.12 },
  { sku: "TEKS-RULO", name: "Textile Fabric Roll", unit: "Roll", cargo: "General Cargo", palletCount: 15, weightKg: 30, volumeM3: 0.08 },
];

const FIRST_NAMES = ["Ahmet", "Mehmet", "Mustafa", "Ali", "Hüseyin", "Hasan", "İbrahim", "İsmail", "Ömer", "Yusuf", "Murat", "Osman", "Ramazan", "Serkan", "Burak", "Emre", "Can", "Berk"];
const LAST_NAMES = ["Yılmaz", "Kaya", "Demir", "Şahin", "Arslan", "Doğan", "Çelik", "Aydın", "Öztürk", "Yıldız", "Güneş", "Aksoy", "Koç", "Çetin"];

async function clearFirebase() {
  if (!adminDb) {
    console.warn("⚠️ Skipping Firebase clear: adminDb not initialized.");
    return;
  }
  console.log("🔥 Clearing Firebase Realtime Database...");
  try {
    await adminDb.ref("/").set(null);
    console.log("  ✅ Firebase cleared.");
  } catch (error) {
    console.error("  ❌ Firebase clear failed:", error);
  }
}

async function main() {
  console.log("🚀 LogiTrack v2 — Starting Professional Seeding...");
  
  const hashedPassword = await bcrypt.hash(PASSWORD, HASH_ROUNDS);

  // 1. CLEANUP
  await clearFirebase();
  console.log("🗑️ Clearing existing database records...");
  await prisma.auditLog.deleteMany();
  await prisma.session.deleteMany();
  await prisma.document.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.shipmentHistory.deleteMany();
  await prisma.shipmentItem.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.route.deleteMany();
  await prisma.trailerAssignment.deleteMany();
  await prisma.trailer.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.customerLocation.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.company.deleteMany();
  await prisma.exchangeRate.deleteMany();
  console.log("  ✅ Database cleared.");

  // 2. EXCHANGE RATES
  console.log("💱 Seeding Exchange Rates...");
  await prisma.exchangeRate.create({
    data: {
      base: "USD",
      rates: { TRY: 32.45, EUR: 0.92, GBP: 0.79, JPY: 151.2 },
      date: new Date()
    }
  });

  // 3. ROLES
  console.log("🔑 Seeding Roles from roles.json...");
  const roles: Record<string, string> = {};
  for (const r of rolesConfig) {
    const role = await prisma.role.create({
      data: {
        name: r.name,
        description: r.description,
        permissions: r.permissions,
      },
    });
    roles[r.id] = role.id;
    roles[r.name] = role.id;
    if (r.names) {
      for (const name of r.names) {
        roles[name] = role.id;
      }
    }
  }

  // 4. SUPER ADMIN
  await prisma.user.create({
    data: {
      email: "superadmin@logitrack.com",
      name: "Super",
      surname: "Admin",
      password: hashedPassword,
      roleId: roles["role_admin"],
      timezone: "Europe/Istanbul",
      dateFormat: "DD/MM/YYYY",
      currency: "USD"
    }
  });

  // 5. COMPANIES & DATA LOOP
  for (const cd of COMPANY_DEFS) {
    console.log(`\n🏢 Seeding Company: ${cd.name} (${cd.slug})`);
    const company = await prisma.company.create({ 
      data: { 
        name: cd.name,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(cd.name)}&background=random`
      } 
    });

    // Company Admin & Manager
    const companyAdmin = await prisma.user.create({
      data: {
        email: `admin@${cd.slug.toLowerCase()}.com`,
        name: pick(FIRST_NAMES),
        surname: pick(LAST_NAMES),
        password: hashedPassword,
        roleId: roles["role_admin"],
        companyId: company.id,
        timezone: "Europe/Istanbul",
        currency: "USD"
      }
    });

    const manager = await prisma.user.create({
      data: {
        email: `manager@${cd.slug.toLowerCase()}.com`,
        name: pick(FIRST_NAMES),
        surname: pick(LAST_NAMES),
        password: hashedPassword,
        roleId: roles["role_manager"],
        companyId: company.id,
        timezone: "Europe/Istanbul",
      }
    });

    // Warehouses
    const warehouseIds: string[] = [];
    for (let i = 1; i <= WAREHOUSES_PER_COMPANY; i++) {
      const city = pick(CITIES);
      const wh = await prisma.warehouse.create({
        data: {
          code: `${cd.slug}-WH-${i}`,
          name: `${cd.name} ${city.name} DC`,
          type: pick(["DISTRIBUTION_CENTER", "WAREHOUSE", "CROSSDOCK"]) as WarehouseType,
          address: `${city.name} Industrial Zone, Block ${i}`,
          city: city.name,
          country: "TR",
          lat: city.lat + randFloat(-0.02, 0.02),
          lng: city.lng + randFloat(-0.02, 0.02),
          capacityPallets: rand(1000, 10000),
          capacityVolumeM3: rand(5000, 20000),
          operatingHours: "07:00 - 22:00",
          timezone: "Europe/Istanbul",
          specifications: ["Temperature Controlled", "Hazmat Storage"],
          managerId: manager.id,
          companyId: company.id,
        }
      });
      warehouseIds.push(wh.id);

      // Inventory
      for (const item of INVENTORY_ITEMS) {
        const inv = await prisma.inventory.create({
          data: {
            warehouseId: wh.id,
            sku: `${item.sku}-${rand(100, 999)}`,
            name: item.name,
            quantity: rand(100, 5000),
            minStock: 50,
            unit: item.unit,
            cargoType: item.cargo,
            unitValue: randFloat(1, 100),
            weightKg: item.weightKg,
            volumeM3: item.volumeM3,
            palletCount: item.palletCount,
            companyId: company.id,
          }
        });

        await prisma.inventoryMovement.create({
          data: {
            warehouseId: wh.id,
            sku: inv.sku,
            quantity: rand(10, 100),
            type: "STOCK_IN",
            notes: "Initial inventory seeding",
            userId: companyAdmin.id,
            companyId: company.id,
          }
        });
      }
    }

    // Vehicles (200 Total)
    const vehicleIds: string[] = [];
    for (let i = 1; i <= VEHICLES_PER_COMPANY; i++) {
      const brandDef = pick(VEHICLE_BRANDS);
      const plate = `${rand(1, 81).toString().padStart(2, '0')} ${String.fromCharCode(65 + rand(0, 25))}${String.fromCharCode(65 + rand(0, 25))} ${rand(100, 9999)}`;
      const city = pick(CITIES);
      
      const v = await prisma.vehicle.create({
        data: {
          fleetNo: `${cd.slug}-V-${pad(i, 3)}`,
          plate: plate,
          type: i % 5 === 0 ? "VAN" : "TRUCK",
          brand: brandDef.brand,
          model: pick(brandDef.models),
          year: rand(2018, 2024),
          status: pick(["AVAILABLE", "ON_TRIP", "MAINTENANCE"]) as VehicleStatus,
          maxLoadKg: i % 5 === 0 ? rand(1500, 3500) : rand(12000, 26000),
          fuelType: "DIESEL",
          currentLat: city.lat + randFloat(-0.05, 0.05),
          currentLng: city.lng + randFloat(-0.05, 0.05),
          fuelLevel: rand(20, 100),
          odometerKm: rand(1000, 450000),
          fuelCapacity: i % 5 === 0 ? rand(70, 100) : rand(400, 800),
          companyId: company.id,
          nextServiceKm: rand(5000, 15000),
          avgFuelConsumption: randFloat(7.5, 35.0),
          registrationExpiry: daysFromNow(rand(30, 365)),
          inspectionExpiry: daysFromNow(rand(30, 180)),
          engineSize: i % 5 === 0 ? "2.0L" : "12.8L",
          transmission: pick(["Manual", "Automatic", "Semi-Auto"]),
          techNotes: "Heavy duty operations configuration.",
          enableAlerts: true
        }
      });
      vehicleIds.push(v.id);

      // Maintenance
      await prisma.maintenanceRecord.create({
        data: {
          vehicleId: v.id,
          type: "Full Service",
          date: daysAgo(rand(20, 90)),
          cost: randFloat(500, 3000),
          status: "COMPLETED",
          description: "Brake pads, oil filter, and tire rotation."
        }
      });

      // Documents
      await prisma.document.create({
        data: {
          type: "INSURANCE",
          name: `Policy_${v.plate}.pdf`,
          url: "https://storage.logitrack.com/docs/insurance_sample.pdf",
          status: "VALID",
          vehicleId: v.id,
          companyId: company.id,
          expiryDate: daysFromNow(rand(100, 500))
        }
      });

      // Firebase Sync
      if (adminDb) {
        await adminDb.ref(`vehicles/${v.id}`).set({
          id: v.id, plate: v.plate, fleetNo: v.fleetNo,
          lat: v.currentLat, lng: v.currentLng, speed: 0,
          fuelLevel: v.fuelLevel, status: v.status, lastUpdate: Date.now()
        });
      }
    }

    // Trailers (30 per company)
    const trailerIds: string[] = [];
    for (let i = 1; i <= 30; i++) {
      const plate = `${rand(1, 81).toString().padStart(2, '0')} ${String.fromCharCode(65 + rand(0, 25))}${String.fromCharCode(65 + rand(0, 25))} ${rand(100, 9999)}`;
      const type = pick([
        TrailerType.DRY_VAN,
        TrailerType.REEFER,
        TrailerType.FLATBED,
        TrailerType.TANKER,
        TrailerType.CURTAINSIDE,
        TrailerType.CONTAINER_CHASSIS
      ]);

      const t = await prisma.trailer.create({
        data: {
          fleetNo: `${cd.slug}-T-${pad(i, 3)}`,
          plate: plate,
          type: type,
          capacityVolumeM3: randFloat(60, 100),
          maxLoadKg: rand(20000, 30000),
          isColdChain: type === TrailerType.REEFER,
          status: pick([TrailerStatus.AVAILABLE, TrailerStatus.IN_USE, TrailerStatus.MAINTENANCE]) as TrailerStatus,
          companyId: company.id,
          // Assign some to vehicles
          currentVehicleId: i <= 20 ? vehicleIds[i - 1] : null,
        }
      });
      trailerIds.push(t.id);

      // Trailer Documents
      await prisma.document.create({
        data: {
          type: "TRAILER_REGISTRATION",
          name: `Reg_${t.plate}.pdf`,
          url: "https://storage.logitrack.com/docs/trailer_reg_sample.pdf",
          status: "VALID",
          trailerId: t.id,
          companyId: company.id,
          expiryDate: daysFromNow(rand(100, 500))
        }
      });
    }

    // Drivers
    const driverIds: string[] = [];
    for (let i = 1; i <= DRIVERS_PER_COMPANY; i++) {
      const user = await prisma.user.create({
        data: {
          email: `driver.${cd.slug.toLowerCase()}.${i}@logitrack.com`,
          name: pick(FIRST_NAMES),
          surname: pick(LAST_NAMES),
          password: hashedPassword,
          roleId: roles["role_driver"],
          companyId: company.id,
        }
      });

      const driver = await prisma.driver.create({
        data: {
          userId: user.id,
          employeeId: `EMP-${cd.slug}-${pad(i, 3)}`,
          phone: `+905${rand(30, 59)}${rand(100, 999)}${rand(10, 99)}${rand(10, 99)}`,
          status: pick(["ON_JOB", "OFF_DUTY"]) as DriverStatus,
          licenseNumber: `L-${rand(100000, 999999)}`,
          licenseType: pick(["Class C", "Class E", "Class D"]),
          licenseExpiry: daysFromNow(rand(200, 1000)),
          hazmatCertified: rand(1, 10) > 8,
          rating: randFloat(4.2, 5.0),
          safetyScore: rand(80, 100),
          efficiencyScore: rand(70, 98),
          companyId: company.id,
          currentVehicleId: i <= 30 ? vehicleIds[i - 1] : null,
          homeBaseWarehouseId: pick(warehouseIds),
          languages: ["Turkish", "English", "German"]
        }
      });
      driverIds.push(driver.id);

      // Driver Document
      await prisma.document.create({
        data: {
          type: "LICENSE",
          name: `License_${user.surname}.jpg`,
          url: "https://storage.logitrack.com/docs/license_sample.jpg",
          status: "VERIFIED",
          driverId: driver.id,
          companyId: company.id,
          expiryDate: driver.licenseExpiry
        }
      });

      // Audit Log & Session
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "LOGIN",
          ipAddress: `172.16.${rand(0, 255)}.${rand(1, 254)}`,
          deviceInfo: "iPhone 15 Pro / iOS 17"
        }
      });

      await prisma.session.create({
        data: {
          userId: user.id,
          token: `token_${user.id}_${Date.now()}`,
          refreshToken: `refresh_${user.id}_${Date.now()}`,
          expiresAt: daysFromNow(7)
        }
      });
    }

    // Customers & Operations
    const customerIds: string[] = [];
    for (let i = 1; i <= CUSTOMERS_PER_COMPANY; i++) {
      const cust = await prisma.customer.create({
        data: {
          code: `C-${cd.slug}-${pad(i, 3)}`,
          name: `${pick(["Inter", "Trans", "Neo", "Apex"])} ${pick(["Goods", "Supplies", "Retail", "Energy"])} Group`,
          industry: pick(["Automotive", "E-commerce", "Chemicals", "FMCG"]),
          taxId: `TR-${rand(1000000000, 9999999999)}`,
          email: `logistics@customer-${cd.slug}-${i}.com`,
          phone: `+90212${rand(1000000, 9999999)}`,
          companyId: company.id,
        }
      });
      customerIds.push(cust.id);

      await prisma.customerLocation.create({
        data: {
          customerId: cust.id,
          name: "Regional Warehouse A",
          address: `${pick(CITIES).name} Industrial Park, Sect ${i}`,
          lat: pick(CITIES).lat + randFloat(-0.01, 0.01),
          lng: pick(CITIES).lng + randFloat(-0.01, 0.01),
          isDefault: true
        }
      });
    }

    // Routes & Shipments
    console.log(`    🚛 Generating Operations for ${cd.slug}...`);
    for (let i = 1; i <= 30; i++) {
      const vId = pick(vehicleIds);
      const dId = pick(driverIds);
      const route = await prisma.route.create({
        data: {
          name: `R-${cd.slug}-${rand(1000, 9999)}`,
          date: daysAgo(rand(0, 7)),
          status: pick(["PLANNED", "ACTIVE", "COMPLETED"]) as RouteStatus,
          distanceKm: randFloat(50, 1200),
          durationMin: rand(60, 1440),
          stops: [
            { address: "Company DC", lat: pick(CITIES).lat, lng: pick(CITIES).lng },
            { address: "Customer Cluster A", lat: pick(CITIES).lat, lng: pick(CITIES).lng }
          ],
          driverId: dId,
          vehicleId: vId,
          companyId: company.id,
        }
      });

      for (let j = 1; j <= rand(2, 5); j++) {
        const itemDef = pick(INVENTORY_ITEMS);
        const itemQty = rand(20, 500);
        const itemPallets = itemDef.palletCount && itemDef.palletCount > 0 
          ? Math.ceil(itemQty / itemDef.palletCount) 
          : 1;

        const shipment = await prisma.shipment.create({
          data: {
            trackingId: `LT-${cd.slug}-${rand(1000000, 9999999)}`,
            customerId: pick(customerIds),
            status: route.status === "COMPLETED" ? "DELIVERED" : "IN_TRANSIT",
            priority: pick(["LOW", "MEDIUM", "HIGH", "CRITICAL"]) as ShipmentPriority,
            destination: `Customer Depot ${rand(1, 50)}`,
            weightKg: itemQty * (itemDef.weightKg || 1),
            volumeM3: itemQty * 0.05,
            palletCount: itemPallets,
            cargoType: itemDef.cargo,
            billingAccount: "Net-30 Corporate",
            slaDeadline: daysFromNow(2),
            routeId: route.id,
            companyId: company.id,
            originWarehouseId: pick(warehouseIds),
            trailerId: pick(trailerIds)
          }
        });

        await prisma.shipmentItem.create({
          data: {
            shipmentId: shipment.id,
            sku: `${itemDef.sku}-${rand(100, 999)}`,
            name: itemDef.name,
            quantity: itemQty,
            unit: itemDef.unit,
            weightKg: itemDef.weightKg,
            volumeM3: 0.05,
            palletCount: itemDef.palletCount, // Units per pallet
            cargoType: itemDef.cargo
          }
        });

        await prisma.shipmentHistory.create({
          data: {
            shipmentId: shipment.id,
            status: "PROCESSING",
            location: "Main DC",
            description: "Cargo verified and scheduled for dispatch."
          }
        });

        // Fuel Logs & Issues
        if (j === 1) {
          await prisma.fuelLog.create({
            data: {
              vehicleId: vId,
              driverId: dId,
              companyId: company.id,
              volumeLiter: randFloat(100, 600),
              cost: randFloat(400, 2000),
              odometerKm: rand(50000, 150000),
              fuelType: "DIESEL",
              location: "Shell Expressway #8"
            }
          });

          if (rand(1, 10) > 7) {
            await prisma.issue.create({
              data: {
                title: "Engine Warning Light",
                description: "Sensor malfunction detected during transit.",
                status: "IN_PROGRESS",
                priority: "HIGH",
                type: "VEHICLE",
                vehicleId: vId,
                driverId: dId,
                companyId: company.id
              }
            });
          }
        }
      }
    }
  }

  console.log("\n✨ SEEDING COMPLETE ✨");
  console.log("📊 Companies: 5 | Vehicles: 200 | Drivers: 180 | Shipments: ~1200");
  console.log("🔑 All Passwords: " + PASSWORD);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

/**
 * LogiTrack v2 — Professional Seed Script
 * ======================================
 * - 5 Companies
 * - 200 Vehicles (40 per company)
 * - 180 Drivers
 * - 25 Warehouses
 * - 100 Customers
 * - 1000+ Shipments
 * - Firebase Realtime Database Sync
 *
 * Password for all accounts: 3121283455Em!
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { adminDb } from "../app/lib/firebase-admin";

const prisma = new PrismaClient();

// --- Helpers ---
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pickN = <T>(arr: readonly T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
const daysFromNow = (n: number) => new Date(Date.now() + n * 86_400_000);
const pad = (n: number, len = 3) => String(n).padStart(len, "0");

const HASH_ROUNDS = 10;
const PASSWORD = "3121283455Em!";

// --- Static Data ---
const COMPANY_DEFS = [
  { name: "Atlas Lojistik A.Ş.", slug: "ATL", city: "İstanbul" },
  { name: "Merkür Taşımacılık Ltd.", slug: "MRK", city: "Ankara" },
  { name: "Poseidon Freight Corp.", slug: "PSN", city: "İzmir" },
  { name: "Titan Cargo Solutions", slug: "TCN", city: "Bursa" },
  { name: "Helios Express GmbH", slug: "HEX", city: "Antalya" },
];

const CITIES = [
  { name: "İstanbul", lat: 41.0082, lng: 28.9784 },
  { name: "Ankara", lat: 39.9208, lng: 32.8541 },
  { name: "İzmir", lat: 38.4192, lng: 27.1287 },
  { name: "Bursa", lat: 40.1885, lng: 29.0610 },
  { name: "Antalya", lat: 36.8969, lng: 30.7133 },
  { name: "Adana", lat: 37.0000, lng: 35.3213 },
  { name: "Konya", lat: 37.8746, lng: 32.4932 },
  { name: "Gaziantep", lat: 37.0662, lng: 37.3833 },
  { name: "Mersin", lat: 36.8000, lng: 34.6333 },
  { name: "Kayseri", lat: 38.7312, lng: 35.4787 },
  { name: "Eskişehir", lat: 39.7767, lng: 30.5206 },
  { name: "Samsun", lat: 41.2867, lng: 36.3300 },
  { name: "Denizli", lat: 37.7765, lng: 29.0864 },
  { name: "Trabzon", lat: 41.0015, lng: 39.7178 },
  { name: "Diyarbakır", lat: 37.9144, lng: 40.2306 },
];

const VEHICLE_BRANDS = [
  { brand: "Mercedes-Benz", models: ["Actros", "Arocs", "Atego", "Sprinter"] },
  { brand: "Volvo", models: ["FH16", "FH", "FM", "FE"] },
  { brand: "MAN", models: ["TGX", "TGS", "TGM", "TGL"] },
  { brand: "Scania", models: ["R 500", "R 450", "S 500", "P 360"] },
  { brand: "DAF", models: ["XF", "CF", "LF", "XG+"] },
  { brand: "Iveco", models: ["S-Way", "Daily", "Eurocargo"] },
  { brand: "Ford", models: ["Transit", "F-Max", "Cargo"] },
  { brand: "Renault", models: ["T 480", "Master", "C 460"] },
];

const FIRST_NAMES = ["Ahmet", "Mehmet", "Mustafa", "Ali", "Hüseyin", "Hasan", "İbrahim", "İsmail", "Ömer", "Yusuf", "Murat", "Osman", "Ramazan", "Serkan", "Burak", "Emre", "Can", "Berk", "Fatma", "Ayşe", "Emine", "Hatice", "Zeynep", "Elif", "Merve", "Selin", "Büşra"];
const LAST_NAMES = ["Yılmaz", "Kaya", "Demir", "Şahin", "Arslan", "Doğan", "Çelik", "Aydın", "Öztürk", "Yıldız", "Güneş", "Aksoy", "Koç", "Çetin", "Acar", "Polat", "Kaplan", "Erdoğan", "Güler", "Bulut", "Korkmaz"];

const INVENTORY_ITEMS = [
  { sku: "PALET-STD", name: "Standart Palet", unit: "Each", cargo: "General Cargo" },
  { sku: "KOLI-KRT-B", name: "Karton Koli (Büyük)", unit: "Each", cargo: "General Cargo" },
  { sku: "KOLI-KRT-K", name: "Karton Koli (Küçük)", unit: "Each", cargo: "General Cargo" },
  { sku: "AKUM-12V", name: "Akü 12V", unit: "Each", cargo: "Automotive Parts" },
  { sku: "ELKT-TV-55", name: "LED TV 55 inç", unit: "Each", cargo: "Electronics" },
  { sku: "GSDA-DON", name: "Gıda - Dondurulmuş", unit: "kg", cargo: "Perishable" },
  { sku: "HLND-RUL", name: "Halı Rulosu", unit: "Roll", cargo: "Textiles" },
  { sku: "KMKL-AZOT", name: "Kimyasal - Azot Tüpü", unit: "Cylinder", cargo: "Hazardous Material" },
];

async function clearFirebase() {
  console.log("🔥 Firebase Realtime Database temizleniyor...");
  try {
    await adminDb.ref("/").set(null);
    console.log("  ✅ Firebase temizlendi.");
  } catch (error) {
    console.error("  ❌ Firebase temizlenemedi:", error);
  }
}

async function main() {
  console.log("🚀 LogiTrack v2 — Kapsamlı Seed Başlatılıyor...");
  
  const hashedPassword = await bcrypt.hash(PASSWORD, HASH_ROUNDS);

  // 1. DATABASE CLEANUP
  console.log("🧹 Veritabanı temizleniyor...");
  const tables = [
    'AuditLog', 'Session', 'FuelLog', 'MaintenanceRecord', 'Document', 'Issue',
    'ShipmentHistory', 'ShipmentItem', 'Shipment', 'Route', 'InventoryMovement',
    'Inventory', 'CustomerLocation', 'Customer', 'Driver', 'Vehicle', 'Warehouse',
    'User', 'Company', 'Role', 'ExchangeRate'
  ];

  for (const table of tables) {
    try {
      // @ts-ignore
      await prisma[table.charAt(0).toLowerCase() + table.slice(1)].deleteMany();
    } catch (e) {
      console.warn(`  ⚠️ ${table} temizlenirken hata oluştu (muhtemelen boş veya FK kısıtı).`);
    }
  }
  console.log("  ✅ Veritabanı temizlendi.");

  // 2. FIREBASE CLEANUP
  await clearFirebase();

  // 3. ROLES
  console.log("🔑 Roller oluşturuluyor...");
  const roleDefs = [
    { name: "Super Admin", permissions: ["*"] },
    { name: "Company Admin", permissions: ["MANAGE_USERS", "MANAGE_VEHICLES", "MANAGE_DRIVERS", "MANAGE_WAREHOUSES", "MANAGE_SHIPMENTS", "MANAGE_ROUTES", "VIEW_REPORTS"] },
    { name: "Manager", permissions: ["MANAGE_VEHICLES", "MANAGE_DRIVERS", "MANAGE_SHIPMENTS", "MANAGE_ROUTES", "VIEW_REPORTS"] },
    { name: "Dispatcher", permissions: ["MANAGE_SHIPMENTS", "MANAGE_ROUTES", "VIEW_VEHICLES", "VIEW_DRIVERS"] },
    { name: "Warehouse Operator", permissions: ["MANAGE_INVENTORY", "VIEW_SHIPMENTS"] },
    { name: "Driver", permissions: ["VIEW_OWN_ROUTES", "UPDATE_SHIPMENT_STATUS"] },
  ];

  const roles: Record<string, string> = {};
  for (const r of roleDefs) {
    const role = await prisma.role.create({ data: r });
    roles[r.name] = role.id;
  }
  console.log("  ✅ Roller tamamlandı.");

  // 4. COMPANIES & DATA SEEDING
  let vehicleTotal = 0;
  let driverTotal = 0;

  for (const cd of COMPANY_DEFS) {
    console.log(`\n🏢 Şirket: ${cd.name} (${cd.slug})`);
    const company = await prisma.company.create({ data: { name: cd.name } });

    // Users
    const admin = await prisma.user.create({
      data: {
        email: `admin@${cd.slug.toLowerCase()}.com`,
        name: pick(FIRST_NAMES),
        surname: pick(LAST_NAMES),
        password: hashedPassword,
        roleId: roles["Company Admin"],
        companyId: company.id,
      }
    });

    const manager = await prisma.user.create({
      data: {
        email: `manager@${cd.slug.toLowerCase()}.com`,
        name: pick(FIRST_NAMES),
        surname: pick(LAST_NAMES),
        password: hashedPassword,
        roleId: roles["Manager"],
        companyId: company.id,
      }
    });

    // Warehouses (5 per company)
    const whIds: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const city = pick(CITIES);
      const wh = await prisma.warehouse.create({
        data: {
          code: `${cd.slug}-WH-${i}`,
          name: `${cd.name} ${city.name} Lojistik Merkezi`,
          type: pick(["DISTRIBUTION_CENTER", "WAREHOUSE", "CROSSDOCK"]),
          address: `${city.name} Org. San. Böl. No:${rand(1, 100)}`,
          city: city.name,
          country: "TR",
          lat: city.lat + randFloat(-0.02, 0.02),
          lng: city.lng + randFloat(-0.02, 0.02),
          managerId: manager.id,
          companyId: company.id,
        }
      });
      whIds.push(wh.id);

      // Inventory
      for (const item of INVENTORY_ITEMS) {
        await prisma.inventory.create({
          data: {
            warehouseId: wh.id,
            sku: `${item.sku}-${rand(100, 999)}`,
            name: item.name,
            quantity: rand(100, 10000),
            unit: item.unit,
            cargoType: item.cargo,
            companyId: company.id,
          }
        });
      }
    }

    // Vehicles (40 per company = 200 total)
    const vehicleIds: string[] = [];
    for (let i = 1; i <= 40; i++) {
      const brandDef = pick(VEHICLE_BRANDS);
      const plate = `${rand(1, 81).toString().padStart(2, '0')} ${String.fromCharCode(65 + rand(0, 25))}${String.fromCharCode(65 + rand(0, 25))} ${rand(100, 9999)}`;
      const city = pick(CITIES);
      
      const v = await prisma.vehicle.create({
        data: {
          fleetNo: `${cd.slug}-V-${pad(i, 3)}`,
          plate: plate,
          type: i % 4 === 0 ? "VAN" : "TRUCK",
          brand: brandDef.brand,
          model: pick(brandDef.models),
          year: rand(2018, 2024),
          status: pick(["AVAILABLE", "AVAILABLE", "AVAILABLE", "ON_TRIP", "MAINTENANCE"]),
          maxLoadKg: i % 4 === 0 ? rand(1500, 3500) : rand(12000, 26000),
          fuelType: "DIESEL",
          currentLat: city.lat + randFloat(-0.05, 0.05),
          currentLng: city.lng + randFloat(-0.05, 0.05),
          fuelLevel: rand(20, 100),
          odometerKm: rand(1000, 450000),
          companyId: company.id,
        }
      });
      vehicleIds.push(v.id);
      vehicleTotal++;

      // Sync to Firebase
      await adminDb.ref(`vehicles/${v.id}`).set({
        id: v.id,
        plate: v.plate,
        fleetNo: v.fleetNo,
        lat: v.currentLat,
        lng: v.currentLng,
        speed: 0,
        fuelLevel: v.fuelLevel,
        status: v.status,
        lastUpdate: Date.now()
      });
    }

    // Drivers (36 per company = 180 total)
    const driverIds: string[] = [];
    for (let i = 1; i <= 36; i++) {
      const fn = pick(FIRST_NAMES);
      const ln = pick(LAST_NAMES);
      const email = `driver.${cd.slug.toLowerCase()}.${i}@logitrack.com`;
      
      const user = await prisma.user.create({
        data: {
          email,
          name: fn,
          surname: ln,
          password: hashedPassword,
          roleId: roles["Driver"],
          companyId: company.id,
        }
      });

      const driver = await prisma.driver.create({
        data: {
          userId: user.id,
          employeeId: `EMP-${cd.slug}-${pad(i, 3)}`,
          phone: `+905${rand(30, 59)}${rand(100, 999)}${rand(10, 99)}${rand(10, 99)}`,
          status: i % 5 === 0 ? "OFF_DUTY" : "ON_JOB",
          rating: randFloat(4.0, 5.0),
          companyId: company.id,
          currentVehicleId: i <= 30 ? vehicleIds[i - 1] : null,
        }
      });
      driverIds.push(driver.id);
      driverTotal++;
    }

    // Customers (20 per company)
    const customerIds: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const cust = await prisma.customer.create({
        data: {
          code: `C-${cd.slug}-${pad(i, 3)}`,
          name: `${pick(["Global", "Ulusal", "Ege", "Marmara"])} ${pick(["Ticaret", "Sanayi", "Gıda", "Teknoloji"])} Ltd.`,
          email: `info@customer${i}.${cd.slug.toLowerCase()}.com`,
          companyId: company.id,
          locations: {
            create: {
              name: "Merkez Depo",
              address: `${pick(CITIES).name} Sanayi Sitesi`,
              isDefault: true,
            }
          }
        }
      });
      customerIds.push(cust.id);
    }

    // Shipments & Routes (Detailed)
    console.log(`    🚛 Operasyonel veriler oluşturuluyor...`);
    for (let i = 1; i <= 60; i++) {
      const route = await prisma.route.create({
        data: {
          name: `${cd.slug}-ROUTE-${pad(i, 3)}`,
          date: daysAgo(rand(0, 30)),
          status: pick(["PLANNED", "ACTIVE", "COMPLETED"]),
          driverId: pick(driverIds),
          vehicleId: pick(vehicleIds),
          companyId: company.id,
        }
      });

      // Shipments for this route
      for (let j = 1; j <= rand(2, 5); j++) {
        await prisma.shipment.create({
          data: {
            trackingId: `LT-${cd.slug}-${pad(i, 3)}-${j}`,
            customerId: pick(customerIds),
            status: route.status === "COMPLETED" ? "DELIVERED" : "IN_TRANSIT",
            origin: "Warehouse",
            destination: "Customer Site",
            weightKg: randFloat(100, 5000),
            routeId: route.id,
            companyId: company.id,
          }
        });
      }
    }
  }

  // Super Admin
  await prisma.user.create({
    data: {
      email: "superadmin@logitrack.com",
      name: "Super",
      surname: "Admin",
      password: hashedPassword,
      roleId: roles["Super Admin"],
    }
  });

  console.log("\n✨ SEED TAMAMLANDI ✨");
  console.log(`📊 Toplam Araç: ${vehicleTotal}`);
  console.log(`📊 Toplam Sürücü: ${driverTotal}`);
  console.log(`📊 Toplam Şirket: 5`);
  console.log(`🔑 Tüm Şifreler: ${PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

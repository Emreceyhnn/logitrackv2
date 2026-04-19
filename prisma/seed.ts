/**
 * LogiTrack v2 — Full Seed Script
 * ================================
 * 5 Companies · 200 Vehicles · Warehouses · Drivers · Customers
 * Shipments · Routes · Inventory · Issues · Fuel Logs · Documents
 *
 * All user accounts password: 3121283455Em!
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── helpers ──────────────────────────────────────────────────────────────────
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(2));
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

// ─── static data ──────────────────────────────────────────────────────────────

const COMPANY_DEFS = [
  {
    name: "Atlas Lojistik A.Ş.",
    slug: "ATL",
    city: "İstanbul",
    country: "TR",
  },
  {
    name: "Merkür Taşımacılık Ltd.",
    slug: "MRK",
    city: "Ankara",
    country: "TR",
  },
  {
    name: "Poseidon Freight Corp.",
    slug: "PSN",
    city: "İzmir",
    country: "TR",
  },
  {
    name: "Titan Cargo Solutions",
    slug: "TCN",
    city: "Bursa",
    country: "TR",
  },
  {
    name: "Helios Express GmbH",
    slug: "HEX",
    city: "Adana",
    country: "TR",
  },
];

// Turkish cities with realistic coordinates
const CITIES = [
  { name: "İstanbul", lat: 41.0082, lng: 28.9784 },
  { name: "Ankara", lat: 39.9208, lng: 32.8541 },
  { name: "İzmir", lat: 38.4192, lng: 27.1287 },
  { name: "Bursa", lat: 40.1885, lng: 29.061 },
  { name: "Adana", lat: 37.0, lng: 35.3213 },
  { name: "Gaziantep", lat: 37.0662, lng: 37.3833 },
  { name: "Konya", lat: 37.8746, lng: 32.4932 },
  { name: "Antalya", lat: 36.8969, lng: 30.7133 },
  { name: "Kayseri", lat: 38.7312, lng: 35.4787 },
  { name: "Mersin", lat: 36.8, lng: 34.6333 },
  { name: "Eskişehir", lat: 39.7767, lng: 30.5206 },
  { name: "Trabzon", lat: 41.0015, lng: 39.7178 },
  { name: "Samsun", lat: 41.2867, lng: 36.33 },
  { name: "Diyarbakır", lat: 37.9144, lng: 40.2306 },
  { name: "Denizli", lat: 37.7765, lng: 29.0864 },
];

const VEHICLE_BRANDS = [
  { brand: "Mercedes-Benz", models: ["Actros", "Arocs", "Atego", "Sprinter"] },
  { brand: "Volvo", models: ["FH16", "FH", "FM", "FE"] },
  { brand: "MAN", models: ["TGX", "TGS", "TGM", "TGL"] },
  { brand: "Scania", models: ["R 500", "R 450", "S 500", "P 360"] },
  { brand: "DAF", models: ["XF", "CF", "LF", "XG+"] },
  { brand: "Iveco", models: ["S-Way", "Stralis", "Daily", "Eurocargo"] },
  { brand: "Ford", models: ["Transit", "Cargo 1848 T", "F-Max"] },
  { brand: "Renault", models: ["T 480", "C 460", "K 460", "Master"] },
];

const FUEL_TYPES = ["DIESEL", "DIESEL", "DIESEL", "ELECTRIC", "LPG", "HYBRID"];
const DRIVER_STATUSES = ["ON_JOB", "OFF_DUTY", "ON_LEAVE"] as const;
const VEHICLE_STATUSES = ["AVAILABLE", "ON_TRIP", "MAINTENANCE"] as const;
// const VEHICLE_TYPES = ["TRUCK", "VAN"] as const;
const WAREHOUSE_TYPES = [
  "DISTRIBUTION_CENTER",
  "CROSSDOCK",
  "WAREHOUSE",
] as const;
const SHIPMENT_STATUSES = [
  "PENDING",
  "PROCESSING",
  "ASSIGNED",
  "PLANNED",
  "IN_TRANSIT",
  "DELIVERED",
  "DELAYED",
  "CANCELLED",
  "COMPLETED",
  "FAILED",
] as const;
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
const CARGO_TYPES = [
  "General Cargo",
  "Hazardous Material",
  "Perishable",
  "Fragile",
  "Electronics",
  "Textiles",
  "Automotive Parts",
  "Food & Beverage",
];
const MAINTENANCE_TYPES = [
  "Routine",
  "Oil Change",
  "Tire Rotation",
  "Brake Inspection",
  "Engine Repair",
  "Body Work",
  "Electrical",
  "Transmission",
];
const ISSUE_TYPES = ["VEHICLE", "DRIVER", "SHIPMENT", "OTHER"] as const;
const ISSUE_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;
const ISSUE_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
const LANGUAGES = ["Turkish", "English", "German", "Arabic", "Azerbaijani"];
const INDUSTRIES = [
  "Retail",
  "Manufacturing",
  "Healthcare",
  "Automotive",
  "Food & Beverage",
  "Electronics",
  "Textiles",
  "Construction",
  "Energy",
  "Pharmaceuticals",
];
const FIRST_NAMES = [
  "Ahmet","Mehmet","Mustafa","Ali","Hüseyin","Hasan","İbrahim","İsmail",
  "Ömer","Yusuf","Murat","Osman","Ramazan","Serkan","Burak","Emre","Can",
  "Berk","Cem","Enes","Fatma","Ayşe","Emine","Hatice","Zeynep","Elif",
  "Nurgül","Merve","Selin","Büşra","Gizem","Derya","Nurcan","Şule","Yıldız",
];
const LAST_NAMES = [
  "Yılmaz","Kaya","Demir","Şahin","Arslan","Doğan","Çelik","Aydın",
  "Öztürk","Yıldız","Güneş","Aksoy","Koç","Çetin","Acar","Polat",
  "Kaplan","Erdoğan","Yücel","Güler","Bulut","Korkmaz","Taş","Kılıç",
];
const INVENTORY_ITEMS = [
  { sku: "PALET-STD-001", name: "Standart Palet", unit: "Each", cargo: "General Cargo" },
  { sku: "KOLI-KRT-002", name: "Karton Koli (Büyük)", unit: "Each", cargo: "General Cargo" },
  { sku: "KOLI-KRT-003", name: "Karton Koli (Küçük)", unit: "Each", cargo: "General Cargo" },
  { sku: "AKUM-12V-004", name: "Akü 12V", unit: "Each", cargo: "Automotive Parts" },
  { sku: "ELKT-TV-005", name: "LED TV 55 inç", unit: "Each", cargo: "Electronics" },
  { sku: "GSDA-DIKSM-006", name: "Gıda - Dondurulmuş", unit: "kg", cargo: "Perishable" },
  { sku: "HLND-TKM-007", name: "Halı Rulosu", unit: "Roll", cargo: "Textiles" },
  { sku: "TMLK-BETON-008", name: "Temlik Beton Blok", unit: "Each", cargo: "Construction" },
  { sku: "KMKL-AZOT-009", name: "Kimyasal - Azot Tüpü", unit: "Cylinder", cargo: "Hazardous Material" },
  { sku: "ILAC-ANBS-010", name: "İlaç - Antibiyotik Kutu", unit: "Box", cargo: "Pharmaceuticals" },
  { sku: "OTCP-FAR-011", name: "Otomotiv - Far Seti", unit: "Set", cargo: "Automotive Parts" },
  { sku: "TRKS-MNTR-012", name: "Tekstil - Mantar Minder", unit: "Each", cargo: "Textiles" },
  { sku: "GSDA-SIVI-013", name: "Gıda - Sıvı Yağ Varil", unit: "Barrel", cargo: "Food & Beverage" },
  { sku: "ELKT-ANDR-014", name: "Elektronik - Anakart", unit: "Each", cargo: "Electronics" },
  { sku: "HLTH-MSKR-015", name: "Sağlık - Maske (Kutu)", unit: "Box", cargo: "Healthcare" },
];

// ─── main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱  LogiTrack v2 — Seed başlatılıyor...\n");
  const hashedPassword = await bcrypt.hash(PASSWORD, HASH_ROUNDS);

  // ── 1. Roles ────────────────────────────────────────────────────────────────
  const roleDefs = [
    {
      name: "Super Admin",
      description: "Full system access",
      permissions: ["*"],
    },
    {
      name: "Company Admin",
      description: "Full access within company",
      permissions: [
        "MANAGE_USERS",
        "MANAGE_VEHICLES",
        "MANAGE_DRIVERS",
        "MANAGE_WAREHOUSES",
        "MANAGE_SHIPMENTS",
        "MANAGE_ROUTES",
        "VIEW_REPORTS",
      ],
    },
    {
      name: "Manager",
      description: "Operational management",
      permissions: [
        "MANAGE_VEHICLES",
        "MANAGE_DRIVERS",
        "MANAGE_SHIPMENTS",
        "MANAGE_ROUTES",
        "VIEW_REPORTS",
      ],
    },
    {
      name: "Dispatcher",
      description: "Dispatch and routing",
      permissions: ["MANAGE_SHIPMENTS", "MANAGE_ROUTES", "VIEW_VEHICLES", "VIEW_DRIVERS"],
    },
    {
      name: "Warehouse Operator",
      description: "Warehouse operations",
      permissions: ["MANAGE_INVENTORY", "VIEW_SHIPMENTS"],
    },
    {
      name: "Driver",
      description: "Driver access",
      permissions: ["VIEW_OWN_ROUTES", "UPDATE_SHIPMENT_STATUS"],
    },
  ];

  const roles: Record<string, { id: string }> = {};
  for (const r of roleDefs) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: r,
    });
    roles[r.name] = role;
    console.log(`  ✅ Rol: ${role.name}`);
  }

  // ── 2. Companies ────────────────────────────────────────────────────────────
  const companies: Record<
    string,
    { id: string; name: string; slug: string; city: string; country: string }
  > = {};

  for (const cd of COMPANY_DEFS) {
    const company = await prisma.company.upsert({
      where: { name: cd.name },
      update: {},
      create: { name: cd.name },
    });
    companies[cd.slug] = { ...company, slug: cd.slug, city: cd.city, country: cd.country };
    console.log(`  🏢 Şirket: ${company.name}`);
  }

  const companySlugs = Object.keys(companies);

  // ── 3. Seed each company ────────────────────────────────────────────────────
  let globalVehicleIdx = 1;
  let globalDriverIdx = 1;
  let globalCustomerIdx = 1;
  let globalShipmentIdx = 1;
  let globalRouteIdx = 1;

  for (const slug of companySlugs) {
    const company = companies[slug];
    console.log(`\n  ── ${company.name} (${slug}) ──────────────────────`);

    // vehicles per company: 40 each = 200 total
    const vehicleCount = 40;
    const driverCount = rand(25, 35);
    const warehouseCount = rand(3, 5);
    const customerCount = rand(20, 30);
    const shipmentCount = rand(60, 80);

    // ── 3a. Admin / manager users ───────────────────────────────────────────
    await prisma.user.upsert({
      where: { email: `admin@${slug.toLowerCase()}.com` },
      update: {},
      create: {
        email: `admin@${slug.toLowerCase()}.com`,
        name: pick(FIRST_NAMES),
        surname: pick(LAST_NAMES),
        password: hashedPassword,
        status: "ACTIVE",
        roleId: roles["Company Admin"].id,
        companyId: company.id,
        lastLoginAt: daysAgo(rand(0, 3)),
      },
    });

    const managerUser = await prisma.user.upsert({
      where: { email: `manager@${slug.toLowerCase()}.com` },
      update: {},
      create: {
        email: `manager@${slug.toLowerCase()}.com`,
        name: pick(FIRST_NAMES),
        surname: pick(LAST_NAMES),
        password: hashedPassword,
        status: "ACTIVE",
        roleId: roles["Manager"].id,
        companyId: company.id,
        lastLoginAt: daysAgo(rand(0, 7)),
      },
    });

    await prisma.user.upsert({
      where: { email: `dispatcher@${slug.toLowerCase()}.com` },
      update: {},
      create: {
        email: `dispatcher@${slug.toLowerCase()}.com`,
        name: pick(FIRST_NAMES),
        surname: pick(LAST_NAMES),
        password: hashedPassword,
        status: "ACTIVE",
        roleId: roles["Dispatcher"].id,
        companyId: company.id,
      },
    });

    console.log(
      `    👤 Admin: admin@${slug.toLowerCase()}.com | Manager: manager@${slug.toLowerCase()}.com | Dispatcher: dispatcher@${slug.toLowerCase()}.com`
    );

    // ── 3b. Warehouses ───────────────────────────────────────────────────────
    const warehouseIds: string[] = [];
    for (let w = 1; w <= warehouseCount; w++) {
      const city = pick(CITIES);
      const wType = pick(WAREHOUSE_TYPES);
      const code = `${slug}-WH-${pad(w)}`;
      const existing = await prisma.warehouse.findUnique({ where: { code } });
      const wh = existing
        ? existing
        : await prisma.warehouse.create({
            data: {
              code,
              name: `${company.name} ${city.name} ${wType === "DISTRIBUTION_CENTER" ? "Dağıtım Merkezi" : wType === "CROSSDOCK" ? "Crossdock" : "Depo"} ${w}`,
              type: wType,
              address: `${city.name} Sanayi Bölgesi No:${rand(1, 200)}`,
              city: city.name,
              country: "TR",
              lat: city.lat + randFloat(-0.05, 0.05),
              lng: city.lng + randFloat(-0.05, 0.05),
              capacityPallets: rand(2000, 15000),
              capacityVolumeM3: rand(50000, 500000),
              operatingHours: pick(["06:00 - 22:00", "07:00 - 19:00", "00:00 - 24:00", "08:00 - 18:00"]),
              specifications: pickN(["Cold Storage", "Hazmat Zone", "High Bay", "Drive-in Racks", "RFID Enabled", "Fire Suppression"], rand(1, 4)),
              managerId: managerUser.id,
              companyId: company.id,
            },
          });
      warehouseIds.push(wh.id);
    }
    console.log(`    🏭 ${warehouseCount} depo oluşturuldu`);

    // ── 3c. Vehicles ─────────────────────────────────────────────────────────
    const vehicleIds: string[] = [];
    for (let v = 0; v < vehicleCount; v++) {
      const brandDef = pick(VEHICLE_BRANDS);
      const vType: "TRUCK" | "VAN" = v < vehicleCount * 0.7 ? "TRUCK" : "VAN";
      const fleetNo = `${slug}-${pad(globalVehicleIdx, 4)}`;
      const plate = generatePlate(globalVehicleIdx);
      const fuelType = pick(FUEL_TYPES);
      const year = rand(2015, 2024);
      const odo = rand(10000, 350000);
      const vStatus = pick(VEHICLE_STATUSES);
      const city = pick(CITIES);

      const existing = await prisma.vehicle.findUnique({ where: { fleetNo } });
      const vehicle = existing
        ? existing
        : await prisma.vehicle.create({
            data: {
              fleetNo,
              plate,
              type: vType,
              brand: brandDef.brand,
              model: pick(brandDef.models),
              year,
              status: vStatus,
              maxLoadKg: vType === "TRUCK" ? rand(10000, 26000) : rand(1000, 3500),
              fuelType,
              currentLat: city.lat + randFloat(-0.1, 0.1),
              currentLng: city.lng + randFloat(-0.1, 0.1),
              fuelLevel: rand(10, 100),
              odometerKm: odo,
              nextServiceKm: odo + rand(5000, 30000),
              avgFuelConsumption: vType === "TRUCK" ? randFloat(25, 42) : randFloat(8, 15),
              registrationExpiry: daysFromNow(rand(-60, 730)),
              inspectionExpiry: daysFromNow(rand(-30, 365)),
              engineSize:
                vType === "TRUCK"
                  ? pick(["10.8L", "12.7L", "13.0L", "15.2L"])
                  : pick(["1.5L", "2.0L", "2.2L"]),
              transmission: pick(["Automatic", "Manual", "Semi-Automatic"]),
              enableAlerts: Math.random() > 0.1,
              companyId: company.id,
            },
          });
      vehicleIds.push(vehicle.id);
      globalVehicleIdx++;

      // Maintenance records (1-3 per vehicle)
      const mCount = rand(1, 3);
      for (let m = 0; m < mCount; m++) {
        await prisma.maintenanceRecord.create({
          data: {
            vehicleId: vehicle.id,
            type: pick(MAINTENANCE_TYPES),
            date: daysAgo(rand(0, 365)),
            cost: randFloat(500, 15000),
            status: pick(["COMPLETED", "COMPLETED", "COMPLETED", "SCHEDULED", "IN_PROGRESS"]) as import("@prisma/client").MaintenanceStatus,
            description: `${pick(MAINTENANCE_TYPES)} bakım kaydı - ${rand(1, 200000)} km`,
          },
        });
      }

      // Documents per vehicle
      await prisma.document.create({
        data: {
          type: "INSURANCE",
          name: `${plate} Kasko Belgesi`,
          url: `https://docs.logitrack.internal/${plate.replace(" ", "-")}-kasko.pdf`,
          expiryDate: daysFromNow(rand(30, 365)),
          status: "ACTIVE",
          vehicleId: vehicle.id,
          companyId: company.id,
        },
      });
    }
    console.log(`    🚛 ${vehicleCount} araç oluşturuldu`);

    // ── 3d. Drivers ──────────────────────────────────────────────────────────
    const driverIds: string[] = [];
    const availableVehicleIds = [...vehicleIds];

    for (let d = 0; d < driverCount; d++) {
      const firstName = pick(FIRST_NAMES);
      const lastName = pick(LAST_NAMES);
      const email = `driver.${slug.toLowerCase()}.${globalDriverIdx}@logitrack.com`;
      const dStatus = pick(DRIVER_STATUSES);
      let assignedVehicleId: string | null = null;

      if (dStatus === "ON_JOB" && availableVehicleIds.length > 0) {
        const idx = rand(0, availableVehicleIds.length - 1);
        assignedVehicleId = availableVehicleIds.splice(idx, 1)[0];
      }

      const userExists = await prisma.user.findUnique({ where: { email } });
      const driverUser = userExists
        ? userExists
        : await prisma.user.create({
            data: {
              email,
              name: firstName,
              surname: lastName,
              password: hashedPassword,
              status: pick(["ACTIVE", "ACTIVE", "ACTIVE", "INACTIVE"]) as import("@prisma/client").UserStatus,
              roleId: roles["Driver"].id,
              companyId: company.id,
            },
          });

      const empId = `EMP-${slug}-${pad(globalDriverIdx, 5)}`;
      const driverExists = await prisma.driver.findUnique({ where: { userId: driverUser.id } });
      const driver = driverExists
        ? driverExists
        : await prisma.driver.create({
            data: {
              userId: driverUser.id,
              employeeId: empId,
              licenseNumber: `TR-${rand(10000000, 99999999)}`,
              licenseType: pick(["B", "C", "C+E", "D", "CE"]),
              licenseExpiry: daysFromNow(rand(30, 1200)),
              phone: `+905${rand(10, 99)}${rand(1000000, 9999999)}`,
              status: dStatus,
              safetyScore: rand(60, 100),
              efficiencyScore: rand(55, 100),
              rating: randFloat(3.0, 5.0),
              hazmatCertified: Math.random() > 0.6,
              languages: pickN(LANGUAGES, rand(1, 3)),
              currentVehicleId: assignedVehicleId,
              companyId: company.id,
              homeBaseWarehouseId: pick(warehouseIds),
            },
          });
      driverIds.push(driver.id);
      globalDriverIdx++;

      // Driver document
      await prisma.document.create({
        data: {
          type: "LICENSE",
          name: `${firstName} ${lastName} Ehliyet`,
          url: `https://docs.logitrack.internal/${empId}-license.pdf`,
          expiryDate: daysFromNow(rand(30, 1200)),
          status: "ACTIVE",
          driverId: driver.id,
          companyId: company.id,
        },
      });
    }
    console.log(`    👨‍💼 ${driverCount} sürücü oluşturuldu`);

    // ── 3e. Customers ────────────────────────────────────────────────────────
    const customerIds: string[] = [];
    for (let c = 0; c < customerCount; c++) {
      const city = pick(CITIES);
      const code = `CUST-${slug}-${pad(globalCustomerIdx, 4)}`;
      const customerName = `${pick(["Küresel", "Ulusal", "Bölgesel", "Anadolu", "Euro"])} ${pick(["Ticaret", "Endüstri", "Lojistik", "Grup", "Holding"])} ${String.fromCharCode(65 + (globalCustomerIdx % 26))}.Ş.`;

      const existingCust = await prisma.customer.findUnique({ where: { code } });
      const customer = existingCust
        ? existingCust
        : await prisma.customer.create({
            data: {
              code,
              name: customerName,
              industry: pick(INDUSTRIES),
              taxId: `${rand(1000000000, 9999999999)}`,
              email: `info@${code.toLowerCase().replace(/-/g, "")}.com`,
              phone: `+90${rand(2000000000, 5999999999)}`,
              companyId: company.id,
              locations: {
                create: [
                  {
                    name: "Ana Merkez",
                    address: `${city.name} Merkez Mah. No:${rand(1, 500)}`,
                    lat: city.lat + randFloat(-0.02, 0.02),
                    lng: city.lng + randFloat(-0.02, 0.02),
                    isDefault: true,
                  },
                  ...(Math.random() > 0.5
                    ? [
                        {
                          name: "Şube",
                          address: `${pick(CITIES).name} Sanayi Sok. No:${rand(1, 100)}`,
                          isDefault: false,
                        },
                      ]
                    : []),
                ],
              },
            },
          });
      customerIds.push(customer.id);
      globalCustomerIdx++;
    }
    console.log(`    🏪 ${customerCount} müşteri oluşturuldu`);

    // ── 3f. Inventory ────────────────────────────────────────────────────────
    for (const whId of warehouseIds) {
      const itemsForWh = pickN(INVENTORY_ITEMS, rand(6, 12));
      for (const item of itemsForWh) {
        const qty = rand(50, 5000);
        try {
          await prisma.inventory.upsert({
            where: { warehouseId_sku: { warehouseId: whId, sku: item.sku } },
            update: {},
            create: {
              warehouseId: whId,
              sku: item.sku,
              name: item.name,
              quantity: qty,
              minStock: Math.floor(qty * 0.1),
              unit: item.unit,
              unitValue: randFloat(10, 5000),
              weightKg: randFloat(0.5, 500),
              volumeM3: randFloat(0.001, 5),
              palletCount: randFloat(0.1, 10),
              cargoType: item.cargo,
              companyId: company.id,
            },
          });
        } catch {
          // skip if duplicate
        }
      }
    }
    console.log(`    📦 Envanter oluşturuldu`);

    // ── 3g. Routes & Shipments ───────────────────────────────────────────────
    for (let s = 0; s < shipmentCount; s++) {
      const originCity = pick(CITIES);
      const destCity = pick(CITIES.filter((c) => c.name !== originCity.name));
      const routeStatus = pick(["PLANNED", "ACTIVE", "COMPLETED", "CANCELLED"]) as import("@prisma/client").RouteStatus;
      const shipStatus = pick(SHIPMENT_STATUSES);
      const routeDate = daysAgo(rand(-10, 60));
      const driver = driverIds.length > 0 ? pick(driverIds) : null;
      const vehicle = vehicleIds.length > 0 ? pick(vehicleIds) : null;
      const customer = pick(customerIds);

      // Route
      const route = await prisma.route.create({
        data: {
          name: `${slug}-ROUTE-${pad(globalRouteIdx, 4)}`,
          status: routeStatus,
          date: routeDate,
          startTime: new Date(routeDate.getTime() + rand(0, 2) * 3600000),
          endTime: new Date(routeDate.getTime() + rand(4, 12) * 3600000),
          distanceKm: randFloat(50, 1200),
          durationMin: rand(60, 900),
          startAddress: `${originCity.name} Merkez`,
          startLat: originCity.lat,
          startLng: originCity.lng,
          endAddress: `${destCity.name} Merkez`,
          endLat: destCity.lat,
          endLng: destCity.lng,
          driverId: driver,
          vehicleId: vehicle,
          companyId: company.id,
        },
      });
      globalRouteIdx++;

      // Shipment
      const priority = pick(PRIORITIES);
      const trackingId = `LT-${slug}-${String(globalShipmentIdx).padStart(6, "0")}`;
      const weight = randFloat(100, 20000);

      await prisma.shipment.create({
        data: {
          trackingId,
          customerId: customer,
          driverId: driver,
          status: shipStatus,
          origin: `${originCity.name}, TR`,
          originLat: originCity.lat,
          originLng: originCity.lng,
          destination: `${destCity.name}, TR`,
          destinationLat: destCity.lat,
          destinationLng: destCity.lng,
          itemsCount: rand(1, 50),
          priority,
          type: pick(["Standard Freight", "Express", "Chilled", "Hazmat", "Oversized"]),
          slaDeadline: daysFromNow(rand(1, 14)),
          weightKg: weight,
          volumeM3: randFloat(0.5, 50),
          palletCount: randFloat(1, 26),
          cargoType: pick(CARGO_TYPES),
          contactEmail: `logistics@cust${customer.substring(0, 6)}.com`,
          routeId: route.id,
          companyId: company.id,
          history: {
            create: [
              {
                status: "PENDING",
                location: originCity.name,
                description: "Shipment created",
                createdAt: daysAgo(rand(5, 30)),
              },
              ...(["IN_TRANSIT", "DELIVERED", "COMPLETED"].includes(shipStatus)
                ? [
                    {
                      status: "IN_TRANSIT",
                      location: originCity.name,
                      description: "Departed from origin",
                      createdAt: daysAgo(rand(2, 4)),
                    },
                  ]
                : []),
              ...(["DELIVERED", "COMPLETED"].includes(shipStatus)
                ? [
                    {
                      status: shipStatus,
                      location: destCity.name,
                      description: "Successfully delivered",
                      createdAt: daysAgo(rand(0, 1)),
                    },
                  ]
                : []),
            ],
          },
        },
      });
      globalShipmentIdx++;
    }
    console.log(`    🚚 ${shipmentCount} sevkiyat & rota oluşturuldu`);

    // ── 3h. Fuel Logs ────────────────────────────────────────────────────────
    const fuelCount = Math.min(vehicleIds.length * 3, 100);
    for (let f = 0; f < fuelCount; f++) {
      const vId = pick(vehicleIds);
      const dId = driverIds.length > 0 ? pick(driverIds) : null;
      if (!dId) continue;
      const city = pick(CITIES);
      try {
        await prisma.fuelLog.create({
          data: {
            vehicleId: vId,
            driverId: dId,
            companyId: company.id,
            date: daysAgo(rand(0, 90)),
            volumeLiter: randFloat(50, 500),
            cost: randFloat(2000, 25000),
            odometerKm: rand(10000, 400000),
            location: `${city.name} Akaryakıt İstasyonu`,
            fuelType: pick(["DIESEL", "ELECTRIC_KWH", "LPG"]),
          },
        });
      } catch {
        // skip
      }
    }
    console.log(`    ⛽ ${fuelCount} yakıt kaydı oluşturuldu`);

    // ── 3i. Issues ───────────────────────────────────────────────────────────
    const issueCount = rand(10, 20);
    for (let i = 0; i < issueCount; i++) {
      const iType = pick(ISSUE_TYPES);
      await prisma.issue.create({
        data: {
          title: generateIssueTitle(iType),
          description: `Detaylı açıklama: ${pick(["Acil müdahale gerekli.", "Takip altında.", "Çözüm bekleniyor.", "Yetkili bilgilendirildi."])}`,
          status: pick(ISSUE_STATUSES),
          priority: pick(ISSUE_PRIORITIES),
          type: iType,
          vehicleId: iType === "VEHICLE" ? pick(vehicleIds) : null,
          driverId: iType === "DRIVER" && driverIds.length > 0 ? pick(driverIds) : null,
          companyId: company.id,
        },
      });
    }
    console.log(`    🛑 ${issueCount} sorun kaydı oluşturuldu`);

    // ── 3j. Warehouse operator users ─────────────────────────────────────────
    for (let w = 0; w < warehouseIds.length; w++) {
      const email = `warehouse${w + 1}@${slug.toLowerCase()}.com`;
      const existing = await prisma.user.findUnique({ where: { email } });
      if (!existing) {
        await prisma.user.create({
          data: {
            email,
            name: pick(FIRST_NAMES),
            surname: pick(LAST_NAMES),
            password: hashedPassword,
            status: "ACTIVE",
            roleId: roles["Warehouse Operator"].id,
            companyId: company.id,
          },
        });
      }
    }
    console.log(`    🔑 Depo operatör hesapları oluşturuldu`);
  }

  // ── 4. Super Admin ──────────────────────────────────────────────────────────
  await prisma.user.upsert({
    where: { email: "superadmin@logitrack.com" },
    update: {},
    create: {
      email: "superadmin@logitrack.com",
      name: "Super",
      surname: "Admin",
      password: hashedPassword,
      status: "ACTIVE",
      roleId: roles["Super Admin"].id,
    },
  });
  console.log("\n  🌟 Super Admin: superadmin@logitrack.com");

  // ── Summary ─────────────────────────────────────────────────────────────────
  const counts = {
    companies: await prisma.company.count(),
    users: await prisma.user.count(),
    drivers: await prisma.driver.count(),
    vehicles: await prisma.vehicle.count(),
    warehouses: await prisma.warehouse.count(),
    customers: await prisma.customer.count(),
    shipments: await prisma.shipment.count(),
    routes: await prisma.route.count(),
    inventory: await prisma.inventory.count(),
    issues: await prisma.issue.count(),
    fuelLogs: await prisma.fuelLog.count(),
    documents: await prisma.document.count(),
    maintenance: await prisma.maintenanceRecord.count(),
  };

  console.log("\n  ─────────────────────────────────────────────");
  console.log("  📊 VERİTABANI ÖZET:");
  for (const [key, val] of Object.entries(counts)) {
    console.log(`     ${key.padEnd(14)}: ${val}`);
  }
  console.log("  ─────────────────────────────────────────────");
  console.log("\n  ✅ Seed tamamlandı!\n");
  console.log("  🔑 Tüm hesaplar için şifre: 3121283455Em!\n");
  console.log("  Hesaplar:");
  console.log("    superadmin@logitrack.com");
  for (const slug of companySlugs) {
    const s = slug.toLowerCase();
    console.log(`    admin@${s}.com | manager@${s}.com | dispatcher@${s}.com | driver.${s}.1@logitrack.com`);
  }
}

// ─── helpers ──────────────────────────────────────────────────────────────────
function generatePlate(idx: number): string {
  const city = TURKISH_CITY_CODES[idx % TURKISH_CITY_CODES.length];
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const l1 = letters[(idx * 3) % 26];
  const l2 = letters[(idx * 7 + 5) % 26];
  const l3 = letters[(idx * 13 + 11) % 26];
  const num = String(rand(1, 9999)).padStart(4, "0");
  return `${city} ${l1}${l2}${l3} ${num}`;
}

function generateIssueTitle(type: string): string {
  const titles: Record<string, string[]> = {
    VEHICLE: [
      "Motor Arızası - Acil Bakım",
      "Fren Sistemi Arızası",
      "Lastik Patlaması",
      "Elektrik Arızası",
      "Muayene Süresi Doldu",
      "Ruhsat Yenileme Gerekli",
      "Soğutma Sistemi Arızası",
    ],
    DRIVER: [
      "Ehliyet Süresi Dolmak Üzere",
      "Mazeret İzin Talebi",
      "Sağlık Raporu Gerekli",
      "Taşıt Hasar Bildirimi",
      "Kaza Raporu",
    ],
    SHIPMENT: [
      "Teslimat Gecikme",
      "Hasar Bildirimi",
      "Kayıp Kargo",
      "Yanlış Adres Teslimat",
      "Gümrük Beklemesi",
    ],
    OTHER: [
      "Sistem Güncelleme Gerekli",
      "Depo Doluluk Uyarısı",
      "Müşteri Şikayeti",
      "Tedarikçi Gecikmesi",
    ],
  };
  return pick(titles[type] ?? titles["OTHER"]);
}

const TURKISH_CITY_CODES = [
  "01","02","03","04","05","06","07","08","09","10",
  "11","12","13","14","15","16","17","18","19","20",
  "21","22","23","24","25","26","27","28","29","30",
  "31","33","34","35","36","37","38","39","40","41",
  "42","43","44","45","46","47","48","49","50",
  "51","52","53","54","55","56","57","58","59","60",
  "61","62","63","64","65","66","67","68","69","70",
  "71","72","73","74","75","76","77","78","79","80",
  "81",
];

main()
  .catch((e) => {
    console.error("❌ Seed hatası:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

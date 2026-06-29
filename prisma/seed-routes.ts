/**
 * LogiTrack v2 — Routes & Shipments Quality Seed
 * ================================================
 * 12 realistic multi-stop corridors across Turkey with real geo-coordinates.
 * ShipmentStops are created for EVERY stop on the route:
 *   sequence 1  = origin
 *   sequence 2…n-1 = waypoints
 *   sequence n  = destination
 *
 * Run after main seed:
 *   npx tsx prisma/seed-routes.ts
 */

import {
  PrismaClient,
  RouteStatus,
  ShipmentStatus,
  ShipmentPriority,
} from "@prisma/client";

const prisma = new PrismaClient();

// ─── Helpers ─────────────────────────────────────────────────────────────────

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(2));
const pick = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
const daysFromNow = (n: number) => new Date(Date.now() + n * 86_400_000);
const pad = (n: number, len = 3) => String(n).padStart(len, "0");

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Real Turkish Logistics Hubs ─────────────────────────────────────────────

const H = {
  // ── Istanbul & Marmara ──────────────────────────────────────────────────────
  IST_HADIMKOY:    { lat: 41.1168, lng: 28.6854, address: "İstanbul Lojistik Köyü, Hadımköy, İstanbul" },
  IST_HALKALI:     { lat: 41.0150, lng: 28.7813, address: "Halkalı TIR Parkı, Küçükçekmece, İstanbul" },
  IST_TUZLA:       { lat: 40.8197, lng: 29.3008, address: "Tuzla Serbest Bölge Lojistik, Tuzla, İstanbul" },
  IST_AVCILAR:     { lat: 40.9811, lng: 28.7178, address: "Avcılar Lojistik Merkezi, Avcılar, İstanbul" },
  IST_GEBZE:       { lat: 40.7969, lng: 29.4305, address: "Gebze OSB Lojistik Kapısı, Gebze, Kocaeli" },
  TEKIRDAG_CORLU:  { lat: 40.9833, lng: 27.5085, address: "Çorlu OSB Lojistik Alanı, Çorlu, Tekirdağ" },
  YALOVA:          { lat: 40.6553, lng: 29.2737, address: "Yalova İskele Taşıma Noktası, Yalova" },
  OSMANGAZI_BRJ:   { lat: 40.4972, lng: 29.0547, address: "Osmangazi Köprüsü Kavşağı, Gemlik, Bursa" },

  // ── Highway Stops & Service Areas ──────────────────────────────────────────
  IZMIT:           { lat: 40.7654, lng: 29.9408, address: "Kocaeli TIR Parkı & Akaryakıt, İzmit, Kocaeli" },
  DUZCE:           { lat: 40.8428, lng: 31.1565, address: "Düzce TEM Mola Tesisi, Düzce" },
  BOLU_GECIT:      { lat: 40.7134, lng: 31.5567, address: "Bolu Dağı Tesisleri, TEM Otoyolu, Bolu" },
  ESKISEHIR:       { lat: 39.7767, lng: 30.5206, address: "Eskişehir OSB Lojistik Kapısı, Odunpazarı, Eskişehir" },
  AFYON_TIR:       { lat: 38.7574, lng: 30.5394, address: "Afyonkarahisar TIR Parkı, Afyonkarahisar" },
  USAK:            { lat: 38.6823, lng: 29.4082, address: "Uşak Çevre Yolu Kavşağı, Uşak" },
  POZANTI:         { lat: 37.4250, lng: 34.8702, address: "Pozantı TEM Kavşağı & Mola, Adana" },
  AKSARAY:         { lat: 38.3695, lng: 33.9869, address: "Aksaray OSB Depo Alanı, Aksaray" },
  NIGDE:           { lat: 37.9667, lng: 34.6836, address: "Niğde Çevre Yolu Mola Noktası, Niğde" },
  BURDUR:          { lat: 37.7153, lng: 30.2885, address: "Burdur Çevre Yolu Kavşağı, Burdur" },
  SILIFKE:         { lat: 36.3786, lng: 33.9306, address: "Silifke TEM Kavşağı, Silifke, Mersin" },
  ADANA_BOLGESI:   { lat: 37.0515, lng: 35.3605, address: "Adana Bölge Ambarı, Seyhan, Adana" },
  DENIZLI_OSB:     { lat: 37.7749, lng: 29.0865, address: "Denizli Servergazi OSB, Honaz, Denizli" },
  KONYA_CEV:       { lat: 37.9523, lng: 32.5023, address: "Konya Kuzey Çevre Yolu Mola, Karatay, Konya" },

  // ── Destination Logistics Zones ─────────────────────────────────────────────
  ANKARA_OSTIM:    { lat: 39.9208, lng: 32.7821, address: "Ostim OSB Lojistik Merkezi, Yenimahalle, Ankara" },
  ANKARA_MACUN:    { lat: 39.9658, lng: 32.7823, address: "Macunköy Lojistik Bölgesi, Keçiören, Ankara" },
  BURSA_OSB:       { lat: 40.2186, lng: 29.0046, address: "Bursa OSB Sevkiyat Kapısı, Nilüfer, Bursa" },
  IZMIR_TORBALI:   { lat: 38.1580, lng: 27.3557, address: "Torbalı OSB Lojistik, Torbalı, İzmir" },
  IZMIR_KEMALPASA: { lat: 38.5574, lng: 27.4203, address: "Kemalpaşa OSB, Kemalpaşa, İzmir" },
  ANTALYA_DOSB:    { lat: 36.9614, lng: 30.6256, address: "Antalya Deri ve Sanayi OSB, Kepez, Antalya" },
  ANTALYA_LIMAN:   { lat: 36.8413, lng: 30.6383, address: "Antalya Liman Lojistik Merkezi, Muratpaşa, Antalya" },
  KONYA_OSB:       { lat: 37.8746, lng: 32.4932, address: "Konya OSB Sevkiyat, Karatay, Konya" },
  ADANA_HSABANCI:  { lat: 37.0833, lng: 35.3283, address: "Adana Hacı Sabancı OSB, Seyhan, Adana" },
  GAZIANTEP_OSB:   { lat: 37.0662, lng: 37.3833, address: "Gaziantep OSB Lojistik Kapısı, Şahinbey, Gaziantep" },
  MERSIN_PORT:     { lat: 36.7989, lng: 34.6255, address: "Mersin Uluslararası Limanı, Akdeniz, Mersin" },
  KAYSERI_OSB:     { lat: 38.7312, lng: 35.4787, address: "Kayseri OSB Lojistik Alanı, Melikgazi, Kayseri" },
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface Hub {
  lat: number;
  lng: number;
  address: string;
}

interface CargoItem {
  sku: string;
  name: string;
  unit: string;
  weightKg: number;
  volumeM3: number;
  palletCount: number;
}

interface Cargo {
  type: string;
  items: CargoItem[];
}

interface RouteTemplate {
  code: string;
  corridor: string;
  /** [0]=origin · [1..n-2]=waypoints · [-1]=destination */
  stops: Hub[];
  distanceKm: number;
  durationMin: number;
  shipmentCount: number;
}

// ─── Cargo Scenarios ─────────────────────────────────────────────────────────

const CARGO: Cargo[] = [
  {
    type: "Automotive Parts",
    items: [
      { sku: "AUTO-ENG-001", name: "Motor Bloğu Tertibatı",               unit: "Adet",   weightKg: 180,  volumeM3: 0.40,   palletCount: 4   },
      { sku: "AUTO-GBX-002", name: "Şanzıman Ünitesi",                    unit: "Adet",   weightKg: 55,   volumeM3: 0.15,   palletCount: 8   },
      { sku: "AUTO-AXL-003", name: "Arka Aks Takımı",                     unit: "Adet",   weightKg: 120,  volumeM3: 0.30,   palletCount: 6   },
    ],
  },
  {
    type: "Electronics",
    items: [
      { sku: "ELEC-LCD-001", name: "LCD Panel 55\" (Kutulu)",              unit: "Adet",   weightKg: 18,   volumeM3: 0.18,   palletCount: 20  },
      { sku: "ELEC-PCB-002", name: "Baskılı Devre Kartı (Paket)",         unit: "Kutu",   weightKg: 8,    volumeM3: 0.04,   palletCount: 50  },
      { sku: "ELEC-SRV-003", name: "Rack Sunucu (1U, Kutu)",              unit: "Adet",   weightKg: 14,   volumeM3: 0.10,   palletCount: 10  },
    ],
  },
  {
    type: "Perishable",
    items: [
      { sku: "FOOD-FROZ-001", name: "Dondurulmuş Tavuk (IQF Blok)",      unit: "kg",     weightKg: 1,    volumeM3: 0.0013, palletCount: 800 },
      { sku: "FOOD-DAIRY-002", name: "UHT Süt (1L, 12'li Paket)",        unit: "Koli",   weightKg: 12,   volumeM3: 0.010,  palletCount: 72  },
    ],
  },
  {
    type: "General Cargo",
    items: [
      { sku: "GEN-PALET-001", name: "Karma FMCG Palet (Karışık)",        unit: "Palet",  weightKg: 720,  volumeM3: 1.20,   palletCount: 1   },
      { sku: "GEN-BOX-002",   name: "Standart Koli (18 kg Brüt)",        unit: "Adet",   weightKg: 15,   volumeM3: 0.065,  palletCount: 18  },
    ],
  },
  {
    type: "Hazardous Material",
    items: [
      { sku: "HAZ-SOLV-001", name: "Endüstriyel Solvent (200L Varil)",   unit: "Varil",  weightKg: 175,  volumeM3: 0.21,   palletCount: 4   },
      { sku: "HAZ-ACID-002", name: "Sülfürik Asit Çözeltisi (%30)",      unit: "Varil",  weightKg: 210,  volumeM3: 0.22,   palletCount: 4   },
    ],
  },
  {
    type: "Textile",
    items: [
      { sku: "TEX-RULO-001",  name: "Denim Kumaş Rulo (100m)",           unit: "Rulo",   weightKg: 35,   volumeM3: 0.090,  palletCount: 15  },
      { sku: "TEX-HAZIR-002", name: "Hazır Giyim (Boxed)",               unit: "Kutu",   weightKg: 12,   volumeM3: 0.050,  palletCount: 24  },
    ],
  },
  {
    type: "Construction Materials",
    items: [
      { sku: "CON-CERM-001",  name: "Seramik Karo (60×60, Koli)",        unit: "m²",     weightKg: 22,   volumeM3: 0.035,  palletCount: 28  },
      { sku: "CON-STBAR-002", name: "İnşaat Çeliği Çubuk (12mm)",        unit: "Ton",    weightKg: 1000, volumeM3: 0.130,  palletCount: 1   },
    ],
  },
];

// ─── Route Templates ─────────────────────────────────────────────────────────
// stops[0]  = origin depot
// stops[-1] = final delivery hub
// stops in between = real highway rest-stops / transfer hubs

const ROUTES: RouteTemplate[] = [
  // 1. Istanbul → Ankara (TEM Otoyolu)
  {
    code: "IST-ANK",
    corridor: "Marmara – Ankara Ekspres",
    stops: [ H.IST_HADIMKOY, H.IZMIT, H.BOLU_GECIT, H.ANKARA_OSTIM ],
    distanceKm: 458, durationMin: 350, shipmentCount: 3,
  },
  // 2. Ankara → İzmir (Eskişehir – Afyon – Uşak)
  {
    code: "ANK-IZM",
    corridor: "Ankara – İzmir Karayolu",
    stops: [ H.ANKARA_MACUN, H.ESKISEHIR, H.AFYON_TIR, H.USAK, H.IZMIR_KEMALPASA ],
    distanceKm: 596, durationMin: 435, shipmentCount: 3,
  },
  // 3. Istanbul → Bursa (Osmangazi Köprüsü)
  {
    code: "IST-BRS",
    corridor: "Marmara Otoyolu – Osmangazi Köprüsü",
    stops: [ H.IST_AVCILAR, H.OSMANGAZI_BRJ, H.BURSA_OSB ],
    distanceKm: 155, durationMin: 115, shipmentCount: 2,
  },
  // 4. Ankara → Konya → Adana (İç Anadolu – Akdeniz)
  {
    code: "ANK-ADN",
    corridor: "İç Anadolu – Akdeniz Koridoru",
    stops: [ H.ANKARA_OSTIM, H.KONYA_CEV, H.POZANTI, H.ADANA_HSABANCI ],
    distanceKm: 489, durationMin: 328, shipmentCount: 3,
  },
  // 5. İzmir → Antalya (Ege – Akdeniz)
  {
    code: "IZM-ANT",
    corridor: "Ege – Akdeniz Koridoru",
    stops: [ H.IZMIR_TORBALI, H.DENIZLI_OSB, H.BURDUR, H.ANTALYA_DOSB ],
    distanceKm: 344, durationMin: 242, shipmentCount: 2,
  },
  // 6. Bursa → Gebze (Osmangazi dönüş)
  {
    code: "BRS-GBZ",
    corridor: "Bursa – Gebze Dönüş",
    stops: [ H.BURSA_OSB, H.YALOVA, H.IST_GEBZE ],
    distanceKm: 134, durationMin: 108, shipmentCount: 2,
  },
  // 7. Istanbul → Gaziantep (Güneydoğu Ekspresi)
  {
    code: "IST-GAZ",
    corridor: "İstanbul – Güneydoğu Ekspresi",
    stops: [ H.IST_HALKALI, H.ANKARA_OSTIM, H.ADANA_BOLGESI, H.GAZIANTEP_OSB ],
    distanceKm: 1108, durationMin: 720, shipmentCount: 3,
  },
  // 8. Mersin Port → Kayseri (Limandan İç Hatta)
  {
    code: "MRS-KSR",
    corridor: "Mersin Limanı – Kayseri Hattı",
    stops: [ H.MERSIN_PORT, H.ADANA_BOLGESI, H.NIGDE, H.KAYSERI_OSB ],
    distanceKm: 323, durationMin: 214, shipmentCount: 2,
  },
  // 9. Istanbul → Tekirdağ (Trakya Hattı)
  {
    code: "IST-TKD",
    corridor: "İstanbul – Trakya Hattı",
    stops: [ H.IST_HALKALI, H.TEKIRDAG_CORLU ],
    distanceKm: 143, durationMin: 118, shipmentCount: 2,
  },
  // 10. Konya → Antalya (Burdur üzerinden)
  {
    code: "KNY-ANT",
    corridor: "Konya – Antalya Dağ Yolu",
    stops: [ H.KONYA_OSB, H.BURDUR, H.ANTALYA_LIMAN ],
    distanceKm: 218, durationMin: 162, shipmentCount: 2,
  },
  // 11. Istanbul → Konya (Orta Anadolu)
  {
    code: "IST-KNY",
    corridor: "İstanbul – Orta Anadolu Hattı",
    stops: [ H.IST_TUZLA, H.IZMIT, H.AKSARAY, H.KONYA_OSB ],
    distanceKm: 562, durationMin: 382, shipmentCount: 3,
  },
  // 12. Kayseri → Gaziantep (Doğu – Güneydoğu)
  {
    code: "KSR-GAZ",
    corridor: "Kayseri – Gaziantep Hattı",
    stops: [ H.KAYSERI_OSB, H.ADANA_BOLGESI, H.GAZIANTEP_OSB ],
    distanceKm: 355, durationMin: 237, shipmentCount: 2,
  },
];

// ─── Status helpers ───────────────────────────────────────────────────────────

const ROUTE_STATUSES: RouteStatus[] = [
  "COMPLETED", "COMPLETED", "COMPLETED",
  "ACTIVE",
  "PLANNED", "PLANNED",
  "CANCELED",
];

function shipmentStatusFor(routeStatus: RouteStatus, idx: number): ShipmentStatus {
  if (routeStatus === "COMPLETED") return "DELIVERED";
  if (routeStatus === "ACTIVE")    return idx === 0 ? "IN_TRANSIT" : "ASSIGNED";
  if (routeStatus === "CANCELED")  return "CANCELLED";
  return idx === 0 ? "ASSIGNED" : "PENDING";
}

/**
 * Returns the correct ShipmentStatus for each stop in the full stop list.
 *
 * stopIdx = 0-based index within allStops (0 = origin, last = destination)
 * totalStops = allStops.length
 * shipmentStatus = the overall status of the shipment
 */
function stopStatusFor(
  shipmentStatus: ShipmentStatus,
  stopIdx: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _totalStops: number,
): ShipmentStatus {

  switch (shipmentStatus) {
    case "DELIVERED":
      return "DELIVERED";

    case "IN_TRANSIT":
      // Origin already departed → DELIVERED at that stop
      if (stopIdx === 0) return "DELIVERED";
      // The first waypoint is currently in transit
      if (stopIdx === 1) return "IN_TRANSIT";
      // Everything ahead is still pending
      return "PENDING";

    case "ASSIGNED":
      // Loaded at origin but not yet departed
      if (stopIdx === 0) return "PROCESSING";
      return "PENDING";

    case "CANCELLED":
      return "CANCELLED";

    case "PENDING":
    default:
      return "PENDING";
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚛 LogiTrack v2 — Routes & Shipments Quality Seed");
  console.log("═══════════════════════════════════════════════════\n");

  // ── 1. Load companies ──────────────────────────────────────────────────────
  const companies = await prisma.company.findMany({
    include: {
      vehicles:   { select: { id: true, plate: true, fuelLevel: true, currentLat: true, currentLng: true } },
      drivers:    { select: { id: true, currentVehicleId: true } },
      warehouses: { select: { id: true } },
      customers:  { select: { id: true } },
      trailers:   { select: { id: true } },
    },
  });

  if (companies.length === 0) {
    console.error("❌  No companies found — run `npx tsx prisma/seed.ts` first.");
    process.exit(1);
  }
  console.log(`🏢  Found ${companies.length} compan${companies.length === 1 ? "y" : "ies"}.`);

  // ── 2. Clear existing routes & shipments ───────────────────────────────────
  console.log("🗑️   Clearing existing routes and shipments...");
  await prisma.issue.updateMany({ data: { shipmentId: null } });
  await prisma.deliveryAttempt.deleteMany({});
  await prisma.shipmentHistory.deleteMany({});
  await prisma.shipmentItem.deleteMany({});
  await prisma.shipmentStop.deleteMany({});
  await prisma.shipment.deleteMany({});
  await prisma.route.deleteMany({});
  console.log("  ✅ Cleared.\n");

  // ── 3. Seed per company ────────────────────────────────────────────────────
  let totalRoutes    = 0;
  let totalShipments = 0;
  let totalStops     = 0;

  for (let companyIdx = 0; companyIdx < companies.length; companyIdx++) {
    const company = companies[companyIdx];
    console.log(`🏢  ${company.name}`);

    if (company.vehicles.length === 0 || company.drivers.length === 0) {
      console.log("   ⚠️  No vehicles or drivers — skipping.\n");
      continue;
    }

    const templates = shuffled([...ROUTES]);
    let routeSeq = 0;

    for (const tmpl of templates) {
      routeSeq++;

      const cargo       = pick(CARGO);
      const routeStatus = pick(ROUTE_STATUSES);
      const vehicle     = pick(company.vehicles);
      const driver      =
        company.drivers.find((d) => d.currentVehicleId === vehicle.id) ??
        pick(company.drivers);

      const dateOffset =
        routeStatus === "COMPLETED" ? -rand(1, 14) :
        routeStatus === "ACTIVE"    ?  0            :
        routeStatus === "PLANNED"   ?  rand(1, 7)   : -rand(1, 3);

      const routeDate = new Date(Date.now() + dateOffset * 86_400_000);
      routeDate.setHours(rand(5, 9), 0, 0, 0);

      const endTime =
        routeStatus === "COMPLETED"
          ? new Date(routeDate.getTime() + (tmpl.durationMin + rand(10, 60)) * 60_000)
          : null;

      // Route stops JSON — ALL stops with type labels
      const stopsJson = tmpl.stops.map((s, i) => ({
        sequence: i + 1,
        lat:      s.lat,
        lng:      s.lng,
        address:  s.address,
        type:
          i === 0                     ? "ORIGIN"      :
          i === tmpl.stops.length - 1 ? "DESTINATION" : "WAYPOINT",
      }));

      const route = await prisma.route.create({
        data: {
          name:        `${tmpl.code}-${pad(routeSeq)}`,
          status:       routeStatus,
          date:         routeDate,
          startTime:    routeStatus !== "PLANNED" && routeStatus !== "CANCELED"
                          ? routeDate
                          : null,
          endTime,
          distanceKm:   tmpl.distanceKm + randFloat(-5, 5),
          durationMin:   tmpl.durationMin + rand(-10, 10),
          driverId:      driver.id,
          vehicleId:     vehicle.id,
          companyId:     company.id,
          stops:         stopsJson,
        },
      });

      totalRoutes++;

      const allStops    = tmpl.stops;                     // origin + waypoints + destination
      const origin      = allStops[0];
      const destination = allStops[allStops.length - 1];
      const waypoints   = allStops.slice(1, -1);

      // ── Shipments per route ───────────────────────────────────────────────
      for (let si = 0; si < tmpl.shipmentCount; si++) {
        const item     = pick(cargo.items);
        const qty      = rand(20, 350);
        const pallets  = Math.max(1, Math.ceil(qty / (item.palletCount || 1)));
        const status   = shipmentStatusFor(routeStatus, si);
        const priority = pick(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const);
        const customer  = pick(company.customers);
        const warehouse = pick(company.warehouses);
        const trailer   = company.trailers.length > 0 ? pick(company.trailers) : null;

        const trackingId = `LT-C${companyIdx + 1}-${tmpl.code}-${pad(routeSeq)}-S${si + 1}`;

        const shipment = await prisma.shipment.create({
          data: {
            trackingId,
            customerId:        customer.id,
            driverId:          driver.id,
            status,
            priority:          priority as ShipmentPriority,
            type:              "Standard Freight",
            origin:            origin.address,
            originLat:         origin.lat,
            originLng:         origin.lng,
            destination:       destination.address,
            destinationLat:    destination.lat,
            destinationLng:    destination.lng,
            weightKg:          randFloat(qty * item.weightKg * 0.9, qty * item.weightKg * 1.1),
            volumeM3:          randFloat(qty * item.volumeM3 * 0.9, qty * item.volumeM3 * 1.1),
            palletCount:       pallets,
            cargoType:         cargo.type,
            itemsCount:        1,
            billingAccount:    "Net-30 Kurumsal",
            slaDeadline:       status === "DELIVERED" ? daysAgo(rand(0, 2)) : daysFromNow(rand(1, 7)),
            routeId:           route.id,
            companyId:         company.id,
            originWarehouseId: warehouse.id,
            ...(trailer ? { trailerId: trailer.id } : {}),
          },
        });

        totalShipments++;

        // ── ShipmentItem ───────────────────────────────────────────────────
        await prisma.shipmentItem.create({
          data: {
            shipmentId:  shipment.id,
            sku:         `${item.sku}-${rand(100, 999)}`,
            name:        item.name,
            quantity:    qty,
            unit:        item.unit,
            weightKg:    item.weightKg,
            volumeM3:    item.volumeM3,
            palletCount: item.palletCount,
            cargoType:   cargo.type,
          },
        });

        // ── ShipmentStops — ALL stops: origin + waypoints + destination ────
        //
        // Time model:
        //   Stop i arrives at:  routeDate + (durationMin * i/(n-1)) minutes
        //   Dwell time at origin = 15-30 min (loading)
        //   Dwell time at waypoints = 10-20 min (rest/fuel)
        //   Destination dwell omitted (shipment complete)
        //
        // Status model:
        //   DELIVERED  → every stop DELIVERED
        //   IN_TRANSIT → origin=DELIVERED, stop[1]=IN_TRANSIT, rest=PENDING
        //   ASSIGNED   → origin=PROCESSING, rest=PENDING
        //   CANCELLED  → every stop CANCELLED
        //   PENDING    → every stop PENDING

        for (let stopIdx = 0; stopIdx < allStops.length; stopIdx++) {
          const hub      = allStops[stopIdx];
          const isOrigin = stopIdx === 0;
          const isDest   = stopIdx === allStops.length - 1;
          const n        = allStops.length;

          // Proportional time offset within total route duration
          const arrivalOffsetMin  = Math.round(tmpl.durationMin * stopIdx / (n - 1));
          const dwellMin          = isOrigin ? rand(15, 30) : isDest ? 0 : rand(10, 20);
          const departureOffsetMin = arrivalOffsetMin + dwellMin;

          const arrivalMs   = routeDate.getTime() + arrivalOffsetMin  * 60_000;
          const departureMs = routeDate.getTime() + departureOffsetMin * 60_000;

          const stopSts = stopStatusFor(status, stopIdx, n);

          // Only set timestamps when the stop has actually been reached
          const hasReached =
            status === "DELIVERED" ||
            (status === "IN_TRANSIT" && stopIdx <= 1) ||
            (status === "ASSIGNED"   && stopIdx === 0);

          await prisma.shipmentStop.create({
            data: {
              shipmentId:    shipment.id,
              address:       hub.address,
              lat:           hub.lat,
              lng:           hub.lng,
              sequence:      stopIdx + 1,
              status:        stopSts,
              arrivalDate:   hasReached ? new Date(arrivalMs)   : null,
              departureDate: hasReached && !isDest ? new Date(departureMs) : null,
            },
          });

          totalStops++;
        }

        // ── ShipmentHistory ────────────────────────────────────────────────
        const historySteps: { status: string; location: string; description: string }[] = [
          {
            status:      "PROCESSING",
            location:    origin.address.split(",")[0],
            description: "Yük doğrulandı ve sevkiyata hazırlandı.",
          },
        ];

        if (["ASSIGNED", "IN_TRANSIT", "DELIVERED"].includes(status)) {
          historySteps.push({
            status:      "ASSIGNED",
            location:    origin.address.split(",")[0],
            description: `Araç ${vehicle.plate} atandı. Sürücü harekete geçti.`,
          });
        }

        if (["IN_TRANSIT", "DELIVERED"].includes(status)) {
          historySteps.push({
            status:      "IN_TRANSIT",
            location:    origin.address.split(",")[0],
            description: "Yük kalkış noktasından ayrıldı. Rota üzerinde ilerliyor.",
          });

          for (const wp of waypoints) {
            historySteps.push({
              status:      "IN_TRANSIT",
              location:    wp.address.split(",")[0],
              description: "Ara durak geçildi. Teslimat noktasına doğru devam ediyor.",
            });
          }
        }

        if (status === "DELIVERED") {
          historySteps.push({
            status:      "DELIVERED",
            location:    destination.address.split(",")[0],
            description: "Yük teslim edildi ve alıcı tarafından imzalandı.",
          });
        }

        if (status === "CANCELLED") {
          historySteps.push({
            status:      "CANCELLED",
            location:    origin.address.split(",")[0],
            description: "Sevkiyat iptal edildi — rota durumu CANCELED.",
          });
        }

        for (const step of historySteps) {
          await prisma.shipmentHistory.create({
            data: {
              shipmentId:  shipment.id,
              status:      step.status,
              location:    step.location,
              description: step.description,
            },
          });
        }
      }

      const icon =
        routeStatus === "COMPLETED" ? "✅" :
        routeStatus === "ACTIVE"    ? "🟢" :
        routeStatus === "PLANNED"   ? "🔵" : "🔴";

      console.log(
        `   ${icon} ${route.name}  [${routeStatus}]  ` +
        `${allStops.length} stops · ${tmpl.distanceKm} km · ` +
        `${tmpl.shipmentCount} shipment${tmpl.shipmentCount > 1 ? "s" : ""}`,
      );
    }

    console.log();
  }

  // ── 4. Summary ────────────────────────────────────────────────────────────
  console.log("═══════════════════════════════════════════════════");
  console.log(`✨  Routes:      ${totalRoutes}`);
  console.log(`📦  Shipments:   ${totalShipments}`);
  console.log(`📍  Stop rows:   ${totalStops}`);
  console.log(`🏢  Companies:   ${companies.length}`);
  console.log("═══════════════════════════════════════════════════\n");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

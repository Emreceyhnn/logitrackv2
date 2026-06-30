/**
 * LogiTrack v2 — Master Seed
 * ===========================
 * Clears & rebuilds the entire database.
 *
 * Scale (per company):
 *   40 Vehicles · 36 Drivers · 5 Warehouses · 20 Customers
 *   30 Trailers · 12 High-quality Routes · ~30 Shipments with real stops
 *
 * Password for ALL accounts: 3121283455Em!
 *
 * Run:  npm run db:seed
 */

import {
  PrismaClient,
  DriverStatus,
  VehicleStatus,
  WarehouseType,
  RouteStatus,
  TrailerType,
  TrailerStatus,
  ShipmentStatus,
  ShipmentPriority,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { adminDb } from "../app/lib/firebase-admin";
import rolesConfig from "../roles.json";

const prisma = new PrismaClient();

// ─── Config ───────────────────────────────────────────────────────────────────
const HASH_ROUNDS = 10;
const PASSWORD = "3121283455Em!";
const VEHICLES_PER_COMPANY = 40;
const DRIVERS_PER_COMPANY = 36;
const WAREHOUSES_PER_COMPANY = 5;
const CUSTOMERS_PER_COMPANY = 20;

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

// ─── Static company definitions ───────────────────────────────────────────────
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
  { name: "Bursa", lat: 40.1885, lng: 29.061 },
  { name: "Antalya", lat: 36.8969, lng: 30.7133 },
  { name: "Adana", lat: 37.0, lng: 35.3213 },
  { name: "Konya", lat: 37.8746, lng: 32.4932 },
  { name: "Gaziantep", lat: 37.0662, lng: 37.3833 },
  { name: "Mersin", lat: 36.8, lng: 34.6333 },
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
  {
    sku: "PALET-STD",
    name: "Standard EURO Pallet (Mixed)",
    unit: "Pallet",
    cargo: "General Cargo",
    palletCount: 1,
    weightKg: 25,
    volumeM3: 1.2,
  },
  {
    sku: "KOLI-KRT-B",
    name: "Large Cardboard Box (Electronics)",
    unit: "Each",
    cargo: "General Cargo",
    palletCount: 20,
    weightKg: 15,
    volumeM3: 0.06,
  },
  {
    sku: "AKUM-12V",
    name: "High-Capacity Battery 12V",
    unit: "Each",
    cargo: "Automotive Parts",
    palletCount: 40,
    weightKg: 22,
    volumeM3: 0.025,
  },
  {
    sku: "GSDA-DON",
    name: "Frozen Meat (Industrial Bulk)",
    unit: "kg",
    cargo: "Perishable",
    palletCount: 600,
    weightKg: 1,
    volumeM3: 0.0018,
  },
  {
    sku: "KMKL-AZOT",
    name: "Nitrogen Cylinder (Industrial)",
    unit: "Cylinder",
    cargo: "Hazardous Material",
    palletCount: 8,
    weightKg: 65,
    volumeM3: 0.12,
  },
  {
    sku: "TEKS-RULO",
    name: "Textile Fabric Roll",
    unit: "Roll",
    cargo: "General Cargo",
    palletCount: 15,
    weightKg: 30,
    volumeM3: 0.08,
  },
];

const FIRST_NAMES = [
  "Ahmet",
  "Mehmet",
  "Mustafa",
  "Ali",
  "Hüseyin",
  "Hasan",
  "İbrahim",
  "İsmail",
  "Ömer",
  "Yusuf",
  "Murat",
  "Osman",
  "Ramazan",
  "Serkan",
  "Burak",
  "Emre",
  "Can",
  "Berk",
];
const LAST_NAMES = [
  "Yılmaz",
  "Kaya",
  "Demir",
  "Şahin",
  "Arslan",
  "Doğan",
  "Çelik",
  "Aydın",
  "Öztürk",
  "Yıldız",
  "Güneş",
  "Aksoy",
  "Koç",
  "Çetin",
];

// ─── Real Turkish Logistics Hubs ──────────────────────────────────────────────
const H = {
  IST_HADIMKOY: {
    lat: 41.1168,
    lng: 28.6854,
    address: "İstanbul Lojistik Köyü, Hadımköy, İstanbul",
  },
  IST_HALKALI: {
    lat: 41.015,
    lng: 28.7813,
    address: "Halkalı TIR Parkı, Küçükçekmece, İstanbul",
  },
  IST_TUZLA: {
    lat: 40.8197,
    lng: 29.3008,
    address: "Tuzla Serbest Bölge Lojistik, Tuzla, İstanbul",
  },
  IST_AVCILAR: {
    lat: 40.9811,
    lng: 28.7178,
    address: "Avcılar Lojistik Merkezi, Avcılar, İstanbul",
  },
  IST_GEBZE: {
    lat: 40.7969,
    lng: 29.4305,
    address: "Gebze OSB Lojistik Kapısı, Gebze, Kocaeli",
  },
  TEKIRDAG_CORLU: {
    lat: 40.9833,
    lng: 27.5085,
    address: "Çorlu OSB Lojistik Alanı, Çorlu, Tekirdağ",
  },
  YALOVA: {
    lat: 40.6553,
    lng: 29.2737,
    address: "Yalova İskele Taşıma Noktası, Yalova",
  },
  OSMANGAZI_BRJ: {
    lat: 40.4972,
    lng: 29.0547,
    address: "Osmangazi Köprüsü Kavşağı, Gemlik, Bursa",
  },
  IZMIT: {
    lat: 40.7654,
    lng: 29.9408,
    address: "Kocaeli TIR Parkı & Akaryakıt, İzmit, Kocaeli",
  },
  DUZCE: {
    lat: 40.8428,
    lng: 31.1565,
    address: "Düzce TEM Mola Tesisi, Düzce",
  },
  BOLU_GECIT: {
    lat: 40.7134,
    lng: 31.5567,
    address: "Bolu Dağı Tesisleri, TEM Otoyolu, Bolu",
  },
  ESKISEHIR: {
    lat: 39.7767,
    lng: 30.5206,
    address: "Eskişehir OSB Lojistik Kapısı, Odunpazarı, Eskişehir",
  },
  AFYON_TIR: {
    lat: 38.7574,
    lng: 30.5394,
    address: "Afyonkarahisar TIR Parkı, Afyonkarahisar",
  },
  USAK: {
    lat: 38.6823,
    lng: 29.4082,
    address: "Uşak Çevre Yolu Kavşağı, Uşak",
  },
  POZANTI: {
    lat: 37.425,
    lng: 34.8702,
    address: "Pozantı TEM Kavşağı & Mola, Adana",
  },
  AKSARAY: {
    lat: 38.3695,
    lng: 33.9869,
    address: "Aksaray OSB Depo Alanı, Aksaray",
  },
  NIGDE: {
    lat: 37.9667,
    lng: 34.6836,
    address: "Niğde Çevre Yolu Mola Noktası, Niğde",
  },
  BURDUR: {
    lat: 37.7153,
    lng: 30.2885,
    address: "Burdur Çevre Yolu Kavşağı, Burdur",
  },
  SILIFKE: {
    lat: 36.3786,
    lng: 33.9306,
    address: "Silifke TEM Kavşağı, Silifke, Mersin",
  },
  ADANA_BOLGESI: {
    lat: 37.0515,
    lng: 35.3605,
    address: "Adana Bölge Ambarı, Seyhan, Adana",
  },
  DENIZLI_OSB: {
    lat: 37.7749,
    lng: 29.0865,
    address: "Denizli Servergazi OSB, Honaz, Denizli",
  },
  KONYA_CEV: {
    lat: 37.9523,
    lng: 32.5023,
    address: "Konya Kuzey Çevre Yolu Mola, Karatay, Konya",
  },
  ANKARA_OSTIM: {
    lat: 39.9208,
    lng: 32.7821,
    address: "Ostim OSB Lojistik Merkezi, Yenimahalle, Ankara",
  },
  ANKARA_MACUN: {
    lat: 39.9658,
    lng: 32.7823,
    address: "Macunköy Lojistik Bölgesi, Keçiören, Ankara",
  },
  BURSA_OSB: {
    lat: 40.2186,
    lng: 29.0046,
    address: "Bursa OSB Sevkiyat Kapısı, Nilüfer, Bursa",
  },
  IZMIR_TORBALI: {
    lat: 38.158,
    lng: 27.3557,
    address: "Torbalı OSB Lojistik, Torbalı, İzmir",
  },
  IZMIR_KEMALPASA: {
    lat: 38.5574,
    lng: 27.4203,
    address: "Kemalpaşa OSB, Kemalpaşa, İzmir",
  },
  ANTALYA_DOSB: {
    lat: 36.9614,
    lng: 30.6256,
    address: "Antalya Deri ve Sanayi OSB, Kepez, Antalya",
  },
  ANTALYA_LIMAN: {
    lat: 36.8413,
    lng: 30.6383,
    address: "Antalya Liman Lojistik Merkezi, Muratpaşa, Antalya",
  },
  KONYA_OSB: {
    lat: 37.8746,
    lng: 32.4932,
    address: "Konya OSB Sevkiyat, Karatay, Konya",
  },
  ADANA_HSABANCI: {
    lat: 37.0833,
    lng: 35.3283,
    address: "Adana Hacı Sabancı OSB, Seyhan, Adana",
  },
  GAZIANTEP_OSB: {
    lat: 37.0662,
    lng: 37.3833,
    address: "Gaziantep OSB Lojistik Kapısı, Şahinbey, Gaziantep",
  },
  MERSIN_PORT: {
    lat: 36.7989,
    lng: 34.6255,
    address: "Mersin Uluslararası Limanı, Akdeniz, Mersin",
  },
  KAYSERI_OSB: {
    lat: 38.7312,
    lng: 35.4787,
    address: "Kayseri OSB Lojistik Alanı, Melikgazi, Kayseri",
  },
};

const EXTRA_LOCATIONS = [
  { address: "İkitelli OSB, Başakşehir, İstanbul", lat: 41.0772, lng: 28.8021 },
  { address: "Dudullu OSB, Ümraniye, İstanbul", lat: 41.0116, lng: 29.1627 },
  { address: "Beylikdüzü OSB, Beylikdüzü, İstanbul", lat: 41.0069, lng: 28.6531 },
  { address: "Hadımköy Yolu Caddesi, Arnavutköy, İstanbul", lat: 41.1343, lng: 28.6253 },
  { address: "Sincan OSB, Sincan, Ankara", lat: 39.9575, lng: 32.5492 },
  { address: "İvedik OSB, Yenimahalle, Ankara", lat: 39.9723, lng: 32.7561 },
  { address: "Kazan Keresteciler Sitesi, Kahramankazan, Ankara", lat: 40.1001, lng: 32.6186 },
  { address: "Çiğli AOSB, Çiğli, İzmir", lat: 38.4891, lng: 27.0132 },
  { address: "Gaziemir Serbest Bölge, Gaziemir, İzmir", lat: 38.3182, lng: 27.1408 },
  { address: "Nilüfer OSB (NOSAB), Nilüfer, Bursa", lat: 40.2312, lng: 28.9163 },
  { address: "Kestel OSB, Kestel, Bursa", lat: 40.1981, lng: 29.2314 },
  { address: "Antalya OSB, Döşemealtı, Antalya", lat: 37.0543, lng: 30.5695 },
  { address: "Seyhan OSB, Seyhan, Adana", lat: 36.9532, lng: 35.1953 },
  { address: "Konya OSB, Selçuklu, Konya", lat: 37.9482, lng: 32.5691 },
  { address: "Karatay Sanayi, Karatay, Konya", lat: 37.8863, lng: 32.5152 },
  { address: "Gaziantep 1. OSB, Şehitkamil, Gaziantep", lat: 37.1154, lng: 37.4589 },
  { address: "Gaziantep 2. OSB, Şehitkamil, Gaziantep", lat: 37.1351, lng: 37.4691 },
  { address: "Mersin Serbest Bölge, Akdeniz, Mersin", lat: 36.8041, lng: 34.6468 },
  { address: "Kayseri OSB, Melikgazi, Kayseri", lat: 38.7492, lng: 35.3941 },
  { address: "Eskişehir OSB, Odunpazarı, Eskişehir", lat: 39.7543, lng: 30.6361 },
  { address: "Gebze Güzeller OSB, Gebze, Kocaeli", lat: 40.8251, lng: 29.4352 },
  { address: "TOSB Otomotiv Yan Sanayi İhtisas OSB, Çayırova, Kocaeli", lat: 40.8401, lng: 29.3871 },
  { address: "Çerkezköy OSB, Çerkezköy, Tekirdağ", lat: 41.2721, lng: 28.0062 },
  { address: "Kapaklı OSB, Kapaklı, Tekirdağ", lat: 41.3281, lng: 27.9712 },
  { address: "Sakarya 1. OSB, Arifiye, Sakarya", lat: 40.7103, lng: 30.3705 },
  { address: "Manisa OSB, Yunusemre, Manisa", lat: 38.6181, lng: 27.3752 },
  { address: "Denizli OSB, Honaz, Denizli", lat: 37.7711, lng: 29.2132 },
  { address: "Balıkesir OSB, Altıeylül, Balıkesir", lat: 39.5891, lng: 27.9254 },
  { address: "Aydın ASTİM OSB, Efeler, Aydın", lat: 37.8282, lng: 27.8591 },
  { address: "Trabzon Arsin OSB, Arsin, Trabzon", lat: 40.9412, lng: 39.9572 },
  { address: "Samsun Merkez OSB, Tekkeköy, Samsun", lat: 41.2291, lng: 36.4393 },
  { address: "Afyonkarahisar OSB, Merkez, Afyonkarahisar", lat: 38.7751, lng: 30.5692 },
  { address: "Kütahya OSB, Merkez, Kütahya", lat: 39.4291, lng: 29.9881 },
  { address: "Erzurum 1. OSB, Aziziye, Erzurum", lat: 39.9362, lng: 41.2185 },
  { address: "Malatya 1. OSB, Yeşilyurt, Malatya", lat: 38.3371, lng: 38.2195 },
  { address: "Elazığ OSB, Merkez, Elazığ", lat: 38.6631, lng: 39.2901 },
  { address: "Diyarbakır OSB, Yenişehir, Diyarbakır", lat: 37.9862, lng: 40.1691 },
  { address: "Şanlıurfa 1. OSB, Eyyübiye, Şanlıurfa", lat: 37.1081, lng: 38.7291 },
  { address: "Kahramanmaraş OSB, Dulkadiroğlu, Kahramanmaraş", lat: 37.5451, lng: 36.9582 },
  { address: "Hatay İskenderun OSB, İskenderun, Hatay", lat: 36.6432, lng: 36.2151 },
  { address: "Osmaniye OSB, Toprakkale, Osmaniye", lat: 37.0391, lng: 36.1432 },
  { address: "Uşak OSB, Merkez, Uşak", lat: 38.6541, lng: 29.3512 },
  { address: "Çorum OSB, Merkez, Çorum", lat: 40.5281, lng: 34.9092 },
  { address: "Burdur OSB, Merkez, Burdur", lat: 37.7331, lng: 30.3452 },
  { address: "Isparta Süleyman Demirel OSB, Gönen, Isparta", lat: 37.9152, lng: 30.4901 },
  { address: "Aksaray OSB, Merkez, Aksaray", lat: 38.3291, lng: 33.9572 },
  { address: "Karaman OSB, Merkez, Karaman", lat: 37.1991, lng: 33.2682 },
  { address: "Niğde Bor OSB, Bor, Niğde", lat: 37.9121, lng: 34.5802 },
  { address: "Düzce OSB, Merkez, Düzce", lat: 40.8142, lng: 31.1271 },
  { address: "Bolu Karma OSB, Merkez, Bolu", lat: 40.7101, lng: 31.5792 }
];

type Hub = { lat: number; lng: number; address: string };

// ─── Cargo Scenarios ──────────────────────────────────────────────────────────
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

const CARGO: Cargo[] = [
  {
    type: "Automotive Parts",
    items: [
      {
        sku: "AUTO-ENG-001",
        name: "Motor Bloğu Tertibatı",
        unit: "Adet",
        weightKg: 180,
        volumeM3: 0.4,
        palletCount: 4,
      },
      {
        sku: "AUTO-GBX-002",
        name: "Şanzıman Ünitesi",
        unit: "Adet",
        weightKg: 55,
        volumeM3: 0.15,
        palletCount: 8,
      },
      {
        sku: "AUTO-AXL-003",
        name: "Arka Aks Takımı",
        unit: "Adet",
        weightKg: 120,
        volumeM3: 0.3,
        palletCount: 6,
      },
    ],
  },
  {
    type: "Electronics",
    items: [
      {
        sku: "ELEC-LCD-001",
        name: 'LCD Panel 55" (Kutulu)',
        unit: "Adet",
        weightKg: 18,
        volumeM3: 0.18,
        palletCount: 20,
      },
      {
        sku: "ELEC-PCB-002",
        name: "Baskılı Devre Kartı (Paket)",
        unit: "Kutu",
        weightKg: 8,
        volumeM3: 0.04,
        palletCount: 50,
      },
      {
        sku: "ELEC-SRV-003",
        name: "Rack Sunucu (1U, Kutu)",
        unit: "Adet",
        weightKg: 14,
        volumeM3: 0.1,
        palletCount: 10,
      },
    ],
  },
  {
    type: "Perishable",
    items: [
      {
        sku: "FOOD-FROZ-001",
        name: "Dondurulmuş Tavuk (IQF Blok)",
        unit: "kg",
        weightKg: 1,
        volumeM3: 0.0013,
        palletCount: 800,
      },
      {
        sku: "FOOD-DAIRY-002",
        name: "UHT Süt (1L, 12'li Paket)",
        unit: "Koli",
        weightKg: 12,
        volumeM3: 0.01,
        palletCount: 72,
      },
    ],
  },
  {
    type: "General Cargo",
    items: [
      {
        sku: "GEN-PALET-001",
        name: "Karma FMCG Palet (Karışık)",
        unit: "Palet",
        weightKg: 720,
        volumeM3: 1.2,
        palletCount: 1,
      },
      {
        sku: "GEN-BOX-002",
        name: "Standart Koli (18 kg Brüt)",
        unit: "Adet",
        weightKg: 15,
        volumeM3: 0.065,
        palletCount: 18,
      },
    ],
  },
  {
    type: "Hazardous Material",
    items: [
      {
        sku: "HAZ-SOLV-001",
        name: "Endüstriyel Solvent (200L Varil)",
        unit: "Varil",
        weightKg: 175,
        volumeM3: 0.21,
        palletCount: 4,
      },
      {
        sku: "HAZ-ACID-002",
        name: "Sülfürik Asit Çözeltisi (%30)",
        unit: "Varil",
        weightKg: 210,
        volumeM3: 0.22,
        palletCount: 4,
      },
    ],
  },
  {
    type: "Textile",
    items: [
      {
        sku: "TEX-RULO-001",
        name: "Denim Kumaş Rulo (100m)",
        unit: "Rulo",
        weightKg: 35,
        volumeM3: 0.09,
        palletCount: 15,
      },
      {
        sku: "TEX-HAZIR-002",
        name: "Hazır Giyim (Boxed)",
        unit: "Kutu",
        weightKg: 12,
        volumeM3: 0.05,
        palletCount: 24,
      },
    ],
  },
  {
    type: "Construction Materials",
    items: [
      {
        sku: "CON-CERM-001",
        name: "Seramik Karo (60×60, Koli)",
        unit: "m²",
        weightKg: 22,
        volumeM3: 0.035,
        palletCount: 28,
      },
      {
        sku: "CON-STBAR-002",
        name: "İnşaat Çeliği Çubuk (12mm)",
        unit: "Ton",
        weightKg: 1000,
        volumeM3: 0.13,
        palletCount: 1,
      },
    ],
  },
];

// ─── Route Templates ──────────────────────────────────────────────────────────
interface RouteTemplate {
  code: string;
  corridor: string;
  stops: Hub[]; // [0] = origin, [-1] = destination, middle = waypoints
  distanceKm: number;
  durationMin: number;
  shipmentCount: number;
}

const ROUTE_TEMPLATES: RouteTemplate[] = [
  {
    code: "IST-ANK",
    corridor: "Marmara – Ankara Ekspres",
    stops: [H.IST_HADIMKOY, H.IZMIT, H.BOLU_GECIT, H.ANKARA_OSTIM],
    distanceKm: 458,
    durationMin: 350,
    shipmentCount: 3,
  },
  {
    code: "ANK-IZM",
    corridor: "Ankara – İzmir Karayolu",
    stops: [
      H.ANKARA_MACUN,
      H.ESKISEHIR,
      H.AFYON_TIR,
      H.USAK,
      H.IZMIR_KEMALPASA,
    ],
    distanceKm: 596,
    durationMin: 435,
    shipmentCount: 3,
  },
  {
    code: "IST-BRS",
    corridor: "Marmara Otoyolu – Osmangazi Köprüsü",
    stops: [H.IST_AVCILAR, H.OSMANGAZI_BRJ, H.BURSA_OSB],
    distanceKm: 155,
    durationMin: 115,
    shipmentCount: 2,
  },
  {
    code: "ANK-ADN",
    corridor: "İç Anadolu – Akdeniz Koridoru",
    stops: [H.ANKARA_OSTIM, H.KONYA_CEV, H.POZANTI, H.ADANA_HSABANCI],
    distanceKm: 489,
    durationMin: 328,
    shipmentCount: 3,
  },
  {
    code: "IZM-ANT",
    corridor: "Ege – Akdeniz Koridoru",
    stops: [H.IZMIR_TORBALI, H.DENIZLI_OSB, H.BURDUR, H.ANTALYA_DOSB],
    distanceKm: 344,
    durationMin: 242,
    shipmentCount: 2,
  },
  {
    code: "BRS-GBZ",
    corridor: "Bursa – Gebze Dönüş",
    stops: [H.BURSA_OSB, H.YALOVA, H.IST_GEBZE],
    distanceKm: 134,
    durationMin: 108,
    shipmentCount: 2,
  },
  {
    code: "IST-GAZ",
    corridor: "İstanbul – Güneydoğu Ekspresi",
    stops: [H.IST_HALKALI, H.ANKARA_OSTIM, H.ADANA_BOLGESI, H.GAZIANTEP_OSB],
    distanceKm: 1108,
    durationMin: 720,
    shipmentCount: 3,
  },
  {
    code: "MRS-KSR",
    corridor: "Mersin Limanı – Kayseri Hattı",
    stops: [H.MERSIN_PORT, H.ADANA_BOLGESI, H.NIGDE, H.KAYSERI_OSB],
    distanceKm: 323,
    durationMin: 214,
    shipmentCount: 2,
  },
  {
    code: "IST-TKD",
    corridor: "İstanbul – Trakya Hattı",
    stops: [H.IST_HALKALI, H.TEKIRDAG_CORLU],
    distanceKm: 143,
    durationMin: 118,
    shipmentCount: 2,
  },
  {
    code: "KNY-ANT",
    corridor: "Konya – Antalya Dağ Yolu",
    stops: [H.KONYA_OSB, H.BURDUR, H.ANTALYA_LIMAN],
    distanceKm: 218,
    durationMin: 162,
    shipmentCount: 2,
  },
  {
    code: "IST-KNY",
    corridor: "İstanbul – Orta Anadolu Hattı",
    stops: [H.IST_TUZLA, H.IZMIT, H.AKSARAY, H.KONYA_OSB],
    distanceKm: 562,
    durationMin: 382,
    shipmentCount: 3,
  },
  {
    code: "KSR-GAZ",
    corridor: "Kayseri – Gaziantep Hattı",
    stops: [H.KAYSERI_OSB, H.ADANA_BOLGESI, H.GAZIANTEP_OSB],
    distanceKm: 355,
    durationMin: 237,
    shipmentCount: 2,
  },
];

const ROUTE_STATUSES: RouteStatus[] = [
  "COMPLETED",
  "COMPLETED",
  "COMPLETED",
  "ACTIVE",
  "PLANNED",
  "PLANNED",
  "CANCELED",
];

function shipmentStatusFor(
  routeStatus: RouteStatus,
  idx: number
): ShipmentStatus {
  if (routeStatus === "COMPLETED") return "DELIVERED";
  if (routeStatus === "ACTIVE") return idx === 0 ? "IN_TRANSIT" : "ASSIGNED";
  if (routeStatus === "CANCELED") return "CANCELLED";
  return idx === 0 ? "ASSIGNED" : "PENDING";
}

// ─── Firebase helper ──────────────────────────────────────────────────────────
async function clearFirebase() {
  if (!adminDb) {
    console.warn("  ⚠️  Firebase skipped (adminDb not init).");
    return;
  }
  try {
    await adminDb.ref("/").set(null);
    console.log("  ✅ Firebase cleared.");
  } catch (e) {
    console.error("  ❌ Firebase clear failed:", e);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 LogiTrack v2 — Master Seed Starting...\n");

  const hashedPassword = await bcrypt.hash(PASSWORD, HASH_ROUNDS);

  // ── 1. CLEAR ────────────────────────────────────────────────────────────────
  await clearFirebase();
  console.log("🗑️  Clearing database...");
  await prisma.auditLog.deleteMany();
  await prisma.session.deleteMany();
  await prisma.document.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.deliveryAttempt.deleteMany();
  await prisma.driverShift.deleteMany();
  await prisma.shipmentHistory.deleteMany();
  await prisma.shipmentItem.deleteMany();
  await prisma.shipmentStop.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.route.deleteMany();
  await prisma.trailerAssignment.deleteMany();
  await prisma.trailer.deleteMany();
  await prisma.maintenanceRecord.deleteMany();
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
  console.log("  ✅ Database cleared.\n");

  // ── 2. EXCHANGE RATES ────────────────────────────────────────────────────────
  await prisma.exchangeRate.create({
    data: {
      base: "USD",
      rates: { TRY: 32.45, EUR: 0.92, GBP: 0.79, JPY: 151.2 },
      date: new Date(),
    },
  });

  // ── 3. ROLES ─────────────────────────────────────────────────────────────────
  console.log("🔑 Seeding Roles...");
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
    if (r.names) for (const n of r.names) roles[n] = role.id;
  }

  // ── 4. SUPER ADMIN ───────────────────────────────────────────────────────────
  await prisma.user.create({
    data: {
      email: "superadmin@logitrack.com",
      name: "Super",
      surname: "Admin",
      password: hashedPassword,
      roleId: roles["role_admin"],
      timezone: "Europe/Istanbul",
      dateFormat: "DD/MM/YYYY",
      currency: "USD",
    },
  });
  console.log("  ✅ Super admin created.\n");

  // ── 5. COMPANIES ─────────────────────────────────────────────────────────────
  let totalRoutes = 0;
  let totalShipments = 0;

  for (let ci = 0; ci < COMPANY_DEFS.length; ci++) {
    const cd = COMPANY_DEFS[ci];
    console.log(
      `🏢  [${ci + 1}/${COMPANY_DEFS.length}] ${cd.name} (${cd.slug})`
    );

    const company = await prisma.company.create({
      data: {
        name: cd.name,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(cd.name)}&background=random`,
      },
    });

    // ── Users ──────────────────────────────────────────────────────────────────
    await prisma.user.create({
      data: {
        email: `admin@${cd.slug.toLowerCase()}.com`,
        name: pick(FIRST_NAMES),
        surname: pick(LAST_NAMES),
        password: hashedPassword,
        roleId: roles["role_admin"],
        companyId: company.id,
        timezone: "Europe/Istanbul",
        currency: "USD",
      },
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
      },
    });

    // ── Warehouses ─────────────────────────────────────────────────────────────
    console.log(`    📦 Warehouses & Inventory...`);
    const warehouseIds: string[] = [];
    const realHubs = [...Object.values(H), ...EXTRA_LOCATIONS];
    for (let i = 1; i <= WAREHOUSES_PER_COMPANY; i++) {
      const realHub = pick(realHubs);
      const city = CITIES.find((c) => realHub.address.includes(c.name)) || pick(CITIES);
      const wh = await prisma.warehouse.create({
        data: {
          code: `${cd.slug}-WH-${i}`,
          name: `${cd.name} ${city.name} DC`,
          type: pick([
            "DISTRIBUTION_CENTER",
            "WAREHOUSE",
            "CROSSDOCK",
          ]) as WarehouseType,
          address: realHub.address,
          city: city.name,
          country: "TR",
          lat: realHub.lat,
          lng: realHub.lng,
          capacityPallets: rand(1000, 10000),
          capacityVolumeM3: rand(5000, 20000),
          operatingHours: "07:00 - 22:00",
          timezone: "Europe/Istanbul",
          specifications: ["Temperature Controlled", "Hazmat Storage"],
          managerId: manager.id,
          companyId: company.id,
        },
      });
      warehouseIds.push(wh.id);

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
          },
        });
        await prisma.inventoryMovement.create({
          data: {
            warehouseId: wh.id,
            sku: inv.sku,
            quantity: rand(10, 100),
            type: "STOCK_IN",
            notes: "Initial inventory seeding",
            companyId: company.id,
          },
        });
      }
    }

    // ── Vehicles ───────────────────────────────────────────────────────────────
    console.log(`    🚛 Vehicles...`);
    const vehicleIds: string[] = [];
    for (let i = 1; i <= VEHICLES_PER_COMPANY; i++) {
      const brandDef = pick(VEHICLE_BRANDS);
      const city = pick(CITIES);
      const plate = `${rand(1, 81).toString().padStart(2, "0")} ${String.fromCharCode(65 + rand(0, 25))}${String.fromCharCode(65 + rand(0, 25))} ${rand(100, 9999)}`;

      const v = await prisma.vehicle.create({
        data: {
          fleetNo: `${cd.slug}-V-${pad(i)}`,
          plate,
          type: i % 5 === 0 ? "VAN" : "TRUCK",
          brand: brandDef.brand,
          model: pick(brandDef.models),
          year: rand(2018, 2024),
          status: pick([
            "AVAILABLE",
            "ON_TRIP",
            "MAINTENANCE",
          ]) as VehicleStatus,
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
          enableAlerts: true,
        },
      });
      vehicleIds.push(v.id);

      await prisma.maintenanceRecord.create({
        data: {
          vehicleId: v.id,
          type: "Full Service",
          date: daysAgo(rand(20, 90)),
          cost: randFloat(500, 3000),
          status: "COMPLETED",
          description: "Brake pads, oil filter, and tire rotation.",
        },
      });

      await prisma.document.create({
        data: {
          type: "INSURANCE",
          name: `Policy_${v.plate}.pdf`,
          url: "https://storage.logitrack.com/docs/insurance_sample.pdf",
          status: "VALID",
          vehicleId: v.id,
          companyId: company.id,
          expiryDate: daysFromNow(rand(100, 500)),
        },
      });

      if (adminDb) {
        await adminDb.ref(`vehicles/${v.id}`).set({
          id: v.id,
          plate: v.plate,
          fleetNo: v.fleetNo,
          lat: v.currentLat,
          lng: v.currentLng,
          speed: 0,
          fuelLevel: v.fuelLevel,
          status: v.status,
          lastUpdate: Date.now(),
        });
      }
    }

    // ── Trailers ───────────────────────────────────────────────────────────────
    console.log(`    🚚 Trailers...`);
    const trailerIds: string[] = [];
    for (let i = 1; i <= 30; i++) {
      const plate = `${rand(1, 81).toString().padStart(2, "0")} ${String.fromCharCode(65 + rand(0, 25))}${String.fromCharCode(65 + rand(0, 25))} ${rand(100, 9999)}`;
      const type = pick([
        TrailerType.DRY_VAN,
        TrailerType.REEFER,
        TrailerType.FLATBED,
        TrailerType.TANKER,
        TrailerType.CURTAINSIDE,
        TrailerType.CONTAINER_CHASSIS,
      ]);
      const t = await prisma.trailer.create({
        data: {
          fleetNo: `${cd.slug}-T-${pad(i)}`,
          plate,
          type,
          capacityVolumeM3: randFloat(60, 100),
          maxLoadKg: rand(20000, 30000),
          isColdChain: type === TrailerType.REEFER,
          status: pick([
            TrailerStatus.AVAILABLE,
            TrailerStatus.IN_USE,
            TrailerStatus.MAINTENANCE,
          ]),
          companyId: company.id,
          currentVehicleId: i <= 20 ? vehicleIds[i - 1] : null,
        },
      });
      trailerIds.push(t.id);

      await prisma.document.create({
        data: {
          type: "TRAILER_REGISTRATION",
          name: `Reg_${t.plate}.pdf`,
          url: "https://storage.logitrack.com/docs/trailer_reg_sample.pdf",
          status: "VALID",
          trailerId: t.id,
          companyId: company.id,
          expiryDate: daysFromNow(rand(100, 500)),
        },
      });
    }

    // ── Drivers ────────────────────────────────────────────────────────────────
    console.log(`    👤 Drivers...`);
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
        },
      });

      const driver = await prisma.driver.create({
        data: {
          userId: user.id,
          employeeId: `EMP-${cd.slug}-${pad(i)}`,
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
          languages: ["Turkish", "English"],
        },
      });
      driverIds.push(driver.id);

      await prisma.document.create({
        data: {
          type: "LICENSE",
          name: `License_${user.surname}.jpg`,
          url: "https://storage.logitrack.com/docs/license_sample.jpg",
          status: "VERIFIED",
          driverId: driver.id,
          companyId: company.id,
          expiryDate: driver.licenseExpiry,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "LOGIN",
          ipAddress: `172.16.${rand(0, 255)}.${rand(1, 254)}`,
          deviceInfo: "iPhone 15 Pro / iOS 17",
        },
      });

      await prisma.session.create({
        data: {
          userId: user.id,
          token: `token_${user.id}_${Date.now()}`,
          refreshToken: `refresh_${user.id}_${Date.now()}`,
          expiresAt: daysFromNow(7),
        },
      });
    }

    // ── Customers ──────────────────────────────────────────────────────────────
    console.log(`    🤝 Customers...`);
    const customerIds: string[] = [];
    for (let i = 1; i <= CUSTOMERS_PER_COMPANY; i++) {
      const cust = await prisma.customer.create({
        data: {
          code: `C-${cd.slug}-${pad(i)}`,
          name: `${pick(["Inter", "Trans", "Neo", "Apex"])} ${pick(["Goods", "Supplies", "Retail", "Energy"])} Group`,
          industry: pick(["Automotive", "E-commerce", "Chemicals", "FMCG"]),
          taxId: `TR-${rand(1000000000, 9999999999)}`,
          email: `logistics@customer-${cd.slug}-${i}.com`,
          phone: `+90212${rand(1000000, 9999999)}`,
          companyId: company.id,
        },
      });
      customerIds.push(cust.id);

      const locHub = pick(realHubs);
      await prisma.customerLocation.create({
        data: {
          customerId: cust.id,
          name: "Regional Warehouse A",
          address: locHub.address,
          lat: locHub.lat,
          lng: locHub.lng,
          isDefault: true,
        },
      });
    }

    // ── Routes & Shipments (quality) ───────────────────────────────────────────
    console.log(`    🗺️  Routes & Shipments...`);
    const templates = shuffled([...ROUTE_TEMPLATES]);
    let routeSeq = 0;

    for (const tmpl of templates) {
      routeSeq++;

      const cargo = pick(CARGO);
      const routeStatus = pick(ROUTE_STATUSES);
      const vehicle = pick(vehicleIds);
      const driverId = pick(driverIds);

      const dateOffset =
        routeStatus === "COMPLETED"
          ? -rand(1, 14)
          : routeStatus === "ACTIVE"
            ? 0
            : routeStatus === "PLANNED"
              ? rand(1, 7)
              : -rand(1, 3);

      const routeDate = new Date(Date.now() + dateOffset * 86_400_000);
      routeDate.setHours(rand(5, 9), 0, 0, 0);

      const endTime =
        routeStatus === "COMPLETED"
          ? new Date(
              routeDate.getTime() + (tmpl.durationMin + rand(10, 60)) * 60_000
            )
          : null;

      const stopsJson = tmpl.stops.map((s, i) => ({
        sequence: i + 1,
        lat: s.lat,
        lng: s.lng,
        address: s.address,
        type:
          i === 0
            ? "ORIGIN"
            : i === tmpl.stops.length - 1
              ? "DESTINATION"
              : "WAYPOINT",
      }));

      const route = await prisma.route.create({
        data: {
          name: `${tmpl.code}-${pad(routeSeq)}`,
          status: routeStatus,
          date: routeDate,
          startTime:
            routeStatus === "ACTIVE" || routeStatus === "COMPLETED"
              ? routeDate
              : null,
          endTime,
          distanceKm: tmpl.distanceKm + randFloat(-5, 5),
          durationMin: tmpl.durationMin + rand(-10, 10),
          driverId,
          vehicleId: vehicle,
          companyId: company.id,
          stops: stopsJson,
        },
      });

      totalRoutes++;

      const origin = tmpl.stops[0];
      const destination = tmpl.stops[tmpl.stops.length - 1];
      const waypoints = tmpl.stops.slice(1, -1);

      // ── Shipments per route ───────────────────────────────────────────────
      for (let si = 0; si < tmpl.shipmentCount; si++) {
        const item = pick(cargo.items);
        const qty = rand(20, 350);
        const pallets = Math.max(1, Math.ceil(qty / (item.palletCount || 1)));
        const status = shipmentStatusFor(routeStatus, si);
        const priority = pick(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const);
        const trailer = trailerIds.length > 0 ? pick(trailerIds) : null;

        const trackingId = `LT-C${ci + 1}-${tmpl.code}-${pad(routeSeq)}-S${si + 1}`;

        const shipment = await prisma.shipment.create({
          data: {
            trackingId,
            customerId: pick(customerIds),
            driverId,
            status,
            priority: priority as ShipmentPriority,
            type: "Standard Freight",
            origin: origin.address.split(",")[0].trim(),
            originLat: origin.lat,
            originLng: origin.lng,
            destination: destination.address.split(",")[0].trim(),
            destinationLat: destination.lat,
            destinationLng: destination.lng,
            weightKg: randFloat(
              qty * item.weightKg * 0.9,
              qty * item.weightKg * 1.1
            ),
            volumeM3: randFloat(
              qty * item.volumeM3 * 0.9,
              qty * item.volumeM3 * 1.1
            ),
            palletCount: pallets,
            cargoType: cargo.type,
            itemsCount: 1,
            billingAccount: "Net-30 Kurumsal",
            slaDeadline:
              status === "DELIVERED"
                ? daysAgo(rand(0, 2))
                : daysFromNow(rand(1, 7)),
            routeId: route.id,
            companyId: company.id,
            originWarehouseId: pick(warehouseIds),
            ...(trailer ? { trailerId: trailer } : {}),
          },
        });

        totalShipments++;

        // ShipmentItem
        await prisma.shipmentItem.create({
          data: {
            shipmentId: shipment.id,
            sku: `${item.sku}-${rand(100, 999)}`,
            name: item.name,
            quantity: qty,
            unit: item.unit,
            weightKg: item.weightKg,
            volumeM3: item.volumeM3,
            palletCount: item.palletCount,
            cargoType: cargo.type,
          },
        });

        // ShipmentStops — ALL stops: origin + waypoints + destination
        // sequence 1 = origin, sequence n = destination
        for (let stopIdx = 0; stopIdx < tmpl.stops.length; stopIdx++) {
          const hub = tmpl.stops[stopIdx];
          const isOrigin = stopIdx === 0;
          const isDest = stopIdx === tmpl.stops.length - 1;
          const n = tmpl.stops.length;

          // Proportional arrival time within total route duration
          const arrivalOffsetMin = Math.round(
            (tmpl.durationMin * stopIdx) / (n - 1)
          );
          const dwellMin = isOrigin ? rand(15, 30) : isDest ? 0 : rand(10, 20);
          const departureOffsetMin = arrivalOffsetMin + dwellMin;

          // Stop status based on shipment status and stop position
          let stopStatus: ShipmentStatus;
          if (status === "DELIVERED") {
            stopStatus = "DELIVERED";
          } else if (status === "IN_TRANSIT") {
            stopStatus =
              stopIdx === 0
                ? "DELIVERED"
                : stopIdx === 1
                  ? "IN_TRANSIT"
                  : "PENDING";
          } else if (status === "ASSIGNED") {
            stopStatus = stopIdx === 0 ? "PROCESSING" : "PENDING";
          } else if (status === "CANCELLED") {
            stopStatus = "CANCELLED";
          } else {
            stopStatus = "PENDING";
          }

          const hasReached =
            status === "DELIVERED" ||
            (status === "IN_TRANSIT" && stopIdx <= 1) ||
            (status === "ASSIGNED" && stopIdx === 0);

          await prisma.shipmentStop.create({
            data: {
              shipmentId: shipment.id,
              address: hub.address.split(",")[0].trim(),
              lat: hub.lat,
              lng: hub.lng,
              sequence: stopIdx + 1,
              status: stopStatus,
              arrivalDate: hasReached
                ? new Date(routeDate.getTime() + arrivalOffsetMin * 60_000)
                : null,
              departureDate:
                hasReached && !isDest
                  ? new Date(routeDate.getTime() + departureOffsetMin * 60_000)
                  : null,
            },
          });
        }

        // ShipmentHistory
        const historySteps: {
          status: string;
          location: string;
          description: string;
        }[] = [
          {
            status: "PROCESSING",
            location: origin.address.split(",")[0],
            description: "Yük doğrulandı ve sevkiyata hazırlandı.",
          },
        ];
        if (["ASSIGNED", "IN_TRANSIT", "DELIVERED"].includes(status)) {
          historySteps.push({
            status: "ASSIGNED",
            location: origin.address.split(",")[0],
            description: `Araç atandı. Sürücü harekete geçti.`,
          });
        }
        if (["IN_TRANSIT", "DELIVERED"].includes(status)) {
          historySteps.push({
            status: "IN_TRANSIT",
            location: (waypoints[0]?.address ?? origin.address).split(",")[0],
            description:
              "Yük kalkış noktasından ayrıldı. Rota üzerinde ilerliyor.",
          });
          if (waypoints.length > 1) {
            historySteps.push({
              status: "IN_TRANSIT",
              location:
                waypoints[Math.floor(waypoints.length / 2)].address.split(
                  ","
                )[0],
              description:
                "Ara durak geçildi. Teslimat noktasına doğru devam ediyor.",
            });
          }
        }
        if (status === "DELIVERED") {
          historySteps.push({
            status: "DELIVERED",
            location: destination.address.split(",")[0],
            description: "Yük teslim edildi ve alıcı tarafından imzalandı.",
          });
        }
        if (status === "CANCELLED") {
          historySteps.push({
            status: "CANCELLED",
            location: origin.address.split(",")[0],
            description: "Sevkiyat iptal edildi.",
          });
        }

        for (const step of historySteps) {
          await prisma.shipmentHistory.create({
            data: {
              shipmentId: shipment.id,
              status: step.status,
              location: step.location,
              description: step.description,
            },
          });
        }
      }
    }

    // ── Fuel logs & Issues ────────────────────────────────────────────────────
    for (let i = 0; i < 10; i++) {
      const vId = pick(vehicleIds);
      const dId = pick(driverIds);
      await prisma.fuelLog.create({
        data: {
          vehicleId: vId,
          driverId: dId,
          companyId: company.id,
          volumeLiter: randFloat(100, 600),
          cost: randFloat(400, 2000),
          odometerKm: rand(50000, 150000),
          fuelType: "DIESEL",
          location: pick([
            "Shell Expressway #8",
            "BP Otoyol İstasyonu",
            "Total TIR Durağı",
          ]),
        },
      });
    }

    for (let i = 0; i < 5; i++) {
      await prisma.issue.create({
        data: {
          title: pick([
            "Engine Warning Light",
            "Tire Pressure Alert",
            "Brake Inspection Needed",
          ]),
          description: "Sensor malfunction detected during transit.",
          status: pick(["OPEN", "IN_PROGRESS", "RESOLVED"]) as
            | "OPEN"
            | "IN_PROGRESS"
            | "RESOLVED",
          priority: pick(["LOW", "MEDIUM", "HIGH"]) as
            | "LOW"
            | "MEDIUM"
            | "HIGH",
          type: "VEHICLE",
          vehicleId: pick(vehicleIds),
          driverId: pick(driverIds),
          companyId: company.id,
        },
      });
    }

    const icon = ["🔵", "🟢", "🟣", "🟠", "🔴"][ci % 5];
    console.log(
      `    ${icon} Done — 12 routes · ${totalShipments} total shipments so far\n`
    );
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`✨  Seeding complete!`);
  console.log(`🏢  Companies:  ${COMPANY_DEFS.length}`);
  console.log(`🚛  Vehicles:   ${COMPANY_DEFS.length * VEHICLES_PER_COMPANY}`);
  console.log(`👤  Drivers:    ${COMPANY_DEFS.length * DRIVERS_PER_COMPANY}`);
  console.log(
    `📦  Warehouses: ${COMPANY_DEFS.length * WAREHOUSES_PER_COMPANY}`
  );
  console.log(`🗺️   Routes:     ${totalRoutes}`);
  console.log(`📫  Shipments:  ${totalShipments}`);
  console.log(`🔑  Password:   ${PASSWORD}`);
  console.log("═══════════════════════════════════════════════════════════\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

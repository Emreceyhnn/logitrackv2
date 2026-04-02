/**
 * scripts/seed-firebase-locations.ts
 *
 * VEHICLE DEVICE SIMULATOR — Publisher Side
 * ==========================================
 * This script simulates what a real GPS tracker/IoT device on a vehicle would do:
 *
 *   1. Fetches the LAST (most recently created) vehicle from the Prisma PostgreSQL DB.
 *   2. Pushes a single live location snapshot to Firebase Realtime Database.
 *
 * Run with: npx tsx scripts/seed-firebase-locations.ts
 *
 * The client (browser dashboard) subscribes via `onValue()` and automatically receives
 * the updated location data the moment this script runs.
 *
 * Firebase RTDB Path: vehicles/locations/{vehicleId}
 */

import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  Database,
} from "firebase/database";
import { PrismaClient } from "@prisma/client";

// ─── Firebase Config ──────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBUYl2ibHOiFj66cjzCgNtfPpv3YULHNvI",
  authDomain: "logitrack-90e52.firebaseapp.com",
  databaseURL:
    "https://logitrack-90e52-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "logitrack-90e52",
  storageBucket: "logitrack-90e52.firebasestorage.app",
  messagingSenderId: "801763183519",
  appId: "1:801763183519:web:1662082c578dde9f790baa",
};

const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
const db: Database = getDatabase(firebaseApp);
const prisma = new PrismaClient();

// ─── Types ────────────────────────────────────────────────────────────────────
interface VehicleLocationPayload {
  lat: number;
  lng: number;
  speed: number;    // km/h
  heading: number;  // degrees (0–360)
  lastUpdated: number; // Unix timestamp in ms
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🚛 [Vehicle Location Seeder] Starting...\n");

  // 1. Fetch the LAST vehicle record from Postgres
  const lastVehicle = await prisma.vehicle.findFirst({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      plate: true,
      brand: true,
      model: true,
      currentLat: true,
      currentLng: true,
    },
  });

  if (!lastVehicle) {
    console.error("❌ No vehicles found in the database. Run `npm run db:seed` first.");
    process.exit(1);
  }

  console.log(`✅ Found vehicle: [${lastVehicle.plate}] ${lastVehicle.brand} ${lastVehicle.model}`);
  console.log(`   Vehicle ID: ${lastVehicle.id}`);
  console.log(`   DB Lat/Lng: ${lastVehicle.currentLat ?? "N/A"} / ${lastVehicle.currentLng ?? "N/A"}\n`);

  // 2. Use existing DB coordinates as starting point, fallback to Istanbul center
  const baseLat = lastVehicle.currentLat ?? 41.0082;
  const baseLng = lastVehicle.currentLng ?? 28.9784;

  // 3. Build the mock location payload (simulates GPS device sending telemetry)
  const payload: VehicleLocationPayload = {
    lat: baseLat + (Math.random() - 0.5) * 0.01,  // ± ~550m
    lng: baseLng + (Math.random() - 0.5) * 0.01,
    speed: Math.round(30 + Math.random() * 50),    // 30–80 km/h
    heading: Math.round(Math.random() * 360),       // 0–360°
    lastUpdated: Date.now(),
  };

  console.log("📡 Pushing location to Firebase Realtime Database...");
  console.log(`   Path: vehicles/locations/${lastVehicle.id}`);
  console.log(`   Payload: ${JSON.stringify(payload, null, 2)}\n`);

  // 4. SET the data at the vehicle's path in Firebase RTDB
  //    `set()` overwrites the node — this is "latest snapshot" semantics.
  //    The client's `onValue()` listener fires immediately with the new data.
  const vehiclePath = `vehicles/locations/${lastVehicle.id}`;
  await set(ref(db, vehiclePath), payload);

  console.log(`✅ Firebase RTDB updated successfully!`);
  console.log(`   → Client in browser will receive the update in <100ms via WebSocket.\n`);
  console.log("🎯 To verify: Open the dashboard at /playground and watch the map marker move.");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

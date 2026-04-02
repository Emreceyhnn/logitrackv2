/**
 * scripts/simulate-trip.ts
 *
 * CONTINUOUS TRIP SIMULATOR — Device Side
 * ========================================
 * Simulates a vehicle GPS tracker sending location updates every 2 seconds.
 * The LAST vehicle from the DB is used.
 *
 * This demonstrates the full pub/sub flow:
 *   [This Script] → Firebase RTDB → [Browser Dashboard onValue()] → Map Marker Moves
 *
 * Run with: npx tsx scripts/simulate-trip.ts
 * Stop with: Ctrl+C
 */

import { initializeApp, FirebaseApp } from "firebase/app";
import { getDatabase, ref, set, Database } from "firebase/database";
import { PrismaClient } from "@prisma/client";

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

const INTERVAL_MS = 2000;    // Push every 2 seconds
const TOTAL_STEPS = 30;      // Simulate 30 steps (~60 seconds of travel)
const STEP_DELTA = 0.0015;   // ~165 meters per step at equator

async function main() {
  console.log("🚛 [Trip Simulator] Starting continuous GPS simulation...\n");

  // 1. Get last vehicle from DB
  const vehicle = await prisma.vehicle.findFirst({
    orderBy: { createdAt: "desc" },
    select: { id: true, plate: true, brand: true, model: true, currentLat: true, currentLng: true },
  });

  if (!vehicle) {
    console.error("❌ No vehicles found. Run `npm run db:seed` first.");
    process.exit(1);
  }

  console.log(`🚗 Simulating: [${vehicle.plate}] ${vehicle.brand} ${vehicle.model}`);
  console.log(`   ID: ${vehicle.id}`);
  console.log(`   Pushing to: vehicles/locations/${vehicle.id}`);
  console.log(`   Steps: ${TOTAL_STEPS} × ${INTERVAL_MS / 1000}s = ~${(TOTAL_STEPS * INTERVAL_MS) / 1000}s\n`);

  await prisma.$disconnect();

  // 2. Starting coordinates
  let lat = vehicle.currentLat ?? 41.0082;
  let lng = vehicle.currentLng ?? 28.9784;

  // 3. Direction of travel (randomized heading in radians)
  const headingDeg = Math.random() * 360;
  const headingRad = (headingDeg * Math.PI) / 180;
  const dLat = Math.cos(headingRad) * STEP_DELTA;
  const dLng = Math.sin(headingRad) * STEP_DELTA;

  const vehicleRef = ref(db, `vehicles/locations/${vehicle.id}`);

  for (let step = 1; step <= TOTAL_STEPS; step++) {
    lat += dLat + (Math.random() - 0.5) * 0.0002; // slight jitter
    lng += dLng + (Math.random() - 0.5) * 0.0002;

    const speed = 45 + Math.random() * 30; // 45–75 km/h
    const heading = (headingDeg + (Math.random() - 0.5) * 10 + 360) % 360;

    const payload = {
      lat: parseFloat(lat.toFixed(7)),
      lng: parseFloat(lng.toFixed(7)),
      speed: parseFloat(speed.toFixed(1)),
      heading: parseFloat(heading.toFixed(1)),
      lastUpdated: Date.now(),
    };

    await set(vehicleRef, payload);

    const progress = "█".repeat(step) + "░".repeat(TOTAL_STEPS - step);
    process.stdout.write(
      `\r  Step ${String(step).padStart(2)} / ${TOTAL_STEPS} [${progress}] ` +
      `lat=${payload.lat.toFixed(5)} lng=${payload.lng.toFixed(5)} ` +
      `speed=${payload.speed} km/h`
    );

    if (step < TOTAL_STEPS) {
      await new Promise((r) => setTimeout(r, INTERVAL_MS));
    }
  }

  console.log("\n\n✅ Trip simulation complete!");
  console.log("   Check the dashboard → /playground to see the final marker position.");
  process.exit(0);
}

main().catch((e) => {
  console.error("\n❌ Simulator error:", e);
  process.exit(1);
});

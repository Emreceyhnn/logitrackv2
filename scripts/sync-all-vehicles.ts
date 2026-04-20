import { PrismaClient } from "@prisma/client";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import * as dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const firebaseDb = getDatabase(app);
const prisma = new PrismaClient();

async function syncAllVehicles() {
  console.log("🚀 Starting bulk vehicle sync to Firebase...");
  
  try {
    const vehicles = await prisma.vehicle.findMany();
    console.log(`[Database] Found ${vehicles.length} vehicles.`);

    let successCount = 0;
    let failCount = 0;

    for (const vehicle of vehicles) {
      try {
        const path = `vehicles/registry/${vehicle.id}`;
        // Prisma model dates need conversion for Firebase JSON serialization
        const vehicleData = JSON.parse(JSON.stringify(vehicle));
        
        await set(ref(firebaseDb, path), {
          ...vehicleData,
          lastSynced: Date.now(),
        });
        
        successCount++;
        if (successCount % 20 === 0) {
          console.log(`[Progress] Synced ${successCount}/${vehicles.length} vehicles...`);
        }
      } catch (err) {
        console.error(`[Error] Failed to sync vehicle ${vehicle.id}:`, err);
        failCount++;
      }
    }

    console.log(`\n✅ Sync completed!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Failed: ${failCount}`);
    
  } catch (error) {
    console.error("❌ Fatal error during sync:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

syncAllVehicles();

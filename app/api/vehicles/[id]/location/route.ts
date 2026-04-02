/**
 * app/api/vehicles/[id]/location/route.ts
 *
 * GPS Device Push Endpoint  (Publisher — Server Side)
 * ====================================================
 * This is the HTTP endpoint that a real GPS tracker/IoT device on a vehicle
 * would call to push its location data.
 *
 * A physical device (or telematics unit) sends:
 *   POST /api/vehicles/{vehicleId}/location
 *   Body: { lat, lng, speed?, heading?, apiKey? }
 *
 * The server then:
 *   1. Validates the vehicleId exists in the Postgres DB.
 *   2. Writes the location to Firebase Realtime Database.
 *   3. All subscribed clients (dashboard) get the update in <100ms.
 *
 * GET /api/vehicles/{vehicleId}/location
 *   Returns the LATEST location stored in Firebase RTDB — used for
 *   one-time polling (non-realtime clients or REST consumers).
 */

import { NextRequest, NextResponse } from "next/server";
import { db as firebase, ref, set, onValue, off } from "@/app/lib/firebase";
import { db as prisma } from "@/app/lib/db";

interface LocationBody {
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
}

// ─── POST: Vehicle device PUSHES location to Firebase ─────────────────────────
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: vehicleId } = await params;

    // 1. Validate vehicle exists in DB
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      select: { id: true, plate: true },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: `Vehicle '${vehicleId}' not found` },
        { status: 404 }
      );
    }

    // 2. Parse request body
    const body: LocationBody = await request.json();
    const { lat, lng, speed, heading } = body;

    if (typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json(
        { error: "Invalid payload: 'lat' and 'lng' must be numbers" },
        { status: 400 }
      );
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: "Invalid coordinates: lat ∈ [-90, 90], lng ∈ [-180, 180]" },
        { status: 422 }
      );
    }

    // 3. Build the location payload
    const locationPayload = {
      lat,
      lng,
      speed: speed ?? null,
      heading: heading ?? null,
      lastUpdated: Date.now(),
    };

    // 4. Push to Firebase Realtime Database
    //    Path: vehicles/locations/{vehicleId}
    //    `set()` always overwrites = "latest snapshot" semantics
    const locationRef = ref(firebase, `vehicles/locations/${vehicleId}`);
    await set(locationRef, locationPayload);

    return NextResponse.json(
      {
        success: true,
        vehicleId,
        plate: vehicle.plate,
        location: locationPayload,
        message: "Location pushed to Firebase. Subscribed clients will update in <100ms.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/vehicles/[id]/location] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── GET: Client polls latest location from Firebase RTDB (REST consumers) ───
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: vehicleId } = await params;

    // Validate vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      select: { id: true, plate: true, currentLat: true, currentLng: true },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: `Vehicle '${vehicleId}' not found` },
        { status: 404 }
      );
    }

    // Read the latest value from Firebase RTDB (one-time read)
    const locationRef = ref(firebase, `vehicles/locations/${vehicleId}`);
    const liveLocation = await new Promise<Record<string, number | null> | null>(
      (resolve) => {
        onValue(
          locationRef,
          (snapshot) => {
            off(locationRef); // Unsubscribe immediately after one read
            resolve(snapshot.val());
          },
          { onlyOnce: true }
        );
      }
    );

    return NextResponse.json({
      vehicleId,
      plate: vehicle.plate,
      // Live Firebase data (real-time, high frequency)
      liveLocation: liveLocation ?? null,
      // Fallback: last saved coordinates in Postgres DB (low frequency)
      dbLocation:
        vehicle.currentLat && vehicle.currentLng
          ? { lat: vehicle.currentLat, lng: vehicle.currentLng }
          : null,
      source: liveLocation ? "firebase_rtdb" : "postgres_fallback",
    });
  } catch (error) {
    console.error("[GET /api/vehicles/[id]/location] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * app/api/vehicles/[id]/location/route.ts
 *
 * GPS Device Push Endpoint  (Publisher — Server Side)
 * ====================================================
 * This is the HTTP endpoint that a real GPS tracker/IoT device on a vehicle
 * would call to push its location data.
 *
 * SECURITY: Both handlers require an authenticated session and only operate on
 * vehicles owned by the caller's company. The vehicle lookup runs inside the
 * tenant context so the Prisma tenant-guard (see db.ts) enforces `companyId`
 * scoping — a request for another tenant's vehicle id returns 404, not data.
 *
 * NOTE: A real unattended GPS device cannot hold a user session. When such
 * devices are onboarded, replace the session check on POST with a per-device
 * API token (hashed, scoped to a single vehicleId + companyId). Until then this
 * endpoint is dashboard/authenticated-user only.
 */

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import { db as prisma } from "@/app/lib/db";
import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import { runWithTenant } from "@/app/lib/tenant-context";

interface LocationBody {
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
}

/**
 * Resolves the authenticated user and confirms the target vehicle belongs to
 * their company. Returns the vehicle (tenant-scoped) or a NextResponse to send
 * back immediately (401 / 404).
 */
async function authorizeVehicleAccess(
  vehicleId: string,
  select: Record<string, boolean>
) {
  const user = await getAuthenticatedUser();
  if (!user || !user.companyId) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const companyId = user.companyId;
  // Runs inside the tenant context: the Prisma tenant-guard injects
  // `companyId = <caller's company>`, so a foreign vehicle id yields null.
  const vehicle = await runWithTenant(companyId, () =>
    prisma.vehicle.findFirst({
      where: { id: vehicleId },
      select,
    })
  );

  if (!vehicle) {
    return {
      error: NextResponse.json(
        { error: `Vehicle '${vehicleId}' not found` },
        { status: 404 }
      ),
    };
  }

  return { user, companyId, vehicle };
}

// ─── POST: Vehicle device PUSHES location to Firebase ─────────────────────────
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: vehicleId } = await params;

    // 1. Authenticate + confirm tenant ownership of the vehicle
    const access = await authorizeVehicleAccess(vehicleId, {
      id: true,
      plate: true,
    });
    if ("error" in access) return access.error;
    const { companyId, vehicle } = access;

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

    // 4. Push to Firebase Realtime Database via Admin SDK (tenant-scoped path)
    if (adminDb) {
      await adminDb
        .ref(`vehicles/locations/${companyId}/${vehicleId}`)
        .set(locationPayload);
    } else {
      console.warn("⚠️ Firebase Admin SDK not initialized. Skipping location push.");
    }

    return NextResponse.json(
      {
        success: true,
        vehicleId,
        plate: vehicle.plate,
        location: locationPayload,
        message: "Location pushed to Firebase via Admin SDK.",
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

    // Authenticate + confirm tenant ownership of the vehicle
    const access = await authorizeVehicleAccess(vehicleId, {
      id: true,
      plate: true,
      currentLat: true,
      currentLng: true,
    });
    if ("error" in access) return access.error;
    const { companyId, vehicle } = access;

    // Read the latest value from Firebase RTDB (one-time read) via Admin SDK
    let liveLocation = null;
    if (adminDb) {
      const snapshot = await adminDb
        .ref(`vehicles/locations/${companyId}/${vehicleId}`)
        .once("value");
      liveLocation = snapshot.val();
    }

    return NextResponse.json({
      vehicleId,
      plate: vehicle.plate,
      liveLocation: liveLocation ?? null,
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

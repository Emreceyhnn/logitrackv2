"use server";

import { adminDb } from "@/app/lib/firebase-admin";

export interface VehicleLocation {
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  lastUpdated: number;
}

export async function updateVehicleLocationAction(
  vehicleId: string,
  location: Omit<VehicleLocation, "lastUpdated">
) {
  try {
    const path = `vehicles/locations/${vehicleId}`;
    const data: VehicleLocation = {
      ...location,
      lastUpdated: Date.now(),
    };

    await adminDb.ref(path).set(data);
    return { success: true };
  } catch (error) {
    console.error(`Failed to update location for vehicle ${vehicleId}:`, error);
    return { success: false, error: String(error) };
  }
}

export async function updateVehicleDataAction(
  vehicleId: string,
  data: Partial<VehicleLocation>
) {
  try {
    const path = `vehicles/locations/${vehicleId}`;
    const updateData = {
      ...data,
      lastUpdated: Date.now(),
    };
    await adminDb.ref(path).update(updateData);
    return { success: true };
  } catch (error) {
    console.error(`Failed to update data for vehicle ${vehicleId}:`, error);
    return { success: false, error: String(error) };
  }
}

export async function syncVehicleToFirebaseAction(vehicle: any) {
  try {
    const path = `vehicles/registry/${vehicle.id}`;
    await adminDb.ref(path).set({
      ...vehicle,
      lastSynced: Date.now(),
    });
    return { success: true };
  } catch (error) {
    console.error(`Failed to sync vehicle ${vehicle.id} to Firebase:`, error);
    return { success: false, error: String(error) };
  }
}

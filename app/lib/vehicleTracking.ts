import { db as firebase, ref, set, update, onValue, off } from "./firebase";

export interface VehicleLocation {
  lat: number;
  lng: number;
  speed?: number; // km/h
  heading?: number; // degrees
  lastUpdated: number; // timestamp
}

/**
 * Updates a vehicle's live location in Firebase Realtime Database.
 */
export const updateVehicleLocation = async (
  vehicleId: string,
  location: Omit<VehicleLocation, "lastUpdated">
) => {
  try {
    const path = `vehicles/locations/${vehicleId}`;
    const data: VehicleLocation = {
      ...location,
      lastUpdated: Date.now(),
    };

    await set(ref(firebase, path), data);
    return { success: true };
  } catch (error) {
    console.error(`Failed to update location for vehicle ${vehicleId}:`, error);
    throw error;
  }
};

/**
 * Updates multiple fields for a vehicle in Firebase.
 */
export const updateVehicleData = async (
  vehicleId: string,
  data: Partial<VehicleLocation>
) => {
  try {
    const path = `vehicles/locations/${vehicleId}`;
    const updateData = {
      ...data,
      lastUpdated: Date.now(),
    };
    await update(ref(firebase, path), updateData);
    return { success: true };
  } catch (error) {
    console.error(`Failed to update data for vehicle ${vehicleId}:`, error);
    throw error;
  }
};

/**
 * Subscribes to a single vehicle's location.
 */
export const subscribeToVehicleLocation = (
  vehicleId: string,
  callback: (location: VehicleLocation | null) => void
) => {
  const path = `vehicles/locations/${vehicleId}`;
  const vehicleRef = ref(firebase, path);

  onValue(vehicleRef, (snapshot) => {
    callback(snapshot.val());
  });

  return () => off(vehicleRef);
};

/**
 * Subscribes to all vehicle locations.
 */
export const subscribeToAllVehicles = (
  callback: (locations: Record<string, VehicleLocation>) => void
) => {
  const path = "vehicles/locations";
  const vehiclesRef = ref(firebase, path);

  onValue(vehiclesRef, (snapshot) => {
    callback(snapshot.val() || {});
  });

  return () => off(vehiclesRef);
};
/**
 * Syncs the entire vehicle record to Firebase.
 */
export const syncVehicleToFirebase = async (vehicle: any) => {
  try {
    const path = `vehicles/registry/${vehicle.id}`;
    await set(ref(firebase, path), {
      ...vehicle,
      lastSynced: Date.now(),
    });
    return { success: true };
  } catch (error) {
    console.error(`Failed to sync vehicle ${vehicle.id} to Firebase:`, error);
    // We don't throw here to avoid breaking the main flow
    return { success: false, error };
  }
};

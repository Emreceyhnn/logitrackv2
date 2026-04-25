import { db as firebase, ref, set, update, onValue, off } from "./firebase";

export interface VehicleLocation {
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  lastUpdated: number;
}

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

    return { success: false, error };
  }
};

import { db as firebase, ref, onValue, off } from "./firebase";
import { VehicleLocation } from "@/app/lib/type/vehicle";

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

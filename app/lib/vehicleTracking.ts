import { db as firebase, ref, onValue, off } from "./firebase";
import { 
  updateVehicleLocationAction, 
  updateVehicleDataAction, 
  syncVehicleToFirebaseAction 
} from "./actions/vehicleTracking";

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
  return updateVehicleLocationAction(vehicleId, location);
};

export const updateVehicleData = async (
  vehicleId: string,
  data: Partial<VehicleLocation>
) => {
  return updateVehicleDataAction(vehicleId, data);
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

export const syncVehicleToFirebase = async (vehicle: { id: string } & Record<string, unknown>) => {
  return syncVehicleToFirebaseAction(vehicle);
};

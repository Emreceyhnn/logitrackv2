import { db as firebase, ref, onValue, off } from "./firebase";
import { ensureFirebaseAuth } from "./firebase-auth";
import { VehicleLocation } from "@/app/lib/type/vehicle";

/**
 * Reads are tenant-scoped: `vehicles/locations/{companyId}/...`. The client must
 * be signed in to Firebase Auth with a `companyId` custom claim (see
 * `ensureFirebaseAuth`) and RTDB security rules (`database.rules.json`) reject
 * any subscription whose path companyId differs from the token claim. A caller
 * that passes another tenant's companyId simply gets a permission-denied error.
 */

export const subscribeToVehicleLocation = (
  companyId: string,
  vehicleId: string,
  callback: (location: VehicleLocation | null) => void
) => {
  const path = `vehicles/locations/${companyId}/${vehicleId}`;
  let vehicleRef: ReturnType<typeof ref> | null = null;
  let cancelled = false;

  void ensureFirebaseAuth().then(() => {
    if (cancelled) return;
    vehicleRef = ref(firebase, path);
    onValue(vehicleRef, (snapshot) => callback(snapshot.val()));
  });

  return () => {
    cancelled = true;
    if (vehicleRef) off(vehicleRef);
  };
};

export const subscribeToAllVehicles = (
  companyId: string,
  callback: (locations: Record<string, VehicleLocation>) => void
) => {
  const path = `vehicles/locations/${companyId}`;
  let vehiclesRef: ReturnType<typeof ref> | null = null;
  let cancelled = false;

  void ensureFirebaseAuth().then(() => {
    if (cancelled) return;
    vehiclesRef = ref(firebase, path);
    onValue(vehiclesRef, (snapshot) => callback(snapshot.val() || {}));
  });

  return () => {
    cancelled = true;
    if (vehiclesRef) off(vehiclesRef);
  };
};

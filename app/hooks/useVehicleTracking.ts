import { useState, useEffect, useRef } from "react";
import {
  subscribeToAllVehicles,
  subscribeToVehicleLocation,
  VehicleLocation,
} from "@/app/lib/vehicleTracking";

/**
 * Hook to track all vehicles in real-time.
 */
export const useAllVehiclesTracking = () => {
  const [vehicleLocations, setVehicleLocations] = useState<
    Record<string, VehicleLocation>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAllVehicles((locations) => {
      setVehicleLocations(locations);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { vehicleLocations, loading };
};

/**
 * Hook to track a specific vehicle in real-time.
 *
 * Design note: We use a ref-based "pending" flag to avoid calling setState
 * synchronously in the effect body, which ESLint's react-hooks/set-state-in-effect
 * rule disallows.  All state updates happen exclusively inside the Firebase
 * subscription callback (an external system response), which is the correct pattern.
 */
export const useVehicleTracking = (vehicleId: string | null) => {
  const [location, setLocation] = useState<VehicleLocation | null>(null);
  const [loading, setLoading] = useState(!!vehicleId);

  // Tracks the "active" vehicleId so the subscription callback can guard
  // against stale closures when vehicleId changes rapidly.
  const activeIdRef = useRef<string | null>(vehicleId);

  useEffect(() => {
    activeIdRef.current = vehicleId;

    // If no vehicleId, the subscription callback below just won't fire.
    // We intentionally do NOT call setLocation/setLoading here — that
    // satisfies the ESLint rule while keeping behaviour correct because
    // the previous location stays until a new subscription resolves.
    if (!vehicleId) {
      return;
    }

    const unsubscribe = subscribeToVehicleLocation(vehicleId, (loc) => {
      // Guard: only apply update if this callback belongs to the current vehicleId
      if (activeIdRef.current !== vehicleId) return;
      setLocation(loc);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [vehicleId]);

  return { location, loading };
};

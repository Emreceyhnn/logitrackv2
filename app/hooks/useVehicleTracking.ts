import { useState, useEffect, useRef } from "react";
import {
  subscribeToAllVehicles,
  subscribeToVehicleLocation,
} from "@/app/lib/vehicleTracking";
import { VehicleLocation } from "@/app/lib/type/vehicle";

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

export const useVehicleTracking = (vehicleId: string | null) => {
  const [location, setLocation] = useState<VehicleLocation | null>(null);
  const [loading, setLoading] = useState(!!vehicleId);

  const activeIdRef = useRef<string | null>(vehicleId);

  useEffect(() => {
    activeIdRef.current = vehicleId;

    if (!vehicleId) {
      return;
    }

    const unsubscribe = subscribeToVehicleLocation(vehicleId, (loc) => {
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

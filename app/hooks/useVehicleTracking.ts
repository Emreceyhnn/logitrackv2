import { useState, useEffect, useRef } from "react";
import {
  subscribeToAllVehicles,
  subscribeToVehicleLocation,
} from "@/app/lib/vehicleTracking";
import { useUser } from "@/app/hooks/useUser";
import { VehicleLocation } from "@/app/lib/type/vehicle";

export const useAllVehiclesTracking = () => {
  const { user } = useUser();
  const companyId = user?.companyId ?? null;

  const [vehicleLocations, setVehicleLocations] = useState<
    Record<string, VehicleLocation>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;

    const unsubscribe = subscribeToAllVehicles(companyId, (locations) => {
      setVehicleLocations(locations);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [companyId]);

  return { vehicleLocations, loading };
};

export const useVehicleTracking = (vehicleId: string | null) => {
  const { user } = useUser();
  const companyId = user?.companyId ?? null;

  const [location, setLocation] = useState<VehicleLocation | null>(null);
  const [loading, setLoading] = useState(!!vehicleId);

  const activeIdRef = useRef<string | null>(vehicleId);

  useEffect(() => {
    activeIdRef.current = vehicleId;

    if (!vehicleId || !companyId) {
      return;
    }

    const unsubscribe = subscribeToVehicleLocation(
      companyId,
      vehicleId,
      (loc) => {
        if (activeIdRef.current !== vehicleId) return;
        setLocation(loc);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [vehicleId, companyId]);

  return { location, loading };
};

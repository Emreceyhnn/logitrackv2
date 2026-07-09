import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { updateRouteStatus } from "@/app/lib/controllers/routes";
import { polylineHelper } from "@/app/components/valhalla/polylineHelper";
import { RouteWithRelations } from "@/app/lib/type/routes";
import { RouteStatus } from "@/app/lib/type/enums";
import { Dictionary } from "@/app/lib/language/language";

export const useRouteDialog = (open: boolean, route: RouteWithRelations | null, onSuccess?: () => void, dict?: Dictionary) => {
  const [liveMetrics, setLiveMetrics] = useState<{ distanceKm: number; durationMin: number; } | null>(null);
  const [vehicleToDestMetrics, setVehicleToDestMetrics] = useState<{ distanceKm: number; durationMin: number; } | null>(null);
  const [vehicleTraveledMetrics, setVehicleTraveledMetrics] = useState<{ distanceKm: number; } | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const { mapOrigin, mapDestination, intermediateStops } = useMemo(() => {
    if (!route) return { mapOrigin: undefined, mapDestination: undefined, intermediateStops: [] };
    const allStops = Array.isArray(route.stops) ? route.stops : [];
    const typedStops = allStops as { lat?: number; lng?: number; address?: string; }[];

    const mOrigin = typedStops.length > 0 ? { lat: typedStops[0]?.lat || 0, lng: typedStops[0]?.lng || 0, address: typedStops[0]?.address || "" } : undefined;
    const mDest = typedStops.length > 1 ? { lat: typedStops[typedStops.length - 1]?.lat || 0, lng: typedStops[typedStops.length - 1]?.lng || 0, address: typedStops[typedStops.length - 1]?.address || "" } : undefined;

    const interStops = typedStops.length > 2 ? typedStops.slice(1, -1).filter((stop) => {
      const isDuplicateOrigin = mOrigin && stop.address === mOrigin.address;
      const isDuplicateDestination = mDest && stop.address === mDest.address;
      return !isDuplicateOrigin && !isDuplicateDestination;
    }).map((w) => ({ location: { lat: w.lat || 0, lng: w.lng || 0 }, stopover: true })) : [];

    return { mapOrigin: mOrigin, mapDestination: mDest, intermediateStops: interStops };
  }, [route]);

  useEffect(() => {
    if (!open) return;
    const vLat = route?.vehicle?.currentLat;
    const vLng = route?.vehicle?.currentLng;
    if (!vLat || !vLng) { setVehicleTraveledMetrics(null); setVehicleToDestMetrics(null); return; }

    let cancelled = false;

    const traveledCall = mapOrigin ? polylineHelper({ locations: [{ lat: mapOrigin.lat, lon: mapOrigin.lng, name: "Origin" }, { lat: vLat, lon: vLng, name: "Vehicle" }], costing: "truck" })
      .then((r) => r?.summary ? { distanceKm: Math.round(r.summary.length * 10) / 10 } : null).catch(() => null) : Promise.resolve(null);

    const remainingCall = mapDestination ? polylineHelper({ locations: [{ lat: vLat, lon: vLng, name: "Vehicle" }, { lat: mapDestination.lat, lon: mapDestination.lng, name: mapDestination.address || "Destination" }], costing: "truck" })
      .then((r) => r?.summary ? { distanceKm: Math.round(r.summary.length * 10) / 10, durationMin: Math.round(r.summary.time / 60) } : null).catch(() => null) : Promise.resolve(null);

    Promise.all([traveledCall, remainingCall]).then(([traveled, remaining]) => {
      if (cancelled) return;
      setVehicleTraveledMetrics(traveled); setVehicleToDestMetrics(remaining);
    });

    return () => { cancelled = true; };
  }, [open, route?.vehicle?.currentLat, route?.vehicle?.currentLng, mapOrigin, mapDestination]);

  const handleStatusChange = async (newStatus: RouteStatus) => {
    if (!route) return;
    setStatusLoading(true);
    try {
      await updateRouteStatus(route.id, newStatus);
      toast.success(dict?.toasts.successUpdate || "Successfully updated!");
      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : (dict?.toasts.errorGeneric || "Error");
      toast.error(message);
    } finally {
      setStatusLoading(false);
    }
  };

  return { liveMetrics, setLiveMetrics, vehicleToDestMetrics, vehicleTraveledMetrics, statusLoading, mapOrigin, mapDestination, intermediateStops, handleStatusChange };
};

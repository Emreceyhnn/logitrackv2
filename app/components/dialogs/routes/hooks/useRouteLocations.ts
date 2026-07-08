import { useMemo } from "react";
import { RouteWithRelations } from "@/app/lib/type/routes";

export const useRouteLocations = (route: RouteWithRelations | null) => {
  return useMemo(() => {
    if (!route)
      return {
        mapOrigin: undefined,
        mapDestination: undefined,
        intermediateStops: [],
      };
    const allStops = Array.isArray(route.stops) ? route.stops : [];
    const typedStops = allStops as {
      lat?: number;
      lng?: number;
      address?: string;
    }[];

    const mOrigin =
      typedStops.length > 0
        ? {
            lat: typedStops[0].lat || 0,
            lng: typedStops[0].lng || 0,
            address: typedStops[0].address || "",
          }
        : undefined;

    const mDest =
      typedStops.length > 1
        ? {
            lat: typedStops[typedStops.length - 1].lat || 0,
            lng: typedStops[typedStops.length - 1].lng || 0,
            address: typedStops[typedStops.length - 1].address || "",
          }
        : undefined;

    const interStops =
      typedStops.length > 2
        ? typedStops
            .slice(1, -1)
            .filter((stop) => {
              const isDuplicateOrigin =
                mOrigin && stop.address === mOrigin.address;
              const isDuplicateDestination =
                mDest && stop.address === mDest.address;
              return !isDuplicateOrigin && !isDuplicateDestination;
            })
            .map((w) => ({
              location: { lat: w.lat || 0, lng: w.lng || 0 },
              stopover: true,
            }))
        : [];

    return {
      mapOrigin: mOrigin,
      mapDestination: mDest,
      intermediateStops: interStops,
    };
  }, [route]);
};

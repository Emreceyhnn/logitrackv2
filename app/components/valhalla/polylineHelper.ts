import {
  costing_options,
  decodeShape,
  fetchRoute,
  RoutingParams,
} from "@/app/lib/valhalla";

export interface LocationPoint {
  lat: number;
  lon: number;
  name: string;
}

export interface PolylineHelperResult {
  polyline: [number, number][];
  mapPoints: LocationPoint[];
  summary: { length: number; time: number };
}

interface PolylineHelperParams {
  locations: LocationPoint[];
  costing?: string;
  costing_options?: costing_options;
}

export const polylineHelper = async (params: PolylineHelperParams): Promise<PolylineHelperResult | undefined> => {
  const input: RoutingParams = {
    locations: params.locations.map((i) => ({ lat: i.lat, lon: i.lon })),
    costing: params.costing || "auto",
    ...(params.costing_options ? { costing_options: params.costing_options } : {}),
  };

  try {
    const data = await fetchRoute(input);
    const legs = data.trip?.legs;

    if (!legs || legs.length === 0) {
      throw new Error("Rotaya ait bacaklar (legs) bulunamadı.");
    }

    const decodedPoints: [number, number][] = [];
    for (const leg of legs) {
      if (leg.shape) {
        const decoded = decodeShape(leg.shape);
        decodedPoints.push(...decoded);
      }
    }

    if (decodedPoints.length === 0) {
      throw new Error("Rotaya ait geometrik çizgi (shape) bulunamadı.");
    }

    return {
      polyline: decodedPoints,
      mapPoints: params.locations,
      summary: {
        length: data.trip.summary.length,
        time: data.trip.summary.time,
      },
    };
  } catch (err: unknown) {
    console.error("Valhalla Routing Error:", err);
    return undefined;
  }
};

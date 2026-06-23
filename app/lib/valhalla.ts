import polyline from "@mapbox/polyline";

export interface Location {
  lat: number;
  lon: number;
}

export interface costing_options {
  height: number;
  width: number;
  length: number;
  weight: number;
  exclude_unpaved: boolean;
  use_highways: boolean;
  use_tolls: boolean;
}

export interface RoutingParams {
  locations: Location[];
  costing?: string;
  costing_options?: costing_options;
  exclude_locations?: Location[];
  date_time?: {
    type: number;
    value: string;
  };
}

export interface RouteResponse {
  trip: {
    legs: {
      shape: string;
      summary: {
        length: number;
        time: number;
      };
    }[];
    summary: {
      length: number;
      time: number;
    };
    status: number;
    status_message: string;
  };
}

const VALHALLA_URL = "/api/valhalla";

export async function fetchRoute(
  params: RoutingParams
): Promise<RouteResponse> {
  const response = await fetch(VALHALLA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...params,
      exclude_locations:
        params.exclude_locations && params.exclude_locations.length > 0
          ? params.exclude_locations
          : undefined,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Valhalla Hatası: ${errorText}`);
  }

  return response.json();
}

export function decodeShape(shapeString: string): [number, number][] {
  return polyline.decode(shapeString, 6);
}

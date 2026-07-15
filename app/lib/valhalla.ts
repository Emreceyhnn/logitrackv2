import polyline from "@mapbox/polyline";

export interface Location {
  lat: number;
  lon: number;
  type?: string;
}

export interface CostingOptionsProfile {
  height?: number;
  width?: number;
  length?: number;
  weight?: number;
  axle_load?: number;
  hazmat?: boolean;
  exclude_unpaved?: boolean;
  use_highways?: number | boolean;
  use_tolls?: number | boolean;
}

export interface costing_options {
  truck?: CostingOptionsProfile;
  auto?: CostingOptionsProfile;
  [key: string]: CostingOptionsProfile | undefined;
}

export interface RoutingParams {
  locations: Location[];
  costing?: string;
  costing_options?: costing_options;
  directions_options?: {
    units?: string;
    language?: string;
  };
  exclude_locations?: Location[];
  date_time?: {
    type: number;
    value: string;
  };
}

export interface RouteResponse {
  trip?: {
    legs: {
      shape: string;
      summary: {
        length: number;
        time: number;
        cost?: number;
      };
    }[];
    summary: {
      length: number;
      time: number;
      cost?: number;
    };
    status?: number;
    status_message?: string;
  };
  route?: {
    legs: {
      shape: string;
      summary: {
        length: number;
        time: number;
        cost?: number;
      };
    }[];
    summary?: {
      length: number;
      time: number;
      cost?: number;
    };
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
    signal: AbortSignal.timeout(30_000),
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

import type { Prisma } from "@prisma/client";

export interface RouteStop {
  address: string;
  lat?: number;
  lng?: number;
}

/**
 * Narrows the `stops` Json column to its domain shape with a real runtime
 * check. The app is the only writer of this column, but the DB cannot
 * enforce the shape — so entries that don't match are dropped instead of
 * being blindly cast through.
 */
export function parseStops(
  value: Prisma.JsonValue | null | undefined
): RouteStop[] | null {
  if (!Array.isArray(value)) return null;

  const stops: RouteStop[] = [];
  for (const entry of value) {
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      const record = entry as Prisma.JsonObject;
      if (typeof record.address === "string") {
        stops.push({
          address: record.address,
          lat: typeof record.lat === "number" ? record.lat : undefined,
          lng: typeof record.lng === "number" ? record.lng : undefined,
        });
      }
    }
  }
  return stops;
}

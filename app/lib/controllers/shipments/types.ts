import type { Customer, CustomerLocation } from "@prisma/client";

export interface CustomerWithLocations extends Customer {
  locations: CustomerLocation[];
}

export interface ShipmentStopInput {
  customerId?: string | null;
  customerLocationId?: string | null;
  address: string;
  lat: number | null;
  lng: number | null;
  sequence: number;
  contactEmail?: string | null;
}

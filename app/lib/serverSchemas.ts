import { z } from "zod";
import { WarehouseType, VehicleType, VehicleStatus, TrailerType } from "@/app/lib/type/enums";

export const updateWarehouseSchema = z.object({
  name: z.string().optional(),
  code: z.string().min(1, "Warehouse code is required").optional(),
  type: z.nativeEnum(WarehouseType).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  capacityPallets: z.number().optional(),
  capacityVolumeM3: z.number().optional(),
  operatingHours: z.string().optional(),
  timezone: z.string().optional(),
  specifications: z.array(z.string()).optional(),
  managerId: z.string().optional(),
});

export const vehicleSchema = z.object({
  year: z.union([z.string(), z.number()]).transform(v => parseInt(v.toString())),
  maxLoadKg: z.union([z.string(), z.number()]).transform(v => parseInt(v.toString())),
  plate: z.string().min(1, "Plate is required"),
  type: z.nativeEnum(VehicleType),
  brand: z.string().optional().default(""),
  model: z.string().optional().default(""),
  fleetNo: z.string().optional(),
  fuelType: z.string().optional().default("DIESEL"),
  odometerKm: z.union([z.string(), z.number()]).optional().transform(v => v ? parseInt(v.toString()) : null),
  fuelLevel: z.union([z.string(), z.number()]).optional().transform(v => v ? parseInt(v.toString()) : null),
  avgFuelConsumption: z.union([z.string(), z.number()]).optional().transform(v => v ? parseFloat(v.toString()) : null),
  fuelCapacity: z.union([z.string(), z.number()]).optional().transform(v => v ? parseInt(v.toString()) : null),
  nextServiceKm: z.union([z.string(), z.number()]).optional().transform(v => v ? parseInt(v.toString()) : null),
  registrationExpiry: z.union([z.string(), z.date()]).optional().transform(v => v ? new Date(v) : null),
  inspectionExpiry: z.union([z.string(), z.date()]).optional().transform(v => v ? new Date(v) : null),
  engineSize: z.string().optional().nullable(),
  transmission: z.string().optional().nullable(),
  techNotes: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),
  enableAlerts: z.boolean().optional().default(false),
  status: z.nativeEnum(VehicleStatus).optional().default(VehicleStatus.AVAILABLE),
});

export const trailerSchema = z.object({
  plate: z.string().min(1, "Plate is required"),
  fleetNo: z.string().min(1, "Fleet Number is required"),
  type: z.nativeEnum(TrailerType),
  capacityVolumeM3: z.union([z.string(), z.number()]).transform(v => parseFloat(v.toString()) || 0),
  maxLoadKg: z.union([z.string(), z.number()]).transform(v => parseInt(v.toString()) || 0),
  isColdChain: z.boolean().optional().default(false),
});

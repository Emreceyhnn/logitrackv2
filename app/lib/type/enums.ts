/**
 * CLIENT-SAFE ENUMS & ENTITY TYPES
 * =================================
 * These enums and interfaces EXACTLY mirror the Prisma schema.
 * They are defined here as plain TypeScript so they can be safely
 * imported by both Server and Client components without triggering
 * Prisma's browser-side bundling error.
 *
 * Import rule:
 *   - Controllers / Server Actions   → import from "@prisma/client"
 *   - Everything else (UI, hooks)    → import from "@/app/lib/type/enums"
 */

// ─── Enums ───────────────────────────────────────────────────────────────────



export const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;
export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

export const VehicleType = {
  TRUCK: "TRUCK",
  VAN: "VAN",
} as const;
export type VehicleType = typeof VehicleType[keyof typeof VehicleType];

export const TrailerType = {
  DRY_VAN: "DRY_VAN",
  REEFER: "REEFER",
  FLATBED: "FLATBED",
  TANKER: "TANKER",
  CURTAINSIDE: "CURTAINSIDE",
  CONTAINER_CHASSIS: "CONTAINER_CHASSIS",
} as const;
export type TrailerType = typeof TrailerType[keyof typeof TrailerType];

export const TrailerStatus = {
  AVAILABLE: "AVAILABLE",
  IN_USE: "IN_USE",
  MAINTENANCE: "MAINTENANCE",
  RETIRED: "RETIRED",
} as const;
export type TrailerStatus = typeof TrailerStatus[keyof typeof TrailerStatus];

export const VehicleStatus = {
  AVAILABLE: "AVAILABLE",
  ON_TRIP: "ON_TRIP",
  MAINTENANCE: "MAINTENANCE",
  OUT_OF_ORDER: "OUT_OF_ORDER",
} as const;
export type VehicleStatus = typeof VehicleStatus[keyof typeof VehicleStatus];

export const DriverStatus = {
  ON_JOB: "ON_JOB",
  OFF_DUTY: "OFF_DUTY",
  ON_LEAVE: "ON_LEAVE",
} as const;
export type DriverStatus = typeof DriverStatus[keyof typeof DriverStatus];

export const WarehouseType = {
  DISTRIBUTION_CENTER: "DISTRIBUTION_CENTER",
  CROSSDOCK: "CROSSDOCK",
  WAREHOUSE: "WAREHOUSE",
} as const;
export type WarehouseType = typeof WarehouseType[keyof typeof WarehouseType];

export const RouteStatus = {
  PLANNED: "PLANNED",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
} as const;
export type RouteStatus = typeof RouteStatus[keyof typeof RouteStatus];

export const ShipmentStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  ASSIGNED: "ASSIGNED",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  FAILED: "FAILED",
  RETURNED: "RETURNED",
  DELAYED: "DELAYED",
  CANCELLED: "CANCELLED",
} as const;
export type ShipmentStatus = typeof ShipmentStatus[keyof typeof ShipmentStatus];

export const ShipmentPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;
export type ShipmentPriority = typeof ShipmentPriority[keyof typeof ShipmentPriority];

export const ShipmentServiceType = {
  STANDARD_FREIGHT: "STANDARD_FREIGHT",
  EXPRESS: "EXPRESS",
  HAZARDOUS: "HAZARDOUS",
} as const;
export type ShipmentServiceType = typeof ShipmentServiceType[keyof typeof ShipmentServiceType];

export const MaintenanceType = {
  ROUTINE_MAINTENANCE: "ROUTINE_MAINTENANCE",
  REPAIR: "REPAIR",
  INSPECTION: "INSPECTION",
  TIRE_CHANGE: "TIRE_CHANGE",
  OIL_CHANGE: "OIL_CHANGE",
  OTHER: "OTHER",
} as const;
export type MaintenanceType = typeof MaintenanceType[keyof typeof MaintenanceType];

export const DocumentType = {
  REGISTRATION: "REGISTRATION",
  TRAILER_REGISTRATION: "TRAILER_REGISTRATION",
  INSURANCE: "INSURANCE",
  LICENSE: "LICENSE",
  INSPECTION: "INSPECTION",
  MAINTENANCE: "MAINTENANCE",
  OTHER: "OTHER",
} as const;
export type DocumentType = typeof DocumentType[keyof typeof DocumentType];

export const DocumentStatus = {
  ACTIVE: "ACTIVE",
  MISSING: "MISSING",
  EXPIRING_SOON: "EXPIRING_SOON",
  EXPIRED: "EXPIRED",
} as const;
export type DocumentStatus = typeof DocumentStatus[keyof typeof DocumentStatus];

export const FuelType = {
  DIESEL: "DIESEL",
  GASOLINE: "GASOLINE",
  ELECTRIC: "ELECTRIC",
  HYBRID: "HYBRID",
} as const;
export type FuelType = typeof FuelType[keyof typeof FuelType];

export const MovementType = {
  STOCK_IN: "STOCK_IN",
  PUTAWAY: "PUTAWAY",
  PICK: "PICK",
  PACK: "PACK",
  RESTOCK: "RESTOCK",
  RESTOCK_REQUEST: "RESTOCK_REQUEST",
  ADJUSTMENT: "ADJUSTMENT",
  ALLOCATION: "ALLOCATION",
  ALLOCATION_REVERT: "ALLOCATION_REVERT",
  ALLOCATION_CANCEL: "ALLOCATION_CANCEL",
} as const;
export type MovementType = typeof MovementType[keyof typeof MovementType];

export const IssueStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
} as const;
export type IssueStatus = typeof IssueStatus[keyof typeof IssueStatus];

export const IssuePriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;
export type IssuePriority = typeof IssuePriority[keyof typeof IssuePriority];

export const IssueType = {
  VEHICLE: "VEHICLE",
  DRIVER: "DRIVER",
  SHIPMENT: "SHIPMENT",
  TRAILER: "TRAILER",
  OTHER: "OTHER",
} as const;
export type IssueType = typeof IssueType[keyof typeof IssueType];

export const MaintenanceStatus = {
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type MaintenanceStatus = typeof MaintenanceStatus[keyof typeof MaintenanceStatus];

export const AuditAction = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  REGISTER: "REGISTER",
  TOKEN_REFRESH: "TOKEN_REFRESH",
  SESSION_REVOKE: "SESSION_REVOKE",
  PASSWORD_CHANGE: "PASSWORD_CHANGE",
  LOGIN_FAILED: "LOGIN_FAILED",
} as const;
export type AuditAction = typeof AuditAction[keyof typeof AuditAction];

// ─── Base Entity Interfaces ───────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  password?: string | null;
  avatarUrl?: string | null;
  roleId?: string | null;
  status?: UserStatus;
  lastLoginAt?: Date | null;
  companyId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  permissions: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Driver {
  id: string;
  userId: string;
  phone: string;
  employeeId: string;
  licenseNumber?: string | null;
  licenseType?: string | null;
  licenseExpiry?: Date | null;
  status: DriverStatus;
  safetyScore?: number | null;
  efficiencyScore?: number | null;
  rating?: number | null;
  hazmatCertified: boolean;
  languages: string[];
  currentVehicleId?: string | null;
  companyId?: string | null;
  homeBaseWarehouseId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  user: User;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  type?: WarehouseType;
  address: string;
  city: string;
  country: string;
  lat?: number | null;
  lng?: number | null;
  capacityPallets?: number;
  capacityVolumeM3?: number;
  operatingHours?: string | null;
  timezone: string;
  specifications?: string[];
  managerId?: string | null;
  companyId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Vehicle {
  id: string;
  fleetNo?: string;
  plate: string;
  type?: VehicleType;
  brand: string;
  model: string;
  year?: number;
  status: VehicleStatus;
  maxLoadKg?: number;
  fuelType?: string;
  currentLat?: number | null;
  currentLng?: number | null;
  fuelLevel?: number | null;
  odometerKm?: number | null;
  companyId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Trailer {
  id: string;
  fleetNo: string;
  plate: string;
  type: TrailerType;
  capacityVolumeM3: number;
  maxLoadKg: number;
  isColdChain: boolean;
  status: TrailerStatus;
  currentVehicleId?: string | null;
  companyId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TrailerAssignment {
  id: string;
  trailerId: string;
  vehicleId: string;
  assignedAt: Date;
  detachedAt?: Date | null;
  notes?: string | null;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  industry?: string | null;
  taxId?: string | null;
  email?: string | null;
  phone?: string | null;
  companyId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerLocation {
  id: string;
  customerId: string;
  name: string;
  address: string;
  lat?: number | null;
  lng?: number | null;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Shipment {
  id: string;
  trackingId: string;
  customerId?: string | null;
  customerLocationId?: string | null;
  driverId?: string | null;
  status: ShipmentStatus;
  origin: string | null;
  originWarehouseId?: string | null;
  originLat?: number | null;
  originLng?: number | null;
  destination: string;
  destinationLat?: number | null;
  destinationLng?: number | null;
  itemsCount: number;
  priority?: ShipmentPriority | null;
  type?: string | null;
  slaDeadline?: Date | null;
  weightKg?: number | null;
  volumeM3?: number | null;
  palletCount?: number | null;
  cargoType?: string | null;
  contactEmail?: string | null;
  billingAccount?: string | null;
  routeId?: string | null;
  trailerId?: string | null;
  companyId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ShipmentHistory {
  id: string;
  shipmentId: string;
  status: string;
  location?: string | null;
  description?: string | null;
  createdAt: Date;
  createdById?: string | null;
}

export interface Route {
  id: string;
  name?: string | null;
  status: RouteStatus;
  date: Date;
  startTime?: Date | null;
  endTime?: Date | null;
  distanceKm?: number | null;
  durationMin?: number | null;
  stops?: { address: string; lat?: number; lng?: number }[] | null;
  driverId?: string | null;
  vehicleId?: string | null;
  companyId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Inventory {
  id: string;
  warehouseId: string;
  sku: string;
  name: string;
  quantity: number;
  allocatedQuantity: number;
  minStock: number;
  imageUrl?: string | null;
  unitValue?: number | null;
  unit?: string;
  currency: string;
  weightKg?: number | null;
  volumeM3?: number | null;
  palletCount?: number | null;
  cargoType?: string | null;
  companyId?: string | null;
  updatedAt?: Date;
}

export interface Issue {
  id: string;
  title: string;
  description?: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  type: IssueType;
  vehicleId?: string | null;
  driverId?: string | null;
  shipmentId?: string | null;
  companyId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  date: Date;
  cost: number;
  currency: string;
  status: MaintenanceStatus;
  description?: string | null;
  documentUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  type: string;
  name: string;
  url: string;
  expiryDate?: Date | null;
  status: string;
  driverId?: string | null;
  vehicleId?: string | null;
  companyId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  avatarUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ShipmentItem {
  id: string;
  shipmentId: string;
  sku: string;
  name: string;
  quantity: number;
  unit: string;
  weightKg?: number | null;
  volumeM3?: number | null;
  palletCount?: number | null;
  cargoType?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  driverId: string;
  companyId: string;
  date: Date;
  volumeLiter: number;
  cost: number;
  odometerKm: number;
  location?: string | null;
  fuelType: string;
  currency: string;
  receiptUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

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

export const UserRole = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  DISPATCHER: "DISPATCHER",
  DRIVER: "DRIVER",
  WAREHOUSE: "WAREHOUSE",
  DEFAULT: "DEFAULT",
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

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

export const VehicleStatus = {
  AVAILABLE: "AVAILABLE",
  ON_TRIP: "ON_TRIP",
  MAINTENANCE: "MAINTENANCE",
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
  PLANNED: "PLANNED",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  DELAYED: "DELAYED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;
export type ShipmentStatus = typeof ShipmentStatus[keyof typeof ShipmentStatus];

export const ShipmentPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;
export type ShipmentPriority = typeof ShipmentPriority[keyof typeof ShipmentPriority];

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
  origin: string;
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
  createdBy?: string | null;
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
  startAddress?: string | null;
  startLat?: number | null;
  startLng?: number | null;
  endAddress?: string | null;
  endLat?: number | null;
  endLng?: number | null;
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
  minStock: number;
  imageUrl?: string | null;
  unitValue?: number | null;
  unit?: string;
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
  status: MaintenanceStatus;
  description?: string | null;
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

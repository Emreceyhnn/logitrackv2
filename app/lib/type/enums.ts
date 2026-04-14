export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  DISPATCHER = "DISPATCHER",
  DRIVER = "DRIVER",
  WAREHOUSE = "WAREHOUSE",
  DEFAULT = "DEFAULT",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum VehicleType {
  TRUCK = "TRUCK",
  VAN = "VAN",
}

export enum VehicleStatus {
  AVAILABLE = "AVAILABLE",
  ON_TRIP = "ON_TRIP",
  MAINTENANCE = "MAINTENANCE",
}

export enum DriverStatus {
  ON_JOB = "ON_JOB",
  OFF_DUTY = "OFF_DUTY",
  ON_LEAVE = "ON_LEAVE",
}

export enum WarehouseType {
  DISTRIBUTION_CENTER = "DISTRIBUTION_CENTER",
  CROSSDOCK = "CROSSDOCK",
  WAREHOUSE = "WAREHOUSE",
}

export enum RouteStatus {
  PLANNED = "PLANNED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export enum ShipmentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  ASSIGNED = "ASSIGNED",
  PLANNED = "PLANNED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  DELAYED = "DELAYED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum ShipmentPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum IssueStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum IssuePriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum IssueType {
  VEHICLE = "VEHICLE",
  DRIVER = "DRIVER",
  SHIPMENT = "SHIPMENT",
  OTHER = "OTHER",
}

export enum MaintenanceStatus {
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

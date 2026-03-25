import { Shipment, Driver, Route, Warehouse, Inventory, User, Customer, ShipmentHistory } from "@prisma/client";

export type ActivityEvent = {
  id: string;
  type: "shipment" | "driver" | "route" | "warehouse" | "inventory";
  action: string;
  user: string;
  timestamp: string;
  details?: string;
};

export interface DashboardStats {
  totalShipments: number;
  activeDrivers: number;
  pendingDeliveries: number;
  warehouseCapacity: number;
  revenue: number;
  growth: number;
}

export type ShipmentStatus = "PENDING" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED" | "DELAYED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface ShipmentWithRelations extends Shipment {
  customer?: Customer;
  driver?: Driver & { user: User };
  route?: Route;
  history?: ShipmentHistory[];
}

export interface DriverWithRelations extends Driver {
  user: User;
  shipments: Shipment[];
}

export interface RouteWithRelations extends Route {
  shipments: Shipment[];
  driver: Driver & { user: User };
}

export interface WarehouseWithRelations extends Warehouse {
  inventory: Inventory[];
}

export interface SLAStats {
  onTime: number;
  delayed: number;
  avgDeliveryTime: string;
  reliability: number;
}

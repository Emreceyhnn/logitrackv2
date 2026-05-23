
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

export type ShipmentStatus =
  | "PENDING"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED"
  | "DELAYED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";



export interface SLAStats {
  onTime: number;
  delayed: number;
  avgDeliveryTime: string;
  reliability: number;
}

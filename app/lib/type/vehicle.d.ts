import {
  Issue,
  VehicleStatus,
  Document,
  MaintenanceRecord,
  Route,
  User,
  Driver,
} from "@prisma/client";

export interface VehicleDashboardProps {
  id: string;
  plate: string;
  status: VehicleStatus;
  maxLoadKg: number;
  documents: {
    type: string;
    expiryDate: Date | null;
  }[];
  issues: {
    id: string;
  }[];
}

export interface VehicleDashboardResponseType {
  vehiclesKpis: {
    totalVehicles: number;
    available: number;
    inService: number;
    onTrip: number;
    openIssues: number;
    docsDueSoon: number;
  };
  vehiclesCapacity: {
    id: string;
    plate: string;
    maxLoadKg: number;
  }[];
  expiringDocs: {
    id: string;
    plate: string;
    documentType: string;
    expiryDate: Date | null;
  }[];
}

export interface DriverWithUser extends Driver {
  user: User;
}

export interface VehicleWithRelations {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  nextServiceKm: number | null;
  avgFuelConsumption: number | null;
  status: VehicleStatus;
  odometerKm: number | null;
  fuelLevel: number | null;
  driver: DriverWithUser | null;
  issues: Issue[];
  documents: Document[];
  maintenanceRecords: MaintenanceRecord[];
  routes: Route[];
  createdAt: Date;
  updatedAt: Date;
}

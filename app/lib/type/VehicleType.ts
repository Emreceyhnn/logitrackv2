export type VehicleStatus =
    string;

export type FuelType = string;

export type IssueType =
    string;

export type IssueSeverity = string;

export type DocumentType =
    string

export type DocumentStatus = string;

export interface VehicleFuel {
    type: FuelType;
    levelPct: number;
    consumptionLPer100Km: number;
}

export interface VehicleCapacity {
    maxWeightKg: number;
    maxVolumeM3: number;
    pallets: number;
}

export interface VehicleLocation {
    lat: number;
    lng: number;
}

export interface VehicleTelemetry {
    lastPingAt: string; // ISO string
    location: VehicleLocation;
    speedKph: number;
    ignitionOn: boolean;
}

export interface MaintenanceIssue {
    id: string;
    type: IssueType;
    severity: IssueSeverity;
    createdAt: string; // ISO string
}

export interface VehicleMaintenance {
    nextServiceKm: number;
    nextServiceDate: string; // ISO date
    openIssues: MaintenanceIssue[];
}

export interface VehicleDocument {
    type: DocumentType;
    expiresOn: string; // ISO date
    status: DocumentStatus;
}

export interface VehicleAssignment {
    driverId: string | null;
    routeId: string | null;
    shipmentIds: string[];
}

export interface Vehicle {
    id: string;
    fleetNo: string;
    plate: string;
    type: string;
    brand: string;
    model: string;
    year: number;
    vin: string;
    status: string;
    odometerKm: number;
    fuel: VehicleFuel;
    capacity: VehicleCapacity;
    telemetry: VehicleTelemetry;
    maintenance: VehicleMaintenance;
    documents: VehicleDocument[];
    assigned: VehicleAssignment;
}

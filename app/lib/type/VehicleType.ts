export type VehicleStatus = string;
export type FuelType = string;

export interface VehicleSpecs {
    maxLoadKg: number;
    heightM: number;
    fuelType: FuelType;
    mpg?: number;
    rangeKm?: number;
}

export interface VehicleLocation {
    lat: number;
    lng: number;
    address?: string;
}

export interface VehicleCurrentStatus {
    location: VehicleLocation;
    speedKph: number;
    fuelLevelPct: number;
    odometerKm: number;
    engineStatus: string;
    lastPing: string;
}

export interface VehicleDocument {
    type: string;
    status: string;
    expiresOn: string;
}

export interface MaintenanceIssue {
    id: string;
    type: string;
    severity: string;
    createdAt: string;
    description: string;
}

export interface MaintenanceRecord {
    id: string;
    date: string;
    serviceType: string;
    technician: string;
    cost: number;
    currency: string;
    status: string;
}

export interface MaintenanceStatus {
    nextServiceKm: number;
    nextServiceDate: string;
    status: string;
    currentTicketId?: string;
    openIssues?: MaintenanceIssue[];
    history?: MaintenanceRecord[];
}

export interface VehicleAssignment {
    driverId?: string;
    routeId?: string;
}

export interface Vehicle {
    id: string;
    fleetNo: string;
    plate: string;
    type: string;
    brand: string;
    model: string;
    year: number;
    status: VehicleStatus;
    specs: VehicleSpecs;
    currentStatus: VehicleCurrentStatus;
    maintenance: MaintenanceStatus;
    assignedTo: VehicleAssignment | null;
    documents?: VehicleDocument[];
}

export type DriverStatus = string;

export type LicenseType = string;

export interface DriverLicense {
    type: LicenseType;
    expiresOn: string; // YYYY-MM-DD
}

export interface WorkingHours {
    todayMinutes: number;
    weekMinutes: number;
}

export interface RestRequirement {
    minRestMinutes: number;
    met: boolean;
}

export interface DriverCompliance {
    lastMedicalCheck: string; // YYYY-MM-DD
    workingHours: WorkingHours;
    restRequirement: RestRequirement;
}

export interface DriverRating {
    avg: number;
    count: number;
}

export interface DriverAssignment {
    vehicleId: string | null;
    routeId: string | null;
    activeShipmentIds: string[];
}

export interface Driver {
    id: string;
    code: string;
    fullName: string;
    phone: string;
    email: string;

    status: DriverStatus;
    homeBaseWarehouseId: string;

    licenses: DriverLicense[];
    compliance: DriverCompliance;

    rating: DriverRating;
    assigned: DriverAssignment;
}

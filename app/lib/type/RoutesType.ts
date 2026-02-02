export type RouteStatus = string;

export type StopType = string;

export interface TimeWindow {
    from: string; // ISO datetime
    to: string;   // ISO datetime
}

export interface StopRef {
    warehouseId?: string;
    customerId?: string;
    siteId?: string;
}

export interface RouteStop {
    seq: number;
    type: StopType;
    ref: StopRef;
    eta: string; // ISO datetime
    window: TimeWindow;
}

export interface Route {
    id: string;
    code: string;
    name: string;
    status: RouteStatus;

    plannedStartAt: string; // ISO datetime
    plannedEndAt: string;   // ISO datetime
    actualStartAt: string | null;

    vehicleId: string;
    driverId: string | null;

    distanceKm: number;

    stops: RouteStop[];

    completedDate: string; // empty string allowed per data
    shipmentIds: string[];
}

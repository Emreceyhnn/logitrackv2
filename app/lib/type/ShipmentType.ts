export interface ShipmentOrigin {
    warehouseId?: string;
    customerId?: string; 
    type: string;
}

export interface ShipmentDestination {
    siteId?: string;
    warehouseId?: string; 
    type: string;
    address: string;
}

export interface ShipmentDates {
    created: string;
    requestedDelivery: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
}

export interface Shipment {
    id: string;
    orderNumber: string;
    code?: string;
    status: string;
    priority: string;
    customerId: string;
    origin: ShipmentOrigin;
    destination: ShipmentDestination;
    dates: ShipmentDates;
    items: { skuId: string; name: string; qty: number; price: number }[];
    cargoDetails: {
        totalWeightKg: number;
        totalVolumeM3: number;
        packageCount: number;
    };
    assignedTo: { routeId: string; loadSequence: number } | null;
    tracking: {
        currentStage: string;
        milestones: { status: string; timestamp: string | null; completed: boolean }[];
    };
    driverId?: string; 
    routeId?: string;
}

export interface Shipment {
    id: string;
    code: string;
    status: string;
    priority: string;
    customerId: string;
    pickup: {
        warehouseId?: string;
        plannedAt: string;
    };
    dropoff: {
        customerSiteId: string;
        plannedAt: string;
    };
    routeId: string;
    vehicleId: string;
    driverId: string;
    cargo: {
        totalWeightKg: number;
        totalVolumeM3: number;
        pallets: number;
        items: Array<{
            skuId: string;
            name: string;
            qty: number;
            uom: string;
        }>;
    };
    sla: {
        onTimeTargetPct: number;
        maxDelayMin: number;
    };
    tracking: {
        lastUpdateAt: string;
        milestones: Array<{
            type: string;
            at: string;
        }>;
    };
}

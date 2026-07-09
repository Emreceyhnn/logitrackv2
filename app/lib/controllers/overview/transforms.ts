// Pure data-transformation helpers for the overview dashboard. Kept in a plain
// (non-"use server") module so getOverviewDashboardData stays focused on
// orchestration while the row → view-model mapping lives here.

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { Document, FuelLog, Issue } from "@prisma/client";
import { IssueType } from "@prisma/client";
import type {
  ActionRequiredItems,
  FuelStat,
  WarehouseCapacityStat,
  ShipmentDayStat,
  MapData,
} from "../../type/overview";

dayjs.extend(utc);
dayjs.extend(timezone);

type AlertIssue = Pick<
  Issue,
  "type" | "title" | "priority" | "status" | "vehicleId" | "driverId" | "shipmentId"
>;
type AlertDocument = Pick<Document, "name" | "expiryDate" | "driverId" | "vehicleId">;

export function buildAlerts(
  openIssues: AlertIssue[],
  expiringDocs: AlertDocument[]
): ActionRequiredItems[] {
  const issueAlerts: ActionRequiredItems[] = openIssues.map((issue) => ({
    type: (issue.type === IssueType.VEHICLE
      ? "vehicle"
      : issue.type === IssueType.DRIVER
      ? "driver"
      : issue.type === IssueType.SHIPMENT
      ? "SHIPMENT_DELAY"
      : "vehicle") as ActionRequiredItems["type"],
    title: issue.title,
    messageKey: "ISSUE_ALERT",
    messageParams: { priority: issue.priority, status: issue.status },
    link: issue.type === IssueType.VEHICLE && issue.vehicleId
      ? `/vehicle?id=${issue.vehicleId}&tab=2`
      : issue.type === IssueType.DRIVER && issue.driverId
      ? `/drivers?id=${issue.driverId}`
      : issue.type === IssueType.SHIPMENT && issue.shipmentId
      ? `/shipments?id=${issue.shipmentId}`
      : undefined,
  }));

  const docAlerts: ActionRequiredItems[] = expiringDocs.map((doc) => ({
    type: "DOCUMENT_DUE" as const,
    title: doc.name,
    messageKey: doc.expiryDate ? "DOC_EXPIRES" : "DOC_EXPIRY_APPROACHING",
    messageParams: doc.expiryDate ? { date: doc.expiryDate.toISOString() } : undefined,
    link: doc.driverId
      ? `/drivers?id=${doc.driverId}`
      : doc.vehicleId
      ? `/vehicle?id=${doc.vehicleId}&tab=1`
      : undefined,
  }));

  return [...issueAlerts, ...docAlerts];
}

export function buildFuelStats(
  fuelLogsRaw: FuelLog[],
  vehicleMap: Map<string, string>,
  rates: Record<string, number>
): FuelStat[] {
  const fuelStatsMap = new Map<string, { volume: number; costUsd: number }>();

  fuelLogsRaw.forEach((log) => {
    const current = fuelStatsMap.get(log.vehicleId) || { volume: 0, costUsd: 0 };
    const rate = rates[log.currency || "USD"] || 1;
    const costUsd = Number(log.cost) / rate;

    fuelStatsMap.set(log.vehicleId, {
      volume: current.volume + log.volumeLiter,
      costUsd: current.costUsd + costUsd,
    });
  });

  return Array.from(fuelStatsMap.entries())
    .sort((a, b) => b[1].volume - a[1].volume)
    .slice(0, 8)
    .map(([id, data]) => ({
      id,
      plate: vehicleMap.get(id) ?? id,
      value: Math.round(data.volume * 10) / 10,
      totalCost: Math.round(data.costUsd),
    }));
}

interface WarehouseCapacityInput {
  id: string;
  name: string;
  capacityPallets: number | null;
  capacityVolumeM3: number | null;
}

interface PalletSumRow {
  warehouseId: string;
  _sum: { palletCount: number | null; volumeM3: number | null };
}

export function buildWarehouseCapacity(
  warehousesRaw: WarehouseCapacityInput[],
  palletSumsRaw: PalletSumRow[]
): WarehouseCapacityStat[] {
  const palletMap = new Map(
    palletSumsRaw.map((p) => [
      p.warehouseId,
      { pallets: p._sum.palletCount ?? 0, volume: p._sum.volumeM3 ?? 0 },
    ])
  );

  return warehousesRaw.map((w) => {
    const used = palletMap.get(w.id) ?? { pallets: 0, volume: 0 };
    const palletCapacity = w.capacityPallets || 5000;
    const volumeCapacity = w.capacityVolumeM3 || 100000;
    const palletUsed = Math.round(used.pallets);
    const volumeUsed = Math.round(used.volume);
    return {
      warehouseName: w.name,
      warehouseId: w.id,
      capacity: Math.min(Math.round((palletUsed / palletCapacity) * 100), 100),
      volume: Math.min(Math.round((volumeUsed / volumeCapacity) * 100), 100),
      palletUsed,
      palletCapacity,
      volumeUsed,
      volumeCapacity,
    };
  });
}

export function buildShipmentVolume(
  shipmentVolumeRaw: { createdAt: Date }[],
  tz: string
): ShipmentDayStat[] {
  // O(n) single pass instead of O(n×180): build a "YYYY-MM-DD" → count map first.
  const shipmentCountByDay = new Map<string, number>();
  for (const s of shipmentVolumeRaw) {
    const d = new Date(s.createdAt);
    const localDate = dayjs.utc(d).tz(tz).format("YYYY-MM-DD");
    shipmentCountByDay.set(localDate, (shipmentCountByDay.get(localDate) ?? 0) + 1);
  }

  const shipmentVolume: ShipmentDayStat[] = [];
  for (let i = 179; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const dayjsDate = dayjs.utc(d).tz(tz);
    const label = dayjsDate.format("MMM DD");
    const key = dayjsDate.format("YYYY-MM-DD");
    shipmentVolume.push({ date: label, count: shipmentCountByDay.get(key) ?? 0 });
  }
  return shipmentVolume;
}

interface MapWarehouse { id: string; name: string; lat: number | null; lng: number | null }
interface MapVehicle { id: string; plate: string; currentLat: number | null; currentLng: number | null }
interface MapCustomer {
  id: string;
  name: string;
  locations: { lat: number | null; lng: number | null; isDefault: boolean }[];
}

export function buildMapData(
  mapDataRaw: [MapWarehouse[], MapVehicle[], MapCustomer[]]
): MapData[] {
  const [mapWarehouses, mapVehicles, mapCustomers] = mapDataRaw;
  return [
    ...mapWarehouses.map((w) => ({
      position: { lat: w.lat || 40.7128, lng: w.lng || -74.006 },
      name: w.name,
      id: w.id,
      type: "W" as const,
    })),
    ...mapVehicles.map((v) => ({
      position: { lat: v.currentLat || 40.7128, lng: v.currentLng || -74.006 },
      name: v.plate,
      id: v.id,
      type: "V" as const,
    })),
    ...mapCustomers.map((c) => {
      const defaultLoc = c.locations.find((l) => l.isDefault) || c.locations[0];
      return {
        position: {
          lat: defaultLoc?.lat ?? 40.7128,
          lng: defaultLoc?.lng ?? -74.006,
        },
        name: c.name,
        id: c.id,
        type: "C" as const,
      };
    }),
  ];
}

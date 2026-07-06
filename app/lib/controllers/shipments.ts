// Barrel re-exporting the shipments controller, split across submodules under
// ./shipments/ to keep each file focused and under ~400 lines.
export type { CustomerWithLocations, ShipmentStopInput } from "./shipments/types";
export { invalidateShipmentCache } from "./shipments/cache";
export { createShipment } from "./shipments/create";
export {
  assignDriverToShipment,
  assignRouteToShipment,
  updateShipmentStatus,
} from "./shipments/assign";
export { updateShipment, deleteShipment } from "./shipments/update";
export {
  getShipments,
  getShipmentById,
  getShipmentByTrackingId,
} from "./shipments/queries";
export {
  getShipmentStats,
  getShipmentVolumeHistory,
  getShipmentStatusDistribution,
  getShipmentsWithDashboardData,
} from "./shipments/stats";

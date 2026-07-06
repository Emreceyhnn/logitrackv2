// Barrel re-exporting the warehouse controller, split across submodules under
// ./warehouse/ to keep each file focused and under ~400 lines.
export { invalidateWarehouseCache } from "./warehouse/cache";
export {
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
  assignManagerToWarehouse,
} from "./warehouse/crud";
export {
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
} from "./warehouse/inventory";
export {
  getWarehouseStats,
  getRecentStockMovements,
  getWarehousesWithDashboardData,
} from "./warehouse/stats";

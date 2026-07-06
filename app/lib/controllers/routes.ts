// Barrel re-exporting the routes controller, split across submodules under
// ./routes/ to keep each file focused and under ~400 lines.
export type { RouteUpdateData } from "./routes/types";
export { invalidateRouteCache } from "./routes/cache";
export { createRoute, updateRoute, deleteRoute } from "./routes/mutations";
export {
  assignDriverToRoute,
  assignVehicleToRoute,
  unassignDriverFromRoute,
  unassignVehicleFromRoute,
  updateRouteStatus,
} from "./routes/assignments";
export {
  getRoutes,
  getRouteById,
  getDriverRoutes,
  getVehicleRoutes,
  getCompanyRoutes,
} from "./routes/queries";
export {
  getRouteStats,
  getRouteEfficiencyStats,
  getActiveRoutesLocations,
  getRoutesWithDashboardData,
} from "./routes/stats";

import type { TourStep } from "@/app/lib/context/GuidedTourContext";

/**
 * Dictionary-backed tour step definitions for each page.
 *
 * Each function receives the page-specific `dict` (already resolved by language)
 * and returns the tour steps for that page.
 *
 * Target selectors use `[data-tour="..."]` attributes that must be placed on the
 * corresponding DOM elements.
 */

type Dict = Record<string, unknown>;

function d(obj: unknown, path: string): string {
  return (
    path.split(".").reduce<unknown>((o, k) => {
      if (o && typeof o === "object" && k in (o as Record<string, unknown>)) {
        return (o as Record<string, unknown>)[k];
      }
      return undefined;
    }, obj) as string
  ) || path;
}

/* -------------------------------------------------------------------------- */
/*                               OVERVIEW                                     */
/* -------------------------------------------------------------------------- */
export function getOverviewTourSteps(dict: Dict): TourStep[] {
  return [
    {
      targetSelector: '[data-tour="overview-title"]',
      title: d(dict, "guidedTour.overview.titleStep.title"),
      description: d(dict, "guidedTour.overview.titleStep.description"),
      placement: "bottom",
    },
    {
      targetSelector: '[data-tour="kpi-cards"]',
      title: d(dict, "guidedTour.overview.kpiStep.title"),
      description: d(dict, "guidedTour.overview.kpiStep.description"),
      placement: "bottom",
    },
    {
      targetSelector: '[data-tour="daily-operations"]',
      title: d(dict, "guidedTour.overview.dailyOpsStep.title"),
      description: d(dict, "guidedTour.overview.dailyOpsStep.description"),
      placement: "right",
    },
    {
      targetSelector: '[data-tour="action-required"]',
      title: d(dict, "guidedTour.overview.actionRequiredStep.title"),
      description: d(dict, "guidedTour.overview.actionRequiredStep.description"),
      placement: "left",
    },
    {
      targetSelector: '[data-tour="overview-map"]',
      title: d(dict, "guidedTour.overview.mapStep.title"),
      description: d(dict, "guidedTour.overview.mapStep.description"),
      placement: "top",
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*                               VEHICLES                                     */
/* -------------------------------------------------------------------------- */
export function getVehicleTourSteps(dict: Dict): TourStep[] {
  return [
    {
      targetSelector: '[data-tour="vehicle-table"]',
      title: d(dict, "guidedTour.vehicles.tableStep.title"),
      description: d(dict, "guidedTour.vehicles.tableStep.description"),
      placement: "center",
    },
    {
      targetSelector: '[data-tour="vehicle-add"]',
      title: d(dict, "guidedTour.vehicles.addStep.title"),
      description: d(dict, "guidedTour.vehicles.addStep.description"),
      placement: "bottom",
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*                               SHIPMENTS                                    */
/* -------------------------------------------------------------------------- */
export function getShipmentTourSteps(dict: Dict): TourStep[] {
  return [
    {
      targetSelector: '[data-tour="shipment-table"]',
      title: d(dict, "guidedTour.shipments.tableStep.title"),
      description: d(dict, "guidedTour.shipments.tableStep.description"),
      placement: "center",
    },
    {
      targetSelector: '[data-tour="shipment-add"]',
      title: d(dict, "guidedTour.shipments.addStep.title"),
      description: d(dict, "guidedTour.shipments.addStep.description"),
      placement: "bottom",
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*                               ANALYTICS                                    */
/* -------------------------------------------------------------------------- */
export function getAnalyticsTourSteps(dict: Dict): TourStep[] {
  return [
    {
      targetSelector: '[data-tour="analytics-header"]',
      title: d(dict, "guidedTour.analytics.headerStep.title"),
      description: d(dict, "guidedTour.analytics.headerStep.description"),
      placement: "bottom",
    },
    {
      targetSelector: '[data-tour="performance-gauges"]',
      title: d(dict, "guidedTour.analytics.gaugesStep.title"),
      description: d(dict, "guidedTour.analytics.gaugesStep.description"),
      placement: "bottom",
    },
    {
      targetSelector: '[data-tour="forecasting-widget"]',
      title: d(dict, "guidedTour.analytics.forecastStep.title"),
      description: d(dict, "guidedTour.analytics.forecastStep.description"),
      placement: "top",
    },
    {
      targetSelector: '[data-tour="cost-analysis"]',
      title: d(dict, "guidedTour.analytics.costStep.title"),
      description: d(dict, "guidedTour.analytics.costStep.description"),
      placement: "top",
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*                               WAREHOUSES                                   */
/* -------------------------------------------------------------------------- */
export function getWarehouseTourSteps(dict: Dict): TourStep[] {
  return [
    {
      targetSelector: '[data-tour="warehouse-table"]',
      title: d(dict, "guidedTour.warehouses.tableStep.title"),
      description: d(dict, "guidedTour.warehouses.tableStep.description"),
      placement: "center",
    },
    {
      targetSelector: '[data-tour="warehouse-add"]',
      title: d(dict, "guidedTour.warehouses.addStep.title"),
      description: d(dict, "guidedTour.warehouses.addStep.description"),
      placement: "bottom",
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*                               DRIVERS                                      */
/* -------------------------------------------------------------------------- */
export function getDriverTourSteps(dict: Dict): TourStep[] {
  return [
    {
      targetSelector: '[data-tour="driver-table"]',
      title: d(dict, "guidedTour.drivers.tableStep.title"),
      description: d(dict, "guidedTour.drivers.tableStep.description"),
      placement: "center",
    },
    {
      targetSelector: '[data-tour="driver-add"]',
      title: d(dict, "guidedTour.drivers.addStep.title"),
      description: d(dict, "guidedTour.drivers.addStep.description"),
      placement: "bottom",
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*                               ROUTES                                       */
/* -------------------------------------------------------------------------- */
export function getRouteTourSteps(dict: Dict): TourStep[] {
  return [
    {
      targetSelector: '[data-tour="route-table"]',
      title: d(dict, "guidedTour.routes.tableStep.title"),
      description: d(dict, "guidedTour.routes.tableStep.description"),
      placement: "center",
    },
    {
      targetSelector: '[data-tour="route-add"]',
      title: d(dict, "guidedTour.routes.addStep.title"),
      description: d(dict, "guidedTour.routes.addStep.description"),
      placement: "bottom",
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*                               INVENTORY                                    */
/* -------------------------------------------------------------------------- */
export function getInventoryTourSteps(dict: Dict): TourStep[] {
  return [
    {
      targetSelector: '[data-tour="inventory-table"]',
      title: d(dict, "guidedTour.inventory.tableStep.title"),
      description: d(dict, "guidedTour.inventory.tableStep.description"),
      placement: "center",
    },
    {
      targetSelector: '[data-tour="inventory-add"]',
      title: d(dict, "guidedTour.inventory.addStep.title"),
      description: d(dict, "guidedTour.inventory.addStep.description"),
      placement: "bottom",
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*                               CUSTOMERS                                    */
/* -------------------------------------------------------------------------- */
export function getCustomerTourSteps(dict: Dict): TourStep[] {
  return [
    {
      targetSelector: '[data-tour="customer-table"]',
      title: d(dict, "guidedTour.customers.tableStep.title"),
      description: d(dict, "guidedTour.customers.tableStep.description"),
      placement: "center",
    },
    {
      targetSelector: '[data-tour="customer-add"]',
      title: d(dict, "guidedTour.customers.addStep.title"),
      description: d(dict, "guidedTour.customers.addStep.description"),
      placement: "bottom",
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*                               REPORTS                                      */
/* -------------------------------------------------------------------------- */
export function getReportTourSteps(dict: Dict): TourStep[] {
  return [
    {
      targetSelector: '[data-tour="report-content"]',
      title: d(dict, "guidedTour.reports.contentStep.title"),
      description: d(dict, "guidedTour.reports.contentStep.description"),
      placement: "center",
    },
  ];
}

/**
 * Master resolver — returns the tour steps for a given route segment.
 */
export function getTourStepsForPage(
  pageSegment: string,
  dict: Dict
): TourStep[] {
  switch (pageSegment) {
    case "overview":
      return getOverviewTourSteps(dict);
    case "vehicle":
      return getVehicleTourSteps(dict);
    case "shipments":
      return getShipmentTourSteps(dict);
    case "analytics":
      return getAnalyticsTourSteps(dict);
    case "warehouses":
      return getWarehouseTourSteps(dict);
    case "drivers":
      return getDriverTourSteps(dict);
    case "routes":
      return getRouteTourSteps(dict);
    case "inventory":
      return getInventoryTourSteps(dict);
    case "customers":
      return getCustomerTourSteps(dict);
    case "reports":
      return getReportTourSteps(dict);
    default:
      return [];
  }
}

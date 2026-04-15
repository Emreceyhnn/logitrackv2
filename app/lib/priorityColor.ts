import { ChipProps } from "@mui/material";

export const getPriorityColor = (priority: string): ChipProps["color"] => {
  const normalizedPriority = priority?.toUpperCase();

  switch (normalizedPriority) {
    case "CRITICAL":
      return "error";
    case "HIGH":
      return "warning";
    case "MEDIUM":
      return "info";
    case "LOW":
      return "success";
    default:
      return "default";
  }
};

import { Dictionary } from "./language/language";

export const getStatusMeta = (status?: string, dict?: Dictionary) => {
  const s = status?.toUpperCase() || "";

  // Helpers to get data from dict
  const getDictColor = (paletteKey: string, fallback: string) => {
    return (dict as unknown as Record<string, Record<string, string>>)?.primaryColors?.[paletteKey] || fallback;
  };

  const getDictLabel = (key: string) => {
    // Special mapping for driver statuses
    if (key === "ON_JOB") return dict?.drivers?.onDuty;
    if (key === "OFF_DUTY") return dict?.drivers?.offDuty;
    if (key === "ON_LEAVE") return dict?.drivers?.onLeave;

    return (
      (dict?.vehicles?.statuses as unknown as Record<string, string>)?.[key] ||
      (dict?.routes?.statuses as unknown as Record<string, string>)?.[key] ||
      (dict?.vehicles?.priorities as unknown as Record<string, string>)?.[
        key
      ] ||
      (dict?.common as unknown as Record<string, string>)?.[key] ||
      key
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase())
    );
  };

  const label = getDictLabel(s);

  switch (s) {
    case "AVAILABLE":
    case "COMPLETED":
    case "VALID":
    case "ON_DUTY":
    case "ON_JOB":
    case "DELIVERED":
    case "SUCCESS":
    case "ON_TRIP":
      return {
        color: getDictColor("success", "#48BB78"),
        paletteKey: "success",
        label,
      };
    case "IN_PROGRESS":
    case "IN_TRANSIT":
    case "PICKED_UP":
    case "IN_SERVICE":
    case "IDLE":
    case "PROCESSING":
      return {
        color: getDictColor("info", "#4299E1"),
        paletteKey: "info",
        label,
      };
    case "MAINTENANCE":
    case "SCHEDULED":
    case "PENDING":
    case "DUE_SOON":
    case "WARNING":
    case "PLANNED":
    case "ASSIGNED":
    case "OFF_DUTY":
    case "ON_LEAVE":
    case "LOW":
    case "MEDIUM":
    case "OPEN":
      return {
        color: getDictColor("warning", "#F6AD55"),
        paletteKey: "warning",
        label,
      };
    case "ERROR":
    case "EXPIRED":
    case "HIGH":
    case "FAILED":
    case "CRITICAL":
    case "DELAYED":
    case "CANCELLED":
    case "CLOSED":
    case "RESOLVED":
      return {
        color: getDictColor("error", "#F56565"),
        paletteKey: "error",
        label,
      };
    default:
      return {
        color: getDictColor("secondary", "#718096"),
        paletteKey: "secondary",
        label: label || "-",
      };
  }
};

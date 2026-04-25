import { ChipProps, Theme, useTheme } from "@mui/material";

export const getPriorityColor = (priority: string): ChipProps["color"] => {
  const normalizedPriority = priority?.toUpperCase();

  switch (normalizedPriority) {
    case "CRITICAL":
    case "HIGH":
      return "error";
    case "MEDIUM":
      return "warning";
    case "LOW":
      return "info";
    default:
      return "default";
  }
};

import { Dictionary } from "./language/language";
import { NotificationType } from "./notifications";

export const getStatusMeta = (status?: string, dict?: Dictionary) => {
  const s = status?.toUpperCase() || "";

  const getDictColor = (paletteKey: string, fallback: string) => {
    return (
      (dict as unknown as Record<string, Record<string, string>>)
        ?.primaryColors?.[paletteKey] || fallback
    );
  };

  const getDictLabel = (key: string) => {
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
    case "LOW":
    case "IN_PROGRESS":
    case "IN_TRANSIT":
    case "PICKED_UP":
    case "IN_SERVICE":
    case "IDLE":
    case "PROCESSING":
    case "ON_TRIP":
      return {
        color: getDictColor("info", "#4299E1"),
        paletteKey: "info",
        label,
      };
    case "MEDIUM":
    case "MAINTENANCE":
    case "SCHEDULED":
    case "PENDING":
    case "DUE_SOON":
    case "WARNING":
    case "PLANNED":
    case "ASSIGNED":
    case "OPEN":
      return {
        color: getDictColor("warning", "#F6AD55"),
        paletteKey: "warning",
        label,
      };
    case "HIGH":
    case "CRITICAL":
    case "ERROR":
    case "EXPIRED":
    case "FAILED":
    case "DELAYED":
    case "CANCELLED":
      return {
        color: getDictColor("error", "#F56565"),
        paletteKey: "error",
        label,
      };
    case "RESOLVED":
    case "CLOSED":
    case "SUCCESS":
    case "COMPLETED":
    case "VALID":
    case "AVAILABLE":
    case "DELIVERED":
    case "ON_DUTY":
    case "ON_JOB":
      return {
        color: getDictColor("success", "#48BB78"),
        paletteKey: "success",
        label,
      };
    case "OFF_DUTY":
    case "ON_LEAVE":
    default:
      return {
        color: getDictColor("secondary", "#718096"),
        paletteKey: "secondary",
        label: label || "-",
      };
  }
};

export const getStatusColor = (t: NotificationType) => {
  switch (t) {
    case "SUCCESS":
      return "theme.palette.success.main";
    case "WARNING":
      return "theme.palette.warning.main";
    case "ERROR":
      return "theme.palette.error.main";
    default:
      return "theme.palette.info.main";
  }
};

export const resolveStatusAlpha = (t: NotificationType) => {
  switch (t) {
    case "SUCCESS":
      return "theme.palette.success._alpha";
    case "WARNING":
      return "theme.palette.warning._alpha";
    case "ERROR":
      return "theme.palette.error._alpha";
    default:
      return "theme.palette.info._alpha";
  }
};

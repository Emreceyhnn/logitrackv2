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
  
  // Helpers to get text from dict
  const getDictLabel = (key: string) => {
    return (
      (dict?.vehicles?.statuses as unknown as Record<string, string>)?.[key] || 
      (dict?.vehicles?.priorities as unknown as Record<string, string>)?.[key] || 
      (dict?.common as unknown as Record<string, string>)?.[key] || 
      key.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
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
      return { color: "#48BB78", label }; // Success Green
    case "IN_PROGRESS":
    case "IN_TRANSIT":
    case "PICKED_UP":
    case "IN_SERVICE":
    case "IDLE":
    case "PROCESSING":
      return { color: "#4299E1", label }; // Primary Blue
    case "MAINTENANCE":
    case "SCHEDULED":
    case "PENDING":
    case "DUE_SOON":
    case "WARNING":
    case "PLANNED":
    case "ASSIGNED":
    case "OFF_DUTY":
    case "LOW":
    case "MEDIUM":
    case "OPEN":
      return { color: "#F6AD55", label }; // Warning Orange/Amber
    case "ERROR":
    case "EXPIRED":
    case "HIGH":
    case "FAILED":
    case "CRITICAL":
    case "DELAYED":
    case "CANCELLED":
    case "CLOSED":
    case "RESOLVED":
      return { color: "#F56565", label }; // Error Red
    default:
      return { color: "#718096", label: label || "-" }; // Neutral Grey
  }
};

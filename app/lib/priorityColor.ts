export const getPriorityColor = (priority: string) => {
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

export const getStatusMeta = (status?: string) => {
  switch (status) {
    case "ON_TRIP":
    case "OFF_DUTY":
      return {
        color: "info.main",
        text: status === "ON_TRIP" ? "On Trip" : "Off Duty",
      };
    case "AVAILABLE":
    case "ON_JOB":
      return {
        color: "success.main",
        text: status === "AVAILABLE" ? "Available" : "On Job",
      };
    case "IN_SERVICE":
    case "ON_LEAVE":
      return {
        color: "warning.main",
        text: status === "IN_SERVICE" ? "In Service" : "On Leave",
      };
    default:
      return { color: "text.primary", text: status ?? "-" };
  }
};

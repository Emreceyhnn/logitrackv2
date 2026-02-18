import { useTheme } from "@mui/material";

export const getPriorityColor = (priority: string) => {
  const theme = useTheme();

  switch (priority) {
    case "CRITICAL":
      return theme.palette.error.main;
    case "HIGH":
      return theme.palette.warning.main;
    case "MEDIUM":
      return theme.palette.info.main;
    case "LOW":
      return theme.palette.success.main;
    default:
      return theme.palette.text.primary;
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

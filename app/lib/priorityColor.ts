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
      return { color: "info.main", text: "On Trip" };
    case "AVAILABLE":
      return { color: "success.main", text: "Available" };
    case "IN_SERVICE":
      return { color: "warning.main", text: "In Service" };
    default:
      return { color: "text.primary", text: status ?? "-" };
  }
};

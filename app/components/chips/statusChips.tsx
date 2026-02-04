import { Chip } from "@mui/material";

export const StatusChip = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toUpperCase();

    // Success - Green
    if (
      [
        "AVAILABLE",
        "COMPLETED",
        "VALID",
        "ON_DUTY",
        "ON_JOB",
        "DELIVERED",
        "SUCCESS","ON_TRIP",
      ].includes(normalizedStatus)
    ) {
      return { bgColor: "#d3f9e3", color: "#009966" };
    }

    // Info - Blue
    if (
      [
        
        "IN_PROGRESS",
        "IN_TRANSIT",
        "PICKED_UP",
        "IN_SERVICE",
        "IDLE"
      ].includes(normalizedStatus)
    ) {
      return { bgColor: "#e3f2fd", color: "#0288d1" };
    }

    // Warning - Yellow/Orange
    if (
      ["DUE_SOON", "WARNING", "LOW", "MEDIUM", "PLANNED", "OFF_DUTY","MAINTENANCE"].includes(
        normalizedStatus,
      )
    ) {
      return { bgColor: "#fff3cd", color: "#f57c00" };
    }

    // Error - Red
    if (
      ["ERROR", "EXPIRED", "HIGH", "FAILED", "CRITITCAL"].includes(
        normalizedStatus,
      )
    ) {
      return { bgColor: "#ffebee", color: "#d32f2f" };
    }

    // Neutral - Grey (Default)
    return { bgColor: "#f5f5f5", color: "#616161" };
  };

  const formatStatusText = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <Chip
      variant="filled"
      size="small"
      label={formatStatusText(status)}
      sx={{
        borderRadius: "4px",
        p: "2px 4px",
        fontSize: "0.75rem",
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: "0.02857em",
        textTransform: "none", // Changed from uppercase to allow our formatting
        backgroundColor: getStatusColor(status).bgColor,
        color: getStatusColor(status).color,
        border: "1px solid transparent", // Cleaner look usually, or match bg
        borderColor: getStatusColor(status).bgColor,
      }}
    />
  );
};

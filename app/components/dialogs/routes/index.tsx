"use client";

import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { Route } from "@/app/lib/type/RoutesType";
import DriverCard from "../../cards/driverCard";
import mockData from "@/app/lib/mockData.json";
import MapRoutesDialogCard from "./map";
import RouteProgress from "./progress";
import RoutesTelemetryCards from "./telemetry";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import PlaceIcon from "@mui/icons-material/Place";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

interface RoutesDialogParams {
  open: boolean;
  onClose: () => void;
  routeData?: Route;
}

const getStatusMeta = (status?: string) => {
  switch (status) {
    case "ACTIVE":
      return { color: "success.main", text: "Active" };
    case "COMPLETED":
      return { color: "info.main", text: "Completed" };
    case "PENDING":
      return { color: "warning.main", text: "Pending" };
    default:
      return { color: "text.primary", text: status ?? "-" };
  }
};

const RoutesDialog = (params: RoutesDialogParams) => {
  const { open, onClose, routeData } = params;
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  const driver =
    mockData.staff.drivers.find((i) => i.id === routeData?.driverId) ?? null;

  /* -------------------------------- functions ------------------------------- */
  const statusMeta = getStatusMeta(routeData?.status);
  const [colorKey, colorVariant] = statusMeta.color.split(".");
  const statusColor =
    (theme.palette as any)[colorKey]?.[colorVariant] ||
    theme.palette.text.primary;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${alpha(statusColor, 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: alpha(statusColor, 0.1),
                color: statusColor,
                width: 72,
                height: 72,
                fontSize: "2rem",
                fontWeight: 800,
                borderRadius: 2,
              }}
            >
              <AltRouteIcon fontSize="large" />
            </Avatar>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ color: theme.palette.text.primary }}
                >
                  Route #{routeData?.id}
                </Typography>
                <Chip
                  label={statusMeta.text}
                  size="small"
                  sx={{
                    height: 24,
                    fontWeight: 600,
                    bgcolor: alpha(statusColor, 0.1),
                    color: statusColor,
                    ml: 1,
                  }}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <PlaceIcon fontSize="small" sx={{ fontSize: "1rem" }} />
                  {routeData?.name || "Route details"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <LocalShippingIcon
                    fontSize="small"
                    sx={{ fontSize: "1rem" }}
                  />
                  {routeData?.metrics?.totalDistanceKm} km •{" "}
                  {routeData?.stops?.length || 0} Stops
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              size="small"
              sx={{
                textTransform: "none",
                borderColor: theme.palette.divider,
                color: theme.palette.text.secondary,
                "&:hover": {
                  borderColor: theme.palette.text.primary,
                  color: theme.palette.text.primary,
                },
              }}
            >
              Edit
            </Button>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.text.secondary, 0.1),
                "&:hover": {
                  bgcolor: alpha(theme.palette.text.secondary, 0.2),
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Stack p={2} spacing={2}>
          {driver && <DriverCard {...driver} />}
          <Divider />
          <MapRoutesDialogCard routeId={routeData?.id ?? ""} />
          {routeData && (
            <Stack direction={"row"} justifyContent={"space-between"}>
              <RouteProgress routeData={routeData} />
              <RoutesTelemetryCards routeId={routeData.id} />
            </Stack>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default RoutesDialog;

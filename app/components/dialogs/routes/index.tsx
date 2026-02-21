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
  Typography,
  useTheme,
  Grid,
} from "@mui/material";
import { RouteWithRelations } from "@/app/lib/type/routes";
import DriverCard from "../../cards/driverCard";
import MapRoutesDialogCard from "./map";
import RouteProgress from "./progress";
import RoutesTelemetryCards from "./telemetry";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import PlaceIcon from "@mui/icons-material/Place";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

interface RouteDialogProps {
  open: boolean;
  onClose: () => void;
  route: RouteWithRelations | null;
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

export default function RouteDialog({
  open,
  onClose,
  route,
}: RouteDialogProps) {
  const theme = useTheme();

  if (!route) return null;

  /* -------------------------------- functions ------------------------------- */
  const statusMeta = getStatusMeta(route.status || "PENDING");
  const [colorKey, colorVariant] = statusMeta.color.split(".");
  const statusColor =
    (theme.palette as any)[colorKey]?.[colorVariant] ||
    theme.palette.text.primary;

  // VIEW MODE: Derive from stops if available
  // Using explicit casts or safe access since Route model might have simple Lat/Lng fields
  const mapOrigin = {
    lat: (route as any).startLat || 0,
    lng: (route as any).startLng || 0,
  };

  const mapDestination = {
    lat: (route as any).endLat || 0,
    lng: (route as any).endLng || 0,
  };

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
          background: `linear-gradient(135deg, ${alpha(
            statusColor,
            0.05
          )} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
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
                  Route #{route.id}
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
                  {route.name || "Route details"}
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
                  {/* Safe access for metrics */}
                  {(route as any).metrics?.totalDistanceKm || 0} km •{" "}
                  {(route as any).stops?.length || 0} Stops
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
          {route.driver && (
            // Simplified driver card props passing
            <DriverCard
              // Construct a partial object that satisfies the type enough for the card display
              // TODO: Fetch full driver details or make DriverCard props optional
              {...({
                id: route.driver.id,
                status: "ON_JOB",
                phone: "",
                employeeId: "",
                licenseNumber: "",
                licenseType: "",
                licenseExpiry: null,
                rating: 0,
                efficiencyScore: 0,
                safetyScore: 0,
                user: {
                  id: route.driver.id,
                  name: route.driver.user.name,
                  surname: route.driver.user.surname,
                  email: "",
                  avatarUrl: route.driver.user.avatarUrl,
                  roleId: "",
                },
                currentVehicle: null,
                createdAt: new Date(),
                updatedAt: new Date(),
              } as any)}
            />
          )}
          <Divider />
          <MapRoutesDialogCard
            routeId={route.id}
            origin={mapOrigin}
            destination={mapDestination}
            vehicleLocation={
              route.vehicle &&
              route.vehicle.currentLat &&
              route.vehicle.currentLng
                ? {
                    lat: route.vehicle.currentLat,
                    lng: route.vehicle.currentLng,
                    name: route.vehicle.plate,
                    id: route.vehicle.id,
                  }
                : null
            }
          />
          <Stack direction={"row"} justifyContent={"space-between"} spacing={2}>
            <Box flex={1}>
              <RouteProgress route={route} />
            </Box>
            <Box flex={1}>
              <RoutesTelemetryCards routeId={route.id} route={route} />
            </Box>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

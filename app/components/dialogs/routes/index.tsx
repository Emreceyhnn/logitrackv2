"use client";

import React, { useState } from "react";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Button,
  CircularProgress,
} from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { toast } from "sonner";
import { updateRouteStatus } from "@/app/lib/controllers/routes";
import { RouteWithRelations } from "@/app/lib/type/routes";
import { RouteStatus } from "@/app/lib/type/enums";

import { DriverWithRelations } from "@/app/lib/type/driver";
import DriverCard from "../../cards/driverCard";
import MapRoutesDialogCard from "./map";
import RouteProgress from "./progress";
import RoutesTelemetryCards from "./telemetry";
import CloseIcon from "@mui/icons-material/Close";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import PlaceIcon from "@mui/icons-material/Place";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { Dictionary } from "@/app/lib/language/language";

interface RouteDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  route: RouteWithRelations | null;
}

const getStatusMeta = (status?: string, dict?: Dictionary) => {
  const s = status?.toUpperCase();
  const label =
    (dict?.routes?.statuses as unknown as Record<string, string>)?.[
      s as string
    ] ||
    status ||
    "-";

  switch (s) {
    case "ACTIVE":
      return { color: "success.main", label };
    case "COMPLETED":
      return { color: "info.main", label };
    case "PENDING":
    case "PLANNED":
      return { color: "warning.main", label };
    case "CANCELED":
      return { color: "error.main", label };
    default:
      return { color: "text.primary", label };
  }
};

export default function RouteDialog({
  open,
  onClose,
  onSuccess,
  route,
}: RouteDialogProps) {
  const dict = useDictionary();
  const theme = useTheme();

  /* --------------------------------- states --------------------------------- */

  const [liveMetrics, setLiveMetrics] = useState<{
    distanceKm: number;
    durationMin: number;
  } | null>(null);

  const [statusLoading, setStatusLoading] = useState(false);

  if (!route) return null;

  /* -------------------------------- functions ------------------------------- */
  const handleStatusChange = async (newStatus: RouteStatus) => {
    setStatusLoading(true);
    try {
      await updateRouteStatus(route.id, newStatus);
      toast.success(dict.toasts.successUpdate || "Successfully updated!");
      onSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : dict.toasts.errorGeneric;
      toast.error(message);
    } finally {
      setStatusLoading(false);
    }
  };

  const statusMeta = getStatusMeta(route.status || "PENDING", dict);

  const getStatusColor = () => {
    if (statusMeta.color.includes(".")) {
      const [colorKey, colorVariant] = statusMeta.color.split(".");
      const palette = theme.palette as unknown as Record<
        string,
        Record<string, string>
      >;
      return palette[colorKey]?.[colorVariant] || theme.palette.text.primary;
    }
    return statusMeta.color;
  };

  const statusColor = getStatusColor();
  const paletteKey = statusMeta.color.split(".")[0];
  const statusAlpha =
    (
      theme.palette as unknown as Record<
        string,
        { _alpha?: Record<string, string> }
      >
    )[paletteKey]?._alpha ?? theme.palette.primary._alpha;

  const mapOrigin =
    route.startLat && route.startLng
      ? {
          lat: route.startLat,
          lng: route.startLng,
        }
      : route.startAddress || "";

  const mapDestination =
    route.endLat && route.endLng
      ? {
          lat: route.endLat,
          lng: route.endLng,
        }
      : route.endAddress || "";

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundImage: "none",
            border: `1px solid ${theme.palette.divider_alpha.main_10}`,
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${statusAlpha.main_10} 0%, transparent 100%)`,
            borderBottom: `1px solid ${theme.palette.divider_alpha.main_05}`,
            position: "relative",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Box
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  background: `linear-gradient(135deg, ${statusAlpha.main_20}, ${statusAlpha.main_05})`,
                  border: `1px solid ${statusAlpha.main_20}`,
                  display: "flex",
                }}
              >
                <AltRouteIcon sx={{ color: statusColor, fontSize: 32 }} />
              </Box>
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{ color: "white", letterSpacing: "-0.02em" }}
                  >
                    {dict.routes.title} #{route.id.slice(-6).toUpperCase()}
                  </Typography>
                  <Chip
                    label={statusMeta.label}
                    sx={{
                      height: 24,
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor: statusAlpha.main_10,
                      color: statusColor,
                      border: `1px solid ${statusAlpha.main_20}`,
                      borderRadius: "6px",
                      textTransform: "uppercase",
                    }}
                  />
                </Stack>
                <Typography
                  variant="body2"
                  color="rgba(255,255,255,0.5)"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <PlaceIcon sx={{ fontSize: 16 }} />
                  {route.name || dict.routes.dialogs.deliveryLabel}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              {/* Action Buttons based on status */}
              {route.status === "PLANNED" && (
                <>
                  <Button
                    variant="contained"
                    onClick={() => handleStatusChange("ACTIVE")}
                    disabled={statusLoading}
                    sx={{
                      bgcolor: theme.palette.success.main,
                      "&:hover": { bgcolor: theme.palette.success.dark },
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      px: 2,
                      height: 36,
                    }}
                  >
                    {dict.common.start}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleStatusChange("CANCELED")}
                    disabled={statusLoading}
                    sx={{
                      color: theme.palette.error.main,
                      borderColor: theme.palette.error.main,
                      "&:hover": {
                        bgcolor: theme.palette.error._alpha.main_05,
                        borderColor: theme.palette.error.dark,
                      },
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      px: 2,
                      height: 36,
                    }}
                  >
                    {dict.common.cancel}
                  </Button>
                </>
              )}

              {route.status === "ACTIVE" && (
                <>
                  <Button
                    variant="contained"
                    onClick={() => handleStatusChange("COMPLETED")}
                    disabled={statusLoading}
                    startIcon={
                      statusLoading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <CheckCircleIcon sx={{ fontSize: 18 }} />
                      )
                    }
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      "&:hover": { bgcolor: theme.palette.primary.dark },
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      px: 2,
                      height: 36,
                    }}
                  >
                    {dict.common.complete}
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => handleStatusChange("CANCELED")}
                    disabled={statusLoading}
                    sx={{
                      color: theme.palette.common.white_alpha.main_50,
                      "&:hover": {
                        color: theme.palette.error.main,
                        bgcolor: theme.palette.error._alpha.main_05,
                      },
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      height: 36,
                    }}
                  >
                    {dict.common.cancel}
                  </Button>
                </>
              )}

              <IconButton
                onClick={onClose}
                sx={{
                  color: "rgba(255,255,255,0.4)",
                  "&:hover": {
                    color: "white",
                    bgcolor: theme.palette.common.white_alpha.main_05,
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          <Stack direction={{ xs: "column", md: "row" }}>
            {/* Left Column: Information & Progress */}
            <Box
              sx={{
                width: { xs: "100%", md: "400px" },
                borderRight: `1px solid ${theme.palette.divider_alpha.main_05}`,
                p: 3,
                bgcolor: theme.palette.common.white_alpha.main_01,
              }}
            >
              <Stack spacing={2}>
                {/* Driver Section */}
                <Stack spacing={2}>
                  <Typography
                    variant="overline"
                    color="rgba(255,255,255,0.3)"
                    fontWeight={700}
                  >
                    {dict.routes.dialogs.driverAssignment}
                  </Typography>
                  {route.driver ? (
                    <DriverCard
                      {...({
                        id: route.driver.id,
                        status: route.driver.status || "ON_JOB",
                        phone: route.driver.phone || "",
                        employeeId: route.driver.employeeId || dict.common.na,
                        licenseNumber: route.driver.licenseNumber || "",
                        licenseType: route.driver.licenseType || "",
                        licenseExpiry: route.driver.licenseExpiry || null,
                        rating: route.driver.rating || 0,
                        efficiencyScore: route.driver.efficiencyScore || 0,
                        safetyScore: route.driver.safetyScore || 0,
                        user: {
                          id: route.driver.user.id,
                          name: route.driver.user.name,
                          surname: route.driver.user.surname,
                          email: "",
                          avatarUrl: route.driver.user.avatarUrl,
                          roleId: "",
                        },
                        currentVehicle: route.vehicle
                          ? {
                              id: route.vehicle.id,
                              plate: route.vehicle.plate,
                              brand: route.vehicle.brand,
                              model: route.vehicle.model,
                            }
                          : null,
                        createdAt: route.driver.createdAt,
                        updatedAt: route.driver.updatedAt,
                      } as unknown as DriverWithRelations)}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {dict.common.na}
                    </Typography>
                  )}
                </Stack>

                <Divider
                  sx={{ borderColor: theme.palette.common.white_alpha.main_05 }}
                />

                {/* Progress Section */}
                <RouteProgress route={route} />

                <Divider
                  sx={{ borderColor: theme.palette.common.white_alpha.main_05 }}
                />

                {/* Stats Grid */}
                <Stack direction="row" spacing={2}>
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: "16px",
                      bgcolor: theme.palette.common.white_alpha.main_03,
                      border: `1px solid ${theme.palette.common.white_alpha.main_05}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="rgba(255,255,255,0.4)"
                      display="block"
                      mb={0.5}
                    >
                      {dict.routes.details.distance}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="white">
                      {liveMetrics?.distanceKm ||
                        route.metrics?.totalDistanceKm ||
                        route.distanceKm ||
                        0}{" "}
                      km
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: "16px",
                      bgcolor: theme.palette.common.white_alpha.main_03,
                      border: `1px solid ${theme.palette.common.white_alpha.main_05}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="rgba(255,255,255,0.4)"
                      display="block"
                      mb={0.5}
                    >
                      {dict.routes.details.stops}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="white">
                      {route.stops?.length || route.shipments?.length
                        ? (route.shipments?.length || 0) + 2
                        : 0}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>

            {/* Right Column: Map & Telemetry */}
            <Box
              sx={{
                flex: 1,
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  height: { xs: 300, md: 440 },
                  width: "100%",
                }}
              >
                <MapRoutesDialogCard
                  origin={mapOrigin}
                  destination={mapDestination}
                  onRouteInfoUpdate={setLiveMetrics}
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
              </Box>

              {/* Overlay Telemetry */}
              <Box
                sx={{
                  p: 2,
                  background: `linear-gradient(to top, #0B1019 0%, ${theme.palette.background.midnight._alpha.main_80} 100%)`,
                  backdropFilter: "blur(8px)",
                  borderTop: `1px solid ${theme.palette.divider_alpha.main_10}`,
                }}
              >
                <RoutesTelemetryCards
                  routeId={route.id}
                  route={route}
                  liveDistanceKm={liveMetrics?.distanceKm}
                />
              </Box>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

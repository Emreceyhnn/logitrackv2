"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, Stack, useTheme } from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { toast } from "sonner";
import { updateRouteStatus } from "@/app/lib/controllers/routes";
import { lookupTranslation } from "@/app/lib/priorityColor";
import { RouteWithRelations } from "@/app/lib/type/routes";
import { RouteStatus } from "@/app/lib/type/enums";

import {
  resolvePaletteColor,
  resolvePaletteAlpha,
} from "@/app/lib/utils/paletteUtils";

import { Dictionary } from "@/app/lib/language/language";

// Custom hooks
import { useRouteLocations } from "./hooks/useRouteLocations";
import { useRouteMetrics } from "./hooks/useRouteMetrics";

// Components
import { RouteDialogHeader } from "./components/RouteDialogHeader";
import { RouteDialogLeftColumn } from "./components/RouteDialogLeftColumn";
import { RouteDialogRightColumn } from "./components/RouteDialogRightColumn";

interface RouteDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  route: RouteWithRelations | null;
}

const getStatusMeta = (status?: string, dict?: Dictionary) => {
  const s = status?.toLocaleUpperCase("en-US");
  const label =
    (s && lookupTranslation(dict?.routes?.statuses, s)) || status || "-";

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

  /* --------------------------------- hooks --------------------------------- */
  const { mapOrigin, mapDestination, intermediateStops } = useRouteLocations(route);
  const { vehicleTraveledMetrics, vehicleToDestMetrics } = useRouteMetrics(
    open,
    route,
    mapOrigin,
    mapDestination
  );

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
      return (
        resolvePaletteColor(theme.palette, statusMeta.color) ||
        theme.palette.text.primary
      );
    }
    return statusMeta.color;
  };

  const statusColor = getStatusColor();
  const paletteKey = statusMeta.color.split(".")[0];
  const statusAlpha =
    resolvePaletteAlpha(theme.palette, paletteKey) ??
    theme.palette.primary._alpha;

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
            display: "flex",
            flexDirection: "column",
            height: { md: "85vh" },
            maxHeight: "90vh",
          },
        }}
      >
        <RouteDialogHeader
          route={route}
          dict={dict}
          statusMeta={statusMeta}
          statusColor={statusColor}
          statusAlpha={statusAlpha}
          statusLoading={statusLoading}
          onStatusChange={handleStatusChange}
          onClose={onClose}
        />

        <DialogContent
          sx={{
            p: 0,
            overflow: { xs: "auto", md: "hidden" },
            flex: 1,
            minHeight: 0,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{ height: { md: "100%" }, minHeight: 0 }}
          >
            <RouteDialogLeftColumn
              route={route}
              dict={dict}
              liveMetrics={liveMetrics}
            />

            <RouteDialogRightColumn
              route={route}
              mapOrigin={mapOrigin}
              mapDestination={mapDestination}
              intermediateStops={intermediateStops}
              liveMetrics={liveMetrics}
              setLiveMetrics={setLiveMetrics}
              vehicleTraveledMetrics={vehicleTraveledMetrics}
              vehicleToDestMetrics={vehicleToDestMetrics}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

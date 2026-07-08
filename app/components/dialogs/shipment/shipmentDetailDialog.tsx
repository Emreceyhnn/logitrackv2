"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Stack,
  Divider,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ShipmentWithRelations } from "@/app/lib/type/shipment";
import { ShipmentItem } from "@/app/lib/type/enums";
import { StatusChip } from "@/app/components/chips/statusChips";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { AnimatePresence } from "framer-motion";
import {
  polylineHelper,
  PolylineHelperResult,
} from "../../valhalla/polylineHelper";
import dynamic from "next/dynamic";
const MapWithPolyline = dynamic(
  () => import("../../valhalla/mapWithPolyline"),
  {
    ssr: false,
  }
);

interface ShipmentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  shipment: ShipmentWithRelations | null;
}

import { PillTab } from "./components/PillTab";
import { ShipmentOverviewTab } from "./tabs/ShipmentOverviewTab";
import { ShipmentItemsTab } from "./tabs/ShipmentItemsTab";
export default function ShipmentDetailDialog({
  open,
  onClose,
  shipment,
}: ShipmentDetailDialogProps) {
  /* -------------------------------------------------------------------------- */
  const waypoints = useMemo(() => {
    if (!shipment) return [];
    const pts: { name: string; lat: number; lon: number }[] = [];

    if (shipment.originLat && shipment.originLng)
      pts.push({ name: shipment.origin || "Origin", lat: shipment.originLat, lon: shipment.originLng });

    const intermediateSorted = [...(shipment.stops || [])]
      .filter((s) => s.lat && s.lng)
      .filter((s) => !(s.lat === shipment.originLat && s.lng === shipment.originLng))
      .filter((s) => !(s.lat === shipment.destinationLat && s.lng === shipment.destinationLng))
      .sort((a, b) => a.sequence - b.sequence);
      
    for (const s of intermediateSorted)
      pts.push({ name: s.address, lat: Number(s.lat), lon: Number(s.lng) });

    if (shipment.destinationLat && shipment.destinationLng)
      pts.push({ name: shipment.destination || "Destination", lat: shipment.destinationLat, lon: shipment.destinationLng });

    return pts;
  }, [shipment]);

  const [data, setData] = useState<PolylineHelperResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!open || !shipment || waypoints.length < 2) {
        return; // Veri gelmeden veya en az 2 nokta olmadan istek atmasını engelliyoruz.
      }

      const response = await polylineHelper({
        locations: waypoints,
        costing: "truck",
      });

      setData(response ?? null);
    };

    fetchData();
  }, [waypoints, open, shipment]);

  /* -------------------------------------------------------------------------- */

  const dict = useDictionary();
  const theme = useTheme();
  const [tab, setTab] = useState<"overview" | "items">("overview");

  const items: ShipmentItem[] = shipment?.items ?? [];

  const stops = shipment?.stops;
  const stopsSorted = useMemo(() => {
    return stops ? [...stops]
      .filter((s) => !(s.lat === shipment.originLat && s.lng === shipment.originLng))
      .filter((s) => !(s.lat === shipment.destinationLat && s.lng === shipment.destinationLng))
      .sort((a, b) => a.sequence - b.sequence) : [];
  }, [stops, shipment]);

  const hasStops = stopsSorted.length > 0;

  if (!shipment) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          overflow: "hidden",
          maxHeight: "90vh",
        },
      }}
    >
      {/* ─── Header ─────────────────────────────────────────── */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(135deg, ${theme.palette.primary._alpha.main_10} 0%, transparent 60%)`
              : `linear-gradient(135deg, ${theme.palette.primary._alpha.main_05} 0%, transparent 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Left: title + status */}
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography
                variant="h5"
                fontWeight={800}
                color="text.primary"
                letterSpacing="-0.02em"
              >
                {shipment.trackingId}
              </Typography>
              <StatusChip status={shipment.status} />
            </Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              letterSpacing="0.04em"
            >
              {dict.shipments.details.systemConsignmentId}:{" "}
              {shipment.id.substring(0, 8).toLocaleUpperCase('en-US')}
            </Typography>
          </Stack>

          {/* Right: tab switcher + close */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Pill switcher container */}
            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                p: 0.5,
                borderRadius: "10px",
                bgcolor: theme.palette.action.hover,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <PillTab
                id="overview"
                active={tab === "overview"}
                onClick={() => setTab("overview")}
                theme={theme}
                icon={<InfoOutlinedIcon sx={{ fontSize: 15 }} />}
                label={dict.shipments.details.tabs.overview}
              />
              <PillTab
                id="items"
                active={tab === "items"}
                onClick={() => setTab("items")}
                theme={theme}
                icon={<Inventory2OutlinedIcon sx={{ fontSize: 15 }} />}
                label={dict.shipments.details.tabs.items}
                badge={items.length}
              />
            </Box>

            <IconButton
              onClick={onClose}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "text.primary",
                  bgcolor: theme.palette.action.hover,
                },
              }}
             aria-label="close">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {/* ─── Body ────────────────────────────────────────────── */}
      <DialogContent sx={{ p: 0, overflow: "hidden" }}>
        <Stack direction={{ xs: "column", md: "row" }}>
          {/* ── LEFT PANEL (400px, switches content by tab) ── */}
          <Box
            sx={{
              width: { xs: "100%", md: "400px" },
              borderRight: `1px solid ${theme.palette.divider}`,
              bgcolor: "background.default",
              overflow: "hidden", // Parent never scrolls; inner sections handle it
              height: { xs: "auto", md: "calc(90vh - 88px)" },
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <AnimatePresence mode="wait">
              {/* ══ TAB: Overview ════════════════════════════════ */}
              {tab === "overview" && (
                <ShipmentOverviewTab
                  shipment={shipment as ShipmentWithRelations}
                  hasStops={hasStops}
                  stopsSorted={stopsSorted}
                />
              )}

              {/* ══ TAB: Items ═══════════════════════════════════ */}
              {tab === "items" && <ShipmentItemsTab items={items} />}
            </AnimatePresence>
          </Box>

          {/* ── RIGHT: Map + telemetry overlay ── */}
          <Box
            sx={{
              flex: 1,
              position: "relative",
              minHeight: { xs: 360, md: 400 },
              height: { md: "calc(90vh - 88px)" },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 0, // Isolate Leaflet's internal panes so the overlay sits on top
              }}
            >
              <MapWithPolyline
                Polylines={data?.mapPoints || []}
                routePolyline={data?.polyline}
              />
            </Box>

            <Box
              sx={{
                position: "absolute",
                bottom: 24,
                left: 24,
                right: 24,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(11,16,25,0.82)"
                    : theme.palette.background.paper_alpha.main_90,
                backdropFilter: "blur(12px)",
                borderRadius: 3,
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                display: "flex",
                justifyContent: "space-around",
                zIndex: 2,
              }}
            >
              <Stack alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {dict.shipments.details.mileage}
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  color="text.primary"
                >
                  {shipment.route?.distanceKm
                    ? `${shipment.route.distanceKm} km`
                    : dict.shipments.details.tbd}
                </Typography>
              </Stack>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: theme.palette.common.white_alpha.main_08 }}
              />
              <Stack alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {dict.shipments.details.duration}
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  color="text.primary"
                >
                  {shipment.route?.durationMin
                    ? `${shipment.route.durationMin} min`
                    : dict.shipments.details.tbd}
                </Typography>
              </Stack>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: theme.palette.common.white_alpha.main_08 }}
              />
              <Stack alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {dict.shipments.details.fleetId}
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  color="text.primary"
                >
                  {shipment.route?.id
                    ? `RT-${shipment.route.id.substring(0, 4).toLocaleUpperCase('en-US')}`
                    : dict.shipments.details.noUnit}
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
  Paper,
  useTheme,
  Theme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ShipmentWithRelations } from "@/app/lib/type/shipment";
import { ShipmentItem } from "@/app/lib/type/enums";
import { StatusChip } from "@/app/components/chips/statusChips";
import DriverCard from "../../cards/driverCard";
import { DriverWithRelations } from "@/app/lib/type/driver";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { motion, AnimatePresence } from "framer-motion";
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

/* ── Pill tab button ── */
const PillTab = ({
  id,
  icon,
  label,
  badge,
  active,
  onClick,
  theme,
}: {
  id?: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  active: boolean;
  onClick: () => void;
  theme: Theme;
}) => {
  return (
    <Box
      id={id}
      component="button"
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.5,
        py: 0.6,
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        transition: "all 0.18s ease",
        bgcolor: active ? theme.palette.primary._alpha.main_15 : "transparent",
        color: active ? "primary.main" : "text.secondary",
        "&:hover": {
          bgcolor: active
            ? theme.palette.primary._alpha.main_20
            : theme.palette.action.hover,
          color: active ? "primary.main" : "text.primary",
        },
      }}
    >
      <Box sx={{ display: "flex", fontSize: 15, color: "inherit" }}>{icon}</Box>
      <Typography
        variant="caption"
        fontWeight={active ? 700 : 500}
        sx={{ color: "inherit", fontSize: "0.78rem" }}
      >
        {label}
      </Typography>
      {badge != null && badge > 0 && (
        <Box
          sx={{
            px: 0.75,
            lineHeight: "17px",
            borderRadius: "5px",
            fontSize: "0.6rem",
            fontWeight: 800,
            bgcolor: active
              ? theme.palette.primary._alpha.main_25
              : theme.palette.action.selected,
            color: active ? "primary.main" : "text.secondary",
          }}
        >
          {badge}
        </Box>
      )}
    </Box>
  );
};

export default function ShipmentDetailDialog({
  open,
  onClose,
  shipment,
}: ShipmentDetailDialogProps) {
  /* -------------------------------------------------------------------------- */
  const waypoints = useMemo(() => {
    const stops = shipment?.stops || [];
    return stops
      .filter((i) => i.lat && i.lng)
      .map((i) => ({
        name: i.address,
        lat: Number(i.lat),
        lon: Number(i.lng),
      }));
  }, [shipment?.stops]);

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
    return stops ? [...stops].sort((a, b) => a.sequence - b.sequence) : [];
  }, [stops]);

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
              {shipment.id.substring(0, 8).toUpperCase()}
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
            >
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
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minHeight: 0,
                  }}
                >
                  <Stack spacing={3} sx={{ flex: 1, minHeight: 0 }}>
                    {/* Driver */}
                    <Stack spacing={1.5} sx={{ flexShrink: 0 }}>
                      <Typography
                        variant="overline"
                        color="text.secondary"
                        fontWeight={700}
                        sx={{ opacity: 0.6 }}
                      >
                        {dict.shipments.details.assignmentDetails}
                      </Typography>
                      {shipment.driver ? (
                        <DriverCard
                          {...(shipment.driver as unknown as DriverWithRelations)}
                        />
                      ) : (
                        <Paper
                          sx={{
                            p: 2,
                            bgcolor: theme.palette.action.hover,
                            border: `1px dashed ${theme.palette.divider}`,
                            borderRadius: 2,
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {dict.shipments.details.noDriverAssigned}
                          </Typography>
                        </Paper>
                      )}
                    </Stack>

                    <Divider
                      sx={{ borderColor: theme.palette.divider, flexShrink: 0 }}
                    />

                    {/* Mission Path */}
                    <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                          }}
                        />
                        <Typography
                          variant="overline"
                          color="text.secondary"
                          fontWeight={700}
                          sx={{ opacity: 0.6 }}
                        >
                          {dict.shipments.details.missionPath}
                        </Typography>
                      </Stack>

                      <Box
                        sx={{
                          position: "relative",
                          flex: 1,
                          minHeight: 120,
                          overflowY: "auto",
                          overflowX: "hidden",
                          pr: 1,
                        }}
                      >
                        <Stack
                          spacing={4}
                          sx={{ position: "relative", pl: 5.5, py: 1 }}
                        >
                          {/* Continuous Vertical Line */}
                          <Box
                            sx={{
                              position: "absolute",
                              left: 16,
                              top: 10,
                              bottom: 10,
                              width: "2px",
                              bgcolor: theme.palette.divider,
                              opacity: 0.5,
                              "&::after": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundImage: `linear-gradient(to bottom, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 50%, ${theme.palette.secondary.main} 100%)`,
                                opacity: 0.3,
                              },
                            }}
                          />

                          {/* 1. Origin (Warehouse) */}
                          <Box sx={{ position: "relative" }}>
                            <Box
                              sx={{
                                position: "absolute",
                                left: -44,
                                top: 0,
                                width: 32,
                                height: 32,
                                borderRadius: "10px",
                                bgcolor: theme.palette.primary.main,
                                border: `4px solid ${theme.palette.background.default}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                zIndex: 1,
                                boxShadow: `0 4px 10px ${theme.palette.primary._alpha.main_30}`,
                              }}
                            >
                              <BusinessIcon sx={{ fontSize: 16 }} />
                            </Box>
                            <Stack spacing={0.25}>
                              <Typography
                                variant="caption"
                                fontWeight={800}
                                color="primary.main"
                                sx={{
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {dict.shipments.details.pickupOrigin}
                              </Typography>
                              <Typography
                                variant="body2"
                                fontWeight={700}
                                color="text.primary"
                              >
                                {shipment.origin || dict.common.noData}
                              </Typography>
                            </Stack>
                          </Box>

                          {/* 2. Intermediate Stops */}
                          {hasStops &&
                            stopsSorted.length > 1 &&
                            stopsSorted.slice(1, -1).map((stop, index) => (
                              <Box key={stop.id} sx={{ position: "relative" }}>
                                <Box
                                  sx={{
                                    position: "absolute",
                                    left: -44,
                                    top: 0,
                                    width: 32,
                                    height: 32,
                                    borderRadius: "10px",
                                    bgcolor: theme.palette.info.main,
                                    border: `4px solid ${theme.palette.background.default}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    zIndex: 1,
                                    fontSize: "0.75rem",
                                    fontWeight: 900,
                                  }}
                                >
                                  {index + 1}
                                </Box>
                                <Stack spacing={0.25}>
                                  <Typography
                                    variant="caption"
                                    fontWeight={800}
                                    color="info.main"
                                    sx={{
                                      textTransform: "uppercase",
                                      letterSpacing: "0.05em",
                                    }}
                                  >
                                    {dict.shipments.dialogs.sections.stop ||
                                      "Stop"}{" "}
                                    {index + 1}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color="text.primary"
                                  >
                                    {stop.address}
                                  </Typography>
                                </Stack>
                              </Box>
                            ))}

                          {/* 3. Final Destination */}
                          <Box sx={{ position: "relative" }}>
                            <Box
                              sx={{
                                position: "absolute",
                                left: -44,
                                top: 0,
                                width: 32,
                                height: 32,
                                borderRadius: "10px",
                                bgcolor: theme.palette.secondary.main,
                                border: `4px solid ${theme.palette.background.default}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                zIndex: 1,
                                boxShadow: `0 4px 10px ${theme.palette.secondary._alpha.main_30}`,
                              }}
                            >
                              <LocationOnIcon sx={{ fontSize: 18 }} />
                            </Box>
                            <Stack spacing={0.25}>
                              <Typography
                                variant="caption"
                                fontWeight={800}
                                color="secondary.main"
                                sx={{
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {dict.shipments.details.finalDelivery}
                              </Typography>
                              <Typography
                                variant="body2"
                                fontWeight={700}
                                color="text.primary"
                              >
                                {hasStops
                                  ? stopsSorted[stopsSorted.length - 1].address
                                  : shipment.destination || dict.common.noData}
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>

                    <Divider
                      sx={{ borderColor: theme.palette.divider, flexShrink: 0 }}
                    />

                    {/* Specs grid */}
                    <Stack spacing={1.5} sx={{ flexShrink: 0 }}>
                      <Typography
                        variant="overline"
                        color="text.secondary"
                        fontWeight={700}
                        sx={{ opacity: 0.6 }}
                      >
                        {dict.shipments.details.consignmentSpecs}
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: "16px",
                            bgcolor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            mb={0.5}
                          >
                            {dict.shipments.details.quantity}
                          </Typography>
                          <Typography
                            component="div"
                            variant="h6"
                            fontWeight={700}
                            color="text.primary"
                          >
                            {shipment.itemsCount || 0}{" "}
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {dict.shipments.details.units}
                            </Typography>
                          </Typography>
                        </Box>

                        {shipment.weightKg && (
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: "16px",
                              bgcolor: theme.palette.background.paper,
                              border: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              mb={0.5}
                            >
                              {dict.shipments.details.grossWeight}
                            </Typography>
                            <Typography
                              component="div"
                              variant="h6"
                              fontWeight={700}
                              color="text.primary"
                            >
                              {shipment.weightKg.toFixed(2)}{" "}
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                              >
                                {dict.shipments.details.kg}
                              </Typography>
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Stack>

                    <Divider
                      sx={{ borderColor: theme.palette.divider, flexShrink: 0 }}
                    />

                    {/* Customer */}
                    <Stack spacing={1.5} sx={{ flexShrink: 0 }}>
                      <Typography
                        variant="overline"
                        color="text.secondary"
                        fontWeight={700}
                        sx={{ opacity: 0.6 }}
                      >
                        {dict.shipments.details.customerEntity}
                      </Typography>
                      {shipment.customer ? (
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{
                            p: 2,
                            borderRadius: "14px",
                            bgcolor: theme.palette.primary._alpha.main_05,
                            border: `1px solid ${theme.palette.primary._alpha.main_10}`,
                          }}
                        >
                          <Avatar
                            variant="rounded"
                            sx={{
                              bgcolor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText,
                              width: 40,
                              height: 40,
                              borderRadius: "10px",
                            }}
                          >
                            <BusinessIcon />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight={700}
                              color="text.primary"
                            >
                              {shipment.customer.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {dict.shipments.details.clientPartner}
                            </Typography>
                          </Box>
                        </Stack>
                      ) : (
                        <Paper
                          sx={{
                            p: 2,
                            bgcolor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: "14px",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="text.primary"
                          >
                            {dict.shipments.details.directConsignment ||
                              "Custom Shipment"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dict.shipments.details.oneTimeService ||
                              "One-time direct service"}
                          </Typography>
                        </Paper>
                      )}
                    </Stack>
                  </Stack>
                </motion.div>
              )}

              {/* ══ TAB: Items ═══════════════════════════════════ */}
              {tab === "items" && (
                <motion.div
                  key="items"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minHeight: 0,
                  }}
                >
                  <Stack
                    spacing={0}
                    sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}
                  >
                    {/* Summary header */}
                    {items.length > 0 && (
                      <Box
                        sx={{
                          px: 3,
                          py: 2,
                          bgcolor: "background.paper",
                          borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Stack direction="row" spacing={3}>
                          <Stack spacing={0.25}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                textTransform: "uppercase",
                                fontSize: "0.65rem",
                                letterSpacing: "0.06em",
                                opacity: 0.6,
                              }}
                            >
                              {dict.shipments.details.itemsTab.totalItems}
                            </Typography>
                            <Typography
                              component="div"
                              variant="h6"
                              fontWeight={700}
                              color="text.primary"
                            >
                              {items.reduce((s, i) => s + i.quantity, 0)}
                            </Typography>
                          </Stack>
                          {items.some((i) => i.weightKg) && (
                            <>
                              <Divider
                                orientation="vertical"
                                flexItem
                                sx={{
                                  borderColor: theme.palette.divider,
                                }}
                              />
                              <Stack spacing={0.25}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    textTransform: "uppercase",
                                    fontSize: "0.65rem",
                                    letterSpacing: "0.06em",
                                    opacity: 0.6,
                                  }}
                                >
                                  {dict.shipments.details.itemsTab.totalWeight}
                                </Typography>
                                <Typography
                                  component="div"
                                  variant="h6"
                                  fontWeight={700}
                                  color="text.primary"
                                >
                                  {items
                                    .reduce(
                                      (s, i) =>
                                        s + (i.weightKg || 0) * i.quantity,
                                      0
                                    )
                                    .toFixed(1)}{" "}
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    kg
                                  </Typography>
                                </Typography>
                              </Stack>
                            </>
                          )}
                        </Stack>
                      </Box>
                    )}

                    {/* Empty state */}
                    {items.length === 0 && (
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        spacing={2}
                        sx={{ py: 8, px: 3 }}
                      >
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "16px",
                            bgcolor: theme.palette.action.hover,
                            border: `1px solid ${theme.palette.divider}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Inventory2OutlinedIcon
                            sx={{
                              fontSize: 24,
                              color: "text.secondary",
                              opacity: 0.2,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ opacity: 0.5 }}
                        >
                          {dict.shipments.details.itemsTab.noItems}
                        </Typography>
                      </Stack>
                    )}

                    {/* Item rows */}
                    {items.map((item, idx) => (
                      <Box key={item.id}>
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          sx={{
                            px: 3,
                            py: 2,
                            transition: "background 0.15s",
                            "&:hover": {
                              bgcolor: theme.palette.action.hover,
                            },
                          }}
                        >
                          {/* Index */}
                          <Typography
                            variant="caption"
                            fontWeight={800}
                            sx={{
                              width: 20,
                              color: "text.secondary",
                              opacity: 0.3,
                              fontSize: "0.65rem",
                              flexShrink: 0,
                            }}
                          >
                            {String(idx + 1).padStart(2, "0")}
                          </Typography>

                          {/* Name + SKU */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="text.primary"
                              noWrap
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                fontFamily: "monospace",
                                fontSize: "0.68rem",
                                opacity: 0.5,
                              }}
                            >
                              {item.sku}
                            </Typography>
                          </Box>

                          {/* Qty */}
                          <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                fontSize: "0.6rem",
                                textTransform: "uppercase",
                                opacity: 0.5,
                              }}
                            >
                              {dict.shipments.details.itemsTab.qty}
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              color="text.primary"
                            >
                              {item.quantity}
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                                ml={0.3}
                              >
                                {item.unit}
                              </Typography>
                            </Typography>
                          </Stack>

                          {/* Weight */}
                          {item.weightKg && (
                            <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  fontSize: "0.6rem",
                                  textTransform: "uppercase",
                                  opacity: 0.5,
                                }}
                              >
                                {dict.shipments.details.itemsTab.weight}
                              </Typography>
                              <Typography
                                variant="body2"
                                fontWeight={700}
                                color="text.primary"
                              >
                                {(item.weightKg * item.quantity).toFixed(1)}
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="text.secondary"
                                  ml={0.3}
                                >
                                  kg
                                </Typography>
                              </Typography>
                            </Stack>
                          )}
                        </Stack>

                        {idx < items.length - 1 && (
                          <Divider
                            sx={{
                              borderColor:
                                theme.palette.common.white_alpha.main_03,
                              mx: 3,
                            }}
                          />
                        )}
                      </Box>
                    ))}
                  </Stack>
                </motion.div>
              )}
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
                    ? `RT-${shipment.route.id.substring(0, 4).toUpperCase()}`
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

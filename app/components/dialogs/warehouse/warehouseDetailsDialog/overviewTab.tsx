"use client";

import {
  Box,
  Stack,
  Typography,
  LinearProgress,
  Divider,
  Grid,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { WarehouseWithRelations } from "@/app/lib/type/warehouse";
import { getUserNow } from "@/app/lib/utils/date";
import dayjs from "dayjs";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import InventoryIcon from "@mui/icons-material/Inventory";
import MapIcon from "@mui/icons-material/Map";
import CustomCard from "@/app/components/cards/card";

interface OverviewTabProps {
  warehouse: WarehouseWithRelations;
}

const OverviewTab = ({ warehouse }: OverviewTabProps) => {
  const dict = useDictionary();
  const theme = useTheme();

  const mockUsedPallets = (warehouse._count?.inventory || 0) * 10;
  const totalPallets = warehouse.capacityPallets || 5000;
  const mockUsedVolume = (warehouse._count?.inventory || 0) * 5;
  const totalVolume = warehouse.capacityVolumeM3 || 100000;

  const palletPct = Math.min((mockUsedPallets / totalPallets) * 100, 100);
  const volumePct = Math.min((mockUsedVolume / totalVolume) * 100, 100);

  const operatingHoursStr =
    typeof warehouse.operatingHours === "object" &&
    warehouse.operatingHours !== null
      ? (warehouse.operatingHours as { monFri?: string }).monFri ||
        "08:00 - 18:00"
      : typeof warehouse.operatingHours === "string"
        ? warehouse.operatingHours
        : "08:00 - 18:00";

  const t = dict.warehouses.dialogs.details;
  const [nowInWhTz, setNowInWhTz] = useState(
    getUserNow(warehouse.timezone || "UTC")
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setNowInWhTz(getUserNow(warehouse.timezone || "UTC"));
    }, 10000);
    return () => clearInterval(timer);
  }, [warehouse.timezone]);

  const is247 = operatingHoursStr === "24/7";
  let isOpen = is247;
  let statusText = "Open";

  const parseTime = (timeStr: string, tz: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return dayjs().tz(tz).set("hour", h).set("minute", m).set("second", 0);
  };

  if (!is247 && operatingHoursStr.includes(" - ")) {
    const [opening, closing] = operatingHoursStr.split(" - ");
    const whOpening = parseTime(opening, warehouse.timezone || "UTC");
    let whClosing = parseTime(closing, warehouse.timezone || "UTC");

    // Handle night shift (e.g. 22:00 - 06:00)
    if (whClosing.isBefore(whOpening)) {
      if (nowInWhTz.isAfter(whOpening) || nowInWhTz.isSame(whOpening)) {
        whClosing = whClosing.add(1, "day");
      } else {
        whOpening.subtract(1, "day");
      }
    }

    isOpen =
      (nowInWhTz.isAfter(whOpening) || nowInWhTz.isSame(whOpening)) &&
      nowInWhTz.isBefore(whClosing);
  }

  statusText = isOpen
    ? dict.warehouses.dialogs.status?.open || "OPEN"
    : dict.warehouses.dialogs.status?.closed || "CLOSED";

  return (
    <Box>
      <Grid container spacing={4}>
        {/* Top Info Cards */}
        <Grid size={{ xs: 12, md: 4 }}>
          <CustomCard
            sx={{
              p: 1.5,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: theme.palette.kpi.amber_alpha.main_10,
              borderColor: theme.palette.kpi.amber_alpha.main_20,
              borderWidth: 1,
              borderStyle: "solid",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 1.5,
                  bgcolor: theme.palette.kpi.amber_alpha.main_20,
                  color: theme.palette.kpi.amber,
                }}
              >
                <MapIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                color="text.primary"
              >
                {t.locationDetails}
              </Typography>
            </Stack>
            <Stack spacing={1}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", fontSize: "0.65rem", lineHeight: 1 }}
                >
                  {t.address}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={600}
                  sx={{ display: "block" }}
                >
                  {warehouse.address}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", fontSize: "0.65rem", lineHeight: 1 }}
                >
                  {t.cityCountry}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={600}
                  sx={{ display: "block" }}
                >
                  {warehouse.city}, {warehouse.country}
                </Typography>
              </Box>
            </Stack>
          </CustomCard>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <CustomCard
            sx={{
              p: 1.5,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: theme.palette.kpi.violet_alpha.main_10,
              borderColor: theme.palette.kpi.violet_alpha.main_20,
              borderWidth: 1,
              borderStyle: "solid",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 1.5,
                  bgcolor: theme.palette.kpi.violet_alpha.main_20,
                  color: theme.palette.kpi.violet,
                }}
              >
                <InventoryIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                color="text.primary"
              >
                {t.uniqueSkus}
              </Typography>
            </Stack>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h5" fontWeight={800} color="text.primary">
                {warehouse._count?.inventory || 0}
              </Typography>
            </Box>
          </CustomCard>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <CustomCard
            sx={{
              p: 1.5,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: theme.palette.kpi.sky_alpha.main_10,
              borderColor: theme.palette.kpi.sky_alpha.main_20,
              borderWidth: 1,
              borderStyle: "solid",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 1.5,
                  bgcolor: theme.palette.kpi.sky_alpha.main_20,
                  color: theme.palette.kpi.sky,
                }}
              >
                <BusinessCenterIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                color="text.primary"
              >
                {t.operations}
              </Typography>
            </Stack>
            <Grid container spacing={1.5}>
              <Grid size={6}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", fontSize: "0.65rem" }}
                >
                  {t.facilityType}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={700}
                  sx={{ textTransform: "uppercase", fontSize: "0.65rem" }}
                >
                  {dict.warehouses.categories.types[
                    warehouse.type as keyof typeof dict.warehouses.categories.types
                  ] || warehouse.type}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", fontSize: "0.65rem" }}
                >
                  {t.manager}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.primary"
                  fontWeight={600}
                >
                  {warehouse.manager
                    ? `${warehouse.manager.name} ${warehouse.manager.surname}`
                    : t.notAssigned}
                </Typography>
              </Grid>
              <Grid size={12}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", fontSize: "0.65rem" }}
                    >
                      {t.operatingHours}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.primary"
                      fontWeight={600}
                    >
                      {operatingHoursStr} (LCL)
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box
                      sx={{
                        px: 0.8,
                        py: 0.2,
                        borderRadius: 1,
                        bgcolor: isOpen
                          ? theme.palette.success._alpha.main_10
                          : theme.palette.error._alpha.main_10,
                        color: isOpen
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                        fontWeight: 700,
                        fontSize: "0.6rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.4,
                      }}
                    >
                      <Box
                        sx={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          bgcolor: isOpen
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                        }}
                      />
                      {statusText.toUpperCase()}
                    </Box>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </CustomCard>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography
            variant="subtitle1"
            fontWeight={800}
            color="text.primary"
            mb={1}
            mt={1}
          >
            {t.capacityUtilization}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <CustomCard
            sx={{
              p: 1.5,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              bgcolor: theme.palette.kpi.indigo_alpha.main_10,
              borderColor: theme.palette.kpi.indigo_alpha.main_20,
              borderWidth: 1,
              borderStyle: "solid",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 1.5,
                  bgcolor: theme.palette.kpi.indigo_alpha.main_20,
                  color: theme.palette.kpi.indigo,
                }}
              >
                <BusinessCenterIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box flex={1}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.primary"
                  sx={{ display: "block", lineHeight: 1 }}
                >
                  {t.palletStorage}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.6rem" }}
                >
                  {t.standardEuroPallets}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={800} color="text.primary">
                {palletPct.toFixed(1)}%
              </Typography>
            </Stack>

            <Box sx={{ position: "relative", mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: theme.palette.divider_alpha.main_10,
                  "& .MuiLinearProgress-bar": { display: "none" },
                }}
              />
              <LinearProgress
                variant="determinate"
                value={palletPct}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "transparent",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    bgcolor: theme.palette.primary.main,
                  },
                }}
              />
            </Box>

            <Stack direction="row" justifyContent="space-between">
              <Typography
                variant="caption"
                color="text.primary"
                fontWeight={600}
                sx={{ fontSize: "0.7rem" }}
              >
                {mockUsedPallets.toLocaleString()} {t.used}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.7rem" }}
              >
                {totalPallets.toLocaleString()} {t.totalCapacity}
              </Typography>
            </Stack>
          </CustomCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <CustomCard
            sx={{
              p: 1.5,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              bgcolor: theme.palette.kpi.teal_alpha.main_10,
              borderColor: theme.palette.kpi.teal_alpha.main_20,
              borderWidth: 1,
              borderStyle: "solid",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 1.5,
                  bgcolor: theme.palette.kpi.teal_alpha.main_20,
                  color: theme.palette.kpi.teal,
                }}
              >
                <LocalShippingIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box flex={1}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.primary"
                  sx={{ display: "block", lineHeight: 1 }}
                >
                  {t.volumeCapacity}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.6rem" }}
                >
                  {t.totalCubicMeters}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={800} color="text.primary">
                {volumePct.toFixed(1)}%
              </Typography>
            </Stack>

            <Box sx={{ position: "relative", mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: theme.palette.divider_alpha.main_10,
                  "& .MuiLinearProgress-bar": { display: "none" },
                }}
              />
              <LinearProgress
                variant="determinate"
                value={volumePct}
                color="success"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "transparent",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    bgcolor: theme.palette.success.main,
                  },
                }}
              />
            </Box>

            <Stack direction="row" justifyContent="space-between">
              <Typography
                variant="caption"
                color="text.primary"
                fontWeight={600}
                sx={{ fontSize: "0.7rem" }}
              >
                {mockUsedVolume.toLocaleString()} {t.m3Used}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.7rem" }}
              >
                {totalVolume.toLocaleString()} {t.m3TotalCapacity}
              </Typography>
            </Stack>
          </CustomCard>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1, borderColor: "divider" }} />
          <Typography
            variant="subtitle2"
            fontWeight={800}
            color="text.primary"
            mb={1}
          >
            {t.facilityCapabilities}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {warehouse.manager && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  mb: 1,
                  bgcolor: theme.palette.info._alpha.main_10,
                  color: theme.palette.info.main,
                  px: 1.2,
                  py: 0.6,
                  borderRadius: 1.5,
                  border: "1px solid",
                  borderColor: theme.palette.info._alpha.main_20,
                }}
              >
                <ThermostatIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" fontWeight={600}>
                  {t.managedFacility}
                </Typography>
              </Stack>
            )}

            {warehouse.specifications?.map((spec, index) => {
              const specKeyMap: Record<string, string> = {
                "Cold Storage": "coldStorage",
                "Hazardous Materials": "hazardous",
                "Bonded Warehouse": "bonded",
                "Cross-Docking": "crossDocking",
                "High Security": "highSecurity",
                "Lashing/Loading": "lashing",
              };
              const key = specKeyMap[spec] || spec;
              return (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    mb: 1,
                    bgcolor: "transparent",
                    color: "text.secondary",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <BusinessCenterIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" fontWeight={600}>
                    {dict.warehouses.categories.specs[
                      key as keyof typeof dict.warehouses.categories.specs
                    ] || spec}
                  </Typography>
                </Stack>
              );
            })}

            {(!warehouse.specifications ||
              warehouse.specifications.length === 0) && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  mb: 1,
                  bgcolor: theme.palette.divider_alpha.main_05,
                  color: "text.secondary",
                  px: 1.2,
                  py: 0.6,
                  borderRadius: 1.5,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <BusinessCenterIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" fontWeight={600}>
                  {t.standardStorage}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewTab;

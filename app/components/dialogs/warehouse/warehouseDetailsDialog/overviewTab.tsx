import {
  Box,
  Stack,
  Typography,
  LinearProgress,
  Divider,
  Grid,
} from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { WarehouseWithRelations } from "@/app/lib/type/warehouse";
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

  return (
    <Box sx={{ pb: 4 }}>
      <Grid container spacing={3}>
        {/* Top Info Cards */}
        <Grid size={{ xs: 12, md: 4 }}>
          <CustomCard
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: (theme) => theme.palette.kpi.indigo_alpha.main_10,
              borderColor: (theme) => theme.palette.kpi.indigo_alpha.main_20,
              borderWidth: 1,
              borderStyle: "solid",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: (theme) => theme.palette.kpi.indigo_alpha.main_20,
                  color: (theme) => theme.palette.kpi.indigo,
                }}
              >
                <MapIcon />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                {t.locationDetails}
              </Typography>
            </Stack>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t.address}
                </Typography>
                <Typography variant="body2" color="text.primary" fontWeight={600}>
                  {warehouse.address}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t.cityCountry}
                </Typography>
                <Typography variant="body2" color="text.primary" fontWeight={600}>
                  {warehouse.city}, {warehouse.country}
                </Typography>
              </Box>
            </Stack>
          </CustomCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <CustomCard
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: (theme) => theme.palette.kpi.teal_alpha.main_10,
              borderColor: (theme) => theme.palette.kpi.teal_alpha.main_20,
              borderWidth: 1,
              borderStyle: "solid",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: (theme) => theme.palette.kpi.teal_alpha.main_20,
                  color: (theme) => theme.palette.kpi.emerald,
                }}
              >
                <BusinessCenterIcon />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                {t.operations}
              </Typography>
            </Stack>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t.facilityType}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      py: 0.3,
                      borderRadius: 1,
                      bgcolor: (theme) => theme.palette.primary._alpha.main_10,
                      color: "primary.main",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.65rem",
                    }}
                  >
                    {dict.warehouses.categories.types[
                      warehouse.type as keyof typeof dict.warehouses.categories.types
                    ] || warehouse.type}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t.operatingHours}
                </Typography>
                <Typography variant="body2" color="text.primary" fontWeight={600}>
                  {operatingHoursStr}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t.manager}
                </Typography>
                <Typography variant="body2" color="text.primary" fontWeight={600}>
                  {warehouse.manager
                    ? `${warehouse.manager.name} ${warehouse.manager.surname}`
                    : t.notAssigned}
                </Typography>
              </Box>
            </Stack>
          </CustomCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <CustomCard
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: (theme) => theme.palette.kpi.deepPurple_alpha.main_10,
              borderColor: (theme) => theme.palette.kpi.deepPurple_alpha.main_20,
              borderWidth: 1,
              borderStyle: "solid",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: (theme) => theme.palette.kpi.deepPurple_alpha.main_20,
                  color: (theme) => theme.palette.kpi.violet,
                }}
              >
                <InventoryIcon />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary">
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
              <Typography variant="h3" fontWeight={800} color="text.primary">
                {warehouse._count?.inventory || 0}
              </Typography>
            </Box>
          </CustomCard>
        </Grid>

        {/* Capacity Utilization */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" fontWeight={800} color="text.primary" mb={2} mt={2}>
            {t.capacityUtilization}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <CustomCard
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: (theme) => theme.palette.primary._alpha.main_10,
                  color: "primary.main",
                }}
              >
                <BusinessCenterIcon />
              </Box>
              <Box flex={1}>
                <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                  {t.palletStorage}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t.standardEuroPallets}
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={800} color="text.primary">
                {palletPct.toFixed(1)}%
              </Typography>
            </Stack>

            <Box sx={{ position: "relative", mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  bgcolor: (theme) => theme.palette.divider_alpha.main_10,
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
                  height: 12,
                  borderRadius: 6,
                  bgcolor: "transparent",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 6,
                    bgcolor: (theme) => theme.palette.primary.main,
                  },
                }}
              />
            </Box>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.primary" fontWeight={600}>
                {mockUsedPallets.toLocaleString()} {t.used}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalPallets.toLocaleString()} {t.totalCapacity}
              </Typography>
            </Stack>
          </CustomCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <CustomCard
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: (theme) => theme.palette.success._alpha.main_10,
                  color: "success.main",
                }}
              >
                <LocalShippingIcon />
              </Box>
              <Box flex={1}>
                <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                  {t.volumeCapacity}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t.totalCubicMeters}
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={800} color="text.primary">
                {volumePct.toFixed(1)}%
              </Typography>
            </Stack>

            <Box sx={{ position: "relative", mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  bgcolor: (theme) => theme.palette.divider_alpha.main_10,
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
                  height: 12,
                  borderRadius: 6,
                  bgcolor: "transparent",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 6,
                    bgcolor: (theme) => theme.palette.success.main,
                  },
                }}
              />
            </Box>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.primary" fontWeight={600}>
                {mockUsedVolume.toLocaleString()} {t.m3Used}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalVolume.toLocaleString()} {t.m3TotalCapacity}
              </Typography>
            </Stack>
          </CustomCard>
        </Grid>

        {/* Feature Flags */}
        <Grid size={{ xs: 12 }}>
          <Divider
            sx={{ my: 2, borderColor: "divider" }}
          />
          <Typography variant="h6" fontWeight={800} color="text.primary" mb={2}>
            {t.facilityCapabilities}
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {warehouse.manager && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                  mb: 2,
                  bgcolor: (theme) => theme.palette.info._alpha.main_10,
                  color: "info.main",
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: (theme) => theme.palette.info._alpha.main_20,
                }}
              >
                <ThermostatIcon />
                <Typography variant="button" fontWeight={600}>
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
                  spacing={1.5}
                  sx={{
                    mb: 2,
                    bgcolor: (theme) => theme.palette.divider_alpha.main_05,
                    color: "text.secondary",
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <BusinessCenterIcon />
                  <Typography variant="button" fontWeight={600}>
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
                spacing={1.5}
                sx={{
                  mb: 2,
                  bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                  color: "text.secondary",
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <BusinessCenterIcon />
                <Typography variant="button" fontWeight={600}>
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

"use client";

import {

  Box,
  Stack,
  Typography,
  alpha,
  useTheme,
  LinearProgress,
  Divider,
  Grid,
} from "@mui/material";
import { WarehouseWithRelations } from "@/app/lib/type/warehouse";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import InventoryIcon from "@mui/icons-material/Inventory";
import MapIcon from "@mui/icons-material/Map";
import CustomCard from "@/app/components/cards/card";
import { deepPurple, indigo, teal } from "@mui/material/colors";

interface OverviewTabProps {
  warehouse: WarehouseWithRelations;
}

const OverviewTab = ({ warehouse }: OverviewTabProps) => {
  const theme = useTheme();

  const mockUsedPallets = (warehouse._count?.inventory || 0) * 10;
  const totalPallets = warehouse.capacityPallets || 5000;
  const mockUsedVolume = (warehouse._count?.inventory || 0) * 5;
  const totalVolume = warehouse.capacityVolumeM3 || 100000;

  const palletPct = Math.min((mockUsedPallets / totalPallets) * 100, 100);
  const volumePct = Math.min((mockUsedVolume / totalVolume) * 100, 100);

  const operatingHoursStr =
    typeof warehouse.operatingHours === "object" && warehouse.operatingHours !== null
      ? (warehouse.operatingHours as { monFri?: string }).monFri || "08:00 - 18:00"
      : typeof warehouse.operatingHours === "string"
      ? warehouse.operatingHours
      : "08:00 - 18:00";

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
              bgcolor: alpha(indigo[900], 0.1),
              borderColor: alpha(indigo[500], 0.2),
              borderWidth: 1,
              borderStyle: "solid",
            }}
           
          >
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: alpha(indigo[500], 0.2),
                  color: indigo[300],
                }}
              >
                <MapIcon />
              </Box>
              <Typography variant="subtitle1" fontWeight={600} color="white">
                Location Details
              </Typography>
            </Stack>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body2" color="white" fontWeight={500}>
                  {warehouse.address}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  City / Country
                </Typography>
                <Typography variant="body2" color="white" fontWeight={500}>
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
              bgcolor: alpha(teal[900], 0.1),
              borderColor: alpha(teal[500], 0.2),
              borderWidth: 1,
              borderStyle: "solid",
            }}
           
          >
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: alpha(teal[500], 0.2),
                  color: teal[300],
                }}
              >
                <BusinessCenterIcon />
              </Box>
              <Typography variant="subtitle1" fontWeight={600} color="white">
                Operations
              </Typography>
            </Stack>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Facility Type
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      py: 0.3,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.65rem",
                    }}
                  >
                    {warehouse.type.replace("_", " ")}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Operating Hours
                </Typography>
                <Typography variant="body2" color="white" fontWeight={500}>
                  {operatingHoursStr}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Manager
                </Typography>
                <Typography variant="body2" color="white" fontWeight={500}>
                  {warehouse.manager
                    ? `${warehouse.manager.name} ${warehouse.manager.surname}`
                    : "Not Assigned"}
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
              bgcolor: alpha(deepPurple[900], 0.1),
              borderColor: alpha(deepPurple[500], 0.2),
              borderWidth: 1,
              borderStyle: "solid",
            }}
           
          >
             <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: alpha(deepPurple[500], 0.2),
                  color: deepPurple[300],
                }}
              >
                <InventoryIcon />
              </Box>
              <Typography variant="subtitle1" fontWeight={600} color="white">
                Unique SKUs
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
              <Typography variant="h3" fontWeight={700} color="white">
                {warehouse._count?.inventory || 0}
              </Typography>
            </Box>
          </CustomCard>
        </Grid>

        {/* Capacity Utilization */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" fontWeight={600} color="white" mb={2} mt={2}>
            Capacity Utilization
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <CustomCard sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                <BusinessCenterIcon />
              </Box>
              <Box flex={1}>
                <Typography variant="subtitle1" fontWeight={600} color="white">
                  Pallet Storage
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Standard & Euro Pallets
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700} color="white">
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
                  bgcolor: alpha(theme.palette.divider, 0.1),
                  "& .MuiLinearProgress-bar": { display: "none" }
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
                  "& .MuiLinearProgress-bar": { borderRadius: 6, bgcolor: theme.palette.primary.main },
                }}
              />
            </Box>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="white" fontWeight={500}>
                {mockUsedPallets.toLocaleString()} Used
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalPallets.toLocaleString()} Total Capacity
              </Typography>
            </Stack>
          </CustomCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
           <CustomCard sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
               <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                }}
              >
                <LocalShippingIcon />
              </Box>
              <Box flex={1}>
                 <Typography variant="subtitle1" fontWeight={600} color="white">
                  Volume Capacity
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total cubic meters (m³)
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700} color="white">
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
                  bgcolor: alpha(theme.palette.divider, 0.1),
                  "& .MuiLinearProgress-bar": { display: "none" }
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
                  "& .MuiLinearProgress-bar": { borderRadius: 6, bgcolor: theme.palette.success.main },
                }}
              />
            </Box>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="white" fontWeight={500}>
                {mockUsedVolume.toLocaleString()} m³ Used
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalVolume.toLocaleString()} m³ Total Capacity
              </Typography>
            </Stack>
          </CustomCard>
        </Grid>

        {/* Feature Flags */}
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 2, borderColor: alpha(theme.palette.divider, 0.1) }} />
          <Typography variant="h6" fontWeight={600} color="white" mb={2}>
            Facility Capabilities
          </Typography>
          <Stack direction="row" spacing={2}>
             {warehouse.manager && (
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.light, px: 2, py: 1.5, borderRadius: 2, border: `1px solid ${alpha(theme.palette.info.main, 0.2)}` }}>
                <ThermostatIcon />
                <Typography variant="button" fontWeight={600}>Managed Facility</Typography>
              </Stack>
            )}
             <Stack direction="row" alignItems="center" spacing={1.5} sx={{ bgcolor: alpha(theme.palette.divider, 0.05), color: "text.secondary", px: 2, py: 1.5, borderRadius: 2, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                <BusinessCenterIcon />
                <Typography variant="button" fontWeight={600}>Standard Storage</Typography>
              </Stack>
          </Stack>
        </Grid>

      </Grid>
    </Box>
  );
};

export default OverviewTab;

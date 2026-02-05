"use client";
import mockData from "@/app/lib/mockData.json";
import {
  Box,
  Card,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import CustomCard from "../../cards/card";

const CapacityUtilization = () => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const warehouses = mockData.warehouses;

  return (
    <CustomCard sx={{ p: 3, borderRadius: "12px", boxShadow: 3, flex: 2 }}>
      <Typography variant="h6" fontWeight={600} mb={4}>
        Capacity Utilization
      </Typography>

      <Stack spacing={4} alignItems="center">
        {warehouses.map((warehouse) => {
          const capacityPct = Math.round(
            (warehouse.capacity.usedPallets / warehouse.capacity.totalPallets) *
              100
          );
          const color = warehouse.code.includes("IST") ? "#3b82f6" : "#10b981";

          return (
            <Stack key={warehouse.id} alignItems="center" spacing={2}>
              <Box position="relative" display="inline-flex">
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={160}
                  thickness={4}
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.05)",
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  value={capacityPct}
                  size={160}
                  thickness={4}
                  sx={{
                    color: color,
                    position: "absolute",
                    left: 0,
                    [`& .MuiCircularProgress-circle`]: {
                      strokeLinecap: "round",
                    },
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h4" component="div" fontWeight={700}>
                    {capacityPct}%
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase" }}
                  >
                    {warehouse.address.city}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Used Pallets
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </CustomCard>
  );
};

export default CapacityUtilization;

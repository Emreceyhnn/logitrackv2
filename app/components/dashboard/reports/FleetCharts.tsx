"use client";

import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { Card, Stack, Typography, useTheme, Box } from "@mui/material";

interface FleetChartData {
  plate: string;
  consumption: string;
  odometer: number;
  maintenanceCost: number;
}

interface FleetChartsProps {
  data?: FleetChartData[];
}

export default function FleetCharts({ data }: FleetChartsProps) {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  const vehicleFuel = (data || []).map((v) => ({
    plate: v.plate,
    consumption: parseFloat(v.consumption),
  }));

  const maintenanceAnalysis = (data || [])
    .map((v) => ({
      plate: v.plate,
      odometer: v.odometer,
      cost: v.maintenanceCost
    }))
    .sort((a, b) => a.odometer - b.odometer);

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Card
          sx={{
            flex: 1,
            p: 2.5,
            borderRadius: "16px",
            boxShadow: theme.shadows[2],
            display: "flex",
            flexDirection: "column",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background: `${theme.palette.background.paper}`,
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: theme.shadows[8],
            },
          }}
        >
          <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>
              Fuel Consumption
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Liters per 100km by Vehicle
            </Typography>
          </Stack>

          <Box sx={{ flex: 1, minHeight: 400 }}>
            <BarChart
              dataset={vehicleFuel}
              yAxis={[{ scaleType: "band", dataKey: "plate" }]}
              series={[
                {
                  dataKey: "consumption",
                  label: "L/100km",
                  color: theme.palette.error.main,
                  valueFormatter: (v) => `${v}L`,
                },
              ]}
              layout="horizontal"
              borderRadius={4}
              margin={{ left: 100 }}
              slotProps={{
                legend: { hidden: true } as any,
              }}
            />
          </Box>
        </Card>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Card
          sx={{
            flex: 1,
            p: 2.5,
            borderRadius: "16px",
            boxShadow: theme.shadows[2],
            display: "flex",
            flexDirection: "column",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background: `${theme.palette.background.paper}`,
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: theme.shadows[8],
            },
          }}
        >
          <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>
              Maintenance Cost Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Cost vs. Odometer Reading
            </Typography>
          </Stack>

          <Box sx={{ flex: 1, minHeight: 400 }}>
            <LineChart
              xAxis={[
                {
                  data: maintenanceAnalysis.length > 0 ? maintenanceAnalysis.map((m) => m.odometer) : [0, 1000],
                  label: "Odometer (km)",
                  valueFormatter: (v: number) => `${(v / 1000).toFixed(0)}k`,
                },
              ]}
              series={[
                {
                  data: maintenanceAnalysis.length > 0 ? maintenanceAnalysis.map((m) => m.cost) : [0, 0],
                  label: "Total Maint. Cost ($)",
                  color: theme.palette.warning.main,
                  area: true,
                  showMark: false,
                  curve: "natural",
                },
              ]}
              margin={{ left: 70 }}
            />
          </Box>
        </Card>
      </Box>
    </Stack>
  );
}

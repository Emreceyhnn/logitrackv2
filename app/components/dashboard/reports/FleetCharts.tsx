import { Paper, Typography, Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { FleetVehicleStats } from "@/app/lib/type/reports";
import { Dictionary } from "@/app/lib/language/language";

interface FleetChartsProps {
  data: FleetVehicleStats[];
  dict: Dictionary;
}

export default function FleetCharts({ data, dict }: FleetChartsProps) {

  if (!data || data.length === 0) {
    return (
      <Box p={3}>
        <Typography color="text.secondary">
          {dict.reports.charts.fleet.noData}
        </Typography>
      </Box>
    );
  }

  // Preparing data for maintenance costs
  const maintenanceData = data
    .map((v) => ({
      plate: v.plate,
      cost: v.maintenanceCost,
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 10); // Top 10 costly vehicles

  // Preparing data for Consumption vs Odometer correlation
  const scatterData = data.map((v, i) => ({
    id: i,
    x: v.odometer,
    y: parseFloat(v.consumption),
    plate: v.plate,
  }));

  return (
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      <Paper sx={{ p: 3, flex: 1, minWidth: 300, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          {dict.reports.charts.fleet.highMaintenance}
        </Typography>
        <BarChart
          dataset={maintenanceData}
          xAxis={[{ scaleType: "band", dataKey: "plate" }]}
          series={[
            {
              dataKey: "cost",
              label: dict.reports.charts.fleet.maintenanceCostLabel,
              color: "theme.palette.error.main",
            },
          ]}
          height={300}
        />
      </Paper>

      <Paper sx={{ p: 3, flex: 1, minWidth: 300, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          {dict.reports.charts.fleet.consumptionVsOdometer}
        </Typography>
        <ScatterChart
          series={[
            {
              label: dict.reports.charts.fleet.fleetLabel,
              data: scatterData.map((d) => ({ x: d.x, y: d.y, id: d.id })),
            },
          ]}
          xAxis={[{ label: dict.reports.charts.fleet.odometerLabel }]}
          yAxis={[{ label: dict.reports.charts.fleet.consumptionLabel }]}
          height={300}
        />
      </Paper>
    </Box>
  );
}

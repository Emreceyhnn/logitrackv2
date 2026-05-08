import { Box, Divider, Stack, Typography } from "@mui/material";
import CustomCard from "../../cards/card";
import { BarChart } from "@mui/x-charts";
import { FuelStat } from "@/app/lib/type/overview";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { FuelLogStat } from "@/app/lib/type/overview";
import { useState, useMemo } from "react";
import TimeRangeSelector, { TimeRange } from "../../charts/TimeRangeSelector";

interface FuelByVehicleCardProps {
  logs: FuelLogStat[];
}

const FuelByVehicleCard = ({ logs }: FuelByVehicleCardProps) => {
  const dict = useDictionary();
  const [range, setRange] = useState<TimeRange>("1w");

  const aggregatedValues = useMemo(() => {
    if (!logs) return [];

    const days =
      range === "1w" ? 7 : range === "2w" ? 14 : range === "1m" ? 30 : 180;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0);

    const filteredLogs = logs.filter(
      (log) => new Date(log.date).getTime() >= cutoffDate.getTime()
    );

    const grouped = filteredLogs.reduce((acc, log) => {
      acc[log.plate] = (acc[log.plate] || 0) + log.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([plate, value]) => ({ plate, value }));
  }, [logs, range]);

  if (!logs) return null;

  return (
    <CustomCard
      sx={{
        padding: "0 0 6px 0",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: 2 }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
          {dict.dashboard.overview.fuelConsumption.title}
        </Typography>
        <TimeRangeSelector value={range} onChange={setRange} dict={dict} />
      </Stack>
      <Divider />

      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {aggregatedValues.length === 0 ? (
          <Stack alignItems="center" spacing={2} sx={{ opacity: 0.5 }}>
            <LocalGasStationIcon sx={{ fontSize: 48 }} />
            <Typography variant="body2">
              {dict.dashboard.overview.fuelConsumption.noLogs}
            </Typography>
          </Stack>
        ) : (
          <BarChart
            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
            xAxis={[
              {
                scaleType: "band",
                data: aggregatedValues.map((v) => v.plate),
                tickLabelStyle: {
                  fill: "text.secondary",
                  fontSize: 10,
                },
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: {
                  fill: "text.secondary",
                  fontSize: 12,
                },
              },
            ]}
            series={[
              {
                data: aggregatedValues.map((v) => v.value),
                color: "#f44336",
                valueFormatter: (value: number | null) => `${value || 0} L`,
              },
            ]}
            height={280}
            slotProps={{
              bar: { rx: 4, ry: 4 },
            }}
            sx={{
              "& .MuiChartsLegend-root": { display: "none" },
            }}
          />
        )}
      </Box>
    </CustomCard>
  );
};

export default FuelByVehicleCard;

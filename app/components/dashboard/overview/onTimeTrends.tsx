import { Box, Divider, Stack, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import CustomCard from "../../cards/card";
import { ShipmentDayStat } from "@/app/lib/type/overview";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import TimeRangeSelector, { TimeRange } from "../../charts/TimeRangeSelector";
import { useState, useMemo } from "react";

interface ShipmentVolumeCardProps {
  values: ShipmentDayStat[];
}

const ShipmentVolumeCard = ({ values }: ShipmentVolumeCardProps) => {
  const dict = useDictionary();
  const [range, setRange] = useState<TimeRange>("1w");

  const filteredValues = useMemo(() => {
    if (!values) return [];
    const days =
      range === "1w" ? 7 : range === "2w" ? 14 : range === "1m" ? 30 : 180;
    return values.slice(-days);
  }, [values, range]);

  if (!values) return null;

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
          {dict.dashboard.overview.shipmentVolume.title}
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
        {values.length === 0 ? (
          <Stack alignItems="center" spacing={2} sx={{ opacity: 0.5 }}>
            <ViewTimelineIcon sx={{ fontSize: 48 }} />
            <Typography variant="body2">
              {dict.dashboard.overview.shipmentVolume.noHistory}
            </Typography>
          </Stack>
        ) : (
          <BarChart
            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
            xAxis={[
              {
                scaleType: "band",
                data: filteredValues.map((v) => v.date),
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
                data: filteredValues.map((v) => v.count),
                color: "#ff9800",
                valueFormatter: (value: number | null) =>
                  dict.dashboard.overview.shipmentVolume.shipmentsCount.replace(
                    "{count}",
                    (value || 0).toString()
                  ),
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

export default ShipmentVolumeCard;

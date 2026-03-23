"use client";

import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import CustomCard from "../../cards/card";
import { ShipmentDayStat } from "@/app/lib/type/overview";
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';

interface ShipmentVolumeCardProps {
  values: ShipmentDayStat[];
}

const ShipmentVolumeCard = ({ values }: ShipmentVolumeCardProps) => {
  const theme = useTheme();

  if (!values) return null;

  return (
    <CustomCard sx={{ padding: "0 0 6px 0", height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
        7-Day Shipment Volume
      </Typography>
      <Divider />
      
      <Box sx={{ flexGrow: 1, p: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {values.length === 0 ? (
          <Stack alignItems="center" spacing={2} sx={{ opacity: 0.5 }}>
            <ViewTimelineIcon sx={{ fontSize: 48 }} />
            <Typography variant="body2">No shipment history available</Typography>
          </Stack>
        ) : (
          <BarChart
            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
            xAxis={[{ 
              scaleType: "band", 
              data: values.map(v => v.date),
              tickLabelStyle: { fill: theme.palette.text.secondary, fontSize: 12 }
            }]}
            yAxis={[{
              tickLabelStyle: { fill: theme.palette.text.secondary, fontSize: 12 }
            }]}
            series={[
              { 
                data: values.map(v => v.count),
                color: theme.palette.primary.main,
                valueFormatter: (value: number | null) => `${value || 0} shipments`
              }
            ]}
            height={280}
            slotProps={{
              bar: { rx: 4, ry: 4 }
            }}
            sx={{
              "& .MuiChartsLegend-root": { display: "none" }
            }}
          />
        )}
      </Box>
    </CustomCard>
  );
};

export default ShipmentVolumeCard;

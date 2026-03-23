"use client";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import CustomCard from "../../cards/card";
import { PieChart } from "@mui/x-charts";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

interface ShipmentOnStatusCardProps {
  values: string[];
}

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 24,
  fontWeight: 700,
  pointerEvents: "none"
}));

const StyledSubText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.secondary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 12,
  fontWeight: 600,
  pointerEvents: "none"
}));

function PieCenterLabel({ total }: { total: number }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <>
      <StyledText x={left + width / 2} y={top + height / 2 - 8}>
        {total}
      </StyledText>
      <StyledSubText x={left + width / 2} y={top + height / 2 + 12}>
        Total
      </StyledSubText>
    </>
  );
}

const ShipmentOnStatusCard = ({ values }: ShipmentOnStatusCardProps) => {
  const theme = useTheme();

  if (!values) return null;

  const config: Record<string, { label: string; color: string }> = {
    IN_TRANSIT: { label: "In Transit", color: theme.palette.info.main },
    DELAYED: { label: "Delayed", color: theme.palette.error.main },
    PLANNED: { label: "Planned", color: theme.palette.secondary.main },
    DELIVERED: { label: "Delivered", color: theme.palette.success.main },
    PROCESSING: { label: "Processing", color: theme.palette.warning.main },
    CANCELLED: { label: "Cancelled", color: theme.palette.grey[500] },
  };

  const statusCounts = values.reduce<Record<string, number>>((acc, s) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(statusCounts).map(([key, value], index) => ({
    id: index,
    label: config[key]?.label || key,
    value,
    color: config[key]?.color || theme.palette.grey[300],
  }));

  const total = values.length;

  return (
    <CustomCard sx={{ padding: "0 0 6px 0", height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
        Shipments by Status
      </Typography>
      <Divider />
      
      <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
        {total === 0 ? (
          <Stack alignItems="center" spacing={2} sx={{ opacity: 0.5 }}>
            <LocalShippingIcon sx={{ fontSize: 48 }} />
            <Typography variant="body2">No shipments found</Typography>
          </Stack>
        ) : (
          <Box sx={{ position: "relative", width: "100%", height: 260, display: "flex", justifyContent: "center" }}>
            <PieChart
              series={[
                {
                  data,
                  innerRadius: 60,
                  outerRadius: 100,
                  paddingAngle: 2,
                  cornerRadius: 4,
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: { innerRadius: 50, color: 'gray' },
                },
              ]}
              slotProps={{
                legend: {
                  position: { vertical: "bottom", horizontal: "center" },
                },
              }}
              margin={{ top: 10, bottom: 60, left: 10, right: 10 }}
            >
              <PieCenterLabel total={total} />
            </PieChart>
          </Box>
        )}
      </Box>
    </CustomCard>
  );
};

export default ShipmentOnStatusCard;

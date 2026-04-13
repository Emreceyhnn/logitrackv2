"use client";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import CustomCard from "../../cards/card";
import { PieChart } from "@mui/x-charts";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { useMemo } from "react";

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

function PieCenterLabel({ total, label }: { total: number; label: string }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <>
      <StyledText x={left + width / 2} y={top + height / 2 - 8}>
        {total}
      </StyledText>
      <StyledSubText x={left + width / 2} y={top + height / 2 + 12}>
        {label}
      </StyledSubText>
    </>
  );
}

const ShipmentOnStatusCard = ({ values }: ShipmentOnStatusCardProps) => {
  const dict = useDictionary();
  const theme = useTheme();

  const data = useMemo(() => {
    if (!values) return [];

    const config: Record<string, { label: string; color: string }> = {
      IN_TRANSIT: { label: dict.shipments.statuses.IN_TRANSIT, color: theme.palette.info.main },
      DELAYED: { label: dict.shipments.statuses.DELAYED, color: theme.palette.error.main },
      PLANNED: { label: dict.shipments.statuses.PENDING, color: theme.palette.secondary.main },
      DELIVERED: { label: dict.shipments.statuses.DELIVERED, color: theme.palette.success.main },
      PROCESSING: { label: dict.shipments.statuses.PROCESSING, color: theme.palette.warning.main },
      CANCELLED: { label: dict.shipments.statuses.CANCELLED, color: theme.palette.grey[500] },
    };

    const statusCounts = values.reduce<Record<string, number>>((acc, s) => {
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([key, value], index) => ({
      id: index,
      label: config[key]?.label || key,
      value,
      color: config[key]?.color || theme.palette.grey[300],
    }));
  }, [values, dict, theme]);

  if (!values) return null;
  const total = values.length;

  return (
    <CustomCard sx={{ padding: "0 0 6px 0", height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography sx={{ fontSize: 18, fontWeight: 600, p: 2 }}>
        {dict.dashboard.overview.shipmentsByStatus.title}
      </Typography>
      <Divider />
      
      <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
        {total === 0 ? (
          <Stack alignItems="center" spacing={2} sx={{ opacity: 0.5 }}>
            <LocalShippingIcon sx={{ fontSize: 48 }} />
            <Typography variant="body2">{dict.dashboard.overview.shipmentsByStatus.noShipments}</Typography>
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
              <PieCenterLabel total={total} label={dict.dashboard.overview.shipmentsByStatus.total} />
            </PieChart>
          </Box>
        )}
      </Box>
    </CustomCard>
  );
};

export default ShipmentOnStatusCard;

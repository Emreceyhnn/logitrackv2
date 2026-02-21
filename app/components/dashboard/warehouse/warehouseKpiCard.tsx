"use client";
import { Card, Stack, Typography, useTheme, Skeleton } from "@mui/material";
import { WarehouseKpiCardProps } from "@/app/lib/type/warehouse";

const WarehouseKpiCard = ({ stats, loading }: WarehouseKpiCardProps) => {
  const theme = useTheme();

  if (loading || !stats) {
    return (
      <Stack direction={"row"} spacing={2} sx={{ width: "100%" }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={100}
            sx={{ flex: 1, borderRadius: "12px" }}
          />
        ))}
      </Stack>
    );
  }

  const kpiItems = [
    { label: "WAREHOUSES", value: stats.totalWarehouses },
    { label: "INVENTORY SKUS", value: stats.totalSkus.toLocaleString() },
    {
      label: "TOTAL PALLETS",
      value: stats.totalCapacityPallets.toLocaleString(),
    },
    {
      label: "TOTAL VOLUME (M³)",
      value: stats.totalCapacityVolume.toLocaleString(),
    },
  ];

  return (
    <Stack direction={"row"} spacing={2} sx={{ width: "100%" }}>
      {kpiItems.map((item, index) => (
        <Card
          key={index}
          sx={{
            backgroundColor: theme.palette.background.paper,
            backgroundImage: "none",
            borderRadius: "12px",
            p: 3,
            flex: 1,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Stack spacing={1}>
            <Typography
              variant="overline"
              color="text.secondary"
              fontWeight={600}
              sx={{ letterSpacing: 1 }}
            >
              {item.label}
            </Typography>
            <Typography variant="h4" fontWeight={600}>
              {item.value}
            </Typography>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};

export default WarehouseKpiCard;

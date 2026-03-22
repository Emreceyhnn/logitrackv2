"use client";
import { useTheme, Box, Stack } from "@mui/material";
import { WarehouseKpiCardProps } from "@/app/lib/type/warehouse";
import { Warehouse, Inventory } from "@mui/icons-material";
import StatCard from "../../cards/StatCard";
import KpiSkeleton from "@/app/components/skeletons/KpiSkeleton";

const WarehouseKpiCard = ({
  stats,
  loading = false,
}: WarehouseKpiCardProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  if (loading || !stats) {
    return <KpiSkeleton count={4} />;
  }

  const values = stats;

  const kpiItems = [
    {
      label: "WAREHOUSES",
      value: values.totalWarehouses,
      icon: <Warehouse />,
      color: theme.palette.primary.main,
    },
    {
      label: "INVENTORY SKUS",
      value: values.totalSkus.toLocaleString(),
      icon: <Inventory />,
      color: theme.palette.info.main,
    },
    {
      label: "TOTAL PALLETS",
      value: values.totalCapacityPallets.toLocaleString(),
      icon: <Inventory />,
      color: theme.palette.warning.main,
    },
    {
      label: "TOTAL VOLUME (M³)",
      value: values.totalCapacityVolume.toLocaleString(),
      icon: <Inventory />,
      color: theme.palette.success.main,
    },
  ];

  return (
    <Stack direction="row" flexWrap="wrap" gap={2} mt={2}>
      {kpiItems.map((item, index) => (
        <Box
          key={index}
          sx={{
            width: {
              xs: "100%",
              sm: "calc(50% - 8px)",
              md: "calc(25% - 12px)",
            },
          }}
        >
          <StatCard
            title={item.label}
            value={item.value}
            icon={item.icon}
            color={item.color}
            sx={{ height: "100%" }}
          />
        </Box>
      ))}
    </Stack>
  );
};

export default WarehouseKpiCard;

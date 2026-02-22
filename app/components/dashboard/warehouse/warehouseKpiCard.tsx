"use client";
import { Stack, useTheme } from "@mui/material";
import { WarehouseKpiCardProps } from "@/app/lib/type/warehouse";
import { Warehouse, Inventory } from "@mui/icons-material";
import StatCard from "../../cards/StatCard";

const WarehouseKpiCard = ({ stats }: WarehouseKpiCardProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  const values = stats || {
    totalWarehouses: 0,
    totalSkus: 0,
    totalCapacityPallets: 0,
    totalCapacityVolume: 0,
  };

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
    <Stack
      direction={"row"}
      flexWrap="wrap"
      gap={2}
      mt={2}
      justifyContent={"center"}
    >
      {kpiItems.map((item, index) => (
        <Stack
          key={index}
          flexBasis={{ xs: "100%", sm: "48%", md: "23%" }}
          flexGrow={1}
        >
          <StatCard
            title={item.label}
            value={item.value}
            icon={item.icon}
            color={item.color}
          />
        </Stack>
      ))}
    </Stack>
  );
};

export default WarehouseKpiCard;

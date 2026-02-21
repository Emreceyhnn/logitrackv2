"use client";

import {
  Card,
  Stack,
  Typography,
  useTheme,
  Box,
  alpha,
  Skeleton,
} from "@mui/material";
import StatCard from "../../cards/StatCard";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { InventoryWithRelations } from "@/app/lib/type/inventory";

interface InventoryKPIProps {
  items: InventoryWithRelations[];
  loading?: boolean;
}

const InventoryKPI = ({ items, loading = false }: InventoryKPIProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  /* ---------------------------------- datas --------------------------------- */
  const totalItems = items.length;
  const lowStockItems = items.filter(
    (item) => item.quantity > 0 && item.quantity <= item.minStock
  ).length;
  const outOfStockItems = items.filter((item) => item.quantity === 0).length;

  const totalValue = 0;

  const kpiItems = [
    {
      label: "TOTAL ITEMS",
      value: totalItems.toLocaleString(),
      icon: <InventoryIcon fontSize="medium" />,
      color: theme.palette.primary.main,
    },
    {
      label: "LOW STOCK",
      value: lowStockItems.toLocaleString(),
      icon: <WarningIcon fontSize="medium" />,
      color: theme.palette.warning.main,
    },
    {
      label: "OUT OF STOCK",
      value: outOfStockItems.toLocaleString(),
      icon: <ErrorIcon fontSize="medium" />,
      color: theme.palette.error.main,
    },
    {
      label: "TOTAL VALUE",
      value: new Intl.NumberFormat("en-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
      }).format(totalValue),
      icon: <AttachMoneyIcon fontSize="medium" />,
      color: theme.palette.success.main,
    },
  ];

  if (loading) {
    return (
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ width: "100%", mb: 3 }}
      >
        {Array.from(new Array(4)).map((_, index) => (
          <Box key={index} sx={{ flex: 1 }}>
            <Skeleton variant="rounded" height={100} sx={{ borderRadius: 2 }} />
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      sx={{ width: "100%", mb: 3 }}
    >
      {kpiItems.map((item, index) => (
        <StatCard
          key={index}
          title={item.label}
          value={item.value}
          icon={item.icon}
          color={item.color}
        />
      ))}
    </Stack>
  );
};

export default InventoryKPI;

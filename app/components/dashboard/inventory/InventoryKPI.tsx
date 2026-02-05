"use client";

import { Card, Stack, Typography, useTheme, Box, alpha } from "@mui/material";
import StatCard from "../../cards/StatCard";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  onHand: number;
  unitPrice: number;
  status: string;
  warehouseCodes: string[];
  lastUpdated: string;
  reorderPoint: number;
}

interface InventoryKPIProps {
  items: InventoryItem[];
}

const InventoryKPI = ({ items }: InventoryKPIProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  /* ---------------------------------- datas --------------------------------- */
  const totalItems = items.length;
  const lowStockItems = items.filter(
    (item) => item.status === "LOW_STOCK"
  ).length;
  const outOfStockItems = items.filter(
    (item) => item.status === "OUT_OF_STOCK"
  ).length;
  const totalValue = items.reduce(
    (acc, item) => acc + item.onHand * item.unitPrice,
    0
  );

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

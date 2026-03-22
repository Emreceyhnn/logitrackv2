"use client";

import { Box, useTheme } from "@mui/material";
import StatCard from "../../cards/StatCard";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { InventoryWithRelations } from "@/app/lib/type/inventory";
import KpiSkeleton from "@/app/components/skeletons/KpiSkeleton";
import { motion } from "framer-motion";

interface InventoryKPIProps {
  items: InventoryWithRelations[];
  loading?: boolean;
}

const InventoryKPI = ({ items, loading = false }: InventoryKPIProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  if (loading) {
    return <KpiSkeleton count={4} />;
  }

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
      color: "#f59e0b", // Amber
      trend: lowStockItems > 0 ? { value: lowStockItems, isUp: true } : undefined
    },
    {
      label: "OUT OF STOCK",
      value: outOfStockItems.toLocaleString(),
      icon: <ErrorIcon fontSize="medium" />,
      color: theme.palette.error.main,
      trend: outOfStockItems > 0 ? { value: outOfStockItems, isUp: true } : undefined
    },
    {
      label: "TOTAL VALUE",
      value: new Intl.NumberFormat("en-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
      }).format(totalValue),
      icon: <AttachMoneyIcon fontSize="medium" />,
      color: "#10b981", // Emerald
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Box
      component={motion.div}
      variants={container}
      initial="hidden"
      animate="show"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "stretch", // Ensure equal height in rows
        gap: 3,
        mt: 3,
        mb: 3,
        width: "100%",
        "& > *": {
          flex: {
            xs: "1 1 calc(100% - 24px)",
            sm: "1 1 calc(50% - 24px)",
            md: "1 1 calc(25% - 24px)",
          },
          display: "flex", // Support StatCard stretching
        }
      }}
    >
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
            trend={item.trend}
          />
        </Box>
      ))}
    </Box>
  );
};

export default InventoryKPI;

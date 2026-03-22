"use client";
import { Box, useTheme } from "@mui/material";
import { WarehouseKpiCardProps } from "@/app/lib/type/warehouse";
import { 
  Warehouse, 
  Inventory2, 
  ListAlt, 
  Storage, 
  Category 
} from "@mui/icons-material";
import StatCard from "../../cards/StatCard";
import KpiSkeleton from "@/app/components/skeletons/KpiSkeleton";
import { motion } from "framer-motion";

const WarehouseKpiCard = ({ stats, loading = false }: WarehouseKpiCardProps) => {
  const theme = useTheme();

  if (loading || !stats) {
    return <KpiSkeleton count={5} />;
  }

  const values = stats;

  const kpiItems = [
    {
      label: "TOTAL WAREHOUSES",
      value: values.totalWarehouses,
      icon: <Warehouse />,
      color: theme.palette.primary.main, // Blue
      trend: { value: 2, isUp: true }
    },
    {
      label: "INVENTORY SKUS",
      value: values.totalSkus.toLocaleString(),
      icon: <Inventory2 />,
      color: "#06b6d4", // Cyan
      trend: { value: 12, isUp: true }
    },
    {
      label: "TOTAL ITEMS",
      value: values.totalItems.toLocaleString(),
      icon: <ListAlt />,
      color: "#8b5cf6", // Violet
      trend: { value: 8, isUp: true }
    },
    {
      label: "PALLET CAPACITY",
      value: values.totalCapacityPallets.toLocaleString(),
      icon: <Category />,
      color: "#f59e0b", // Amber
      trend: { value: 5, isUp: true }
    },
    {
      label: "STOCKED VOLUME",
      value: `${values.totalCapacityVolume.toLocaleString()} M³`,
      icon: <Storage />,
      color: "#10b981", // Emerald
      trend: { value: 15, isUp: true }
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
        width: "100%",
        "& > *": {
          flex: {
            xs: "1 1 calc(100% - 24px)",
            sm: "1 1 calc(50% - 24px)",
            lg: "1 1 calc(20% - 24px)",
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
            sx={{ height: "100%" }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default WarehouseKpiCard;

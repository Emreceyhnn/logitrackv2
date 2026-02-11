"use client";
import { Card, Stack, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { getWarehouseStats } from "@/app/lib/controllers/warehouse";

const WarehouseKpiCard = () => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  const [stats, setStats] = useState({
    totalWarehouses: 0,
    totalSkus: 0,
    totalItems: 0,
    totalCapacityPallets: 0,
    totalCapacityVolume: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const COMPANY_ID = 'cmlgt985b0003x0cuhtyxoihd';
      const USER_ID = 'usr_001';
      try {
        const data = await getWarehouseStats(COMPANY_ID, USER_ID);
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);


  const kpiItems = [
    { label: "WAREHOUSES", value: stats.totalWarehouses },
    { label: "INVENTORY SKUS", value: stats.totalSkus.toLocaleString() },
    { label: "TOTAL PALLETS", value: stats.totalCapacityPallets.toLocaleString() },
    { label: "TOTAL VOLUME (M³)", value: stats.totalCapacityVolume.toLocaleString() },
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

"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab, CircularProgress } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import InventoryIcon from "@mui/icons-material/Inventory";

import ShipmentCharts from "@/app/components/dashboard/reports/ShipmentCharts";
import FleetCharts from "@/app/components/dashboard/reports/FleetCharts";
import InventoryCharts from "@/app/components/dashboard/reports/InventoryCharts";
import ReportSummaryCards from "@/app/components/dashboard/reports/ReportSummaryCards";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ReportsPage() {
  /* --------------------------------- states --------------------------------- */
  const [value, setValue] = useState(0);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const COMPANY_ID = 'cmlgt985b0003x0cuhtyxoihd';
      const USER_ID = 'usr_001';
      try {
        const result = await import("@/app/lib/controllers/reports").then(mod => mod.getReportsData(COMPANY_ID));
        setData(result);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [])

  /* -------------------------------- handlers -------------------------------- */
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{ mb: 1, letterSpacing: "-0.02em" }}
        >
          Operational Reports
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight={400}>
          Data-driven insights for shipments, fleet, and inventory
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="report tabs"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              minHeight: 48,
            },
          }}
        >
          <Tab
            icon={<LocalShippingIcon />}
            iconPosition="start"
            label="Shipment Analytics"
          />
          <Tab
            icon={<DirectionsCarIcon />}
            iconPosition="start"
            label="Fleet Efficiency"
          />
          <Tab
            icon={<InventoryIcon />}
            iconPosition="start"
            label="Inventory Valuation"
          />
        </Tabs>
      </Box>

      <ReportSummaryCards tabIndex={value} metrics={data?.metrics} />

      <Box sx={{ mt: 2 }}>
        <CustomTabPanel value={value} index={0}>
          <ShipmentCharts data={data?.shipments} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <FleetCharts data={data?.fleet} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <InventoryCharts data={data?.inventory?.categoryStats} />
        </CustomTabPanel>
      </Box>
    </Box>
  );
}

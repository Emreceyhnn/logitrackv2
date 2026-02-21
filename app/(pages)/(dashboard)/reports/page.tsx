"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import InventoryIcon from "@mui/icons-material/Inventory";

import ShipmentCharts from "@/app/components/dashboard/reports/ShipmentCharts";
import FleetCharts from "@/app/components/dashboard/reports/FleetCharts";
import InventoryCharts from "@/app/components/dashboard/reports/InventoryCharts";
import ReportSummaryCards from "@/app/components/dashboard/reports/ReportSummaryCards";
import { getReportsDataAction } from "@/app/lib/controllers/reports";
import { ReportsPageState } from "@/app/lib/type/reports";

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
  const [state, setState] = useState<ReportsPageState>({
    data: null,
    loading: true,
    error: null,
    tabIndex: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getReportsDataAction();
        setState((prev) => ({ ...prev, data: result, loading: false }));
      } catch (error: any) {
        console.error("Failed to fetch reports:", error);
        setState((prev) => ({ ...prev, loading: false, error: error.message }));
      }
    };
    fetchData();
  }, []);

  /* -------------------------------- handlers -------------------------------- */
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setState((prev) => ({ ...prev, tabIndex: newValue }));
  };

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
          value={state.tabIndex}
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

      {state.data && (
        <ReportSummaryCards
          tabIndex={state.tabIndex}
          metrics={state.data.metrics}
        />
      )}

      <Box sx={{ mt: 2 }}>
        <CustomTabPanel value={state.tabIndex} index={0}>
          {state.data && <ShipmentCharts data={state.data.shipments} />}
        </CustomTabPanel>
        <CustomTabPanel value={state.tabIndex} index={1}>
          {state.data && <FleetCharts data={state.data.fleet} />}
        </CustomTabPanel>
        <CustomTabPanel value={state.tabIndex} index={2}>
          {state.data && (
            <InventoryCharts data={state.data.inventory.categoryStats} />
          )}
        </CustomTabPanel>
      </Box>
    </Box>
  );
}

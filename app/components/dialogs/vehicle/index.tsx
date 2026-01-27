"use client";

import { Box, Divider, Stack, Tab, Tabs, Typography } from "@mui/material";
import CustomDialog from "../customDialog";
import { Vehicle } from "@/app/lib/type/VehicleType";
import { useState } from "react";
import OverviewTab from "./overviewTab";
import { text } from "stream/consumers";
import DocumentsTab from "./documentsTab";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface VehicleDialogParams {
  open: boolean;
  onClose: () => void;
  vehicleData?: Vehicle;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const getStatusMeta = (status?: string) => {
  switch (status) {
    case "ON_TRIP":
      return { color: "info.main", text: "On Trip" };
    case "AVAILABLE":
      return { color: "success.main", text: "Available" };
    case "IN_SERVICE":
      return { color: "warning.main", text: "In Service" };
    default:
      return { color: "text.primary", text: status ?? "-" };
  }
};

const VehicleDialog = (params: VehicleDialogParams) => {
  const { open, onClose, vehicleData } = params;

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidthData="sm">
      <Stack
        sx={{ padding: 2 }}
        direction={"row"}
        spacing={2}
        alignItems={"center"}
      >
        <Typography
          fontSize={18}
          sx={{
            backgroundColor: "info.main",
            p: 1,
            borderRadius: "8px",
          }}
        >
          {vehicleData?.plate}
        </Typography>
        <Typography fontSize={24} sx={{ flexGrow: 5 }}>
          {vehicleData?.brand} {vehicleData?.model} - {vehicleData?.year}
        </Typography>

        <Stack
          direction={"row"}
          spacing={1}
          alignItems={"center"}
          sx={{ flexGrow: 1 }}
        >
          <Box
            sx={{
              width: 15,
              height: 15,
              borderRadius: "50%",
              backgroundColor: getStatusMeta(vehicleData?.status).color,
            }}
          ></Box>
          <Typography color={getStatusMeta(vehicleData?.status).color}>
            {getStatusMeta(vehicleData?.status).text}
          </Typography>
        </Stack>
      </Stack>
      <Typography sx={{ p: 2 }} color="text.secondary">
        Vehicle ID: {vehicleData?.id}
      </Typography>

      <Divider />
      <Stack>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Item Two" {...a11yProps(1)} />
            <Tab label="Item Three" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <OverviewTab vehicle={vehicleData} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <DocumentsTab vehicle={vehicleData} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
      </Stack>
    </CustomDialog>
  );
};

export default VehicleDialog;

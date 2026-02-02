"use client";

import { Box, Divider, Stack, Tab, Tabs, Typography } from "@mui/material";
import CustomDialog from "../customDialog";
import { Driver } from "@/app/lib/type/DriverType";
import { useState } from "react";
import OverviewTab from "./overviewTab";
import DocumentsTab from "./documentsTab";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface DriverDialogParams {
    open: boolean;
    onClose: () => void;
    driverData?: Driver;
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
        case "ON_DUTY":
            return { color: "success.main", text: "On Duty" };
        case "OFF_DUTY":
            return { color: "text.primary", text: "Off Duty" };
        default:
            return { color: "text.primary", text: status ?? "-" };
    }
};

const DriverDialog = (params: DriverDialogParams) => {
    const { open, onClose, driverData } = params;

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
                    {driverData?.code}
                </Typography>
                <Typography fontSize={24} sx={{ flexGrow: 5 }}>
                    {driverData?.fullName}
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
                            backgroundColor: getStatusMeta(driverData?.status).color,
                        }}
                    ></Box>
                    <Typography color={getStatusMeta(driverData?.status).color}>
                        {getStatusMeta(driverData?.status).text}
                    </Typography>
                </Stack>
            </Stack>
            <Typography sx={{ p: 2 }} color="text.secondary">
                Phone: {driverData?.phone} | Email: {driverData?.email}
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
                        <Tab label="Documents" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <OverviewTab driver={driverData} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <DocumentsTab driver={driverData} />
                </CustomTabPanel>
            </Stack>
        </CustomDialog>
    );
};

export default DriverDialog;

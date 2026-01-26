"use client"

import { Box, Divider, Stack, Tab, Tabs, Typography } from "@mui/material";
import CustomDialog from "../customDialog"
import { Vehicle } from "@/app/lib/type/VehicleType";
import { useState } from "react";
import OverviewPage from "@/app/(pages)/(dashboard)/overview/page";
import OverviewTab from "./overviewTab";


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
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const VehicleDialog = (params: VehicleDialogParams) => {
    const { open, onClose, vehicleData } = params;


    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }

    return (
        <CustomDialog open={open} onClose={onClose} maxWidthData="sm" >
            <Typography fontSize={22} sx={{ padding: 2 }}>{vehicleData?.plate}</Typography>
            <Divider />
            <Stack>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Item One" {...a11yProps(0)} />
                        <Tab label="Item Two" {...a11yProps(1)} />
                        <Tab label="Item Three" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <OverviewTab vehicle={vehicleData} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    Item Two
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    Item Three
                </CustomTabPanel>
            </Stack>

        </CustomDialog>
    )
}


export default VehicleDialog
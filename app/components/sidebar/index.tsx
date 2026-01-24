"use client"
import { Box, Divider, IconButton, Stack, Typography, useTheme } from "@mui/material"
import MonitorIcon from '@mui/icons-material/Monitor';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import KeyboardCommandKeyIcon from '@mui/icons-material/KeyboardCommandKey';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { SidebarList } from "./listItem";
import LogoutIcon from '@mui/icons-material/Logout';


const SideBar = () => {
    /* -------------------------------- variables ------------------------------- */
    const theme = useTheme()


    const sideBarItemsParents = [
        {
            title: "Overview",
            icon: <MonitorIcon sx={{ fontSize: 18, color: theme.palette.icon.secondary }} />
        },
        {
            title: "Operation",
            icon: <PrecisionManufacturingIcon sx={{ fontSize: 18, color: theme.palette.icon.secondary }} />,
            subTitles: [
                "Vehicles",
                "Drivers",
                "Routes",
                "Shipments"
            ]
        },
        {
            title: "Management",
            icon: <KeyboardCommandKeyIcon sx={{ fontSize: 18, color: theme.palette.icon.secondary }} />,
            subTitles: ["Warehouses",
                "Inventory",
                "Customers"]
        },
        {
            title: "Analytics",
            icon: <AnalyticsIcon sx={{ fontSize: 18, color: theme.palette.icon.secondary }} />,
            subTitles: ["Reports",
                "Analytics"]
        },
        {
            title: "Settings",
            icon: <SettingsIcon sx={{ fontSize: 18, color: theme.palette.icon.secondary }} />,
            subTitles: [
                "Users",
                "Roles",
                "Settings",]
        },

    ]

    return (

        <Box sx={{
            position: "fixed",
            top: 0,
            left: 0,
            minWidth: 200,
            height: "100dvh",
            backgroundColor: theme.palette.background.sidebar,
        }}>

            <Stack spacing={1} height={"100%"}>
                <Stack p={3}>
                    <Typography sx={{
                        fontWeight: 800,
                        letterSpacing: "-3%",
                        fontSize: 24,
                        textTransform: "uppercase"
                    }}>Logitrack</Typography>
                </Stack>
                <Divider />


                <Stack justifyContent={"start"} alignItems={"start"} height={"100%"}>
                    <SidebarList items={sideBarItemsParents} />
                    <Stack justifyContent={"start"} px={2} marginTop={"auto"} mb={2} spacing={2}>
                        <IconButton sx={{
                            ":hover": {
                                width: "100%",
                                borderRadius: "8px",
                                backgroundColor: "transparent"
                            },
                            ":active": {
                                width: "100%",
                                borderRadius: "8px",
                                backgroundColor: "transparent"
                            },

                            gap: 1
                        }}>
                            <HelpOutlineIcon sx={{ fontSize: 24, p: 0, color: theme.palette.icon.secondary }} />
                            <Typography>Need Help</Typography>
                        </IconButton>
                        <IconButton sx={{
                            display: "flex",
                            justifyContent: "start",

                            ":hover": {
                                width: "100%",
                                borderRadius: "8px",
                                backgroundColor: "transparent"
                            },
                            ":active": {
                                width: "100%",
                                borderRadius: "8px",
                                backgroundColor: "transparent"
                            },

                            gap: 1
                        }}>
                            <LogoutIcon sx={{ fontSize: 24, p: 0, color: theme.palette.icon.secondary }} />
                            <Typography>Log Out</Typography>
                        </IconButton>
                    </Stack>
                </Stack>

            </Stack>

        </Box>

    )
}


export default SideBar
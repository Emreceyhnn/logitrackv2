"use client";
import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import MonitorIcon from "@mui/icons-material/Monitor";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { SidebarList } from "./listItem";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter, useParams } from "next/navigation";
import { getDictionary } from "@/app/lib/language/language";
import { useMemo } from "react";
import { clearAuthCookies } from "@/app/lib/controllers/session";

const SideBar = () => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const dict = useMemo(() => getDictionary(lang), [lang]);

  const handleLogout = async () => {
    try {
      await clearAuthCookies();
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const sideBarItemsParents = useMemo(() => [
    {
      title: dict.sidebar.overview,
      icon: (
        <MonitorIcon
          sx={{ fontSize: 18, color: theme?.palette?.icon?.secondary }}
        />
      ),
    },
    {
      title: dict.sidebar.operation,
      icon: (
        <PrecisionManufacturingIcon
          sx={{ fontSize: 18, color: theme?.palette?.icon?.secondary }}
        />
      ),
      subTitles: [
        dict.sidebar.vehicles,
        dict.sidebar.drivers,
        dict.sidebar.routes,
        dict.sidebar.shipments
      ],
    },
    {
      title: dict.sidebar.management,
      icon: (
        <KeyboardCommandKeyIcon
          sx={{ fontSize: 18, color: theme?.palette?.icon?.secondary }}
        />
      ),
      subTitles: [
        dict.sidebar.warehouses,
        dict.sidebar.inventory,
        dict.sidebar.customers,
        dict.sidebar.company
      ],
    },
    {
      title: dict.sidebar.analytics,
      icon: (
        <AnalyticsIcon
          sx={{ fontSize: 18, color: theme?.palette?.icon?.secondary }}
        />
      ),
      subTitles: [
        dict.sidebar.reports,
        dict.sidebar.analytics
      ],
    },
  ], [dict, theme]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        minWidth: 200,
        height: "100dvh",
        backgroundColor: theme.palette.background.sidebar,
      }}
    >
      <Stack spacing={1} height={"100%"}>
        <Stack p={3}>
          <Typography
            sx={{
              fontWeight: 800,
              letterSpacing: "-3%",
              fontSize: 24,
              textTransform: "uppercase",
            }}
          >
            {dict.common.logitrack}
          </Typography>
        </Stack>
        <Divider />

        <Stack justifyContent={"start"} alignItems={"start"} height={"100%"}>
          <SidebarList items={sideBarItemsParents} />
          <Stack
            justifyContent={"start"}
            px={2}
            marginTop={"auto"}
            mb={2}
            spacing={2}
          >
            <IconButton
              sx={{
                ":hover": {
                  width: "100%",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                },
                ":active": {
                  width: "100%",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                },

                gap: 1,
              }}
            >
              <HelpOutlineIcon
                sx={{
                  fontSize: 24,
                  p: 0,
                  color: theme?.palette?.icon?.secondary,
                }}
              />
              <Typography>{dict.common.needHelp}</Typography>
            </IconButton>
            <IconButton
              onClick={handleLogout}
              sx={{
                display: "flex",
                justifyContent: "start",

                ":hover": {
                  width: "100%",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                },
                ":active": {
                  width: "100%",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                },

                gap: 1,
              }}
            >
              <LogoutIcon
                sx={{
                  fontSize: 24,
                  p: 0,
                  color: theme?.palette?.icon?.secondary,
                }}
              />
              <Typography>{dict.common.logout}</Typography>
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SideBar;

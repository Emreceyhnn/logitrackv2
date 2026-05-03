"use client";
import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import MonitorIcon from "@mui/icons-material/Monitor";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { SidebarList } from "./listItem";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter, useParams } from "next/navigation";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { useMemo } from "react";
import { clearAuthCookies } from "@/app/lib/controllers/session";
import { getLocalizedPath } from "@/app/lib/language/navigation";

const SideBar = () => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const dict = useDictionary();

  const handleLogout = async () => {
    try {
      await clearAuthCookies();
      const logoutPath = getLocalizedPath("/auth/sign-in", lang);
      router.push(`/${lang}${logoutPath}`);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const sideBarItemsParents = useMemo(
    () => [
      {
        title: dict.sidebar.overview,
        href: "/overview",
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
          { title: dict.sidebar.vehicles, href: "/vehicle" },
          { title: dict.sidebar.drivers, href: "/drivers" },
          { title: dict.sidebar.routes, href: "/routes" },
          { title: dict.sidebar.shipments, href: "/shipments" },
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
          { title: dict.sidebar.warehouses, href: "/warehouses" },
          { title: dict.sidebar.inventory, href: "/inventory" },
          { title: dict.sidebar.customers, href: "/customers" },
          { title: dict.sidebar.company, href: "/company" },
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
          { title: dict.sidebar.reports, href: "/reports" },
          { title: dict.sidebar.analytics, href: "/analytics" },
        ],
      },
    ],
    [dict, theme]
  );

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
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #38bdf8, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/logo.svg"
                alt="LogiTrack"
                width={20}
                height={20}
              />
            </Box>
            <Typography
              sx={{
                fontWeight: 800,
                letterSpacing: "-3%",
                fontSize: 20,
                textTransform: "uppercase",
                color: theme.palette.text.primary,
              }}
            >
              {dict.common.logitrack}
            </Typography>
          </Stack>
        </Stack>
        <Divider />

        <Stack justifyContent={"start"} alignItems={"start"} height={"100%"}>
          <SidebarList items={sideBarItemsParents} lang={lang} />
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

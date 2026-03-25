import { alpha, type PaletteMode } from "@mui/material";

export const palettes = {
  /* -------------------------------- DARKMODE -------------------------------- */
  dark: {
    mode: "dark" as PaletteMode,

    primary: {
      main: "#1ec1f2",
      contrastText: "#161616",
    },

    background: {
      default: "#232323",
      dashboardBg: "#1F1F1F",
      paper: "#121212",
      sidebar: "#121212",
      header: "#161616",
      hoverBg: "rgba(31, 31, 31, 1)",
    },

    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255,255,255,0.5)",
      greenText: "#BEDBB0",
      sideBarText: "#FFFFFF",
    },

    divider: "rgba(255,255,255,0.3)",

    icon: {
      primary: "#BEDBB0",
      secondary: "rgba(255,255,255,0.5)",
    },
    buttonPrimary: {
      buttonBg: "rgba(190, 219, 176, 1)",
      buttonBgHover: "rgba(157, 200, 136, 1)",
      iconColor: "#FFFFFF",
      iconBgColor: "#161616",
      primaryText: "#161616",
    },
    buttonSecondary: {
      buttonBg: "#121212",
      buttonBgHover: "#1212128e",
      iconColor: "#161616",
      iconBg: "#FFFFFF",
      primaryText: "#ffffff",
    },
    logo: {
      color1: "#1F1F1F",
      color2: "#FFFFFF",
      text: "#FFF",
    },
    scroll: {
      color: "rgb(18, 18, 18)",
      hover: "rgba(18, 18, 18,0.5)",
      background: "#2e3234",
    },
  },
  light: {
    mode: "light" as PaletteMode,

    primary: {
      main: "#FF5722", // Premium Orange
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#FFFFFF",
      dashboardBg: "#F9FAFB",
      paper: "#FFFFFF",
      sidebar: "#FFFFFF",
      header: "#FFFFFF",
      hoverBg: alpha("#FF5722", 0.05),
    },

    text: {
      primary: "#1A202C", // Dark Slate
      secondary: "#718096", // Slate Gray
      greenText: "#48BB78",
      sideBarText: "#1A202C",
    },

    divider: "rgba(0,0,0,0.08)",

    icon: {
      primary: "#FF5722",
      secondary: "#718096",
    },

    buttonPrimary: {
      buttonBg: "#FF5722",
      buttonBgHover: "#E64A19",
      iconColor: "#FFFFFF",
      iconBgColor: "rgba(255,255,255,0.2)",
      primaryText: "#FFFFFF",
    },
    buttonSecondary: {
      buttonBg: "#FFFFFF",
      buttonBgHover: "#F7FAFC",
      iconColor: "#FF5722",
      iconBg: alpha("#FF5722", 0.1),
      primaryText: "#FF5722",
    },
    logo: {
      color1: "#FF5722",
      color2: "#1A202C",
      text: "#1A202C",
    },
    scroll: {
      color: "rgba(255, 87, 34, 0.2)",
      hover: "rgba(255, 87, 34, 0.4)",
      background: "#F7FAFC",
    },
  },
};

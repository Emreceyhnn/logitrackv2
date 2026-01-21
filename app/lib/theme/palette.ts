import type { PaletteMode } from "@mui/material";

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
    mode: "dark" as PaletteMode,

    primary: {
      main: "#BEDBB0",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#FFFFFF",
      dashboardBg: "#F6F6F7",
      paper: "#e4e4e4",
      sidebar: "#FFFFFF",
      header: "#FCFCFC",
      hoverBg: "rgba(177, 177, 177, 0.99)",
    },

    text: {
      primary: "#161616",
      secondary: "#161616b3",
      greenText: "#BEDBB0",
      sideBarText: "#161616",
    },

    divider: "rgba(255,255,255,0.3)",

    icon: {
      primary: "#BEDBB0",
      secondary: "#8c8c8c",
    },

    buttonPrimary: {
      buttonBg: "rgba(190, 219, 176, 1)",
      buttonBgHover: "rgba(157, 200, 136, 1)",
      iconColor: "#FFFFFF",
      iconBgColor: "#161616",
      primaryText: "#161616",
    },
    buttonSecondary: {
      buttonBg: "#FFFFFF",
      buttonBgHover: "#ffffff93",
      iconColor: "#FFFFFF",
      iconBg: "#161616",
      primaryText: "#161616",
    },
    logo: {
      color1: "#1F1F1F",
      color2: "#FFFFFF",
      text: "#1F1F1F",
    },
    scroll: {
      color: "rgba(22, 22, 22, 0.1)",
      hover: "rgba(22, 22, 22, 0.2)",
      background: "rgba(232, 232, 232, 1)",
    },
  },
};

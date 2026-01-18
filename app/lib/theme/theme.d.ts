import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    buttonPrimary: {
      buttonBg: string;
      buttonBgHover: string;
      iconColor: string;
      iconBgColor: string;
      primaryText: string;
    };

    buttonSecondary: {
      buttonBg: string;
      buttonBgHover: string;
      iconColor: string;
      iconBg: string;
      primaryText: string;
    };

    icon: {
      primary: string;
      secondary: string;
    };

    logo: {
      color1: string;
      color2: string;
      text: string;
    };

    scroll: {
      color: string;
      hover: string;
      background: string;
    };
  }

  interface PaletteOptions {
    buttonPrimary?: {
      buttonBg: string;
      buttonBgHover: string;
      iconColor: string;
      iconBgColor: string;
      primaryText: string;
    };

    buttonSecondary?: {
      buttonBg: string;
      buttonBgHover: string;
      iconColor: string;
      iconBg: string;
      primaryText: string;
    };

    icon?: {
      primary: string;
      secondary: string;
    };

    logo?: {
      color1: string;
      color2: string;
      text: string;
    };

    scroll?: {
      color: string;
      hover: string;
      background: string;
    };
  }

  /* ======================================================
     BACKGROUND
  ====================================================== */
  interface TypeBackground {
    dashboardBg: string;
    sidebar: string;
    header: string;
    hoverBg: string;
  }

  /* ======================================================
     TEXT
  ====================================================== */
  interface TypeText {
    greenText: string;
    sideBarText: string;
  }

  /* ======================================================
     BREAKPOINT
  ====================================================== */
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    mobile: true;
    xxl: true;
  }
}

import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    dashboardBg?: string;
    sidebar?: string;
    header?: string;
    hoverBg?: string;
  }

  interface TypeText {
    greenText?: string;
    sideBarText?: string;
  }

  interface Palette {
    icon?: {
      primary: string;
      secondary: string;
    };
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

  interface PaletteOptions {
    icon?: {
      primary?: string;
      secondary?: string;
    };
    buttonPrimary?: {
      buttonBg?: string;
      buttonBgHover?: string;
      iconColor?: string;
      iconBgColor?: string;
      primaryText?: string;
    };
    buttonSecondary?: {
      buttonBg?: string;
      buttonBgHover?: string;
      iconColor?: string;
      iconBg?: string;
      primaryText?: string;
    };
    logo?: {
      color1?: string;
      color2?: string;
      text?: string;
    };
    scroll?: {
      color?: string;
      hover?: string;
      background?: string;
    };
  }

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

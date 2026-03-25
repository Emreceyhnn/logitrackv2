import { createTheme, alpha } from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { palettes } from "./palette";

declare module "@mui/material/styles" {
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

  interface BreakpointOverrides {
    mobile: true;
    xxl: true;
  }
}
import { getScrollbarStyles } from "@/app/components/scrollbar";

// import types from types.d.ts if needed, but .d.ts should be global or referenced via triple-slash if not in include path

export type ThemeMode = "light" | "dark";

export const getTheme = (mode: ThemeMode) =>
  createTheme({
    palette: palettes[mode] ?? palettes.dark,

    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
        mobile: 650,
        xxl: 1600,
      },
    },
    typography: {
      fontFamily: "Poppins, Arial, sans-serif",

      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      body1: { fontWeight: 400 },
      body2: { fontWeight: 400 },
      button: {
        fontWeight: 500,
        textTransform: "none",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            ...getScrollbarStyles({ palette: palettes[mode] }),
          },
          "*": {
            ...getScrollbarStyles({ palette: palettes[mode] }),
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      // Date Picker Premium Styling
      MuiPickerPopper: {
        styleOverrides: {
          paper: {
            backgroundColor: "#0B1019",
            backgroundImage: "none",
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            borderRadius: 16,
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            fontSize: "0.875rem",
            color: "rgba(255, 255, 255, 0.7)",
            "&.Mui-selected": {
              backgroundColor: palettes[mode].primary.main,
              color: palettes[mode].primary.contrastText,
              fontWeight: 700,
              "&:hover": {
                backgroundColor: palettes[mode].primary.main,
              },
            },
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
            "&.MuiPickersDay-today": {
              border: `1px solid ${palettes[mode].primary.main}`,
            },
          },
        },
      },
      MuiDateTimePickerToolbar: {
        styleOverrides: {
          root: {
            backgroundColor: "#0B1019",
            "& .MuiTypography-root": {
              color: "#FFFFFF",
            },
          },
        },
      },
      MuiDateTimePickerTabs: {
        styleOverrides: {
          root: {
            backgroundColor: "#0B1019",
            "& .MuiTab-root": {
              color: "rgba(255, 255, 255, 0.5)",
              "&.Mui-selected": {
                color: palettes[mode].primary.main,
              },
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
          size: "small",
        },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.1)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&.Mui-focused fieldset": {
                borderColor: palettes[mode].primary.main,
              },
            },
          },
        },
      },
      // Global Premium Menu Styling
      MuiMenu: {
        styleOverrides: {
          paper: {
            minWidth: 160,
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            border: `1px solid ${alpha("#ffffff", 0.1)}`,
            backgroundColor: alpha("#0B0F19", 0.8),
            backdropFilter: "blur(12px)",
            marginTop: "8px",
          },
          list: {
            padding: "8px",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            marginBottom: "4px",
            padding: "8px 12px",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: palettes[mode].primary.main ? alpha(palettes[mode].primary.main, 0.1) : alpha("#ffffff", 0.05),
            },
            "&.Mui-selected": {
              backgroundColor: palettes[mode].primary.main ? alpha(palettes[mode].primary.main, 0.15) : alpha("#ffffff", 0.1),
              "&:hover": {
                backgroundColor: palettes[mode].primary.main ? alpha(palettes[mode].primary.main, 0.2) : alpha("#ffffff", 0.15),
              },
            },
            "&:last-child": {
              marginBottom: 0,
            },
          },
        },
      },
    },
  });

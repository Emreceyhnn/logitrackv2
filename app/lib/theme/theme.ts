import { createTheme, alpha } from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { palettes } from "./palette";

declare module "@mui/material/styles" {
  interface PaletteColor {
    _alpha: Record<string, string>;
  }
  interface SimplePaletteColorOptions {
    _alpha?: Record<string, string>;
  }

  interface TypeText {
    primary_alpha: Record<string, string>;
    secondary_alpha: Record<string, string>;
    greenText: string;
    sideBarText: string;
    darkBlue: { main: string; _alpha: Record<string, string> };
  }

  interface TypeBackground {
    default_alpha: Record<string, string>;
    paper_alpha: Record<string, string>;
    dashboardBg: string;
    sidebar: string;
    header: string;
    hoverBg: string;
    midnight: { main: string; _alpha: Record<string, string> };
    deepNavy: { main: string; _alpha: Record<string, string> };
    ebony: { main: string; _alpha: Record<string, string> };
  }

  interface CommonColors {
    black_alpha: Record<string, string>;
    white_alpha: Record<string, string>;
  }

  interface Palette {
    divider_alpha: Record<string, string>;
    icon: {
      primary: string;
      secondary: string;
    };
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
    logo: {
      color1: string;
      color2: string;
      text: string;
    };
    kpi: {
      indigo: string;
      sky: string;
      emerald: string;
      amber: string;
      pink: string;
      violet: string;
      cyan: string;
      purple: string;
      slateLight: string;
      slateDark: string;
      slateDeep: string;
      slateDeepest: string;
      slateGray: string;
      lavender: string;
    };
    kpi_alpha: Record<string, Record<string, string>>;
  }

  interface PaletteOptions {
    divider_alpha?: Record<string, string>;
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
    kpi?: {
      indigo?: string;
      sky?: string;
      emerald?: string;
      amber?: string;
      pink?: string;
      violet?: string;
      cyan?: string;
      purple?: string;
      slateLight?: string;
      slateDark?: string;
      slateDeep?: string;
      slateDeepest?: string;
      slateGray?: string;
      lavender?: string;
    };
    kpi_alpha?: Record<string, Record<string, string>>;
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
    palette: (palettes[mode] ?? palettes.dark) as any,

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
            marginBottom: "20px",
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
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            position: "absolute",
            bottom: "-18px",
            marginLeft: "2px",
            fontSize: "0.75rem",
            fontWeight: 400,
            lineHeight: 1,
            whiteSpace: "nowrap",
            "&.Mui-error": {
              color: palettes[mode === "dark" ? "dark" : "light"].error.light,
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
            border: `1px solid ${palettes[mode].common.white_alpha.main_10}`,
            backgroundColor: palettes[mode].background.ebony?._alpha.main_80 || "#0B0F19CC",
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
              backgroundColor: palettes[mode].primary._alpha.main_10 || "rgba(255, 255, 255, 0.05)",
            },
            "&.Mui-selected": {
              backgroundColor: palettes[mode].primary._alpha.main_15 || "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                backgroundColor: palettes[mode].primary._alpha.main_20 || "rgba(255, 255, 255, 0.15)",
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

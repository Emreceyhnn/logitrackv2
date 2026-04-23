import { createTheme, type PaletteOptions } from "@mui/material/styles";
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
      indigo_alpha: Record<string, string>;
      sky: string;
      sky_alpha: Record<string, string>;
      emerald: string;
      emerald_alpha: Record<string, string>;
      amber: string;
      amber_alpha: Record<string, string>;
      pink: string;
      pink_alpha: Record<string, string>;
      violet: string;
      violet_alpha: Record<string, string>;
      cyan: string;
      cyan_alpha: Record<string, string>;
      purple: string;
      purple_alpha: Record<string, string>;
      slateLight: string;
      slateLight_alpha: Record<string, string>;
      slateDark: string;
      slateDark_alpha: Record<string, string>;
      slateDeep: string;
      slateDeep_alpha: Record<string, string>;
      slateDeepest: string;
      slateDeepest_alpha: Record<string, string>;
      slateGray: string;
      slateGray_alpha: Record<string, string>;
      lavender: string;
      lavender_alpha: Record<string, string>;
      teal: string;
      teal_alpha: Record<string, string>;
      deepPurple: string;
      deepPurple_alpha: Record<string, string>;
      error: string;
      error_alpha: Record<string, string>;
    };
    getColorAlpha: (targetColor: string) => Record<string, string>;
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
      indigo_alpha?: Record<string, string>;
      sky?: string;
      sky_alpha?: Record<string, string>;
      emerald?: string;
      emerald_alpha?: Record<string, string>;
      amber?: string;
      amber_alpha?: Record<string, string>;
      pink?: string;
      pink_alpha?: Record<string, string>;
      violet?: string;
      violet_alpha?: Record<string, string>;
      cyan?: string;
      cyan_alpha?: Record<string, string>;
      purple?: string;
      purple_alpha?: Record<string, string>;
      slateLight?: string;
      slateLight_alpha?: Record<string, string>;
      slateDark?: string;
      slateDark_alpha?: Record<string, string>;
      slateDeep?: string;
      slateDeep_alpha?: Record<string, string>;
      slateDeepest?: string;
      slateDeepest_alpha?: Record<string, string>;
      slateGray?: string;
      slateGray_alpha?: Record<string, string>;
      lavender?: string;
      lavender_alpha?: Record<string, string>;
      teal?: string;
      teal_alpha?: Record<string, string>;
      deepPurple?: string;
      deepPurple_alpha?: Record<string, string>;
    };
    getColorAlpha?: (targetColor: string) => Record<string, string>;
  }

  interface BreakpointOverrides {
    mobile: true;
    xxl: true;
  }
}
import { getScrollbarStyles } from "@/app/components/scrollbar";

// import types from types.d.ts if needed, but .d.ts should be global or referenced via triple-slash if not in include path

export type ThemeMode = "light" | "dark";

export const getTheme = (mode: ThemeMode) => {
  const basePalette = (palettes[mode] ?? palettes.dark) as unknown as typeof palettes.dark;

  return createTheme({
    palette: {
      ...basePalette,
      getColorAlpha: (targetColor: string) => {
        const color = targetColor.toLowerCase();
        if (!basePalette || !basePalette.kpi)
          return basePalette?.primary?._alpha || {};
        const kpi = basePalette.kpi;

        // Dynamic KPI mapping: Check if targetColor matches any hex in kpi object
        const kpiEntries = Object.entries(kpi);
        for (const [key, value] of kpiEntries) {
          if (typeof value === "string" && value.toLowerCase() === color) {
            const alphaKey = `${key}_alpha`;
            // @ts-expect-error -- kpi is a strict typed object; dynamic alphaKey access is intentional
            if (kpi[alphaKey]) return kpi[alphaKey];
          }
        }

        // Specific mappings for complex keys / fallbacks
        if (color === "#38bdf8") return kpi.cyan_alpha;
        if (color === "#6366f1") return kpi.indigo_alpha;
        if (color === "#10b981") return kpi.emerald_alpha;
        if (color === "#f59e0b") return kpi.amber_alpha;
        if (color === "#0ea5e9") return kpi.sky_alpha;
        if (color === "#a855f7") return kpi.purple_alpha;
        if (color === "#cbd5f5") return kpi.slateLight_alpha;
        if (color === "#1e293b") return kpi.slateDark_alpha;
        if (color === "#0f172a") return kpi.slateDeep_alpha;
        if (color === "#0b1120") return kpi.slateDeepest_alpha;
        if (color === "#94a3b8") return kpi.slateGray_alpha;
        if (color === "#e2e8f0") return kpi.lavender_alpha;

        // Core Palette Matches
        if (
          basePalette.primary &&
          color === basePalette.primary.main.toLowerCase()
        )
          return basePalette.primary._alpha;
        if (
          basePalette.secondary &&
          color === basePalette.secondary.main.toLowerCase()
        )
          return basePalette.secondary._alpha;
        if (
          basePalette.success &&
          color === basePalette.success.main.toLowerCase()
        )
          return basePalette.success._alpha;
        if (basePalette.error && color === basePalette.error.main.toLowerCase())
          return basePalette.error._alpha;
        if (
          basePalette.warning &&
          color === basePalette.warning.main.toLowerCase()
        )
          return basePalette.warning._alpha;
        if (basePalette.info && color === basePalette.info.main.toLowerCase())
          return basePalette.info._alpha;

        return basePalette.primary?._alpha || {};
      },
    } as PaletteOptions,

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
            backgroundColor: palettes[mode].background.paper,
            backgroundImage: "none",
            border: `1px solid ${palettes[mode].divider}`,
            borderRadius: 16,
            boxShadow: mode === "dark" 
              ? "0 20px 40px rgba(0,0,0,0.4)"
              : "0 20px 40px rgba(0,0,0,0.1)",
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            fontSize: "0.875rem",
            color: palettes[mode].text.secondary,
            "&.Mui-selected": {
              backgroundColor: palettes[mode].primary.main,
              color: palettes[mode].primary.contrastText,
              fontWeight: 700,
              "&:hover": {
                backgroundColor: palettes[mode].primary.main,
              },
            },
            "&:hover": {
              backgroundColor: palettes[mode].action.hover,
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
            backgroundColor: palettes[mode].background.paper,
            "& .MuiTypography-root": {
              color: palettes[mode].text.primary,
            },
          },
        },
      },
      MuiDateTimePickerTabs: {
        styleOverrides: {
          root: {
            backgroundColor: palettes[mode].background.paper,
            "& .MuiTab-root": {
              color: palettes[mode].text.secondary,
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
              backgroundColor: mode === "dark" 
                ? "rgba(255, 255, 255, 0.03)"
                : "rgba(0, 0, 0, 0.01)",
              "& fieldset": {
                borderColor: palettes[mode].divider,
              },
              "&:hover fieldset": {
                borderColor: mode === "dark"
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(0, 0, 0, 0.2)",
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
              color: palettes[mode].error.main,
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
            boxShadow: mode === "dark" 
              ? "0 8px 32px rgba(0,0,0,0.5)"
              : "0 8px 32px rgba(0,0,0,0.1)",
            border: `1px solid ${palettes[mode].divider}`,
            backgroundColor: palettes[mode].background.paper,
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
              backgroundColor:
                palettes[mode].primary._alpha.main_10 ||
                "rgba(255, 255, 255, 0.05)",
            },
            "&.Mui-selected": {
              backgroundColor:
                palettes[mode].primary._alpha.main_15 ||
                "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                backgroundColor:
                  palettes[mode].primary._alpha.main_20 ||
                  "rgba(255, 255, 255, 0.15)",
              },
            },
            "&:last-child": {
              marginBottom: 0,
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            backgroundImage: "none",
            backgroundColor: mode === "dark" 
              ? (palettes.dark.background.midnight?._alpha?.main_85 || "rgba(11, 16, 25, 0.85)")
              : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(24px) saturate(180%)",
            border: `1px solid ${mode === "dark" ? palettes.dark.divider_alpha.main_10 : palettes.light.divider_alpha.main_20}`,
            boxShadow: mode === "dark"
              ? "0 24px 64px rgba(0,0,0,0.6)"
              : "0 24px 64px rgba(0,0,0,0.1)",
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            padding: "24px 24px 16px",
            "\u0026 .MuiTypography-root": {
              fontWeight: 800,
              fontSize: "1.25rem",
              color: palettes[mode].text.primary,
            },
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            padding: "16px 24px 24px",
            color: palettes[mode].text.secondary,
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: "16px 24px 24px",
            gap: "12px",
          },
        },
      },
    },
  });
};

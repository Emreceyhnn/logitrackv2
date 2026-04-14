import { type PaletteMode } from "@mui/material";

export const palettes = {
  /* -------------------------------- DARKMODE -------------------------------- */
  dark: {
    mode: "dark" as PaletteMode,

    primary: {
      main: "#1ec1f2",
      contrastText: "#161616",
      _alpha: {
        main_03: "#1ec1f208",
        main_04: "#1ec1f20A",
        main_05: "#1ec1f20D",
        main_08: "#1ec1f214",
        main_10: "#1ec1f21A",
        main_12: "#1ec1f21F",
        main_15: "#1ec1f226",
        main_18: "#1ec1f22E",
        main_20: "#1ec1f233",
        main_25: "#1ec1f240",
        main_30: "#1ec1f24D",
        main_35: "#1ec1f259",
        main_40: "#1ec1f266",
        main_50: "#1ec1f280",
        main_60: "#1ec1f299",
        main_80: "#1ec1f2CC",
      }
    },

    secondary: {
      main: "#BEDBB0",
      _alpha: {
        main_10: "#BEDBB01A",
        main_20: "#BEDBB033",
      }
    },

    background: {
      default: "#232323",
      default_alpha: {
        main_10: "#2323231A",
        main_20: "#23232333",
        main_40: "#23232366",
        main_60: "#23232399",
        main_98: "#232323FA",
      },
      dashboardBg: "#1F1F1F",
      paper: "#121212",
      paper_alpha: {
        main_02: "#12121205",
        main_03: "#12121208",
        main_05: "#1212120D",
        main_10: "#1212121A",
        main_20: "#12121233",
        main_30: "#1212124D",
        main_40: "#12121266",
        main_50: "#12121280",
        main_60: "#12121299",
        main_70: "#121212B3",
        main_80: "#121212CC",
        main_90: "#121212E6",
      },
      sidebar: "#121212",
      header: "#161616",
      hoverBg: "#1F1F1F",
      midnight: {
          main: "#0B1019",
          _alpha: {
            main_40: "#0B101966",
            main_60: "#0B101999",
            main_80: "#0B1019CC",
            main_85: "#0B1019D9",
            main_95: "#0B1019F2",
          }
      },
      deepNavy: {
          main: "#020617",
          _alpha: {
            main_85: "#020617D9",
          }
      },
      ebony: {
          main: "#0B0F19",
          _alpha: {
            main_80: "#0B0F19CC",
          }
      }
    },

    text: {
      primary: "#FFFFFF",
      primary_alpha: {
        main_02: "#FFFFFF05",
        main_05: "#FFFFFF0D",
        main_10: "#FFFFFF1A",
        main_20: "#FFFFFF33",
        main_30: "#FFFFFF4D",
        main_35: "#FFFFFF59",
        main_40: "#FFFFFF66",
        main_70: "#FFFFFFB3",
        main_80: "#FFFFFFCC",
      },
      secondary: "#FFFFFF80",
      secondary_alpha: {
        main_05: "#FFFFFF0D",
        main_10: "#FFFFFF1A",
        main_20: "#FFFFFF33",
        main_40: "#FFFFFF66",
        main_60: "#FFFFFF99",
        main_70: "#FFFFFFB3",
      },
      greenText: "#BEDBB0",
      sideBarText: "#FFFFFF",
      darkBlue: {
          main: "#1A202C",
          _alpha: {
            main_30: "#1A202C4D",
            main_50: "#1A202C80",
            main_60: "#1A202C99",
            main_80: "#1A202CB3",
          }
      }
    },

    divider: "#FFFFFF4D",
    divider_alpha: {
        main_01: "#FFFFFF03",
        main_02: "#FFFFFF05",
        main_05: "#FFFFFF0D",
        main_10: "#FFFFFF1A",
        main_20: "#FFFFFF33",
        main_50: "#FFFFFF80",
    },

    action: {
      active: "#FFFFFF8A",
      hover: "#FFFFFF14",
      hoverOpacity: 0.08,
      selected: "#FFFFFF29",
      selectedOpacity: 0.16,
      disabled: "#FFFFFF4D",
      disabledBackground: "#FFFFFF1F",
      disabledOpacity: 0.38,
      focus: "#FFFFFF1F",
      focusOpacity: 0.12,
      activatedOpacity: 0.24,
    },

    icon: {
      primary: "#BEDBB0",
      secondary: "#FFFFFF80",
    },
    buttonPrimary: {
      buttonBg: "#BEDBB0",
      buttonBgHover: "#9DC888",
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
      color: "#121212",
      hover: "#12121280",
      background: "#2e3234",
    },
    kpi: {
      indigo: "#6366f1",
      indigo_alpha: { main_10: "#6366f11A", main_20: "#6366f133", main_30: "#6366f14D" },
      sky: "#0ea5e9",
      sky_alpha: { main_20: "#0ea5e933", main_40: "#0ea5e966" },
      emerald: "#10b981",
      emerald_alpha: { main_10: "#10b9811A", main_40: "#10b98166" },
      amber: "#f59e0b",
      amber_alpha: { main_10: "#f59e0b1A" },
      pink: "#ec4899",
      violet: "#8b5cf6",
      cyan: "#38bdf8",
      cyan_alpha: { 
        main_05: "#38bdf80D",
        main_08: "#38bdf814",
        main_10: "#38bdf81A", 
        main_15: "#38bdf826",
        main_16: "#38bdf829",
        main_20: "#38bdf833",
        main_22: "#38bdf838",
        main_24: "#38bdf83D",
        main_25: "#38bdf840",
        main_30: "#38bdf84D", 
        main_35: "#38bdf859",
        main_40: "#38bdf866",
        main_60: "#38bdf899",
        main_80: "#38bdf8CC",
        main_85: "#38bdf8D9",
      },
      purple: "#a855f7",
      purple_alpha: { main_10: "#a855f71A", main_30: "#a855f74D" },
      slateLight: "#cbd5f5",
      slateLight_alpha: {
        main_05: "#cbd5f50D",
        main_10: "#cbd5f51A",
        main_40: "#cbd5f566",
        main_60: "#cbd5f599",
        main_65: "#cbd5f5A6",
        main_70: "#cbd5f5B3",
        main_75: "#cbd5f5BF",
        main_80: "#cbd5f5CC",
        main_85: "#cbd5f5D9",
        main_90: "#cbd5f5E6",
      },
      slateDark: "#1e293b",
      slateDark_alpha: {
        main_20: "#1e293b33",
        main_40: "#1e293b66",
        main_60: "#1e293b99",
        main_65: "#1e293bA6",
        main_70: "#1e293bB3",
      },
      slateDeep: "#0f172a",
      slateDeep_alpha: {
        main_35: "#0f172a59",
        main_40: "#0f172a66",
        main_50: "#0f172a80",
        main_60: "#0f172a99",
        main_90: "#0f172aE6",
      },
      slateDeepest: "#0b1120",
      slateDeepest_alpha: {
        main_50: "#0b112080",
        main_80: "#0b1120CC",
      },
      slateGray: "#94a3b8",
      slateGray_alpha: {
        main_07: "#94a3b812",
        main_15: "#94a3b826",
        main_40: "#94a3b866",
        main_60: "#94a3b899",
        main_70: "#94a3b8B3",
        main_75: "#94a3b8BF",
      },
      lavender: "#e2e8f0",
      lavender_alpha: {
        main_65: "#e2e8f0A6",
        main_70: "#e2e8f0B3",
        main_75: "#e2e8f0BF",
        main_80: "#e2e8f0CC",
        main_85: "#e2e8f0D9",
        main_90: "#e2e8f0E6",
      },
      teal: "#14b8a6",
      teal_alpha: { main_10: "#14b8a61A", main_20: "#14b8a633" },
      deepPurple: "#8b5cf6",
      deepPurple_alpha: { main_10: "#8b5cf61A", main_20: "#8b5cf633" },
    },

    error: {
      main: "#F44336",
      light: "#E57373",
      dark: "#D32F2F",
      _alpha: {
        main_10: "#F443361A",
        main_20: "#F4433633",
        main_30: "#F443364D",
        main_50: "#F4433680",
        main_70: "#F44336B3",
        main_80: "#F44336CC",
      }
    },
    success: {
      main: "#10b981",
      _alpha: {
        main_02: "#10b98105",
        main_05: "#10b9810D",
        main_10: "#10b9811A",
        main_20: "#10b98133",
        main_40: "#10b98166",
      }
    },
    warning: {
      main: "#f59e0b",
      _alpha: {
        main_03: "#f59e0b08",
        main_05: "#f59e0b0D",
        main_10: "#f59e0b1A",
        main_20: "#f59e0b33",
      }
    },
    info: {
      main: "#0ea5e9",
      _alpha: {
        main_03: "#0ea5e908",
        main_10: "#0ea5e91A",
        main_20: "#0ea5e933",
      }
    },
    common: {
        black: "#000000",
        black_alpha: {
            main_04: "#0000000A",
            main_10: "#0000001A",
            main_15: "#00000026",
            main_20: "#00000033",
            main_30: "#0000004D",
            main_35: "#00000059",
            main_40: "#00000066",
            main_50: "#00000080",
            main_55: "#0000008C",
            main_60: "#00000099",
            main_75: "#000000BF",
        },
        white: "#FFFFFF",
        white_alpha: {
            main_01: "#FFFFFF03",
            main_015: "#FFFFFF04",
            main_02: "#FFFFFF05",
            main_03: "#FFFFFF08",
            main_04: "#FFFFFF0A",
            main_05: "#FFFFFF0D",
            main_06: "#FFFFFF0F",
            main_08: "#FFFFFF14",
            main_10: "#FFFFFF1A",
            main_15: "#FFFFFF26",
            main_20: "#FFFFFF33",
            main_25: "#FFFFFF40",
            main_30: "#FFFFFF4D",
            main_35: "#FFFFFF59",
            main_40: "#FFFFFF66",
            main_45: "#FFFFFF73",
            main_50: "#FFFFFF80",
            main_60: "#FFFFFF99",
            main_70: "#FFFFFFB3",
        }
    }
  },

  /* -------------------------------- LIGHTMODE ------------------------------- */
  light: {
    mode: "light" as PaletteMode,

    primary: {
      main: "#FF5722",
      contrastText: "#FFFFFF",
      _alpha: {
        main_03: "#FF572208",
        main_04: "#FF57220A",
        main_05: "#FF57220D",
        main_08: "#FF572214",
        main_10: "#FF57221A",
        main_12: "#FF57221F",
        main_15: "#FF572226",
        main_18: "#FF57222E",
        main_20: "#FF572233",
        main_25: "#FF572240",
        main_30: "#FF57224D",
        main_35: "#FF572259",
        main_40: "#FF572266",
        main_50: "#FF572280",
        main_60: "#FF572299",
        main_80: "#FF5722CC",
      }
    },

    background: {
      default: "#F7FAFC",
      default_alpha: {
        main_10: "#F7FAFC1A",
        main_20: "#F7FAFC33",
        main_40: "#F7FAFC66",
        main_60: "#F7FAFC99",
        main_98: "#F7FAFCFA",
      },
      dashboardBg: "#F7FAFC",
      paper: "#FFFFFF",
      paper_alpha: {
        main_02: "#FFFFFF05",
        main_03: "#FFFFFF08",
        main_05: "#FFFFFF0D",
        main_10: "#FFFFFF1A",
        main_20: "#FFFFFF33",
        main_30: "#FFFFFF4D",
        main_40: "#FFFFFF66",
        main_50: "#FFFFFF80",
        main_60: "#FFFFFF99",
        main_70: "#FFFFFFB3",
        main_80: "#FFFFFFCC",
        main_90: "#FFFFFFE6",
      },
      sidebar: "#FFFFFF",
      header: "#FFFFFF",
      hoverBg: "#FF57220D",
      midnight: {
          main: "#0B1019",
          _alpha: {
            main_40: "#0B101966",
            main_60: "#0B101999",
            main_80: "#0B1019CC",
            main_85: "#0B1019D9",
            main_95: "#0B1019F2",
          }
      },
      deepNavy: {
          main: "#020617",
          _alpha: {
            main_85: "#020617D9",
          }
      },
      ebony: {
          main: "#0B0F19",
          _alpha: {
            main_80: "#0B0F19CC",
          }
      }
    },

    text: {
      primary: "#1A202C",
      primary_alpha: {
        main_02: "#1A202C05",
        main_05: "#1A202C0D",
        main_10: "#1A202C1A",
        main_20: "#1A202C33",
        main_30: "#1A202C4D",
        main_35: "#1A202C59",
        main_40: "#1A202C66",
        main_70: "#1A202CB3",
        main_80: "#1A202CCC",
      },
      secondary: "#718096",
      secondary_alpha: {
        main_05: "#7180960D",
        main_10: "#7180961A",
        main_20: "#71809633",
        main_40: "#71809666",
        main_60: "#71809699",
        main_70: "#718096B3",
      },
      greenText: "#48BB78",
      sideBarText: "#1A202C",
      darkBlue: {
          main: "#1A202C",
          _alpha: {
            main_30: "#1A202C4D",
            main_50: "#1A202C80",
            main_60: "#1A202C99",
            main_80: "#1A202CB3",
          }
      }
    },

    divider: "#00000014",
    divider_alpha: {
        main_01: "#00000003",
        main_02: "#00000005",
        main_05: "#0000000D",
        main_10: "#0000001A",
        main_20: "#00000033",
        main_50: "#00000080",
    },

    action: {
      active: "#0000008A",
      hover: "#0000000A",
      hoverOpacity: 0.04,
      selected: "#00000014",
      selectedOpacity: 0.08,
      disabled: "#00000042",
      disabledBackground: "#0000001F",
      disabledOpacity: 0.38,
      focus: "#0000001F",
      focusOpacity: 0.12,
      activatedOpacity: 0.12,
    },

    icon: {
      primary: "#FF5722",
      secondary: "#718096",
    },

    buttonPrimary: {
      buttonBg: "#FF5722",
      buttonBgHover: "#E64A19",
      iconColor: "#FFFFFF",
      iconBgColor: "#FFFFFF33",
      primaryText: "#FFFFFF",
    },
    buttonSecondary: {
      buttonBg: "#FFFFFF",
      buttonBgHover: "#F7FAFC",
      iconColor: "#FF5722",
      iconBg: "#FF57221A",
      primaryText: "#FF5722",
    },
    logo: {
      color1: "#FF5722",
      color2: "#1A202C",
      text: "#1A202C",
    },
    scroll: {
      color: "#FF572233",
      hover: "#FF572266",
      background: "#F7FAFC",
    },
    kpi: {
      indigo: "#6366f1",
      indigo_alpha: { main_10: "#6366f11A", main_20: "#6366f133", main_30: "#6366f14D" },
      sky: "#0ea5e9",
      sky_alpha: { main_20: "#0ea5e933", main_40: "#0ea5e966" },
      emerald: "#10b981",
      emerald_alpha: { main_10: "#10b9811A", main_40: "#10b98166" },
      amber: "#f59e0b",
      amber_alpha: { main_10: "#f59e0b1A" },
      pink: "#ec4899",
      violet: "#8b5cf6",
      cyan: "#38bdf8",
      cyan_alpha: { 
        main_05: "#38bdf80D",
        main_08: "#38bdf814",
        main_10: "#38bdf81A", 
        main_15: "#38bdf826",
        main_16: "#38bdf829",
        main_20: "#38bdf833",
        main_22: "#38bdf838",
        main_24: "#38bdf83D",
        main_25: "#38bdf840",
        main_30: "#38bdf84D", 
        main_35: "#38bdf859",
        main_40: "#38bdf866",
        main_60: "#38bdf899",
        main_80: "#38bdf8CC",
        main_85: "#38bdf8D9",
      },
      purple: "#a855f7",
      purple_alpha: { main_10: "#a855f71A", main_30: "#a855f74D" },
      slateLight: "#cbd5f5",
      slateLight_alpha: {
        main_05: "#cbd5f50D",
        main_10: "#cbd5f51A",
        main_40: "#cbd5f566",
        main_60: "#cbd5f599",
        main_65: "#cbd5f5A6",
        main_70: "#cbd5f5B3",
        main_75: "#cbd5f5BF",
        main_80: "#cbd5f5CC",
        main_85: "#cbd5f5D9",
        main_90: "#cbd5f5E6",
      },
      slateDark: "#1e293b",
      slateDark_alpha: {
        main_20: "#1e293b33",
        main_40: "#1e293b66",
        main_60: "#1e293b99",
        main_65: "#1e293bA6",
        main_70: "#1e293bB3",
      },
      slateDeep: "#0f172a",
      slateDeep_alpha: {
        main_35: "#0f172a59",
        main_40: "#0f172a66",
        main_50: "#0f172a80",
        main_60: "#0f172a99",
        main_90: "#0f172aE6",
      },
      slateDeepest: "#0b1120",
      slateDeepest_alpha: {
        main_50: "#0b112080",
        main_80: "#0b1120CC",
      },
      slateGray: "#94a3b8",
      slateGray_alpha: {
        main_07: "#94a3b812",
        main_15: "#94a3b826",
        main_40: "#94a3b866",
        main_60: "#94a3b899",
        main_70: "#94a3b8B3",
        main_75: "#94a3b8BF",
      },
      lavender: "#e2e8f0",
      lavender_alpha: {
        main_65: "#e2e8f0A6",
        main_70: "#e2e8f0B3",
        main_75: "#e2e8f0BF",
        main_80: "#e2e8f0CC",
        main_85: "#e2e8f0D9",
        main_90: "#e2e8f0E6",
      },
      teal: "#14b8a6",
      teal_alpha: { main_10: "#14b8a61A", main_20: "#14b8a633" },
      deepPurple: "#8b5cf6",
      deepPurple_alpha: { main_10: "#8b5cf61A", main_20: "#8b5cf633" },
    },

    error: {
      main: "#E53E3E",
      light: "#FC8181",
      dark: "#C53030",
      _alpha: {
        main_10: "#E53E3E1A",
        main_20: "#E53E3E33",
        main_30: "#E53E3E4D",
        main_50: "#E53E3E80",
        main_70: "#E53E3EB3",
        main_80: "#E53E3ECC",
      }
    },
    success: {
      main: "#38A169",
      _alpha: {
        main_02: "#38A16905",
        main_05: "#38A1690D",
        main_10: "#38A1691A",
        main_20: "#38A16933",
        main_40: "#38A16966",
      }
    },
    warning: {
      main: "#D69E2E",
      _alpha: {
        main_03: "#D69E2E08",
        main_05: "#D69E2E0D",
        main_10: "#D69E2E1A",
        main_20: "#D69E2E33",
      }
    },
    info: {
      main: "#3182CE",
      _alpha: {
        main_03: "#3182CE08",
        main_10: "#3182CE1A",
        main_20: "#3182CE33",
      }
    },
    common: {
        black: "#000000",
        black_alpha: {
            main_04: "#0000000A",
            main_10: "#0000001A",
            main_15: "#00000026",
            main_20: "#00000033",
            main_30: "#0000004D",
            main_35: "#00000059",
            main_40: "#00000066",
            main_50: "#00000080",
            main_55: "#0000008C",
            main_60: "#00000099",
            main_75: "#000000BF",
        },
        white: "#FFFFFF",
        white_alpha: {
            main_01: "#FFFFFF03",
            main_015: "#FFFFFF04",
            main_02: "#FFFFFF05",
            main_03: "#FFFFFF08",
            main_04: "#FFFFFF0A",
            main_05: "#FFFFFF0D",
            main_06: "#FFFFFF0F",
            main_08: "#FFFFFF14",
            main_10: "#FFFFFF1A",
            main_15: "#FFFFFF26",
            main_20: "#FFFFFF33",
            main_25: "#FFFFFF40",
            main_30: "#FFFFFF4D",
            main_35: "#FFFFFF59",
            main_40: "#FFFFFF66",
            main_45: "#FFFFFF73",
            main_50: "#FFFFFF80",
            main_60: "#FFFFFF99",
            main_70: "#FFFFFFB3",
        }
    }
  },
};

import { createTheme } from "@mui/material/styles";
import { palettes } from "./palette";
import { getScrollbarStyles } from "@/app/components/scrollbar";

export type ThemeMode = "light" | "dark" | "violet";

export const getTheme = (mode: ThemeMode) =>
  createTheme({
    palette: palettes[mode] ?? palettes.dark,

    breakpoints: {
      values: {
        xs: 0, // mobile
        mobile: 650, // mobile
        sm: 800, // tablet
        md: 1024, // small laptop
        lg: 1280, // desktop
        xl: 1536, // large screens
        xxl: 1700,
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
    }
  });

"use client";

import { Chip, useTheme, type Palette, type PaletteColor } from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { getStatusMeta } from "@/app/lib/priorityColor";

export const StatusChip = ({ status }: { status: string }) => {
  const dict = useDictionary();
  const theme = useTheme();
  const meta = getStatusMeta(status, dict);
  const paletteKey = meta.paletteKey as
    | "info"
    | "success"
    | "warning"
    | "error"
    | "secondary";

  // Determine colors based on paletteKey and mode
  const isLight = theme.palette.mode === "light";

  const colorObj = theme.palette[paletteKey as keyof Palette] as PaletteColor;
  
  // Use custom alpha tokens for background in light mode, or default to meta.color with alpha
  const backgroundColor = isLight
    ? colorObj?._alpha?.main_10 || `${meta.color}1A`
    : colorObj?._alpha?.main_20 || `${meta.color}33`;

  const textColor = colorObj?.main || meta.color;

  const borderColor = isLight
    ? colorObj?._alpha?.main_20 || `${meta.color}33`
    : colorObj?._alpha?.main_40 || `${meta.color}66`;

  return (
    <Chip
      variant="filled"
      size="small"
      label={meta.label}
      sx={{
        borderRadius: "6px",
        height: "22px",
        fontSize: "0.72rem",
        fontWeight: 700,
        backgroundColor: backgroundColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
        textTransform: "uppercase",
        letterSpacing: "0.02em",
        "& .MuiChip-label": {
          px: 1,
        },
      }}
    />
  );
};

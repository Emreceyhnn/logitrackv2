"use client";

import { Chip, useTheme } from "@mui/material";
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

  // Use custom alpha tokens for background in light mode, or default to meta.color with alpha
  const backgroundColor = isLight
    ? (theme.palette as any)[paletteKey]?._alpha?.main_10 || `${meta.color}1A`
    : (theme.palette as any)[paletteKey]?._alpha?.main_20 || `${meta.color}33`;

  const textColor = isLight
    ? (theme.palette as any)[paletteKey]?.main || meta.color
    : (theme.palette as any)[paletteKey]?.main || meta.color;

  const borderColor = isLight
    ? (theme.palette as any)[paletteKey]?._alpha?.main_20 || `${meta.color}33`
    : (theme.palette as any)[paletteKey]?._alpha?.main_40 || `${meta.color}66`;

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

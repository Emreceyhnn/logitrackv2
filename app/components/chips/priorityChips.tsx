import { Chip, useTheme, PaletteColor } from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { getStatusMeta } from "@/app/lib/priorityColor";

export const PriorityChip = ({ status }: { status: string }) => {
  const dict = useDictionary();
  const theme = useTheme();
  const meta = getStatusMeta(status, dict);

  // Safely access the palette color dynamically
  const paletteKey = meta.paletteKey as keyof typeof theme.palette;
  const paletteColor = theme.palette[paletteKey] as PaletteColor;
  
  const statusColor = paletteColor?.main || meta.color;
  const statusAlpha = paletteColor?._alpha || theme.palette.primary._alpha;

  return (
    <Chip
      variant="filled"
      size="small"
      label={meta.label}
      sx={{
        borderRadius: "4px",
        height: "22px",
        fontSize: "0.75rem",
        fontWeight: 600,
        backgroundColor: statusAlpha?.main_10 || "rgba(0,0,0,0.1)",
        color: statusColor,
        border: `1px solid ${statusAlpha?.main_20 || "rgba(0,0,0,0.1)"}`,
        "& .MuiChip-label": {
          px: 1,
        }
      }}
    />
  );
};

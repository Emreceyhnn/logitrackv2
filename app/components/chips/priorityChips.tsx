import { Chip, useTheme } from "@mui/material";

import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { getStatusMeta } from "@/app/lib/priorityColor";

export const PriorityChip = ({ status }: { status: string }) => {
  const dict = useDictionary();
  const theme = useTheme();
  const meta = getStatusMeta(status, dict) as any;

  const statusColor = (theme.palette[meta.paletteKey as keyof typeof theme.palette] as any)?.main || meta.color;
  const statusAlpha = (theme.palette[meta.paletteKey as keyof typeof theme.palette] as any)?._alpha || (theme.palette.primary as any)._alpha;

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
        backgroundColor: statusAlpha.main_10,
        color: statusColor,
        border: `1px solid ${statusAlpha.main_20}`,
        "& .MuiChip-label": {
          px: 1,
        }
      }}
    />
  );
};

import { Chip } from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { getStatusMeta } from "@/app/lib/priorityColor";

export const PriorityChip = ({ status }: { status: string }) => {
  const dict = useDictionary();
  const meta = getStatusMeta(status, dict);
  const paletteKey = meta.paletteKey || "secondary";

  return (
    <Chip
      variant="filled"
      size="small"
      label={meta.label}
      sx={{
        borderRadius: "6px",
        height: "24px",
        fontSize: "0.7rem",
        fontWeight: 800,
        backgroundColor: `${paletteKey}.main`,
        color: "white",
        border: "none",
        textTransform: "uppercase",
        letterSpacing: "0.02em",
        boxShadow: (theme) => `0 2px 8px ${(theme.palette as any)[paletteKey]._alpha.main_30}`,
        "& .MuiChip-label": {
          px: 1,
        },
      }}
    />
  );
};


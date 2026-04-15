import { Chip } from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { getStatusMeta } from "@/app/lib/priorityColor";

export const StatusChip = ({ status }: { status: string }) => {
  const dict = useDictionary();
  const meta = getStatusMeta(status, dict);

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
        backgroundColor: meta.color || "rgba(0,0,0,0.1)",
        color: "theme.palette.primary.text",
        border: `1px solid ${meta.color || "rgba(0,0,0,0.1)"}`,
        "& .MuiChip-label": {
          px: 1,
        },
      }}
    />
  );
};

import { Chip } from "@mui/material";

import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { getStatusMeta } from "@/app/lib/priorityColor";
import { alpha } from "@mui/material";

export const PriorityChip = ({ status }: { status: string }) => {
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
        backgroundColor: alpha(meta.color, 0.1),
        color: meta.color,
        border: `1px solid ${alpha(meta.color, 0.2)}`,
        "& .MuiChip-label": {
          px: 1,
        }
      }}
    />
  );
};

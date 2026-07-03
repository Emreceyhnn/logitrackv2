import React from "react";
import {
  Stack,
  Box,
  Typography,
  Button,
  LinearProgress,
  useTheme,
} from "@mui/material";
import type {
  Task,
  WarehouseWorkerDict,
} from "@/app/lib/type/warehouseWorkerClient";

interface WWTaskRowProps {
  t: Task;
  advanceTask: (id: string) => void;
  ww: WarehouseWorkerDict;
}

export default function WWTaskRow({ t, advanceTask, ww }: WWTaskRowProps) {
  const theme = useTheme();

  const kindMeta: Record<string, { color: string; bg: string }> = {
    PICK: { color: theme.palette.kpi.amber, bg: "rgba(245,158,11,0.14)" },
    PACK: { color: theme.palette.kpi.emerald, bg: "rgba(52,211,153,0.14)" },
    PUT: { color: theme.palette.kpi.cyan, bg: "rgba(56,189,248,0.14)" },
  };

  const km = kindMeta[t.kind];
  const pm =
    t.priority === "high"
      ? { color: "#fca5a5", bg: "rgba(244,67,54,0.14)", label: ww.high }
      : t.priority === "med"
        ? { color: "#fcd34d", bg: "rgba(245,158,11,0.12)", label: ww.med }
        : {
            color: "rgba(255,255,255,0.55)",
            bg: "rgba(255,255,255,0.06)",
            label: ww.low,
          };
  const pct = Math.round((t.done / t.total) * 100);
  const complete = t.done >= t.total;

  return (
    <Stack
      key={t.id}
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{
        p: 2.2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        opacity: complete ? 0.55 : 1,
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ flex: 1, minWidth: 0 }}
      >
        <Box
          sx={{
            color: km.color,
            bgcolor: km.bg,
            px: 1,
            py: 0.5,
            borderRadius: 2,
            fontSize: 10,
            fontWeight: 800,
          }}
        >
          {ww.ui[t.kind] || t.kind}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            noWrap
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {t.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary }}
          >
            {t.order} · {ww.ui.zone} {t.zone}
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ width: 150 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: theme.palette.text.secondary,
            mb: 0.5,
          }}
        >
          <Box>
            {t.done}/{t.total}
          </Box>
          <Box sx={{ color: km.color }}>{pct}%</Box>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{
            height: 5,
            borderRadius: 5,
            bgcolor: "rgba(255,255,255,0.08)",
            "& .MuiLinearProgress-bar": { bgcolor: km.color },
          }}
        />
      </Box>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ width: 150, justifyContent: "flex-end" }}
      >
        <Box
          sx={{
            color: pm.color,
            bgcolor: pm.bg,
            px: 1,
            py: 0.5,
            borderRadius: 1.5,
            fontSize: 9,
            fontWeight: 700,
          }}
        >
          {pm.label}
        </Box>
        <Button
          disabled={complete}
          onClick={() => advanceTask(t.id)}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            color: complete ? theme.palette.kpi.emerald : km.color,
            bgcolor: complete ? "rgba(52,211,153,0.12)" : km.bg,
          }}
        >
          {complete ? ww.ui.doneBtn : ww.ui.advanceBtn}
        </Button>
      </Stack>
    </Stack>
  );
}

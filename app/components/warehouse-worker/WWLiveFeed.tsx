/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Stack, Box, Typography, Card, Avatar, useTheme } from "@mui/material";
import { Movement, I } from "@/app/lib/type/warehouseWorkerClient";
import { Ico } from "./Ico";

export function getMoveMetaFor(type: string, theme: any, ww?: any) {
  const moveMeta: Record<string, { color: string; bg: string; label?: string }> = {
    PICK: { color: theme.palette.kpi.amber, bg: "rgba(245,158,11,0.14)", label: ww?.ui?.PICK || "PICK" },
    PACK: { color: theme.palette.kpi.emerald, bg: "rgba(52,211,153,0.14)", label: ww?.ui?.PACK || "PACK" },
    PUT: { color: theme.palette.kpi.cyan, bg: "rgba(56,189,248,0.14)", label: ww?.ui?.PUT || "PUT" },
    PUTAWAY: { color: theme.palette.kpi.cyan, bg: "rgba(56,189,248,0.14)", label: ww?.ui?.PUTAWAY || "PUT" },
    RESTOCK: { color: theme.palette.kpi.cyan, bg: "rgba(34,211,238,0.14)", label: ww?.ui?.RESTOCK || "RESTOCK" },
    RESTOCK_REQUEST: {
      color: theme.palette.kpi.cyan,
      bg: "rgba(34,211,238,0.14)",
      label: ww?.ui?.RESTOCK_REQUEST || "RESTOCK",
    },
    STOCK_IN: { color: theme.palette.kpi.emerald, bg: "rgba(52,211,153,0.14)", label: ww?.ui?.STOCK_IN || "IN" },
    ADJUSTMENT: { color: theme.palette.kpi.purple, bg: "rgba(139,92,246,0.14)", label: ww?.ui?.ADJUSTMENT || "ADJ" },
  };

  const MOVE_FALLBACK = {
    color: "rgba(255,255,255,0.6)",
    bg: "rgba(255,255,255,0.08)",
  };

  const m = moveMeta[type] ?? MOVE_FALLBACK;
  return {
    color: m.color,
    bg: m.bg,
    label: (moveMeta[type]?.label ?? type).slice(0, 10),
  };
}

interface WWLiveFeedProps {
  fd: Movement[];
  ww: any;
}

export default function WWLiveFeed({ fd, ww }: WWLiveFeedProps) {
  const theme = useTheme();

  return (
    <Card sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}
      >
        <Avatar
          sx={{ bgcolor: `${theme.palette.kpi.purple}1f`, color: theme.palette.kpi.purple, borderRadius: 2 }}
        >
          <Ico d={I.activity} size={19} />
        </Avatar>
        <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
          {ww.ui.liveMovements}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          px: 3,
          py: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          fontSize: 10,
          fontWeight: 800,
          color: theme.palette.text.secondary,
          textTransform: "uppercase",
        }}
      >
        <Box sx={{ width: 90 }}>{ww.ui.type}</Box>
        <Box sx={{ flex: 1 }}>{ww.ui.item}</Box>
        <Box sx={{ width: 80, textAlign: "right" }}>{ww.ui.qty}</Box>
        <Box sx={{ width: 80 }}>{ww.ui.zone}</Box>
        <Box sx={{ width: 120 }}>{ww.ui.by}</Box>
        <Box sx={{ width: 90, textAlign: "right" }}>{ww.ui.time}</Box>
      </Stack>
      <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
        {fd.map((mv) => {
          const mm = getMoveMetaFor(mv.type, theme, ww);
          return (
            <Stack
              key={mv.id}
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{
                px: 3,
                py: 1.5,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box
                sx={{
                  width: 90,
                  textAlign: "center",
                  bgcolor: mm.bg,
                  color: mm.color,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: 10,
                  fontWeight: 800,
                }}
              >
                {mm.label}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: 13, fontWeight: 600 }}>
                  {mv.name}
                </Typography>
                <Typography
                  noWrap
                  sx={{
                    fontSize: 11,
                    fontFamily: "monospace",
                    color: theme.palette.text.secondary,
                  }}
                >
                  {mv.sku}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 80,
                  textAlign: "right",
                  color: mm.color,
                  fontFamily: "monospace",
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                {mv.qty > 0 ? `+${mv.qty}` : mv.qty}
              </Box>
              <Box
                sx={{
                  width: 80,
                  fontSize: 12,
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                }}
              >
                {mv.zone}
              </Box>
              <Box
                sx={{
                  width: 120,
                  fontSize: 12,
                  fontWeight: 600,
                  color: mv.self ? theme.palette.primary.main : theme.palette.text.secondary,
                }}
              >
                {mv.who}
              </Box>
              <Box
                sx={{
                  width: 90,
                  textAlign: "right",
                  fontSize: 12,
                  fontFamily: "monospace",
                  color: theme.palette.text.secondary,
                }}
              >
                {mv.t}
              </Box>
            </Stack>
          );
        })}
      </Box>
    </Card>
  );
}

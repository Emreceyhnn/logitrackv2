"use client";

import {
  Box,
  Stack,
  Typography,
  Card,
  LinearProgress,
  CircularProgress,
  useTheme,
} from "@mui/material";
import type {
  Zone,
  WarehouseWorkerDict,
} from "@/app/lib/type/warehouseWorkerClient";
import { zoneColor } from "@/app/lib/utils/warehouseWorkerUi";

interface WWCapacityViewProps {
  ww: WarehouseWorkerDict;
  zones: Zone[];
  capUsed: number;
  capTotal: number;
  capacityPct: number;
}

export default function WWCapacityView({
  ww,
  zones,
  capUsed,
  capTotal,
  capacityPct,
}: WWCapacityViewProps) {
  const theme = useTheme();
  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
          {ww.ui.siteCapacity}
        </Typography>
        <Typography
          sx={{ fontSize: 13, color: theme.palette.text.secondary, mt: 1 }}
        >
          {capUsed.toLocaleString()} / {capTotal.toLocaleString()}{" "}
          {ww.ui.palletPositionsUsed}
        </Typography>
      </Box>
      <Stack direction="row" spacing={2.5} alignItems="flex-start">
        <Card
          data-tour="ww-capacity-chart"
          sx={{
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: 3,
            p: 3,
            flexShrink: 0,
            width: 320,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ position: "relative", display: "inline-flex", mb: 3 }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={168}
              sx={{ color: "rgba(255,255,255,0.08)" }}
            />
            <CircularProgress
              variant="determinate"
              value={capacityPct}
              size={168}
              sx={{
                color: zoneColor(capacityPct, theme),
                position: "absolute",
                left: 0,
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ fontSize: 38, fontWeight: 900 }}>
                {capacityPct}%
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 800 }}>
            {(capTotal - capUsed).toLocaleString()}
          </Typography>
          <Typography
            sx={{ fontSize: 12, color: theme.palette.text.secondary }}
          >
            {ww.ui.positionsFree}
          </Typography>
        </Card>
        <Card
          data-tour="ww-zone-list"
          sx={{
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: 3,
            p: 3,
            flex: 1,
          }}
        >
          <Stack spacing={2.5}>
            {zones.map((z) => (
              <Box key={z.name}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        bgcolor: zoneColor(z.pct, theme),
                      }}
                    />
                    <Box>
                      {ww.ui.zone} {z.name}
                    </Box>
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: zoneColor(z.pct, theme),
                      fontFamily: "monospace",
                    }}
                  >
                    {z.pct}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={z.pct}
                  sx={{
                    height: 6,
                    borderRadius: 6,
                    bgcolor: "rgba(255,255,255,0.07)",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: zoneColor(z.pct, theme),
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
}

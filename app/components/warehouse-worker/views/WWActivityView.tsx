"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import type {
  Movement,
  WarehouseWorkerDict,
} from "@/app/lib/type/warehouseWorkerClient";
import WWLiveFeed from "../WWLiveFeed";

interface WWActivityViewProps {
  ww: WarehouseWorkerDict;
  feed: Movement[];
}

export default function WWActivityView({ ww, feed }: WWActivityViewProps) {
  const theme = useTheme();
  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
          {ww.ui.liveActivity}
        </Typography>
        <Typography
          sx={{ fontSize: 13, color: theme.palette.text.secondary, mt: 1 }}
        >
          {ww.ui.liveActivitySubtitle}
        </Typography>
      </Box>
      <Box data-tour="ww-activity-feed">
        <WWLiveFeed fd={feed} ww={ww} />
      </Box>
    </Stack>
  );
}

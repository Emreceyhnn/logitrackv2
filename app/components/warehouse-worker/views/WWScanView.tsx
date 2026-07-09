"use client";

import React from "react";
import { Box, Stack, Typography, Card, Avatar, useTheme } from "@mui/material";
import type {
  Movement,
  SkuInfo,
  WarehouseWorkerDict,
} from "@/app/lib/type/warehouseWorkerClient";
import { I } from "@/app/lib/utils/warehouseWorkerUi";
import { Ico } from "../Ico";
import WWScanSection from "../WWScanSection";
import WWLiveFeed from "../WWLiveFeed";

interface WWScanViewProps {
  ww: WarehouseWorkerDict;
  feed: Movement[];
  scanResult: SkuInfo | null;
  scanInput: string;
  setScanInput: (v: string) => void;
  scanQty: number;
  setScanQty: React.Dispatch<React.SetStateAction<number>>;
  doScan: (raw: string) => void;
  simScan: () => void;
  log: (kind: "PICK" | "PACK") => void;
  setScanResult: (v: SkuInfo | null) => void;
}

export default function WWScanView({
  ww,
  feed,
  scanResult,
  scanInput,
  setScanInput,
  scanQty,
  setScanQty,
  doScan,
  simScan,
  log,
  setScanResult,
}: WWScanViewProps) {
  const theme = useTheme();
  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
          {ww.ui.scanLogMovements}
        </Typography>
        <Typography
          sx={{ fontSize: 13, color: theme.palette.text.secondary, mt: 1 }}
        >
          {ww.ui.scanSubtitle}
        </Typography>
      </Box>
      <Stack direction="row" spacing={2.5} alignItems="flex-start">
        <Card
          data-tour="ww-scan-section"
          sx={{
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: 3,
            flex: 1.4,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ p: 2.5 }}
          >
            <Avatar
              sx={{
                bgcolor: `${theme.palette.primary.main}1f`,
                color: theme.palette.primary.main,
                borderRadius: 2,
              }}
            >
              <Ico d={I.scan} size={19} />
            </Avatar>
            <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
              {ww.ui.scanAnItem}
            </Typography>
          </Stack>
          <Box sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
            <WWScanSection
              scanResult={scanResult}
              scanInput={scanInput}
              setScanInput={setScanInput}
              doScan={doScan}
              simScan={simScan}
              scanQty={scanQty}
              setScanQty={setScanQty}
              log={log}
              setScanResult={setScanResult}
              ww={ww}
            />
          </Box>
        </Card>
        <Box sx={{ flex: 1 }}>
          <WWLiveFeed fd={feed} ww={ww} />
        </Box>
      </Stack>
    </Stack>
  );
}

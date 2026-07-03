import React from "react";
import {
  Stack,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import type {
  SkuInfo,
  WarehouseWorkerDict,
} from "@/app/lib/type/warehouseWorkerClient";

interface WWScanSectionProps {
  scanResult: SkuInfo | null;
  scanInput: string;
  setScanInput: (v: string) => void;
  doScan: (raw: string) => void;
  simScan: () => void;
  scanQty: number;
  setScanQty: React.Dispatch<React.SetStateAction<number>>;
  log: (kind: "PICK" | "PACK") => void;
  setScanResult: (v: SkuInfo | null) => void;
  ww: WarehouseWorkerDict;
}

export default function WWScanSection({
  scanResult,
  scanInput,
  setScanInput,
  doScan,
  simScan,
  scanQty,
  setScanQty,
  log,
  setScanResult,
  ww,
}: WWScanSectionProps) {
  const theme = useTheme();

  return (
    <Box sx={{ p: 2.5 }}>
      {!scanResult ? (
        <>
          <Stack direction="row" spacing={1.5}>
            <TextField
              fullWidth
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doScan(scanInput)}
              placeholder={ww.ui.scanPlaceholder}
              variant="outlined"
              sx={{
                input: { color: theme.palette.text.primary },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.04)",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={() => doScan(scanInput)}
              sx={{
                borderRadius: 3,
                bgcolor: theme.palette.primary.main,
                px: 4,
              }}
            >
              {ww.ui.scanBtn}
            </Button>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 1.5 }}
          >
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary }}
            >
              {ww.ui.scanHint}
            </Typography>
            <Button
              size="small"
              onClick={simScan}
              sx={{ textTransform: "none", color: theme.palette.primary.main }}
            >
              {ww.ui.simScan}
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              p: 2,
              bgcolor: "rgba(255,255,255,0.04)",
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  sx={{
                    color: theme.palette.primary.main,
                    fontFamily: "monospace",
                    fontSize: 12,
                  }}
                >
                  {scanResult.sku}
                </Typography>
                <Box
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1.5,
                    bgcolor: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {ww.ui.zone} {scanResult.zone}
                </Box>
              </Stack>
              <Typography
                sx={{
                  mt: 1,
                  fontSize: 18,
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {scanResult.name}
              </Typography>
            </Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ bgcolor: "rgba(0,0,0,0.25)", p: 0.5, borderRadius: 3 }}
            >
              <IconButton
                size="small"
                onClick={() => setScanQty((q) => Math.max(1, q - 1))}
                sx={{ color: "#fff" }}
              >
                −
              </IconButton>
              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: 800,
                  minWidth: 32,
                  textAlign: "center",
                  color: "#fff",
                }}
              >
                {scanQty}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setScanQty((q) => q + 1)}
                sx={{ color: "#fff" }}
              >
                +
              </IconButton>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
            <Button
              fullWidth
              onClick={() => log("PICK")}
              sx={{
                height: 54,
                borderRadius: 3,
                bgcolor: theme.palette.kpi.amber,
                color: "#000",
                fontWeight: 800,
                "&:hover": { bgcolor: theme.palette.kpi.amber },
              }}
            >
              {ww.ui.logPick}
            </Button>
            <Button
              fullWidth
              onClick={() => log("PACK")}
              sx={{
                height: 54,
                borderRadius: 3,
                bgcolor: theme.palette.kpi.emerald,
                color: "#000",
                fontWeight: 800,
                "&:hover": { bgcolor: theme.palette.kpi.emerald },
              }}
            >
              {ww.ui.logPack}
            </Button>
            <IconButton
              onClick={() => setScanResult(null)}
              sx={{
                height: 54,
                width: 54,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.secondary,
              }}
            >
              ×
            </IconButton>
          </Stack>
        </>
      )}
    </Box>
  );
}

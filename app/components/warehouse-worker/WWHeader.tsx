/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import {
  Stack,
  Button,
  Avatar,
  Box,
  Typography,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import { fmtShift } from "@/app/lib/type/warehouseWorkerClient";
import { Ico } from "./Ico";

interface WWHeaderProps {
  ww: any;
  lang: string;
  locked: boolean;
  warehouseId: string;
  setSelectedWarehouseId: (id: string) => void;
  warehouse: { name: string; code: string; city: string };
  warehouseOptions: any[];
  status: { label: string; color: string; action: string };
  shiftSec: number;
  worker: { name: string; initials: string; role: string };
  toggleShift: () => void;
}

export default function WWHeader({
  ww,
  lang,
  locked,
  warehouseId,
  setSelectedWarehouseId,
  warehouse,
  warehouseOptions,
  status,
  shiftSec,
  worker,
  toggleShift,
}: WWHeaderProps) {
  const theme = useTheme();
  const backHref = `/${lang}/overview`;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        height: 78,
        bgcolor: theme.palette.background.sidebar,
        borderBottom: `1px solid ${theme.palette.divider}`,
        px: 3,
        flexShrink: 0,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ minWidth: 0, flex: 1 }}
      >
        {!locked && (
          <Button
            component={Link}
            href={backHref}
            startIcon={<Ico d="M19 12H5M12 19l-7-7 7-7" size={15} />}
            sx={{
              color: theme.palette.text.secondary,
              bgcolor: "rgba(255,255,255,0.05)",
              borderRadius: 3,
              textTransform: "none",
            }}
          >
            {ww.backToPanel}
          </Button>
        )}
        <Avatar
          sx={{
            bgcolor: `${theme.palette.primary.main}1f`,
            color: theme.palette.primary.main,
            borderRadius: 3,
            width: 46,
            height: 46,
          }}
        >
          <Ico d="M3 21h18M4 21V9l8-4 8 4v12M9 21v-6h6v6" size={24} />
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography noWrap sx={{ fontSize: 19, fontWeight: 700 }}>
              {warehouse.name}
            </Typography>
            <Box
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: theme.palette.primary.main,
                bgcolor: `${theme.palette.primary.main}1f`,
                px: 1,
                py: 0.5,
                borderRadius: 2,
              }}
            >
              {warehouse.code}
            </Box>
            {warehouseOptions.length > 1 && (
              <Select
                size="small"
                value={warehouseId}
                onChange={(e) => setSelectedWarehouseId(e.target.value as string)}
                sx={{
                  height: 28,
                  fontSize: 10,
                  color: theme.palette.text.primary,
                  bgcolor: "rgba(255,255,255,0.05)",
                  borderRadius: 2,
                }}
              >
                {warehouseOptions.map((w) => (
                  <MenuItem key={w.id} value={w.id}>
                    {w.code} — {w.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Stack>
          <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
            {warehouse.city} · {ww.ui.aisles}
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button
          onClick={toggleShift}
          sx={{
            color: status.color,
            bgcolor: `${status.color}1f`,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: status.color,
              mr: 1,
            }}
          />
          {status.label}
        </Button>
        <Box
          sx={{
            textAlign: "right",
            borderLeft: `1px solid ${theme.palette.divider}`,
            pl: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 600,
              color: theme.palette.text.secondary,
              textTransform: "uppercase",
            }}
          >
            {ww.ui.onShift}
          </Typography>
          <Typography
            sx={{ fontSize: 18, fontWeight: 600, fontFamily: "monospace" }}
          >
            {fmtShift(shiftSec)}
          </Typography>
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ borderLeft: `1px solid ${theme.palette.divider}`, pl: 2 }}
        >
          <Avatar
            sx={{
              background: "linear-gradient(135deg,#1e293b,#0f172a)",
              border: `1px solid ${theme.palette.divider}`,
              fontWeight: 800,
            }}
          >
            {worker.initials}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
              {worker.name}
            </Typography>
            <Typography
              sx={{ fontSize: 11, color: theme.palette.text.secondary }}
            >
              {worker.role}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

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
import type {
  WarehouseWorkerDict,
  WarehouseOption,
} from "@/app/lib/type/warehouseWorkerClient";
import { Ico } from "./Ico";

interface WWHeaderProps {
  ww: WarehouseWorkerDict;
  lang: string;
  locked: boolean;
  warehouseId: string;
  setSelectedWarehouseId: (id: string) => void;
  warehouse: { name: string; code: string; city: string };
  warehouseOptions: WarehouseOption[];
  worker: { name: string; initials: string; role: string };
}

export default function WWHeader({
  ww,
  lang,
  locked,
  warehouseId,
  setSelectedWarehouseId,
  warehouse,
  warehouseOptions,
  worker,
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
            {warehouseOptions.length > 1 ? (
              <Select
                value={warehouseId}
                onChange={(e) => setSelectedWarehouseId(e.target.value as string)}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "& .MuiSelect-select": {
                    py: 0.5,
                    pl: 0,
                    pr: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.02)", borderRadius: 2 },
                }}
                renderValue={(selected) => {
                  const w = warehouseOptions.find((o) => o.id === selected) || warehouse;
                  return (
                    <>
                      <Typography noWrap sx={{ fontSize: 19, fontWeight: 700 }}>
                        {w.name}
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
                        {w.code}
                      </Box>
                    </>
                  );
                }}
              >
                {warehouseOptions.map((w) => (
                  <MenuItem key={w.id} value={w.id}>
                    <Typography sx={{ fontWeight: 500, mr: 1 }}>{w.name}</Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {w.code}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <>
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
              </>
            )}
          </Stack>
          <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
            {warehouse.city} · {ww.ui.aisles}
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
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

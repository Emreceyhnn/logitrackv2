/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import { Stack, Box, IconButton, useTheme, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { View } from "@/app/lib/type/warehouseWorkerClient";
import { Ico } from "./Ico";

interface WWSidebarProps {
  locked: boolean;
  lang: string;
  view: View;
  setView: (v: View) => void;
  worker: { initials: string };
  status: { color: string };
  NAV: { key: View; title: string; d: string }[];
  onHelpClick?: () => void;
  dict?: any;
}

export default function WWSidebar({
  locked,
  lang,
  view,
  setView,
  worker,
  status,
  NAV,
  onHelpClick,
  dict,
}: WWSidebarProps) {
  const theme = useTheme();
  const backHref = `/${lang}/overview`;

  return (
    <Stack
      data-tour="ww-sidebar"
      sx={{
        width: 86,
        bgcolor: theme.palette.background.sidebar,
        borderRight: `1px solid ${theme.palette.divider}`,
        alignItems: "center",
        py: 2,
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 3,
          background: "linear-gradient(135deg,#38bdf8 0%,#6366f1 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Ico d="M3 21h18M4 21V9l8-4 8 4v12M9 21v-6h6v6" size={22} />
      </Box>
      {NAV.map((n) => {
        const active = view === n.key;
        return (
          <IconButton
            key={n.key}
            onClick={() => setView(n.key)}
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              color: active ? "#fff" : "rgba(255,255,255,0.5)",
              bgcolor: active ? "rgba(56,189,248,0.16)" : "transparent",
            }}
          >
            <Ico d={n.d} />
          </IconButton>
        );
      })}
      {!locked && (
        <IconButton
          component={Link}
          href={backHref}
          sx={{
            mt: "auto",
            width: 48,
            height: 48,
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.03)",
            border: `1px solid ${theme.palette.divider}`,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <Ico d="M19 12H5M12 19l-7-7 7-7" size={20} />
        </IconButton>
      )}
      {onHelpClick && dict && (
        <Tooltip title={dict.common?.needHelp || "Need Help"} arrow placement="right">
          <IconButton
            data-tour="ww-help-btn"
            onClick={onHelpClick}
            sx={{
              mt: locked ? "auto" : 1,
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: "transparent",
              color: "rgba(255,255,255,0.5)",
              ":hover": {
                bgcolor: "rgba(255,255,255,0.08)",
                color: "#fff",
              },
            }}
          >
            <HelpOutlineIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Tooltip>
      )}
      <Box
        sx={{
          position: "relative",
          mt: 1,
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#1e293b,#0f172a)",
          border: `1px solid ${theme.palette.divider}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 800,
          color: "#fff"
        }}
      >
        {worker.initials}
        <Box
          sx={{
            position: "absolute",
            bottom: -1,
            right: -1,
            width: 13,
            height: 13,
            borderRadius: "50%",
            bgcolor: status.color,
            border: `2.5px solid ${theme.palette.background.sidebar}`,
          }}
        />
      </Box>
    </Stack>
  );
}

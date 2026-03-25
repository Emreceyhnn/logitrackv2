"use client";

import React from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  LightMode,
  DarkMode,
  DesktopMac,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeMode } from "@/app/lib/theme/themeContext";
import type { SettingsPageState, SettingsPageActions, AppearanceMode } from "@/app/lib/type/settings";

interface AppearanceTabProps {
  state: SettingsPageState;
  actions: SettingsPageActions;
}

export default function AppearanceTab({ state, actions }: AppearanceTabProps) {
  const theme = useTheme();
  const { setMode } = useThemeMode();

  const modes: { value: AppearanceMode; label: string; icon: React.ElementType; desc: string }[] = [
    { value: "light", label: "Polar", icon: LightMode, desc: "High contrast UI" },
    { value: "dark", label: "Nebula", icon: DarkMode, desc: "Deep space aesthetic" },
    { value: "system", label: "Adaptive", icon: DesktopMac, desc: "Synchronized with OS" },
  ];

  const handleChange = (mode: AppearanceMode) => {
    actions.updateAppearance({ mode });
    if (mode !== "system") setMode(mode);
  };

  return (
    <Stack spacing={3.5}>
      <Box sx={{ 
        p: 2, 
        borderRadius: 2.5, 
        bgcolor: alpha(theme.palette.primary.main, 0.04),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
      }}>
        <Typography variant="caption" sx={{ color: alpha("#fff", 0.45), fontWeight: 550, lineHeight: 1.6 }}>
            The appearance settings dynamically transform the color matrices and surface shaders across the entire LogiTrack application.
        </Typography>
      </Box>

      <Stack direction="row" spacing={2}>
        {modes.map((m) => {
          const active = state.appearance.mode === m.value;
          const Icon = m.icon;
          return (
            <Box
              key={m.value}
              onClick={() => handleChange(m.value)}
              sx={{
                flex: 1,
                p: 2.5,
                borderRadius: 4,
                border: `1.5px solid ${active ? theme.palette.primary.main : alpha("#ffffff", 0.05)}`,
                bgcolor: active ? alpha(theme.palette.primary.main, 0.08) : alpha("#ffffff", 0.02),
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  border: `1.5px solid ${alpha(theme.palette.primary.main, active ? 0.8 : 0.2)}`,
                  bgcolor: alpha(theme.palette.primary.main, active ? 0.1 : 0.04),
                  transform: "translateY(-4px)",
                  boxShadow: `0 12px 32px ${alpha("#000", 0.5)}`
                },
                "&::after": active ? {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "40px",
                    height: "40px",
                    background: `linear-gradient(45deg, transparent 50%, ${alpha(theme.palette.primary.main, 0.1)} 50%)`,
                } : {}
              }}
            >
              <Box
                sx={{
                  width: 44, height: 44, borderRadius: 2.5, mb: 2,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  bgcolor: active ? theme.palette.primary.main : alpha("#ffffff", 0.05),
                  color: active ? "#000" : alpha("#fff", 0.4),
                  transition: "all 0.3s",
                  boxShadow: active ? `0 8px 20px ${alpha(theme.palette.primary.main, 0.4)}` : "none"
                }}
              >
                <Icon sx={{ fontSize: 22 }} />
              </Box>
              <Typography variant="body1" fontWeight={850} color="white" sx={{ mb: 0.5 }}>
                  {m.label}
              </Typography>
              <Typography variant="caption" sx={{ color: alpha("#fff", 0.35), fontWeight: 600, display: "block", mb: 2 }}>
                  {m.desc}
              </Typography>
              
              <AnimatePresence>
                {active && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Chip
                            label="PROJECTION ACTIVE" size="small"
                            icon={<CheckIcon sx={{ fontSize: 13, color: "inherit !important" }} />}
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.15),
                                color: theme.palette.primary.main,
                                fontWeight: 850,
                                fontSize: "0.6rem",
                                height: 22,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                "& .MuiChip-icon": { ml: 0.5 }
                            }}
                        />
                    </motion.div>
                )}
              </AnimatePresence>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}

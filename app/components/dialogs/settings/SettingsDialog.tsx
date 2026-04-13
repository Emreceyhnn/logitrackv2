"use client";

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Divider,
  Tabs,
  Tab,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Language as LanguageIcon,
  NotificationsActive as NotifIcon,
  Contrast as AppearanceIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

import type {
  SettingsPageState,
  SettingsPageActions,
} from "@/app/lib/type/settings";

// Extracted Components
import SettingsHeader from "./components/SettingsHeader";
import RegionalTab from "./components/RegionalTab";
import NotificationsTab from "./components/NotificationsTab";
import AppearanceTab from "./components/AppearanceTab";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SettingsDialog({ open, onClose }: Props) {
  const theme = useTheme();
  const dict = useDictionary();

  const [state, setState] = useState<SettingsPageState>({
    activeTab: 0,
    isLoading: false,
    isSaving: false,
    error: null,
    regional: {
      language: "EN",
      currency: "USD",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
    },
    notifications: {
      emailShipmentUpdates: true,
      emailMaintenanceAlerts: true,
      emailWeeklyReports: false,
      pushNewAssignments: true,
      pushDelayAlerts: true,
    },
    appearance: { mode: "dark" },
  });

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    if (type === "success") toast.success(msg);
    else toast.error(msg);
  }, []);

  const actions: SettingsPageActions = {
    setActiveTab: useCallback(
      (tab) => setState((s) => ({ ...s, activeTab: tab })),
      []
    ),
    updateRegional: useCallback(
      (d) => setState((s) => ({ ...s, regional: { ...s.regional, ...d } })),
      []
    ),
    updateNotifications: useCallback(
      (d) =>
        setState((s) => ({
          ...s,
          notifications: { ...s.notifications, ...d },
        })),
      []
    ),
    updateAppearance: useCallback(
      (d) => setState((s) => ({ ...s, appearance: { ...s.appearance, ...d } })),
      []
    ),
    saveRegional: useCallback(async () => {
      setState((s) => ({ ...s, isSaving: true }));
      await new Promise((r) => setTimeout(r, 600));
      setState((s) => ({ ...s, isSaving: false }));
      showToast("success", dict.settings.dialogs.success.regional);
    }, [showToast, dict.settings.dialogs.success.regional]),
    saveNotifications: useCallback(async () => {
      setState((s) => ({ ...s, isSaving: true }));
      await new Promise((r) => setTimeout(r, 600));
      setState((s) => ({ ...s, isSaving: false }));
      showToast("success", dict.settings.dialogs.success.notifications);
    }, [showToast, dict.settings.dialogs.success.notifications]),
  };

  const tabs = [
    { label: dict.settings.dialogs.tabs.localization, icon: <LanguageIcon sx={{ fontSize: 16 }} /> },
    { label: dict.settings.dialogs.tabs.signals, icon: <NotifIcon sx={{ fontSize: 16 }} /> },
    { label: dict.settings.dialogs.tabs.visualEngine, icon: <AppearanceIcon sx={{ fontSize: 16 }} /> },
  ];

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            bgcolor: alpha("#0B1019", 0.85),
            backdropFilter: "blur(24px) saturate(180%)",
            backgroundImage: "none",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 24px 64px ${alpha("#000", 0.6)}`,
          },
        }}
      >
        <SettingsHeader onClose={onClose} />

        <Box sx={{ px: 3, mt: 2 }}>
          <Tabs
            value={state.activeTab}
            onChange={(_, v) => actions.setActiveTab(v)}
            sx={{
              minHeight: 44,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.82rem",
                minHeight: 44,
                color: alpha("#fff", 0.3),
                gap: 1,
                transition: "all 0.2s",
                "&.Mui-selected": { color: "white" },
                "&:hover": { color: alpha("#fff", 0.6) },
              },
              "& .MuiTabs-indicator": {
                bgcolor: theme.palette.primary.main,
                borderRadius: "3px 3px 0 0",
                height: 3,
                boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.5)}`,
              },
            }}
          >
            {tabs.map((t, i) => (
              <Tab key={i} label={t.label} icon={t.icon} iconPosition="start" />
            ))}
          </Tabs>
          <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.08) }} />
        </Box>

        <DialogContent sx={{ px: 3, pt: 3.5, pb: 4, minHeight: 400 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={state.activeTab}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
            >
              {state.activeTab === 0 && (
                <RegionalTab state={state} actions={actions} />
              )}
              {state.activeTab === 1 && (
                <NotificationsTab state={state} actions={actions} />
              )}
              {state.activeTab === 2 && (
                <AppearanceTab state={state} actions={actions} />
              )}
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}

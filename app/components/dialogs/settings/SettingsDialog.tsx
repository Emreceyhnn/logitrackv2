"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Divider,
  Tabs,
  Tab,
  useTheme,
  
} from "@mui/material";
import {
  Language as LanguageIcon,
  NotificationsActive as NotifIcon,
  Contrast as AppearanceIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { useUserContext } from "@/app/lib/context/UserContext";
import { updateUserRegionalSettings, updateUserNotificationSettings } from "@/app/lib/controllers/users";
import { useRouter, usePathname, useParams } from "next/navigation";
import { getLocalizedPath, getCanonicalPath } from "@/app/lib/language/navigation";
import type {
  SettingsPageState,
  SettingsPageActions,
  CurrencyCode,
  LanguageCode,
  AppearanceMode,
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
  const { user } = useUserContext();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLang = (params?.lang as string) || "tr";

  const [state, setState] = useState<SettingsPageState>({
    activeTab: 0,
    isLoading: false,
    isSaving: false,
    error: null,
    regional: {
      language: currentLang as LanguageCode,
      currency: (user?.currency as CurrencyCode) || "USD",
      timezone: user?.timezone || "UTC",
      dateFormat: user?.dateFormat || "DD/MM/YYYY",
      timeFormat: user?.timeFormat || "24h",
    },
    notifications: {
      emailShipmentUpdates: user?.notifEmailShipment ?? true,
      emailMaintenanceAlerts: user?.notifEmailMaint ?? true,
      emailWeeklyReports: user?.notifEmailWeekly ?? false,
      pushNewAssignments: user?.notifPushAssignment ?? true,
      pushDelayAlerts: user?.notifPushDelay ?? true,
    },
    appearance: { mode: "dark" },
  });

  // Sync user data to state when opening or user changes
  useEffect(() => {
    if (open && user) {
      setState((s) => {
        const newRegional = {
          ...s.regional,
          currency: (user.currency as CurrencyCode) || "USD",
          timezone: user.timezone || "UTC",
          dateFormat: user.dateFormat || "DD/MM/YYYY",
          timeFormat: user.timeFormat || "24h",
        };
        const newNotifications = {
          emailShipmentUpdates: user.notifEmailShipment ?? true,
          emailMaintenanceAlerts: user.notifEmailMaint ?? true,
          emailWeeklyReports: user.notifEmailWeekly ?? false,
          pushNewAssignments: user.notifPushAssignment ?? true,
          pushDelayAlerts: user.notifPushDelay ?? true,
        };

        // Check if we actually need to update to avoid cascading renders
        const needsUpdate = 
          s.regional.currency !== newRegional.currency ||
          s.regional.timezone !== newRegional.timezone ||
          s.notifications.emailShipmentUpdates !== newNotifications.emailShipmentUpdates;

        if (!needsUpdate) return s;

        return {
          ...s,
          regional: newRegional,
          notifications: newNotifications,
        };
      });
    }
  }, [open, user]);

  // Sync theme mode from localStorage
  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem("logitrack-theme-mode");
      if (stored) {
        setState((s) => {
          if (s.appearance.mode === (stored as AppearanceMode)) return s;
          return { ...s, appearance: { mode: stored as AppearanceMode } };
        });
      }
    }
  }, [open]);

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
      try {
        await updateUserRegionalSettings(state.regional);
        
        // Handle Language Redirection if changed
        const newLang = state.regional.language;
        if (newLang !== currentLang) {
          const segments = pathname.split("/");
          const pathWithoutLang = segments.slice(2).join("/");
          const canonical = getCanonicalPath(pathWithoutLang, currentLang);
          const localized = getLocalizedPath(canonical, newLang);
          const newPathname = `/${newLang}${localized}`;

          // Set cookie for persistence
          // eslint-disable-next-line react-hooks/immutability
          document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
          
          router.push(newPathname);
          onClose(); // Close dialog as we are redirecting
        } else {
          router.refresh();
        }

        setState((s) => ({ ...s, isSaving: false }));
        showToast("success", dict.settings.dialogs.success.regional);
      } catch (error) {
        setState((s) => ({ ...s, isSaving: false }));
        showToast("error", "Failed to save settings");
      }
    }, [state.regional, currentLang, pathname, router, onClose, showToast, dict.settings.dialogs.success.regional]),
    saveNotifications: useCallback(async () => {
      setState((s) => ({ ...s, isSaving: true }));
      try {
        await updateUserNotificationSettings(state.notifications);
        setState((s) => ({ ...s, isSaving: false }));
        showToast("success", dict.settings.dialogs.success.notifications);
        router.refresh();
      } catch (error) {
        setState((s) => ({ ...s, isSaving: false }));
        showToast("error", "Failed to save notifications");
      }
    }, [state.notifications, showToast, dict.settings.dialogs.success.notifications, router]),
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
            overflow: "hidden",
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
                color: "text.secondary",
                gap: 1,
                transition: "all 0.2s",
                "&.Mui-selected": { color: "text.primary" },
                "&:hover": { color: "text.primary" },
              },
              "& .MuiTabs-indicator": {
                bgcolor: theme.palette.primary.main,
                borderRadius: "3px 3px 0 0",
                height: 3,
                boxShadow: `0 0 12px ${theme.palette.primary._alpha.main_50}`,
              },
            }}
          >
            {tabs.map((t, i) => (
              <Tab key={i} label={t.label} icon={t.icon} iconPosition="start" />
            ))}
          </Tabs>
          <Divider sx={{ borderColor: theme.palette.divider_alpha.main_08 }} />
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

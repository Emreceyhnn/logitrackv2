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
  
  CircularProgress,
} from "@mui/material";
import { Person as PersonIcon, Lock as LockIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
} from "@/app/lib/actions/profile";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import {
  ProfilePageState,
  ProfilePageActions,
} from "@/app/lib/type/profile";

// Extracted Components
import ProfileHeader from "./components/ProfileHeader";
import ProfileTab from "./components/ProfileTab";
import SecurityTab from "./components/SecurityTab";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProfileDialog({ open, onClose }: Props) {
  const theme = useTheme();
  const dict = useDictionary();

  const [state, setState] = useState<ProfilePageState>({
    user: null,
    activeTab: 0,
    isLoading: true,
    isSaving: false,
    error: null,
    profileForm: {
      name: "",
      surname: "",
      email: "",

      avatarUrl: null,
    },
    passwordForm: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const showToast = useCallback((type: "success" | "error", message: string) => {
    if (type === "success") toast.success(message);
    else toast.error(message);
  }, []);

  const loadProfile = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const p = await getMyProfile();
      setState((s) => ({
        ...s,
        user: {
          ...p,
          lastLoginAt: p.lastLoginAt?.toISOString() ?? null,
          createdAt: p.createdAt.toISOString(),
        },
        profileForm: {
          name: p.name,
          surname: p.surname,
          email: p.email,

          avatarUrl: p.avatarUrl,
        },
        isLoading: false,
      }));
    } catch {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: dict.profile.messages.loadError,
      }));
    }
  }, [dict.profile.messages.loadError]);

  useEffect(() => {
    if (open) loadProfile();
  }, [open, loadProfile]);

  const actions: ProfilePageActions = {
    setActiveTab: useCallback(
      (tab) => setState((s) => ({ ...s, activeTab: tab })),
      []
    ),
    updateProfileForm: useCallback(
      (data) =>
        setState((s) => ({ ...s, profileForm: { ...s.profileForm, ...data } })),
      []
    ),
    updatePasswordForm: useCallback(
      (data) =>
        setState((s) => ({
          ...s,
          passwordForm: { ...s.passwordForm, ...data },
        })),
      []
    ),
    saveProfile: useCallback(async () => {
      setState((s) => ({ ...s, isSaving: true }));
      try {
        const r = await updateMyProfile({
          name: state.profileForm.name,
          surname: state.profileForm.surname,

          avatarUrl: state.profileForm.avatarUrl,
        });
        if ("error" in r) showToast("error", String(r.error));
        else showToast("success", dict.profile.messages.saveSuccess);
      } catch {
        showToast("error", dict.profile.messages.networkError);
      } finally {
        setState((s) => ({ ...s, isSaving: false }));
      }
    }, [state.profileForm, showToast, dict.profile.messages.saveSuccess, dict.profile.messages.networkError]),
    changePassword: useCallback(async () => {
      setState((s) => ({ ...s, isSaving: true }));
      try {
        const r = await changeMyPassword({
          currentPassword: state.passwordForm.currentPassword,
          newPassword: state.passwordForm.newPassword,
        });
        if ("error" in r) showToast("error", String(r.error));
        else {
          showToast("success", dict.profile.messages.passwordSuccess);
          setState((s) => ({
            ...s,
            passwordForm: {
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            },
          }));
        }
      } catch {
        showToast("error", dict.profile.messages.verificationError);
      } finally {
        setState((s) => ({ ...s, isSaving: false }));
      }
    }, [state.passwordForm, showToast, dict.profile.messages.passwordSuccess, dict.profile.messages.verificationError]),
    refresh: loadProfile,
  };

  const tabs = [
    { label: dict.profile.tabs.account, icon: <PersonIcon sx={{ fontSize: 16 }} /> },
    { label: dict.profile.tabs.security, icon: <LockIcon sx={{ fontSize: 16 }} /> },
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
            bgcolor: theme.palette.background.midnight._alpha.main_85,
            backdropFilter: "blur(24px) saturate(180%)",
            backgroundImage: "none",
            border: `1px solid ${theme.palette.divider_alpha.main_10}`,
            boxShadow: `0 24px 64px ${theme.palette.common.black_alpha.main_60}`,
          },
        }}
      >
        <ProfileHeader onClose={onClose} />

        <Box sx={{ px: 3, mt: 2 }}>
          <Tabs
            value={state.activeTab}
            onChange={(_, v) => actions.setActiveTab(v)}
            sx={{
              minHeight: 44,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.85rem",
                minHeight: 44,
                color: theme.palette.common.white_alpha.main_30,
                gap: 1,
                transition: "all 0.2s",
                "&.Mui-selected": { color: "white" },
                "&:hover": { color: theme.palette.common.white_alpha.main_60 },
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

        <DialogContent sx={{ px: 3, pt: 3.5, pb: 4, minHeight: 420 }}>
          {state.isLoading ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={10}
              gap={2}
            >
              <CircularProgress
                size={40}
                thickness={4.5}
                sx={{ color: theme.palette.primary.main }}
              />
              <Box
                sx={{
                  color: theme.palette.common.white_alpha.main_30,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  letterSpacing: 1,
                }}
              >
                {dict.profile.status.synchronizing}
              </Box>
            </Box>
          ) : (
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
                  <ProfileTab state={state} actions={actions} />
                )}
                {state.activeTab === 1 && (
                  <SecurityTab state={state} actions={actions} />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  Stack,
  CircularProgress,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useParams } from "next/navigation";

import { getUserSession, logoutAction } from "@/app/lib/actions/auth";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import LanguageSwitcher from "./LanguageSwitcher";

// Dialogs
import ProfileDialog from "../dialogs/profile/ProfileDialog";
import SettingsDialog from "../dialogs/settings/SettingsDialog";

const menuPaperSx = {
  overflow: "visible",
  filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.4))",
  mt: 1.5,
  borderRadius: 3,
  bgcolor: alpha("#0B1019", 0.95),
  backdropFilter: "blur(12px)",
  border: `1px solid ${alpha("#ffffff", 0.08)}`,
  color: "white",
  padding: "4px",
  "& .MuiMenuItem-root": {
    borderRadius: 1.5,
    mx: 0.5,
    my: 0.25,
    px: 1.5,
    py: 1,
    fontSize: "0.85rem",
    fontWeight: 600,
    transition: "all 0.2s",
    "&:hover": {
      bgcolor: alpha("#fff", 0.05),
    },
  },
  "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    top: 0,
    right: 14,
    width: 10,
    height: 10,
    bgcolor: "#0B1019",
    transform: "translateY(-50%) rotate(45deg)",
    zIndex: 0,
    borderLeft: `1px solid ${alpha("#ffffff", 0.08)}`,
    borderTop: `1px solid ${alpha("#ffffff", 0.08)}`,
  },
};

export default function UserAccountNav() {
  const theme = useTheme();
  const params = useParams();
  const lang = (params?.lang as string) || "tr";
  const dict = useDictionary();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    surname: string;
    avatarUrl: string | null;
  } | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const fetchSession = async () => {
    setLoading(true);
    try {
      const session = await getUserSession();
      setUser(session);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenProfile = () => {
    handleMenuClose();
    setProfileOpen(true);
  };

  const handleOpenSettings = () => {
    handleMenuClose();
    setSettingsOpen(true);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logoutAction();
    window.location.href = `/${lang}`;
  };

  if (loading) {
    return (
      <CircularProgress size={20} sx={{ color: theme.palette.primary.main }} />
    );
  }

  if (!user) return null;

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <LanguageSwitcher />
        <Box
          onClick={handleMenuOpen}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            padding: "6px 12px",
            borderRadius: 3,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            bgcolor: alpha("#fff", 0.02),
            border: `1px solid ${alpha("#fff", 0.03)}`,
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              borderColor: alpha(theme.palette.primary.main, 0.2),
              transform: "translateY(-1px)",
              boxShadow: `0 4px 20px ${alpha("#000", 0.3)}`,
            },
          }}
        >
          <Avatar
            src={user.avatarUrl || undefined}
            sx={{
              width: 32,
              height: 32,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.4)}`,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 800,
              fontSize: "0.75rem",
            }}
          >
            {user.name?.[0]}
            {user.surname?.[0]}
          </Avatar>
          <Stack spacing={-0.5} sx={{ display: { xs: "none", sm: "flex" } }}>
            <Typography
              variant="body2"
              fontWeight={800}
              color="white"
              sx={{ fontSize: "0.85rem" }}
            >
              {user.name} {user.surname}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: alpha("#fff", 0.35),
                fontWeight: 600,
                fontSize: "0.65rem",
              }}
            >
              {dict.sidebar.management}
            </Typography>
          </Stack>
        </Box>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        PaperProps={{ elevation: 0, sx: menuPaperSx }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleOpenProfile} sx={{ gap: 1.5 }}>
          <ListItemIcon sx={{ minWidth: "auto !important" }}>
            <PersonIcon
              fontSize="small"
              sx={{ color: theme.palette.primary.main }}
            />
          </ListItemIcon>
          {dict?.common?.profile || "Profile"}
        </MenuItem>
        <MenuItem onClick={handleOpenSettings} sx={{ gap: 1.5 }}>
          <ListItemIcon sx={{ minWidth: "auto !important" }}>
            <SettingsIcon
              fontSize="small"
              sx={{ color: theme.palette.primary.main }}
            />
          </ListItemIcon>
          {dict.common.settings}
        </MenuItem>
        <Divider sx={{ borderColor: alpha("#ffffff", 0.06), my: 0.5 }} />
        <MenuItem
          onClick={handleLogout}
          sx={{ color: "#f43f5e !important", gap: 1.5 }}
        >
          <ListItemIcon sx={{ minWidth: "auto !important" }}>
            <LogoutIcon fontSize="small" sx={{ color: "inherit" }} />
          </ListItemIcon>
          {dict.common.logout}
        </MenuItem>
      </Menu>

      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}

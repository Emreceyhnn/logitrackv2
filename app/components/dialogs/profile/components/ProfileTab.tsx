"use client";

import React, { useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Avatar,
  Button,
  TextField,
  CircularProgress,
  Chip,
  InputAdornment,
  useTheme,
  alpha,
} from "@mui/material";
import {
  CameraAlt as CameraIcon,
  EmailOutlined as EmailIcon,
  Save as SaveIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import type { ProfilePageState, ProfilePageActions } from "@/app/lib/type/profile";

interface ProfileTabProps {
  state: ProfilePageState;
  actions: ProfilePageActions;
}

export default function ProfileTab({ state, actions }: ProfileTabProps) {
  const theme = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      actions.updateProfileForm({ avatarUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      bgcolor: alpha("#ffffff", 0.03),
      transition: "all 0.2s",
      "& fieldset": { borderColor: alpha(theme.palette.divider, 0.08) },
      "&:hover": {
        bgcolor: alpha("#ffffff", 0.05),
        "& fieldset": { borderColor: alpha(theme.palette.primary.main, 0.3) },
      },
      "&.Mui-focused": {
        bgcolor: alpha("#ffffff", 0.06),
        "& fieldset": { borderColor: theme.palette.primary.main },
      },
      color: "white",
    },
    "& .MuiInputLabel-root": { 
        color: alpha("#fff", 0.4),
        fontSize: "0.9rem",
        fontWeight: 500
    },
    "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.primary.main },
  };

  return (
    <Stack spacing={3.5}>
      {/* Avatar Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          p: 3,
          borderRadius: 4,
          border: `1px solid ${alpha("#ffffff", 0.05)}`,
          bgcolor: alpha("#ffffff", 0.02),
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `radial-gradient(circle at top right, ${alpha(theme.palette.primary.main, 0.08)}, transparent)`,
            zIndex: 0,
          }
        }}
      >
        <Box sx={{ position: "relative", flexShrink: 0, zIndex: 1 }}>
          <Avatar
            src={state.profileForm.avatarUrl || undefined}
            sx={{
              width: 90,
              height: 90,
              border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontSize: "2rem",
              fontWeight: 800,
              boxShadow: `0 8px 32px ${alpha("#000", 0.4)}`,
            }}
          >
            {state.profileForm.name?.[0]}{state.profileForm.surname?.[0]}
          </Avatar>
          <IconButton
            onClick={() => fileRef.current?.click()}
            size="small"
            sx={{
              position: "absolute",
              bottom: 2,
              right: 2,
              bgcolor: theme.palette.primary.main,
              color: "#fff",
              width: 28,
              height: 28,
              border: `2px solid #0B1019`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              "&:hover": { 
                bgcolor: theme.palette.primary.dark,
                transform: "scale(1.1)"
              },
              transition: "all 0.2s"
            }}
          >
            <CameraIcon sx={{ fontSize: 14 }} />
          </IconButton>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
        </Box>

        <Box sx={{ flex: 1, zIndex: 1 }}>
          <Typography fontWeight={800} color="white" variant="h6" sx={{ letterSpacing: -0.5 }}>
            {state.profileForm.name} {state.profileForm.surname}
          </Typography>
          <Typography variant="body2" sx={{ color: alpha("#fff", 0.4), mb: 1.5, fontWeight: 500 }}>
            @{state.profileForm.username || "no_username"}
          </Typography>
          <Chip
            size="small"
            icon={<AdminIcon sx={{ fontSize: 13, color: `${theme.palette.primary.main} !important` }} />}
            label="Verified Member"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: theme.palette.primary.main,
              fontWeight: 700,
              fontSize: "0.7rem",
              height: 24,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          />
        </Box>
      </Box>

      {/* Form Fields */}
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={2.5}>
          <TextField
            label="First Name"
            value={state.profileForm.name}
            onChange={(e) => actions.updateProfileForm({ name: e.target.value })}
            fullWidth size="small" sx={fieldSx}
          />
          <TextField
            label="Last Name"
            value={state.profileForm.surname}
            onChange={(e) => actions.updateProfileForm({ surname: e.target.value })}
            fullWidth size="small" sx={fieldSx}
          />
        </Stack>
        
        <TextField
          label="Display Username"
          value={state.profileForm.username}
          onChange={(e) => actions.updateProfileForm({ username: e.target.value })}
          fullWidth size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography sx={{ color: alpha(theme.palette.primary.main, 0.6), fontWeight: 800, fontSize: 16, ml: 0.5 }}>@</Typography>
              </InputAdornment>
            ),
          }}
          sx={fieldSx}
        />

        <TextField
          label="Administrative Email"
          value={state.profileForm.email}
          disabled fullWidth size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ fontSize: 18, color: alpha("#fff", 0.25), ml: 0.5 }} />
              </InputAdornment>
            ),
          }}
          helperText="Immutable account identifier. Contact IT for changes."
          sx={{
            ...fieldSx,
            "& .MuiOutlinedInput-root": {
                ...fieldSx["& .MuiOutlinedInput-root"],
                bgcolor: alpha("#fff", 0.015),
                "& fieldset": { borderColor: alpha("#fff", 0.05) },
            },
            "& .MuiFormHelperText-root": { 
                color: alpha("#fff", 0.25), 
                fontSize: "0.72rem",
                fontWeight: 500,
                mt: 1
            },
            "& .Mui-disabled": {
                WebkitTextFillColor: alpha("#fff", 0.3),
            }
          }}
        />
      </Stack>

      <Box display="flex" justifyContent="flex-end" pt={1}>
        <Button
          variant="contained"
          onClick={actions.saveProfile}
          disabled={state.isSaving}
          startIcon={state.isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: "none",
            fontWeight: 800,
            borderRadius: 2.5,
            px: 4,
            py: 1,
            fontSize: "0.9rem",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
            "&:hover": {
                boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                transform: "translateY(-1px)"
            },
            transition: "all 0.2s"
          }}
        >
          {state.isSaving ? "Finalizing..." : "Synchronize Profile"}
        </Button>
      </Box>
    </Stack>
  );
}

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
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import type {
  ProfilePageState,
  ProfilePageActions,
} from "@/app/lib/type/profile";

interface ProfileTabProps {
  state: ProfilePageState;
  actions: ProfilePageActions;
}

export default function ProfileTab({ state, actions }: ProfileTabProps) {
  const theme = useTheme();
  const dict = useDictionary();
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
      bgcolor: (theme.palette.common as any).white_alpha.main_03,
      transition: "all 0.2s",
      "& fieldset": { borderColor: (theme.palette as any).divider_alpha.main_08 },
      "&:hover": {
        bgcolor: (theme.palette.common as any).white_alpha.main_05,
        "& fieldset": { borderColor: (theme.palette.primary as any)._alpha.main_30 },
      },
      "&.Mui-focused": {
        bgcolor: (theme.palette.common as any).white_alpha.main_06,
        "& fieldset": { borderColor: theme.palette.primary.main },
      },
      color: "white",
    },
    "& .MuiInputLabel-root": {
      color: (theme.palette.common as any).white_alpha.main_40,
      fontSize: "0.9rem",
      fontWeight: 500,
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
          border: `1px solid ${(theme.palette.common as any).white_alpha.main_05}`,
          bgcolor: (theme.palette.common as any).white_alpha.main_02,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `radial-gradient(circle at top right, ${(theme.palette.primary as any)._alpha.main_08}, transparent)`,
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: "relative", flexShrink: 0, zIndex: 1 }}>
          <Avatar
            src={state.profileForm.avatarUrl || undefined}
            sx={{
              width: 90,
              height: 90,
              border: `3px solid ${(theme.palette.primary as any)._alpha.main_30}`,
              bgcolor: (theme.palette.primary as any)._alpha.main_10,
              color: theme.palette.primary.main,
              fontSize: "2rem",
              fontWeight: 800,
              boxShadow: `0 8px 32px ${(theme.palette.common as any).black_alpha.main_40}`,
            }}
          >
            {state.profileForm.name?.[0]}
            {state.profileForm.surname?.[0]}
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
                transform: "scale(1.1)",
              },
              transition: "all 0.2s",
            }}
          >
            <CameraIcon sx={{ fontSize: 14 }} />
          </IconButton>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleAvatarChange}
          />
        </Box>

        <Box sx={{ flex: 1, zIndex: 1 }}>
          <Typography
            fontWeight={800}
            color="white"
            variant="h6"
            sx={{ letterSpacing: -0.5 }}
          >
            {state.profileForm.name} {state.profileForm.surname}
          </Typography>

          <Chip
            size="small"
            icon={
              <AdminIcon
                sx={{
                  fontSize: 13,
                  color: `${theme.palette.primary.main} !important`,
                }}
              />
            }
            label={dict.profile.account.verifiedMember}
            sx={{
              bgcolor: (theme.palette.primary as any)._alpha.main_12,
              color: theme.palette.primary.main,
              fontWeight: 700,
              fontSize: "0.7rem",
              height: 24,
              border: `1px solid ${(theme.palette.primary as any)._alpha.main_20}`,
            }}
          />
        </Box>
      </Box>

      {/* Form Fields */}
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={2.5}>
          <TextField
            label={dict.profile.account.firstName}
            value={state.profileForm.name}
            onChange={(e) =>
              actions.updateProfileForm({ name: e.target.value })
            }
            fullWidth
            size="small"
            sx={fieldSx}
          />
          <TextField
            label={dict.profile.account.lastName}
            value={state.profileForm.surname}
            onChange={(e) =>
              actions.updateProfileForm({ surname: e.target.value })
            }
            fullWidth
            size="small"
            sx={fieldSx}
          />
        </Stack>

        <TextField
          label={dict.profile.account.adminEmail}
          value={state.profileForm.email}
          disabled
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon
                  sx={{ fontSize: 18, color: (theme.palette.common as any).white_alpha.main_25, ml: 0.5 }}
                />
              </InputAdornment>
            ),
          }}
          helperText={dict.profile.account.emailHelper}
          sx={{
            ...fieldSx,
            "& .MuiOutlinedInput-root": {
              ...fieldSx["& .MuiOutlinedInput-root"],
              bgcolor: (theme.palette.common as any).white_alpha.main_02,
              "& fieldset": { borderColor: (theme.palette.common as any).white_alpha.main_05 },
            },
            "& .MuiFormHelperText-root": {
              color: (theme.palette.common as any).white_alpha.main_25,
              fontSize: "0.72rem",
              fontWeight: 500,
              mt: 1,
            },
            "& .Mui-disabled": {
              WebkitTextFillColor: (theme.palette.common as any).white_alpha.main_30,
            },
          }}
        />
      </Stack>

      <Box display="flex" justifyContent="flex-end" pt={1}>
        <Button
          variant="contained"
          onClick={actions.saveProfile}
          disabled={state.isSaving}
          startIcon={
            state.isSaving ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <SaveIcon sx={{ fontSize: 18 }} />
            )
          }
          sx={{
            textTransform: "none",
            fontWeight: 800,
            borderRadius: 2.5,
            px: 4,
            py: 1,
            fontSize: "0.9rem",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: `0 8px 24px ${(theme.palette.primary as any)._alpha.main_30}`,
            "&:hover": {
              boxShadow: `0 12px 32px ${(theme.palette.primary as any)._alpha.main_40}`,
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s",
          }}
        >
          {state.isSaving ? dict.profile.status.finalizing : dict.profile.account.syncButton}
        </Button>
      </Box>
    </Stack>
  );
}

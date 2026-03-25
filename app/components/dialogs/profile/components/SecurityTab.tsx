"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  TextField,
  CircularProgress,
  InputAdornment,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Security as SecurityIcon,
} from "@mui/icons-material";
import type {
  ProfilePageState,
  ProfilePageActions,
} from "@/app/lib/type/profile";

interface SecurityTabProps {
  state: ProfilePageState;
  actions: ProfilePageActions;
}

export default function SecurityTab({ state, actions }: SecurityTabProps) {
  const theme = useTheme();
  const [show, setShow] = useState({
    current: false,
    newP: false,
    confirm: false,
  });

  const passwordMatch =
    state.passwordForm.newPassword === state.passwordForm.confirmPassword;
  const len = state.passwordForm.newPassword.length;
  const strength =
    len >= 12 ? "strong" : len >= 8 ? "medium" : len > 0 ? "weak" : "none";

  const strengthMap = {
    none: { color: alpha("#fff", 0.1), width: "0%", label: "" },
    weak: { color: "#f43f5e", width: "33%", label: "Vulnerable" },
    medium: { color: "#f59e0b", width: "66%", label: "Acceptable" },
    strong: { color: "#10b981", width: "100%", label: "Robust" },
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
      fontWeight: 500,
    },
    "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.primary.main },
    "& .MuiFormHelperText-root.Mui-error": {
      color: "#f43f5e",
      fontWeight: 600,
    },
  };

  return (
    <Stack spacing={3.5}>
      {/* Information Banner */}
      <Box
        sx={{
          p: 2.5,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.primary.main, 0.06),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          display: "flex",
          gap: 2,
          alignItems: "flex-start",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 0.5,
          }}
        >
          <SecurityIcon
            sx={{ color: theme.palette.primary.main, fontSize: 18 }}
          />
        </Box>
        <Box>
          <Typography
            variant="body2"
            fontWeight={800}
            sx={{ color: theme.palette.primary.main, mb: 0.5 }}
          >
            Security Best Practices
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: alpha("#fff", 0.45),
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            We recommend a minimum of 12 characters including uppercase,
            numbers, and specialized symbols to protect your account.
          </Typography>
        </Box>
      </Box>

      <Stack spacing={2.5}>
        <TextField
          label="Current Password"
          size="small"
          fullWidth
          type={show.current ? "text" : "password"}
          value={state.passwordForm.currentPassword}
          onChange={(e) =>
            actions.updatePasswordForm({ currentPassword: e.target.value })
          }
          sx={fieldSx}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() =>
                    setShow((s) => ({ ...s, current: !s.current }))
                  }
                >
                  {show.current ? (
                    <VisibilityOff
                      sx={{ fontSize: 18, color: alpha("#fff", 0.3) }}
                    />
                  ) : (
                    <Visibility
                      sx={{ fontSize: 18, color: alpha("#fff", 0.3) }}
                    />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box>
          <TextField
            label="New Secure Password"
            size="small"
            fullWidth
            type={show.newP ? "text" : "password"}
            value={state.passwordForm.newPassword}
            onChange={(e) =>
              actions.updatePasswordForm({ newPassword: e.target.value })
            }
            sx={fieldSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShow((s) => ({ ...s, newP: !s.newP }))}
                  >
                    {show.newP ? (
                      <VisibilityOff
                        sx={{ fontSize: 18, color: alpha("#fff", 0.3) }}
                      />
                    ) : (
                      <Visibility
                        sx={{ fontSize: 18, color: alpha("#fff", 0.3) }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {len > 0 && (
            <Box mt={1.5}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha("#fff", 0.45),
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                  }}
                >
                  Entropy Level
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: strengthMap[strength].color,
                    fontWeight: 800,
                    fontSize: "0.65rem",
                  }}
                >
                  {strengthMap[strength].label}
                </Typography>
              </Stack>
              <Box
                sx={{
                  height: 4,
                  bgcolor: alpha("#fff", 0.05),
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: strengthMap[strength].width,
                    bgcolor: strengthMap[strength].color,
                    borderRadius: 2,
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: `0 0 8px ${alpha(strengthMap[strength].color, 0.4)}`,
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>

        <TextField
          label="Confirm New Password"
          size="small"
          fullWidth
          type={show.confirm ? "text" : "password"}
          value={state.passwordForm.confirmPassword}
          onChange={(e) =>
            actions.updatePasswordForm({ confirmPassword: e.target.value })
          }
          error={
            state.passwordForm.confirmPassword.length > 0 && !passwordMatch
          }
          helperText={
            state.passwordForm.confirmPassword.length > 0 && !passwordMatch
              ? "Verification failed. Passwords must match exactly."
              : ""
          }
          sx={fieldSx}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() =>
                    setShow((s) => ({ ...s, confirm: !s.confirm }))
                  }
                >
                  {show.confirm ? (
                    <VisibilityOff
                      sx={{ fontSize: 18, color: alpha("#fff", 0.3) }}
                    />
                  ) : (
                    <Visibility
                      sx={{ fontSize: 18, color: alpha("#fff", 0.3) }}
                    />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Box display="flex" justifyContent="flex-end" pt={1}>
        <Button
          variant="contained"
          onClick={actions.changePassword}
          disabled={
            state.isSaving ||
            !passwordMatch ||
            !state.passwordForm.newPassword ||
            strength === "weak"
          }
          startIcon={
            state.isSaving ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <LockIcon sx={{ fontSize: 18 }} />
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
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
            "&:hover": {
              boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s",
            "&.Mui-disabled": {
              bgcolor: alpha("#fff", 0.05),
              color: alpha("#fff", 0.2),
              border: `1px solid ${alpha("#fff", 0.05)}`,
            },
          }}
        >
          {state.isSaving ? "Upgrading..." : "Update Credentials"}
        </Button>
      </Box>
    </Stack>
  );
}

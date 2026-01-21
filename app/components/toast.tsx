import {
  Snackbar,
  Box,
  IconButton,
  Typography,
  LinearProgress,
} from "@mui/material";
import { CheckCircle, Error, Warning, Info, Close } from "@mui/icons-material";

interface ToastParams {
  open: boolean;
  onClose: () => void;
  type: "error" | "info" | "success" | "warning";
  message: string;
}

export default function CustomToast(params: ToastParams) {
  const { open, onClose, type, message } = params;

  const toastConfig = {
    success: {
      icon: <CheckCircle />,
      iconColor: "#10b981",
      borderColor: "#10b981",
      bgColor: "#f0fdf4",
    },
    error: {
      icon: <Error />,
      iconColor: "#ef4444",
      borderColor: "#ef4444",
      bgColor: "#fef2f2",
    },
    warning: {
      icon: <Warning />,
      iconColor: "#f59e0b",
      borderColor: "#f59e0b",
      bgColor: "#fffbeb",
    },
    info: {
      icon: <Info />,
      iconColor: "#3b82f6",
      borderColor: "#3b82f6",
      bgColor: "#eff6ff",
    },
  };

  const config = toastConfig[type];

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          backgroundColor: config.bgColor,
          borderLeft: `5px solid ${config.borderColor}`,
          borderRadius: "8px",
          padding: "12px 16px",
          minWidth: "320px",
          maxWidth: "400px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            color: config.iconColor,
            display: "flex",
            alignItems: "center",
            fontSize: "24px",
          }}
        >
          {config.icon}
        </Box>

        <Typography
          sx={{
            flex: 1,
            fontSize: "14px",
            fontWeight: 500,
            color: "#1f2937",
          }}
        >
          {message}
        </Typography>

        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: "#9ca3af",
            padding: "4px",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Close fontSize="small" />
        </IconButton>

        <LinearProgress
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: config.borderColor,
            },
          }}
        />
      </Box>
    </Snackbar>
  );
}

"use client";

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  useTheme,
  CircularProgress,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import BadgeIcon from "@mui/icons-material/Badge";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useEffect, useState, useCallback } from "react";
import { getDriverHistory } from "@/app/lib/controllers/driver";
import { DriverHistory } from "@/app/lib/type/driver";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface DriverHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  driverId: string;
  driverName: string;
}

const ActivityIcon = ({ type }: { type: string }) => {
  const theme = useTheme();
  switch (type) {
    case "SHIFT_START":
      return <LoginIcon sx={{ color: theme.palette.success.main }} />;
    case "SHIFT_END":
      return <LogoutIcon sx={{ color: theme.palette.warning.main }} />;
    case "ROUTE_COMPLETED":
      return <LocalShippingIcon sx={{ color: theme.palette.primary.main }} />;
    case "JOB_COMPLETED":
      return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
    default:
      return <HistoryIcon sx={{ color: theme.palette.text.secondary }} />;
  }
};

const KPICard = ({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) => {
  const theme = useTheme();
  
  const resolveAlpha = (targetColor: string) => {
    if (targetColor === theme.palette.primary.main) return theme.palette.primary._alpha;
    if (targetColor === theme.palette.success.main) return theme.palette.success._alpha;
    if (targetColor === theme.palette.error.main) return theme.palette.error._alpha;
    if (targetColor === theme.palette.warning.main) return theme.palette.warning._alpha;
    if (targetColor === theme.palette.info.main) return theme.palette.info._alpha;
    return theme.palette.primary._alpha;
  };

  const statusAlpha = resolveAlpha(color);

  return (
    <Box
      sx={{
        flex: 1,
        p: 2,
        borderRadius: 3,
        bgcolor: statusAlpha.main_05,
        border: `1px solid ${statusAlpha.main_15}`,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: statusAlpha.main_10,
          color: color,
          display: "flex",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" fontWeight={800} color="white">
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export default function DriverHistoryDialog({
  open,
  onClose,
  driverId,
  driverName,
}: DriverHistoryDialogProps) {
  const theme = useTheme();
  const dict = useDictionary();
  const [history, setHistory] = useState<DriverHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDriverHistory(driverId);
      setHistory(data);
    } catch (err) {
      console.error("Load history error:", err);
      setError(dict.common.errorOccurred);
    } finally {
      setLoading(false);
    }
  }, [driverId, dict]);

  useEffect(() => {
    if (open && driverId) {
      loadHistory();
    }
  }, [open, driverId, loadHistory]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#0B1019",
          backgroundImage: "none",
          border: `1px solid ${theme.palette.divider_alpha.main_10}`,
          maxHeight: "85vh",
        },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 2, borderBottom: `1px solid ${theme.palette.divider_alpha.main_05}` }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 1.25,
                borderRadius: 2,
                bgcolor: theme.palette.primary._alpha.main_10,
                color: theme.palette.primary.main,
                display: "flex",
              }}
            >
              <HistoryIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} color="white">
                {dict.drivers.labels.driverHistory}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {dict.drivers.labels.activityLog.replace("{name}", driverName)}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 2 }}>
        {loading ? (
          <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={32} />
          </Box>
        ) : error ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {error}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={4}>
            {/* KPI Summary */}
            <Stack direction="row" spacing={2}>
              <KPICard
                label={dict.drivers.labels.completedJobs}
                value={history?.completedShipments || 0}
                icon={<CheckCircleIcon fontSize="small" />}
                color={theme.palette.success.main}
              />
              <KPICard
                label={dict.drivers.labels.permissions}
                value={history?.activePermissions || 0}
                icon={<BadgeIcon fontSize="small" />}
                color={theme.palette.info.main}
              />
            </Stack>

            <Divider sx={{ borderColor: theme.palette.divider_alpha.main_05 }} />

            {/* Timeline */}
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="white" sx={{ mb: 3 }}>
                {dict.drivers.labels.recentActivities}
              </Typography>
              
              <Stack spacing={0}>
                {history?.activities && history.activities.length > 0 ? (
                  history.activities.map((activity, index) => (
                    <Box key={activity.id} sx={{ position: "relative" }}>
                      {/* Vertical Line */}
                      {index < history.activities.length - 1 && (
                        <Box
                          sx={{
                            position: "absolute",
                            left: 20,
                            top: 40,
                            bottom: -15,
                            width: 2,
                            bgcolor: theme.palette.divider_alpha.main_05,
                            zIndex: 0,
                          }}
                        />
                      )}
                      
                      <Stack direction="row" spacing={3} sx={{ pb: 4 }}>
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: "50%",
                            bgcolor: theme.palette.background.paper_alpha.main_30,
                            border: `1px solid ${theme.palette.divider_alpha.main_10}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1,
                            flexShrink: 0,
                          }}
                        >
                          <ActivityIcon type={activity.type} />
                        </Box>
                        
                        <Box sx={{ pt: 0.5 }}>
                          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                            <Typography variant="subtitle2" fontWeight={700} color="white">
                              {activity.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              • {new Date(activity.timestamp).toLocaleString()}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                            {activity.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ py: 4, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      {dict.drivers.labels.noActivities}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

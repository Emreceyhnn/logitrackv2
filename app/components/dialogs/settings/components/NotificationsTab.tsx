"use client";

import React from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Divider,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import {
  NotificationsActive as NotifIcon,
  Save as SaveIcon,
  EmailOutlined as EmailOutlinedIcon,
} from "@mui/icons-material";
import type {
  SettingsPageState,
  SettingsPageActions,
} from "@/app/lib/type/settings";
import NotificationRow from "./NotificationRow";

interface NotificationsTabProps {
  state: SettingsPageState;
  actions: SettingsPageActions;
}

export default function NotificationsTab({
  state,
  actions,
}: NotificationsTabProps) {
  const theme = useTheme();

  return (
    <Stack spacing={3.5}>
      <Box>
        <Stack direction="row" alignItems="center" gap={1} mb={2}>
          <Box
            sx={{
              p: 0.8,
              borderRadius: 1.5,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <EmailOutlinedIcon
              sx={{ fontSize: 16, color: theme.palette.primary.main }}
            />
          </Box>
          <Typography
            variant="caption"
            fontWeight={850}
            sx={{ color: alpha("#fff", 0.6), letterSpacing: 1.2 }}
          >
            EMAIL CHANNELS
          </Typography>
        </Stack>
        <Stack spacing={1.5}>
          <NotificationRow
            label="Fleet Status Reports"
            description="Automated updates for active shipment transitions"
            checked={state.notifications.emailShipmentUpdates}
            onChange={(v) =>
              actions.updateNotifications({ emailShipmentUpdates: v })
            }
          />
          <NotificationRow
            label="Preventive Maintenance"
            description="Proactive reminders for scheduled vehicle service"
            checked={state.notifications.emailMaintenanceAlerts}
            onChange={(v) =>
              actions.updateNotifications({ emailMaintenanceAlerts: v })
            }
          />
          <NotificationRow
            label="Executive KPI Summaries"
            description="Analytics digest delivered every Monday morning"
            checked={state.notifications.emailWeeklyReports}
            onChange={(v) =>
              actions.updateNotifications({ emailWeeklyReports: v })
            }
          />
        </Stack>
      </Box>

      <Divider sx={{ borderColor: alpha("#fff", 0.05) }} />

      <Box>
        <Stack direction="row" alignItems="center" gap={1} mb={2}>
          <Box
            sx={{
              p: 0.8,
              borderRadius: 1.5,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <NotifIcon
              sx={{ fontSize: 16, color: theme.palette.primary.main }}
            />
          </Box>
          <Typography
            variant="caption"
            fontWeight={850}
            sx={{ color: alpha("#fff", 0.6), letterSpacing: 1.2 }}
          >
            REAL-TIME SIGNALS
          </Typography>
        </Stack>
        <Stack spacing={1.5}>
          <NotificationRow
            label="Dynamic Routing"
            description="Instant alerts for newly assigned logistics paths"
            checked={state.notifications.pushNewAssignments}
            onChange={(v) =>
              actions.updateNotifications({ pushNewAssignments: v })
            }
          />
          <NotificationRow
            label="Network Anomalies"
            description="Critical alerts regarding logistics delays or disruptions"
            checked={state.notifications.pushDelayAlerts}
            onChange={(v) =>
              actions.updateNotifications({ pushDelayAlerts: v })
            }
          />
        </Stack>
      </Box>

      <Box display="flex" justifyContent="flex-end" pt={1}>
        <Button
          variant="contained"
          startIcon={
            state.isSaving ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <SaveIcon sx={{ fontSize: 18 }} />
            )
          }
          onClick={actions.saveNotifications}
          disabled={state.isSaving}
          sx={{
            textTransform: "none",
            fontWeight: 800,
            borderRadius: 2.5,
            px: 4,
            py: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.25)}`,
            "&:hover": {
              boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.35)}`,
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s",
          }}
        >
          {state.isSaving ? "Synchronizing..." : "Update Webhooks"}
        </Button>
      </Box>
    </Stack>
  );
}

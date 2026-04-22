"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Badge,
  Popover,
  Typography,
  Divider,
  List,
  ListItem,
  Stack,
  Button,
  useTheme,
  Tooltip,
  Theme,
} from "@mui/material";
import {
  Notifications as NotifIcon,
  NotificationsActive as NotifActiveIcon,
  Delete as DeleteIcon,
  CheckCircle as ReadIcon,
  DoneAll as DoneAllIcon,
} from "@mui/icons-material";
import { getUserSession } from "@/app/lib/actions/auth";
import { useNotifications } from "@/app/hooks/useNotifications";
import { NotificationType } from "@/app/lib/notifications";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { AuthenticatedUser } from "@/app/lib/auth-middleware";

const getStatusColor = (theme: Theme, t: NotificationType) => {
  switch (t) {
    case "SUCCESS":
      return theme.palette.success.main;
    case "WARNING":
      return theme.palette.warning.main;
    case "ERROR":
      return theme.palette.error.main;
    default:
      return theme.palette.info.main;
  }
};

const resolveStatusAlpha = (theme: Theme, t: NotificationType) => {
  switch (t) {
    case "SUCCESS":
      return theme.palette.success._alpha;
    case "WARNING":
      return theme.palette.warning._alpha;
    case "ERROR":
      return theme.palette.error._alpha;
    default:
      return theme.palette.info._alpha;
  }
};

export default function NotificationBell({ user: initialUser }: { user: AuthenticatedUser | null }) {
  const dict = useDictionary();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<AuthenticatedUser | null>(initialUser);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!initialUser) {
      const fetchSession = async () => {
        try {
          const session = await getUserSession();
          if (session) {
              setUser(session);
          }
        } catch (err) {
          console.error("Session fetch failed for bell:", err);
        }
      };
      fetchSession();
    }
  }, [initialUser]);

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(user || undefined);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={dict.notifications.title}>
        <IconButton
          onClick={handleOpen}
          sx={{
            color:
              unreadCount > 0 ? theme.palette.primary.main : theme.palette.text.secondary,
            bgcolor: unreadCount > 0 
              ? theme.palette.primary._alpha.main_05 
              : theme.palette.action.hover,
            border: `1px solid ${unreadCount > 0 
              ? theme.palette.primary._alpha.main_10 
              : theme.palette.divider}`,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              bgcolor: theme.palette.primary._alpha.main_10,
              borderColor: theme.palette.primary._alpha.main_30,
              transform: "translateY(-1px)",
            },
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            overlap="circular"
            sx={{
              "& .MuiBadge-badge": {
                fontWeight: 900,
                fontSize: "0.6rem",
                minWidth: 16,
                height: 16,
                padding: "0 4px",
                boxShadow: "0 0 10px rgba(244, 63, 94, 0.5)",
              },
            }}
          >
            {unreadCount > 0 ? (
              <NotifActiveIcon sx={{ fontSize: 22 }} />
            ) : (
              <NotifIcon sx={{ fontSize: 22 }} />
            )}
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 2,
            width: 380,
            maxHeight: 520,
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: theme.palette.background.paper,
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.palette.mode === "dark" 
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.6)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={800}
            color="text.primary"
            sx={{ letterSpacing: "-0.02em" }}
          >
            {dict.notifications.title}
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              startIcon={<DoneAllIcon />}
              onClick={markAllAsRead}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                color: theme.palette.primary.main,
                fontSize: "0.75rem",
                "&:hover": { bgcolor: theme.palette.primary._alpha.main_10 },
              }}
            >
              {dict.notifications.catchUp}
            </Button>
          )}
        </Box>

        <Divider sx={{ borderColor: theme.palette.divider }} />

        <Box sx={{ flex: 1, overflowY: "auto", px: 1.5, py: 1 }}>
          {loading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {dict.notifications.initializing}
              </Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center", opacity: 0.3 }}>
              <NotifIcon sx={{ fontSize: 40, mb: 1, color: "text.primary" }} />
              <Typography variant="body2" color="text.primary">
                {dict.notifications.systemClear}
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((notif) => (
                <ListItem
                  key={notif.id}
                  disablePadding
                  sx={{
                    mb: 1,
                    borderRadius: 3,
                    transition: "all 0.2s",
                    position: "relative",
                    bgcolor: notif.isRead ? "transparent" : theme.palette.action.hover,
                    border: "1px solid",
                    borderColor: notif.isRead
                      ? "transparent"
                      : theme.palette.divider,
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                      borderColor: resolveStatusAlpha(theme, notif.type).main_30,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: "60%",
                      borderRadius: 1,
                      position: "absolute",
                      left: 6,
                      bgcolor: getStatusColor(theme, notif.type),
                      opacity: notif.isRead ? 0.3 : 1,
                    }}
                  />
                  <Stack sx={{ p: 2, pl: 3, width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: notif.isRead ? 600 : 800,
                          color: "text.primary",
                          fontSize: "0.85rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {notif.title}
                      </Typography>
                      <Stack direction="row">
                        {!notif.isRead && (
                          <IconButton
                            size="small"
                            onClick={() => markAsRead(notif)}
                            sx={{ color: theme.palette.primary.main, p: 0.5 }}
                          >
                            <ReadIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => deleteNotification(notif)}
                          sx={{
                            color: theme.palette.text.secondary,
                            opacity: 0.3,
                            p: 0.5,
                            "&:hover": { 
                              color: theme.palette.error.main,
                              opacity: 1
                            },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Stack>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        lineHeight: 1.4,
                        mb: 1,
                      }}
                    >
                      {notif.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        opacity: 0.5,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                      }}
                    >
                      {new Date(notif.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Stack>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
}

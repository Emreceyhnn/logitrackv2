"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import {
  NotificationsActive as NotifIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  CheckCircle as ReadIcon,
} from "@mui/icons-material";
import { createNotification, NotificationType } from "@/app/lib/notifications";
import { useNotifications } from "@/app/hooks/useNotifications";

const COLORS = {
  bg: "radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)",
  // Modified from white to a dark glass look for better cohesion
  panel: "rgba(30, 41, 59, 0.7)", 
  info: "#38bdf8",
  success: "#4ade80",
  warning: "#fbbf24", // Fixed: Proper Amber for Warning
  error: "#f43f5e",   // Fixed: Distinct Rose/Crimson for Error
  textHeader: "#f8fafc",
  textBody: "#cbd5e1",
  textMuted: "#94a3b8", // Darker for better contrast on glass
};

const Playground = () => {
  // Simulator State
  const [currentUserId, setCurrentUserId] = useState("user_001");
  const [currentCompanyId, setCurrentCompanyId] = useState("comp_alpha");
  const [currentRole, setCurrentRole] = useState("ADMIN");

  // Send Form State
  const [targetType, setTargetType] = useState<"USER" | "COMPANY" | "ROLE" | "EVERYONE">(
    "USER"
  );
  const [title, setTitle] = useState("New Alert");
  const [message, setMessage] = useState("This is a real-time test message.");
  const [type, setType] = useState<NotificationType>("INFO");

  // Hook into real-time stream
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications({
    id: currentUserId,
    companyId: currentCompanyId,
    roleName: currentRole,
  });

  const handleSend = async () => {
    const target: { userId?: string; companyId?: string; roleName?: string; isGlobal?: boolean } =
      {};
    if (targetType === "USER") target.userId = currentUserId;
    if (targetType === "COMPANY") target.companyId = currentCompanyId;
    if (targetType === "ROLE") {
      target.companyId = currentCompanyId;
      target.roleName = currentRole;
    }
    if (targetType === "EVERYONE") target.isGlobal = true;

    await createNotification(target, {
      title,
      message,
      type,
    });
  };

  const getStatusColor = (t: NotificationType) => {
    switch (t) {
      case "SUCCESS": return COLORS.success;
      case "WARNING": return COLORS.warning;
      case "ERROR": return COLORS.error;
      default: return COLORS.info;
    }
  };

  return (
    <Box sx={{ 
      background: COLORS.bg, 
      minHeight: "100vh", 
      py: 6,
      px: 2,
      display: "flex",
      alignItems: "center",
      color: COLORS.textBody
    }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          gutterBottom
          sx={{ 
            fontWeight: 800, 
            color: COLORS.textHeader, 
            mb: 5,
            textAlign: "center",
            letterSpacing: "-0.03em"
          }}
        >
          Notification Engine
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* SENDER PANEL */}
          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                height: "100%",
                background: COLORS.panel,
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1.5, fontWeight: 700, mb: 3, color: COLORS.textHeader }}
              >
                <SendIcon sx={{ color: COLORS.info }} /> Broadcast Trigger
              </Typography>
              
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: COLORS.textMuted }}>Targeting Scope</InputLabel>
                  <Select
                    value={targetType}
                    label="Targeting Scope"
                    onChange={(e) => setTargetType(e.target.value as "USER" | "COMPANY" | "ROLE" | "EVERYONE")}
                    sx={{ 
                      borderRadius: 2, 
                      color: COLORS.textHeader, 
                      bgcolor: "rgba(0,0,0,0.2)",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" }
                    }}
                  >
                    <MenuItem value="USER">Personal Inbox</MenuItem>
                    <MenuItem value="COMPANY">Company-wide Node</MenuItem>
                    <MenuItem value="ROLE">Role-based Segment</MenuItem>
                    <MenuItem value="EVERYONE">Global Broadcast (Everyone)</MenuItem>
                  </Select>
                </FormControl>

                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ 
                      "& .MuiInputBase-root": { color: COLORS.textHeader, bgcolor: "rgba(0,0,0,0.2)" },
                      "& .MuiInputLabel-root": { color: COLORS.textMuted },
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" }
                    }}
                  />
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value as NotificationType)}
                    sx={{ 
                      minWidth: 100, 
                      color: COLORS.textHeader, 
                      bgcolor: "rgba(0,0,0,0.2)",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" }
                    }}
                  >
                    <MenuItem value="INFO">INFO</MenuItem>
                    <MenuItem value="SUCCESS">SUCCESS</MenuItem>
                    <MenuItem value="WARNING">WARNING</MenuItem>
                    <MenuItem value="ERROR">ERROR</MenuItem>
                  </Select>
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Content Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{ 
                    "& .MuiInputBase-root": { color: COLORS.textHeader, bgcolor: "rgba(0,0,0,0.2)" },
                    "& .MuiInputLabel-root": { color: COLORS.textMuted },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" }
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSend}
                  sx={{ 
                    py: 2, 
                    borderRadius: 2,
                    textTransform: "none", 
                    fontWeight: 700,
                    fontSize: "1rem",
                    bgcolor: COLORS.info,
                    "&:hover": { bgcolor: "#0ea5e9" }
                  }}
                >
                  Fire Signal
                </Button>

                <Box sx={{ p: 2, bgcolor: "rgba(0,0,0,0.2)", borderRadius: 3, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <Typography variant="caption" fontWeight={700} sx={{ color: COLORS.textMuted, mb: 1.5, display: "block", textTransform: "uppercase" }}>
                    Simulator Context
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField 
                      size="small" 
                      label="My ID" 
                      value={currentUserId} 
                      onChange={(e) => setCurrentUserId(e.target.value)}
                      sx={{ "& .MuiInputBase-root": { color: COLORS.textHeader, fontSize: 12 } }}
                    />
                    <TextField 
                      size="small" 
                      label="Comp ID" 
                      value={currentCompanyId} 
                      onChange={(e) => setCurrentCompanyId(e.target.value)}
                      sx={{ "& .MuiInputBase-root": { color: COLORS.textHeader, fontSize: 12 } }}
                    />
                    <TextField 
                      size="small" 
                      label="Role" 
                      value={currentRole} 
                      onChange={(e) => setCurrentRole(e.target.value)}
                      sx={{ "& .MuiInputBase-root": { color: COLORS.textHeader, fontSize: 12 } }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* RECEIVER PANEL */}
          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: "100%",
                borderRadius: 4,
                background: COLORS.panel,
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1.5, fontWeight: 700, color: COLORS.textHeader }}
                >
                  <NotifIcon sx={{ color: unreadCount > 0 ? getStatusColor(type) : COLORS.info }} /> Live Feed
                  {unreadCount > 0 && (
                    <Chip 
                      label={`${unreadCount} New`} 
                      size="small" 
                      sx={{ 
                        bgcolor: COLORS.error, 
                        color: "white", 
                        fontWeight: 700,
                        height: 20
                      }} 
                    />
                  )}
                </Typography>
                <Button
                  size="small"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  sx={{ color: COLORS.info, textTransform: "none", fontWeight: 700 }}
                >
                  Clear All
                </Button>
              </Box>

              <Divider sx={{ mb: 3, borderColor: "rgba(255,255,255,0.05)" }} />

              {loading ? (
                <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Typography sx={{ color: COLORS.textMuted }}>Syncing signals...</Typography>
                </Box>
              ) : notifications.length === 0 ? (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    opacity: 0.4,
                    py: 8
                  }}
                >
                  <NotifIcon sx={{ fontSize: 48, color: COLORS.textMuted }} />
                  <Typography variant="body2">No signals detected.</Typography>
                </Box>
              ) : (
                <List sx={{ flex: 1, overflow: "auto", pr: 1, maxHeight: 650 }}>
                  {notifications.map((notif) => (
                    <ListItem
                      key={notif.id}
                      sx={{
                        mb: 2,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: notif.isRead ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
                        background: notif.isRead ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.03)",
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: getStatusColor(notif.type),
                          background: "rgba(255,255,255,0.05)",
                        }
                      }}
                      secondaryAction={
                        <Stack direction="row" spacing={0.5}>
                          {!notif.isRead && (
                            <IconButton onClick={() => markAsRead(notif)} sx={{ color: COLORS.info }}>
                              <ReadIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton onClick={() => deleteNotification(notif)} sx={{ color: COLORS.textMuted, "&:hover": { color: COLORS.error } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      }
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: getStatusColor(notif.type) }} />
                            <Typography
                              variant="subtitle2"
                              sx={{ 
                                fontWeight: notif.isRead ? 500 : 700,
                                color: COLORS.textHeader 
                              }}
                            >
                              {notif.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5, pl: 2.5 }}>
                            <Typography variant="body2" sx={{ color: COLORS.textBody, mb: 0.5 }}>
                              {notif.message}
                            </Typography>
                            <Typography variant="caption" sx={{ color: COLORS.textMuted, fontSize: 10 }}>
                              {new Date(notif.createdAt).toLocaleTimeString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Playground;

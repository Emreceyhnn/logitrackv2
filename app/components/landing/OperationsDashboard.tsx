"use client";

import { useState } from "react";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RouteIcon from "@mui/icons-material/Route";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SpeedIcon from "@mui/icons-material/Speed";
import { motion } from "framer-motion";

export default function OperationsDashboard() {
  const dict = useDictionary();
  const [activeTab, setActiveTab] = useState("overview");

  const sidebarItems = [
    {
      id: "overview",
      icon: <DashboardIcon sx={{ fontSize: 20 }} />,
      label: dict.landing.operations.tabs.overview,
    },
    {
      id: "fleet",
      icon: <LocalShippingIcon sx={{ fontSize: 20 }} />,
      label: dict.landing.operations.tabs.fleet,
    },
    {
      id: "routes",
      icon: <RouteIcon sx={{ fontSize: 20 }} />,
      label: dict.landing.operations.tabs.routes,
    },
  ];

  const getStats = () => {
    switch (activeTab) {
      case "fleet":
        return [
          { label: dict.landing.operations.stats.totalFleet, value: "842" },
          { label: dict.landing.operations.stats.inTransit, value: "615" },
          { label: dict.landing.operations.stats.maintenance, value: "24" },
          { label: dict.landing.operations.stats.onTime, value: "94.2", unit: "%" },
        ];
      case "routes":
        return [
          { label: dict.landing.operations.stats.activeRoutes, value: "412" },
          { label: dict.landing.operations.stats.fuelSaved, value: "12.4", unit: "%" },
          { label: dict.landing.operations.stats.timeSaved, value: "8.5", unit: "h" },
          { label: dict.landing.operations.stats.deviations, value: "3" },
        ];
      default:
        return [
          { label: dict.landing.operations.stats.activeUnits, value: "1,204" },
          { label: dict.landing.operations.stats.efficiency, value: "98.4", unit: "%" },
          { label: dict.landing.operations.stats.avgSpeed, value: "64", unit: "km/h" },
          { label: dict.landing.operations.stats.co2Reduced, value: "14.2", unit: "t" },
        ];
    }
  };

  const stats = getStats();

  const renderOverview = () => (
    <Box
      sx={{
        flex: 1,
        p: 4,
        position: "relative",
        bgcolor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <Box
        className="glass-inner"
        sx={{
          width: "100%",
          height: "100%",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "4px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Advanced Telemetry Background Layer */}
        <Box
          className="bg-grid-pattern"
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
          }}
        />

        {/* Central Radial Glow */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at center, rgba(0, 242, 255, 0.15) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Radar Rings */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "250px", md: "400px" },
            height: { xs: "250px", md: "400px" },
            borderRadius: "50%",
            border: "1px solid rgba(0, 242, 255, 0.2)",
            pointerEvents: "none",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "15%",
              left: "15%",
              right: "15%",
              bottom: "15%",
              borderRadius: "50%",
              border: "1px solid rgba(0, 242, 255, 0.1)",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: "35%",
              left: "35%",
              right: "35%",
              bottom: "35%",
              borderRadius: "50%",
              border: "1px dashed rgba(0, 242, 255, 0.15)",
            }
          }}
        />

        {/* Radar Crosshairs */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, rgba(0, 242, 255, 0.3) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: "1px",
            background: "linear-gradient(180deg, transparent 0%, rgba(0, 242, 255, 0.3) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Sweeping Radar Scanner */}
        <Box
          className="animate-spin"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: { xs: "250px", md: "400px" },
            height: { xs: "250px", md: "400px" },
            mt: { xs: "-125px", md: "-200px" },
            ml: { xs: "-125px", md: "-200px" },
            borderRadius: "50%",
            background: "conic-gradient(from 0deg, transparent 70%, rgba(0, 242, 255, 0.1) 95%, rgba(0, 242, 255, 0.4) 100%)",
            pointerEvents: "none",
            animationDuration: "4s",
          }}
        />

        {/* Data Nodes */}
        {[
          { top: "30%", left: "40%", delay: "0s" },
          { top: "60%", left: "65%", delay: "1s" },
          { top: "25%", left: "70%", delay: "0.5s" },
          { top: "75%", left: "35%", delay: "1.5s" },
          { top: "45%", left: "20%", delay: "0.2s" },
        ].map((node, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              top: node.top,
              left: node.left,
              width: 6,
              height: 6,
              bgcolor: "#00f2ff",
              borderRadius: "50%",
              boxShadow: "0 0 10px #00f2ff, 0 0 20px #00f2ff",
              "&::after": {
                content: '""',
                position: "absolute",
                top: -4,
                left: -4,
                right: -4,
                bottom: -4,
                borderRadius: "50%",
                border: "1px solid rgba(0, 242, 255, 0.5)",
                animation: "pulse 2s infinite",
                animationDelay: node.delay,
              }
            }}
          />
        ))}

        {/* Simulation Content */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 80,
                border: "1px solid rgba(0, 242, 255, 0.4)",
                boxShadow: "0 0 30px rgba(0, 242, 255, 0.1)",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(0, 242, 255, 0.1)",
                  animation: "pulse 2s infinite",
                }}
              />
              <MyLocationIcon sx={{ color: "#00f2ff", fontSize: 40 }} />
            </Box>
            <Typography
              className="font-label-md"
              sx={{
                fontSize: "0.75rem",
                color: "#00f2ff",
                textTransform: "uppercase",
                letterSpacing: "0.4em",
                fontWeight: 900,
              }}
            >
              {dict.landing.operations.telemetry.title}
            </Typography>
          </Box>
        </Box>

        {/* Coordinates */}
        <Typography
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            fontSize: "0.625rem",
            fontFamily: "monospace",
            color: "rgba(255, 255, 255, 0.4)",
          }}
        >
          X: 402.192 / Y: 881.042
        </Typography>

        {/* Alert Card */}
        <Box
          className="glass-panel"
          sx={{
            position: "absolute",
            top: 24,
            right: 24,
            width: 280,
            p: 3,
            borderRadius: "4px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            display: { xs: "none", md: "block" },
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Box
              sx={{
                p: 0.75,
                borderRadius: "4px",
                bgcolor: "rgba(0, 242, 255, 0.1)",
              }}
            >
              <NotificationsActiveIcon
                sx={{ color: "#00f2ff", fontSize: 16 }}
              />
            </Box>
            <Typography
              className="font-label-md"
              sx={{
                fontSize: "0.625rem",
                color: "white",
                fontWeight: 900,
                textTransform: "uppercase",
              }}
            >
              {dict.landing.operations.telemetry.activeIntelligence}
            </Typography>
          </Stack>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              p: 1.5,
              borderRadius: "4px",
              bgcolor: "rgba(255, 255, 255, 0.05)",
            }}
          >
            <Box
              sx={{
                width: 4,
                bgcolor: "#00f2ff",
                borderRadius: "2px",
              }}
            />
            <Box>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "white",
                  fontWeight: 700,
                }}
              >
                {dict.landing.operations.telemetry.routeOptimized.replace("{id}", "HK-942")}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.625rem",
                  color: "rgba(255, 255, 255, 0.7)",
                  mt: 0.5,
                }}
              >
                {dict.landing.operations.telemetry.efficiencyIncreased.replace("{value}", "4.2")}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Log Terminal */}
        <Box
          className="glass-inner"
          sx={{
            position: "absolute",
            bottom: 24,
            left: 24,
            width: 300,
            height: 160,
            p: 2.5,
            borderRadius: "4px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            display: { xs: "none", xl: "block" },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              pb: 1,
              mb: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.625rem",
                color: "rgba(255, 255, 255, 0.6)",
                fontWeight: 900,
                textTransform: "uppercase",
              }}
            >
              {dict.landing.operations.telemetry.systemLog}
            </Typography>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "#00f2ff",
              }}
            />
          </Stack>
          <Box
            sx={{
              color: "rgba(0, 242, 255, 0.8)",
              fontFamily: "monospace",
              fontSize: "0.625rem",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
              <Box component="span" sx={{ opacity: 0.5 }}>
                [09:42:01]
              </Box>
              <Box component="span">RTE_MOD_SYNC_SUCCESS</Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
              <Box component="span" sx={{ opacity: 0.5 }}>
                [09:42:04]
              </Box>
              <Box component="span" sx={{ color: "#7bd0ff" }}>
                DATA_STREAM_NODE_7B
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
              <Box component="span" sx={{ opacity: 0.5 }}>
                [09:42:08]
              </Box>
              <Box component="span">GEO_FENCE_VLD_PRX</Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
              <Box component="span" sx={{ opacity: 0.5 }}>
                [09:42:12]
              </Box>
              <Box component="span" sx={{ color: "#ffb4ab" }}>
                WARN: CONGESTION_LHR
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Box component="span" sx={{ opacity: 0.5 }}>
                [09:42:15]
              </Box>
              <Box component="span">REROUTING_CALC_DONE</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const renderFleet = () => (
    <Box
      sx={{
        flex: 1,
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        overflowY: "auto",
        bgcolor: "rgba(0, 0, 0, 0.4)",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          className: "bg-grid-pattern",
          opacity: 0.05,
          pointerEvents: "none",
        }}
      />
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Typography
          className="font-label-md"
          sx={{
            color: "#00f2ff",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            fontWeight: 900,
          }}
        >
          {dict.landing.operations.fleet.title}
        </Typography>
        <Box
          sx={{ flex: 1, height: "1px", bgcolor: "rgba(0, 242, 255, 0.2)" }}
        />
      </Stack>

      <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
        {[
          {
            id: "TRK-9042",
            dest: "Frankfurt Hub",
            status: "ON SCHEDULE",
            progress: 65,
            speed: "82 km/h",
          },
          {
            id: "TRK-8115",
            dest: "Rotterdam Port",
            status: "DELAYED",
            progress: 42,
            speed: "45 km/h",
            error: true,
          },
          {
            id: "TRK-7701",
            dest: "Munich Central",
            status: "ARRIVING",
            progress: 95,
            speed: "30 km/h",
          },
        ].map((truck) => (
          <Box
            key={truck.id}
            className="glass-inner"
            sx={{
              p: 2.5,
              borderRadius: "4px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.05)",
                borderColor: "rgba(0, 242, 255, 0.3)",
              },
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "8px",
                  bgcolor: truck.error
                    ? "rgba(255, 180, 171, 0.1)"
                    : "rgba(0, 242, 255, 0.1)",
                  border: `1px solid ${
                    truck.error
                      ? "rgba(255, 180, 171, 0.3)"
                      : "rgba(0, 242, 255, 0.3)"
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LocalShippingIcon
                  sx={{
                    color: truck.error ? "#ffb4ab" : "#00f2ff",
                    fontSize: 24,
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: "white",
                    fontWeight: 900,
                    fontSize: "1rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {truck.id}
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                  }}
                >
                  {truck.dest}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ width: "35%", display: { xs: "none", md: "block" } }}>
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography
                  sx={{
                    color: truck.error ? "#ffb4ab" : "#00f2ff",
                    fontSize: "0.625rem",
                    letterSpacing: "0.1em",
                    fontWeight: 700,
                  }}
                >
                  {truck.status === "ON SCHEDULE" ? dict.landing.operations.fleet.onSchedule : 
                   truck.status === "DELAYED" ? dict.landing.operations.fleet.delayed : 
                   dict.landing.operations.fleet.arriving}
                </Typography>
                <Typography
                  sx={{
                    color: "white",
                    fontSize: "0.625rem",
                    fontFamily: "monospace",
                  }}
                >
                  {truck.progress}%
                </Typography>
              </Stack>
              <Box
                sx={{
                  width: "100%",
                  height: 4,
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    width: `${truck.progress}%`,
                    height: "100%",
                    bgcolor: truck.error ? "#ffb4ab" : "#00f2ff",
                    borderRadius: 2,
                    boxShadow: `0 0 10px ${
                      truck.error ? "#ffb4ab" : "#00f2ff"
                    }`,
                  }}
                />
              </Box>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <SpeedIcon
                sx={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 16 }}
              />
              <Typography
                sx={{
                  color: "white",
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                }}
              >
                {truck.speed}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );

  const renderRoutes = () => (
    <Box
      sx={{
        flex: 1,
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        overflowY: "auto",
        bgcolor: "rgba(0, 0, 0, 0.4)",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          className: "bg-grid-pattern",
          opacity: 0.05,
          pointerEvents: "none",
        }}
      />
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Typography
          className="font-label-md"
          sx={{
            color: "#00f2ff",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            fontWeight: 900,
          }}
        >
          {dict.landing.operations.routes.title}
        </Typography>
        <Box
          sx={{ flex: 1, height: "1px", bgcolor: "rgba(0, 242, 255, 0.2)" }}
        />
      </Stack>

      <Grid container spacing={3} sx={{ position: "relative", zIndex: 1 }}>
        {[
          {
            route: "BERLIN -> PARIS",
            oldEta: "14h 30m",
            newEta: "12h 15m",
            saved: "2h 15m",
            efficiency: "+18%",
          },
          {
            route: "VIENNA -> MILAN",
            oldEta: "8h 45m",
            newEta: "7h 50m",
            saved: "55m",
            efficiency: "+12%",
          },
          {
            route: "MADRID -> LYON",
            oldEta: "11h 20m",
            newEta: "9h 40m",
            saved: "1h 40m",
            efficiency: "+15%",
          },
          {
            route: "PRAGUE -> WARSAW",
            oldEta: "6h 15m",
            newEta: "5h 30m",
            saved: "45m",
            efficiency: "+9%",
          },
        ].map((route, i) => (
          <Grid size={{ xs: 12, lg: 6 }} key={i}>
            <Box
              className="glass-panel"
              sx={{
                p: 3,
                borderRadius: "4px",
                border: "1px solid rgba(0, 242, 255, 0.15)",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  borderColor: "#00f2ff",
                  boxShadow: "0 0 20px rgba(0, 242, 255, 0.1)",
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100px",
                  height: "100px",
                  background:
                    "radial-gradient(circle at top right, rgba(0, 242, 255, 0.1), transparent)",
                  pointerEvents: "none",
                }}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={3}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <RouteIcon sx={{ color: "#00f2ff", fontSize: 20 }} />
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: 900,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {route.route}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: "rgba(0, 242, 255, 0.1)",
                    border: "1px solid rgba(0, 242, 255, 0.3)",
                    borderRadius: "4px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#00f2ff",
                      fontSize: "0.625rem",
                      fontWeight: 900,
                    }}
                  >
                    EFF {route.efficiency}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={4}>
                <Box>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.4)",
                      fontSize: "0.625rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      mb: 0.5,
                    }}
                  >
                    {dict.landing.operations.routes.originalEta}
                  </Typography>
                  <Typography
                    sx={{
                      color: "white",
                      opacity: 0.5,
                      textDecoration: "line-through",
                      fontFamily: "monospace",
                    }}
                  >
                    {route.oldEta}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.4)",
                      fontSize: "0.625rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      mb: 0.5,
                    }}
                  >
                    {dict.landing.operations.routes.optimizedEta}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#00f2ff",
                      fontWeight: 900,
                      fontFamily: "monospace",
                    }}
                  >
                    {route.newEta}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.4)",
                      fontSize: "0.625rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      mb: 0.5,
                    }}
                  >
                    {dict.landing.operations.routes.timeSaved}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#7bd0ff",
                      fontWeight: 900,
                      fontFamily: "monospace",
                    }}
                  >
                    {route.saved}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ py: 12, bgcolor: "#10141a", overflow: "hidden" }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box
            className="glass-panel"
            sx={{
              width: "100%",
              borderRadius: "4px",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 40px 100px -20px rgba(0,0,0,0.8)",
            }}
          >
            {/* Window Header */}
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "rgba(255, 255, 255, 0.03)",
              }}
            >
              <Stack direction="row" spacing={1.5}>
                {[1, 2, 3].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                    }}
                  />
                ))}
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#00f2ff",
                    animation: "pulse 2s infinite",
                  }}
                />
                <Typography
                  className="font-label-md"
                  sx={{
                    fontSize: "0.75rem",
                    color: "white",
                    fontWeight: 700,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                  }}
                >
                  {dict.landing.operations.telemetry.globalCommand}
                </Typography>
              </Stack>
              <Box sx={{ width: 60 }} />
            </Box>

            {/* Content Area */}
            <Box
              sx={{
                display: "flex",
                height: { xs: "auto", md: 600 },
                className: "bg-grid-pattern",
              }}
            >
              {/* Sidebar */}
              <Box
                sx={{
                  width: 280,
                  borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                  bgcolor: "rgba(0, 0, 0, 0.3)",
                  p: 4,
                  display: { xs: "none", lg: "flex" },
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <Stack spacing={1.5}>
                  {sidebarItems.map((item) => (
                    <Box
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      sx={{
                        px: 2,
                        py: 1.25,
                        borderRadius: "4px",
                        bgcolor:
                          activeTab === item.id
                            ? "rgba(0, 242, 255, 0.1)"
                            : "transparent",
                        border:
                          activeTab === item.id
                            ? "1px solid rgba(0, 242, 255, 0.4)"
                            : "1px solid transparent",
                        color:
                          activeTab === item.id
                            ? "#00f2ff"
                            : "rgba(255, 255, 255, 0.7)",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor:
                            activeTab === item.id
                              ? "rgba(0, 242, 255, 0.15)"
                              : "rgba(255, 255, 255, 0.05)",
                        },
                      }}
                    >
                      {item.icon}
                      <Typography
                        className="font-label-md"
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Box sx={{ mt: "auto" }}>
                  <Box
                    className="glass-inner"
                    sx={{
                      p: 2.5,
                      borderRadius: "4px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.625rem",
                        color: "rgba(255, 255, 255, 0.6)",
                        mb: 1.5,
                        letterSpacing: "0.2em",
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    >
                      {dict.landing.operations.telemetry.nodeStatus}
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#00f2ff",
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 900,
                          color: "#00f2ff",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {dict.landing.operations.telemetry.systemsNominal}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
              </Box>

              {/* Main Panel */}
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Stats Row */}
                <Grid
                  container
                  sx={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    bgcolor: "rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {stats.map((stat, idx) => (
                    <Grid
                      size={{ xs: 6, md: 3 }}
                      key={stat.label}
                      sx={{
                        p: 4,
                        borderRight:
                          idx < stats.length - 1
                            ? "1px solid rgba(255, 255, 255, 0.1)"
                            : "none",
                      }}
                    >
                      <Typography
                        className="font-label-md"
                        sx={{
                          fontSize: "0.625rem",
                          color: "rgba(255, 255, 255, 0.7)",
                          textTransform: "uppercase",
                          mb: 1,
                          letterSpacing: "0.2em",
                        }}
                      >
                        {stat.label}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 900, color: "white" }}
                      >
                        {stat.value}
                        {stat.unit && (
                          <Box
                            component="span"
                            sx={{
                              fontSize: "1rem",
                              color: "rgba(255, 255, 255, 0.3)",
                              ml: 0.5,
                            }}
                          >
                            {stat.unit}
                          </Box>
                        )}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

                {/* Content Visualization */}
                {activeTab === "overview" && renderOverview()}
                {activeTab === "fleet" && renderFleet()}
                {activeTab === "routes" && renderRoutes()}
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

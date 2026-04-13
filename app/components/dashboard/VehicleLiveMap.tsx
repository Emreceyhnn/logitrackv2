"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Chip, 
  Avatar, 
  Stack, 
  IconButton
} from "@mui/material";
import { 
  LocalShipping as TruckIcon, 
  Speed as SpeedIcon, 
  Person as DriverIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { MapWithMarker, MarkerData } from "../googleMaps/MapWithMarker";
import { useAllVehiclesTracking } from "@/app/hooks/useVehicleTracking";
import { getVehicles } from "@/app/lib/controllers/vehicle";
import { VehicleWithRelations } from "@/app/lib/type/vehicle";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

const COLORS = {
  panel: "rgba(15, 23, 42, 0.8)",
  border: "rgba(255, 255, 255, 0.1)",
  textPrimary: "#f8fafc",
  textSecondary: "#94a3b8",
  accent: "#38bdf8",
  success: "#4ade80",
};

export const VehicleLiveMap = () => {
  const [vehicles, setVehicles] = useState<VehicleWithRelations[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const { vehicleLocations } = useAllVehiclesTracking();
  const [initialLoading, setInitialLoading] = useState(true);
  const dict = useDictionary();

  // Fetch initial vehicle data (plate, driver, etc.)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Merge static data with live coordinates
  const markers = useMemo<MarkerData[]>(() => {
    return vehicles.map((v) => {
      const live = vehicleLocations[v.id];
      const position = live ? { lat: live.lat, lng: live.lng } : (v.currentLat && v.currentLng ? { lat: v.currentLat, lng: v.currentLng } : { lat: 41.0082, lng: 28.9784 });
      
      return {
        position,
        label: v.plate,
        type: "vehicle",
      };
    });
  }, [vehicles, vehicleLocations]);

  const selectedVehicle = useMemo(() => 
    vehicles.find(v => v.id === selectedVehicleId), 
  [vehicles, selectedVehicleId]);

  const selectedLive = selectedVehicleId ? vehicleLocations[selectedVehicleId] : null;

  if (initialLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 500, bgcolor: "rgba(0,0,0,0.4)", borderRadius: 4 }}>
        <CircularProgress sx={{ color: COLORS.accent }} />
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", width: "100%", height: 600, borderRadius: 4, overflow: "hidden" }}>
      <MapWithMarker 
        height={600} 
        markers={markers} 
        onMarkerClick={(m) => {
          const v = vehicles.find(veh => veh.plate === m.label);
          if (v) setSelectedVehicleId(v.id);
        }}
        center={selectedLive ? { lat: selectedLive.lat, lng: selectedLive.lng } : undefined}
        zoom={selectedLive ? 15 : undefined}
      />

      {/* Stats Overlay */}
      <Box sx={{ 
        position: "absolute", 
        top: 20, 
        left: 20, 
        zIndex: 1, 
        pointerEvents: "none" 
      }}>
        <Paper sx={{ 
          p: 2, 
          bgcolor: COLORS.panel, 
          backdropFilter: "blur(10px)",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 3,
          pointerEvents: "auto",
          minWidth: 200
        }}>
          <Typography variant="subtitle2" sx={{ color: COLORS.textSecondary, mb: 1, fontWeight: 700, textTransform: "uppercase", fontSize: 10 }}>
            {dict.dashboard.fleet.status}
          </Typography>
          <Stack spacing={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" sx={{ color: COLORS.textPrimary }}>{dict.dashboard.fleet.activeUnits}</Typography>
              <Chip label={Object.keys(vehicleLocations).length} size="small" sx={{ bgcolor: COLORS.success, color: "black", fontWeight: 700, height: 20 }} />
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" sx={{ color: COLORS.textPrimary }}>{dict.dashboard.fleet.totalFleet}</Typography>
              <Typography variant="body2" sx={{ color: COLORS.accent, fontWeight: 700 }}>{vehicles.length}</Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* Selected Vehicle Detail Card */}
      {selectedVehicle && (
        <Box sx={{ 
          position: "absolute", 
          bottom: 20, 
          right: 20, 
          left: { xs: 20, sm: "auto" },
          zIndex: 1 
        }}>
          <Paper sx={{ 
            p: 2.5, 
            width: { sm: 320 },
            bgcolor: COLORS.panel, 
            backdropFilter: "blur(12px)",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 4,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box>
                <Chip 
                  icon={<TruckIcon sx={{ fontSize: 14 }} />} 
                  label={selectedVehicle.plate} 
                  sx={{ bgcolor: COLORS.accent, color: "black", fontWeight: 800, mb: 1 }} 
                />
                <Typography variant="h6" sx={{ color: COLORS.textPrimary, fontWeight: 700, lineHeight: 1.2 }}>
                  {selectedVehicle.brand} {selectedVehicle.model}
                </Typography>
                <Typography variant="caption" sx={{ color: COLORS.textSecondary }}>
                  {dict.dashboard.fleet.fleetId}: {selectedVehicle.fleetNo}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => setSelectedVehicleId(null)} sx={{ color: COLORS.textSecondary }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Stack spacing={2}>
              {selectedVehicle.driver ? (
                <Box sx={{ p: 1.5, bgcolor: "rgba(255,255,255,0.03)", borderRadius: 3, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar src={selectedVehicle.driver.user.avatarUrl || ""} sx={{ width: 40, height: 40 }}>
                      <DriverIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ color: COLORS.textPrimary, fontWeight: 600 }}>
                        {selectedVehicle.driver.user.name} {selectedVehicle.driver.user.surname}
                      </Typography>
                      <Typography variant="caption" sx={{ color: COLORS.textSecondary }}>
                        {dict.dashboard.fleet.currentOperator}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              ) : (
                <Typography variant="caption" sx={{ color: COLORS.textSecondary, fontStyle: "italic" }}>
                  {dict.dashboard.fleet.noDriver}
                </Typography>
              )}

              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1, p: 1.5, bgcolor: "rgba(0,0,0,0.2)", borderRadius: 2, textAlign: "center" }}>
                  <SpeedIcon sx={{ color: COLORS.accent, mb: 0.5 }} />
                  <Typography variant="h6" sx={{ color: COLORS.textPrimary, fontWeight: 800, lineHeight: 1 }}>
                    {selectedLive?.speed?.toFixed(0) || "0"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: COLORS.textSecondary }}>{dict.dashboard.fleet.kmh}</Typography>
                </Box>
                <Box sx={{ flex: 1, p: 1.5, bgcolor: "rgba(0,0,0,0.2)", borderRadius: 2, textAlign: "center" }}>
                  <Typography variant="caption" sx={{ color: COLORS.textSecondary, display: "block", mb: 0.5 }}>{dict.dashboard.fleet.signal}</Typography>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: "50%", 
                    bgcolor: selectedLive ? COLORS.success : COLORS.textSecondary,
                    mx: "auto",
                    mb: 1,
                    boxShadow: selectedLive ? `0 0 10px ${COLORS.success}` : "none"
                  }} />
                  <Typography variant="body2" sx={{ color: COLORS.textPrimary, fontWeight: 700 }}>
                    {selectedLive ? dict.dashboard.fleet.live : dict.dashboard.fleet.syncing}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

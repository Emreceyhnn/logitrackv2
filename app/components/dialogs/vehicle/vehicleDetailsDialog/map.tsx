"use client";

import { useMemo, useState, useEffect } from "react";
import { MapWithMarker } from "@/app/components/googleMaps/MapWithMarker";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import CustomCard from "../../../cards/card";
import { useVehicleTracking } from "@/app/hooks/useVehicleTracking";
import { Box, Stack, Typography, Chip, Skeleton, useTheme } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SignalWifiOffIcon from "@mui/icons-material/SignalWifiOff";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt";
import SpeedIcon from "@mui/icons-material/Speed";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface MapVehicleOverviewCardProps {
  /** The vehicle ID — used to subscribe to Firebase RTDB */
  id: string;
  /** Vehicle plate number — shown as the marker label */
  name: string;
  /** Static DB location — used as fallback if Firebase has no data yet */
  dbLocation?: { lat: number; lng: number } | null;
}

const isLive = (timestamp: number | undefined, now: number): boolean => {
  if (!timestamp) return false;
  return now - timestamp < 30_000; // live if updated in last 30s
};

// ─── Component ────────────────────────────────────────────────────────────────

const MapVehicleOverviewCard = ({
  id,
  name,
  dbLocation,
}: MapVehicleOverviewCardProps) => {
  const theme = useTheme();
  const dict = useDictionary();
  const [now, setNow] = useState(0);

  useEffect(() => {
    const t = Date.now();
    const timer = setTimeout(() => {
      setNow(t);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const formatAge = (timestamp: number | undefined, currentNow: number): string => {
    if (!timestamp) return dict.common.na;
    const diffMs = currentNow - timestamp;
    const diffSec = Math.round(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}${dict.vehicles.dialogs.secondsAgo}`;
    const diffMin = Math.round(diffSec / 60);
    if (diffMin < 60) return `${diffMin}${dict.vehicles.dialogs.minutesAgo}`;
    return `${Math.round(diffMin / 60)}${dict.vehicles.dialogs.hoursAgo}`;
  };

  // Subscribe to Firebase RTDB — fires on every location push from the device
  const { location: liveLocation, loading } = useVehicleTracking(id);

  // Priority: Firebase live data → Postgres DB fallback → nothing
  const activeLocation = useMemo(
    () =>
      liveLocation
        ? { lat: liveLocation.lat, lng: liveLocation.lng }
        : dbLocation ?? null,
    [liveLocation, dbLocation]
  );

  const hasLiveSignal = useMemo(() => isLive(liveLocation?.lastUpdated, now), [liveLocation?.lastUpdated, now]);

  const markers = useMemo(
    () =>
      activeLocation
        ? [
            {
              position: activeLocation,
              label: name,
              type: "vehicle" as const,
            },
          ]
        : [],
    [activeLocation, name]
  );

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <CustomCard sx={{ flexGrow: 1, padding: 0, overflow: "hidden", position: "relative" }}>
      {/* ── Live/Offline Status Badge ─────────────────────────────────── */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        {loading ? (
          <Skeleton variant="rounded" width={90} height={26} sx={{ bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
        ) : hasLiveSignal ? (
          <Chip
            icon={
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#4ade80",
                  animation: "pulse 1.5s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1, transform: "scale(1)" },
                    "50%": { opacity: 0.5, transform: "scale(1.3)" },
                  },
                  ml: "6px !important",
                }}
              />
            }
            label={dict.vehicles.dialogs.liveStatus}
            size="small"
            sx={{
              bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(74, 222, 128, 0.15)" : "rgba(74, 222, 128, 0.1)",
              border: (theme) => `1px solid ${theme.palette.mode === "dark" ? "rgba(74, 222, 128, 0.4)" : "rgba(74, 222, 128, 0.5)"}`,
              color: (theme) => theme.palette.mode === "dark" ? "#4ade80" : "#166534",
              fontWeight: 800,
              fontSize: "0.65rem",
              letterSpacing: "0.08em",
              backdropFilter: "blur(8px)",
              height: 26,
            }}
          />
        ) : (
          <Chip
            icon={<SignalWifiOffIcon sx={{ fontSize: "0.85rem !important", color: "text.secondary" }} />}
            label={dict.vehicles.dialogs.noSignal}
            size="small"
            sx={{
              bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              border: `1px solid ${theme.palette.divider}`,
              color: "text.secondary",
              fontWeight: 600,
              fontSize: "0.65rem",
              letterSpacing: "0.06em",
              backdropFilter: "blur(8px)",
              height: 26,
            }}
          />
        )}
      </Box>

      {/* ── Map ──────────────────────────────────────────────────────────── */}
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{ minHeight: 320, bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
        />
      ) : activeLocation ? (
        <GoogleMapsProvider>
          <MapWithMarker markers={markers} />
        </GoogleMapsProvider>
      ) : (
        // ── No Location State ──
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={1.5}
          sx={{
            minHeight: 320,
            bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
            borderRadius: 2,
          }}
        >
          <SatelliteAltIcon sx={{ fontSize: 48, color: "text.disabled" }} />
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 700 }}>
            {dict.vehicles.dialogs.noGpsData}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled", textAlign: "center", px: 2 }}>
            {dict.vehicles.dialogs.noGpsDesc}
          </Typography>
        </Stack>
      )}

      {/* ── Live Telemetry Footer ─────────────────────────────────────── */}
      {liveLocation && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            px: 2,
            py: 1.5,
            background: (theme) => theme.palette.mode === "dark" 
              ? "linear-gradient(to top, rgba(11, 16, 25, 0.95) 0%, rgba(11, 16, 25, 0.7) 50%, transparent 100%)"
              : "linear-gradient(to top, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.7) 50%, transparent 100%)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            {/* Coordinates */}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <MyLocationIcon sx={{ fontSize: 12, color: "primary.main" }} />
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontFamily: "monospace", fontSize: "0.68rem", fontWeight: 700 }}
              >
                {liveLocation.lat.toFixed(5)}, {liveLocation.lng.toFixed(5)}
              </Typography>
            </Stack>

            {/* Speed */}
            {liveLocation.speed != null && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <SpeedIcon sx={{ fontSize: 12, color: "secondary.main" }} />
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", fontSize: "0.68rem", fontWeight: 800 }}
                >
                  {Math.round(liveLocation.speed)} km/h
                </Typography>
              </Stack>
            )}

            {/* Last Updated */}
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", fontSize: "0.62rem", ml: "auto !important", fontWeight: 600 }}
            >
              {dict.vehicles.dialogs.updated} {formatAge(liveLocation.lastUpdated, now)}
            </Typography>
          </Stack>
        </Box>
      )}

      {/* DB fallback label — shown when using Postgres static coords */}
      {!liveLocation && dbLocation && !loading && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            px: 2,
            py: 1,
            background: (theme) => theme.palette.mode === "dark" ? "rgba(11, 16, 25, 0.85)" : "rgba(255, 255, 255, 0.85)",
            zIndex: 10,
            pointerEvents: "none",
            backdropFilter: "blur(4px)",
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontSize: "0.65rem", fontWeight: 700 }}
          >
            {dict.vehicles.dialogs.dbFallback}
          </Typography>
        </Box>
      )}
    </CustomCard>
  );
};

export default MapVehicleOverviewCard;

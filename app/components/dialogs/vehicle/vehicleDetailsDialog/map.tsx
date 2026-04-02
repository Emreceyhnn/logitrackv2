"use client";

import { useMemo } from "react";
import { MapWithMarker } from "@/app/components/googleMaps/MapWithMarker";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import CustomCard from "../../../cards/card";
import { useVehicleTracking } from "@/app/hooks/useVehicleTracking";
import { Box, Stack, Typography, Chip, alpha, Skeleton } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt";
import SpeedIcon from "@mui/icons-material/Speed";
import SignalWifiOffIcon from "@mui/icons-material/SignalWifiOff";

interface MapVehicleOverviewCardProps {
  /** The vehicle ID — used to subscribe to Firebase RTDB */
  id: string;
  /** Vehicle plate number — shown as the marker label */
  name: string;
  /** Static DB location — used as fallback if Firebase has no data yet */
  dbLocation?: { lat: number; lng: number } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatAge = (timestamp: number | undefined): string => {
  if (!timestamp) return "Unknown";
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.round(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  return `${Math.round(diffMin / 60)}h ago`;
};

const isLive = (timestamp: number | undefined): boolean => {
  if (!timestamp) return false;
  return Date.now() - timestamp < 30_000; // live if updated in last 30s
};

// ─── Component ────────────────────────────────────────────────────────────────

const MapVehicleOverviewCard = ({
  id,
  name,
  dbLocation,
}: MapVehicleOverviewCardProps) => {
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

  const hasLiveSignal = isLive(liveLocation?.lastUpdated);

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
          <Skeleton variant="rounded" width={90} height={26} sx={{ bgcolor: "rgba(255,255,255,0.08)" }} />
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
            label="LIVE"
            size="small"
            sx={{
              bgcolor: alpha("#4ade80", 0.15),
              border: `1px solid ${alpha("#4ade80", 0.4)}`,
              color: "#4ade80",
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.08em",
              backdropFilter: "blur(8px)",
              height: 26,
            }}
          />
        ) : (
          <Chip
            icon={<SignalWifiOffIcon sx={{ fontSize: "0.85rem !important", color: "#94a3b8" }} />}
            label="NO SIGNAL"
            size="small"
            sx={{
              bgcolor: alpha("#1e293b", 0.8),
              border: `1px solid ${alpha("#94a3b8", 0.2)}`,
              color: "#94a3b8",
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
          sx={{ minHeight: 320, bgcolor: "rgba(255,255,255,0.04)" }}
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
            bgcolor: alpha("#0f172a", 0.8),
            borderRadius: 2,
          }}
        >
          <SatelliteAltIcon sx={{ fontSize: 48, color: alpha("#94a3b8", 0.3) }} />
          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
            No GPS data available
          </Typography>
          <Typography variant="caption" sx={{ color: "#475569", textAlign: "center", px: 2 }}>
            Location will appear here once the vehicle<br />starts transmitting GPS data.
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
            background: "linear-gradient(to top, rgba(11,16,25,0.95) 0%, rgba(11,16,25,0.7) 50%, transparent 100%)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            {/* Coordinates */}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <MyLocationIcon sx={{ fontSize: 12, color: "#38bdf8" }} />
              <Typography
                variant="caption"
                sx={{ color: "#94a3b8", fontFamily: "monospace", fontSize: "0.68rem" }}
              >
                {liveLocation.lat.toFixed(5)}, {liveLocation.lng.toFixed(5)}
              </Typography>
            </Stack>

            {/* Speed */}
            {liveLocation.speed != null && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <SpeedIcon sx={{ fontSize: 12, color: "#a78bfa" }} />
                <Typography
                  variant="caption"
                  sx={{ color: "#94a3b8", fontSize: "0.68rem", fontWeight: 600 }}
                >
                  {Math.round(liveLocation.speed)} km/h
                </Typography>
              </Stack>
            )}

            {/* Last Updated */}
            <Typography
              variant="caption"
              sx={{ color: "#475569", fontSize: "0.62rem", ml: "auto !important" }}
            >
              Updated {formatAge(liveLocation.lastUpdated)}
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
            background: "rgba(11,16,25,0.85)",
            zIndex: 10,
            pointerEvents: "none",
            backdropFilter: "blur(4px)",
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "#64748b", fontSize: "0.65rem" }}
          >
            Showing last known DB position — live signal not yet active
          </Typography>
        </Box>
      )}
    </CustomCard>
  );
};

export default MapVehicleOverviewCard;

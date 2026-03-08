"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { GoogleMap, useJsApiLoader, Polyline } from "@react-google-maps/api";
import { AdvancedMarker } from "./advancedMarker";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Stack, Typography } from "@mui/material";
import { GOOGLE_MAPS_LIBRARIES } from "@/app/lib/constants";

type LatLng = { lat: number; lng: number };

type LocationItem = {
  id: string | number;
  name: string;
  position: LatLng;
  type: string;
};

interface GoogleMapViewProps {
  isRoute?: boolean;
  locA?: LatLng;
  locB?: LatLng;
  addrA?: string;
  addrB?: string;
  waypoints?: google.maps.DirectionsWaypoint[];
  warehouseLoc?: LocationItem[];
  zoom?: number;
  onClick?: (e: google.maps.MapMouseEvent) => void;
}

const containerStyle = { width: "100%", height: "100%", borderRadius: 8 };

const GoogleMapView = ({
  isRoute = false,
  locA,
  locB,
  addrA,
  addrB,
  waypoints = [],
  warehouseLoc = [],
  zoom = 12,
  onClick,
}: GoogleMapViewProps) => {
  /* --------------------------------- states --------------------------------- */
  const [routePath, setRoutePath] = useState<LatLng[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [localLocA, setLocalLocA] = useState<LatLng | undefined>(undefined);
  const [localLocB, setLocalLocB] = useState<LatLng | undefined>(undefined);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const mapCenter: LatLng = useMemo(() => {
    return (
      locA ??
      localLocA ??
      warehouseLoc?.[0]?.position ?? { lat: 40.195, lng: 29.06 }
    );
  }, [locA, localLocA, warehouseLoc]);

  /* --------------------------------- handler -------------------------------- */
  const handleLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
      mapInstance.panTo(mapCenter);
    },
    [mapCenter]
  );

  /* -------------------------------- lifecycle ------------------------------- */
  const locAStr = JSON.stringify(locA);
  const locBStr = JSON.stringify(locB);
  const waypointsStr = JSON.stringify(waypoints);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isRoute) {
      setRoutePath([]);
      setLocalLocA(undefined);
      setLocalLocB(undefined);
      return;
    }

    if (!(locA || addrA) || !(locB || addrB)) return;

    const fetchRoute = async () => {
      try {
        const { getDirections } = await import("@/app/lib/controllers/map");

        // Safely extract lat/lng from waypoints
        const formattedWaypoints = waypoints.map((w) => {
          let location: string | LatLng = "";
          if (typeof w.location === "string") {
            location = w.location;
          } else {
            let lat = 0;
            let lng = 0;
            if (
              w.location &&
              typeof w.location === "object" &&
              "lat" in w.location &&
              typeof (w.location as google.maps.LatLng).lat === "function"
            ) {
              lat = (w.location as google.maps.LatLng).lat();
              lng = (w.location as google.maps.LatLng).lng();
            } else if (
              w.location &&
              typeof w.location === "object" &&
              "lat" in w.location &&
              typeof (w.location as google.maps.LatLngLiteral).lat === "number"
            ) {
              lat = (w.location as google.maps.LatLngLiteral).lat;
              lng = (w.location as google.maps.LatLngLiteral).lng;
            }
            location = { lat, lng };
          }

          return {
            location,
            stopover: !!w.stopover,
          };
        });

        const data = await getDirections(
          locA || addrA!,
          locB || addrB!,
          formattedWaypoints
        );

        if (data && data.routes && data.routes.length > 0) {
          const leg = data.routes[0].legs[0];

          // If coordinates were missing, extract them from the Directions result
          if (!locA && leg.start_location) {
            setLocalLocA({
              lat: leg.start_location.lat,
              lng: leg.start_location.lng,
            });
          }
          if (!locB && leg.end_location) {
            setLocalLocB({
              lat: leg.end_location.lat,
              lng: leg.end_location.lng,
            });
          }

          const points = google.maps.geometry.encoding.decodePath(
            data.routes[0].overview_polyline.points
          );
          setRoutePath(points.map((p) => ({ lat: p.lat(), lng: p.lng() })));

          // Fit bounds
          if (map) {
            const bounds = new google.maps.LatLngBounds();
            points.forEach((p) => bounds.extend(p));
            map.fitBounds(bounds);
          }
        }
      } catch (error) {
        console.error("Failed to load directions", error);
      }
    };

    fetchRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isRoute, map, locAStr, locBStr, addrA, addrB, waypointsStr]);

  if (!isLoaded) return null;

  /* ------------------------------- components ------------------------------- */
  const IconSetter = (type: string) => {
    const PinWrapper = ({
      color,
      label,
    }: {
      color: string;
      label?: string;
    }) => (
      <Stack alignItems="center" sx={{ position: "relative" }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            bgcolor: color,
            borderRadius: "50% 50% 50% 0",
            transform: "rotate(-45deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid white",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        >
          {label && (
            <Typography
              sx={{
                color: "white",
                fontWeight: 900,
                fontSize: 14,
                transform: "rotate(45deg)",
                lineHeight: 1,
              }}
            >
              {label}
            </Typography>
          )}
        </Box>
      </Stack>
    );

    if (type === "W" || type === "ORIGIN") {
      return <PinWrapper color="#4285F4" label="A" />; // Google Blue
    } else if (type === "V") {
      return (
        <DirectionsCarIcon
          sx={{
            color: "#34A853",
            fontSize: 32,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
        />
      );
    } else if (type === "C" || type === "DEST") {
      return <PinWrapper color="#EA4335" label="B" />; // Google Red
    } else {
      return <PersonIcon sx={{ color: "#FBBC05", fontSize: 30 }} />;
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      onLoad={handleLoad}
      zoom={zoom}
      onClick={onClick}
      options={{
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID!,
      }}
    >
      {map &&
        warehouseLoc
          .filter(
            (w) =>
              w.position &&
              typeof w.position.lat === "number" &&
              !isNaN(w.position.lat) &&
              typeof w.position.lng === "number" &&
              !isNaN(w.position.lng)
          )
          .map((w, index) => (
            <AdvancedMarker
              key={w.id}
              map={map!}
              position={w.position}
              index={index}
            >
              <Stack alignItems={"center"}>
                {IconSetter(w.type)}
                <Typography sx={{ fontSize: 14, color: "black" }}>
                  {w.name}
                </Typography>
              </Stack>
            </AdvancedMarker>
          ))}

      {/* Markers for Route Origin/Dest if not in warehouseLoc */}
      {map && isRoute && (locA || localLocA) && (
        <AdvancedMarker
          map={map!}
          position={locA || localLocA!}
          index={100}
          key="origin"
        >
          {IconSetter("ORIGIN")}
        </AdvancedMarker>
      )}
      {map && isRoute && (locB || localLocB) && (
        <AdvancedMarker
          map={map!}
          position={locB || localLocB!}
          index={101}
          key="dest"
        >
          {IconSetter("DEST")}
        </AdvancedMarker>
      )}

      {isRoute && routePath.length > 0 && (
        <Polyline
          path={routePath}
          options={{
            strokeColor: "#2196F3",
            strokeOpacity: 0.8,
            strokeWeight: 6,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default memo(GoogleMapView);

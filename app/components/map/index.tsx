"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { GoogleMap, useJsApiLoader, Polyline } from "@react-google-maps/api";
import { AdvancedMarker } from "./advancedMarker";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import { Stack, Typography } from "@mui/material";
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
  waypoints = [],
  warehouseLoc = [],
  zoom = 12,
  onClick,
}: GoogleMapViewProps) => {
  /* --------------------------------- states --------------------------------- */
  const [routePath, setRoutePath] = useState<LatLng[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const mapCenter: LatLng = useMemo(() => {
    return locA ?? warehouseLoc?.[0]?.position ?? { lat: 40.195, lng: 29.06 };
  }, [locA, warehouseLoc]);

  /* --------------------------------- handler -------------------------------- */
  const handleLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
      mapInstance.panTo(mapCenter);
    },
    [mapCenter]
  );

  /* -------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    if (!isLoaded) return;
    if (!isRoute) {
      setRoutePath([]);
      return;
    }
    if (!locA || !locB) return;

    const fetchRoute = async () => {
      try {
        const { getDirections } = await import("@/app/lib/controllers/map");

        // Safely extract lat/lng from waypoints
        const formattedWaypoints = waypoints.map((w) => {
          let lat = 0;
          let lng = 0;
          // Check if location is a LatLng object (has functions)
          if (
            w.location &&
            typeof w.location === "object" &&
            "lat" in w.location &&
            typeof (w.location as google.maps.LatLng).lat === "function"
          ) {
            lat = (w.location as google.maps.LatLng).lat();
            lng = (w.location as google.maps.LatLng).lng();
          }
          // Check if location is a LatLngLiteral (has properties)
          else if (
            w.location &&
            typeof w.location === "object" &&
            "lat" in w.location &&
            typeof (w.location as google.maps.LatLngLiteral).lat === "number"
          ) {
            lat = (w.location as google.maps.LatLngLiteral).lat;
            lng = (w.location as google.maps.LatLngLiteral).lng;
          }
          return {
            location: { lat, lng },
            stopover: !!w.stopover,
          };
        });

        const data = await getDirections(locA, locB, formattedWaypoints);

        if (data && data.routes && data.routes.length > 0) {
          const points = google.maps.geometry.encoding.decodePath(
            data.routes[0].overview_polyline.points
          );
          setRoutePath(points.map((p) => ({ lat: p.lat(), lng: p.lng() })));

          // Fit bounds
          if (map) {
            const pointsLatLng = points;
            const bounds = new google.maps.LatLngBounds();
            pointsLatLng.forEach((p) => bounds.extend(p));
            map.fitBounds(bounds);
          }
        }
      } catch (error) {
        console.error("Failed to load directions", error);
      }
    };

    fetchRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoaded,
    isRoute,
    map,
    JSON.stringify(locA),
    JSON.stringify(locB),
    JSON.stringify(waypoints),
  ]);

  if (!isLoaded) return null;

  /* ------------------------------- components ------------------------------- */
  const IconSetter = (type: string) => {
    if (type === "W") {
      return <WarehouseIcon sx={{ color: "orange", fontSize: 30 }} />;
    } else if (type === "V") {
      return <DirectionsCarIcon sx={{ color: "blue", fontSize: 30 }} />;
    } else if (type === "C") {
      return <StoreIcon sx={{ color: "#7b1fa2", fontSize: 30 }} />;
    } else {
      return <PersonIcon sx={{ color: "blue", fontSize: 30 }} />;
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
      {map && isRoute && locA && (
        <AdvancedMarker map={map!} position={locA} index={100} key="origin">
          <Stack alignItems="center">
            <WarehouseIcon sx={{ color: "green", fontSize: 30 }} />
            <Typography sx={{ fontSize: 12, fontWeight: "bold" }}>
              Start
            </Typography>
          </Stack>
        </AdvancedMarker>
      )}
      {map && isRoute && locB && (
        <AdvancedMarker map={map!} position={locB} index={101} key="dest">
          <Stack alignItems="center">
            <StoreIcon sx={{ color: "red", fontSize: 30 }} />
            <Typography sx={{ fontSize: 12, fontWeight: "bold" }}>
              End
            </Typography>
          </Stack>
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

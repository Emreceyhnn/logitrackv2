"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { GoogleMap, PolylineF, OverlayView } from "@react-google-maps/api";
import Image from "next/image";
import polyline from "@mapbox/polyline";

/* --------------------------------- TYPES ---------------------------------- */

export interface LocationPoint {
  lat: number;
  lng: number;
}

export type RouteMarkerType = "vehicle" | "warehouse" | "customer";

export interface RouteMarker {
  id: string;
  position: LocationPoint;
  type: RouteMarkerType;
  label?: string;
}

export interface RouteMapProps {
  origin: LocationPoint;
  destination: LocationPoint;
  stops?: LocationPoint[];
  markers?: RouteMarker[];
  height?: string | number;
}

/* --------------------------------- STYLES --------------------------------- */
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
};

const polylineOptions = {
  strokeColor: "#3B82F6",
  strokeOpacity: 0.8,
  strokeWeight: 6,
};

/* ------------------------------- ADVANCED MARKER ------------------------------- */

const AdvancedMarker = ({
  map,
  position,
  title,
  label,
  iconUrl,
  bgColor,
  zIndex,
}: {
  map: google.maps.Map | null;
  position: LocationPoint;
  title?: string;
  label?: string;
  iconUrl?: string;
  bgColor?: string;
  zIndex?: number;
}) => {
  useEffect(() => {
    if (!map || typeof window === "undefined" || !window.google) return;

    let content: HTMLElement;

    if (iconUrl) {
      const img = document.createElement("img");
      img.src = iconUrl;
      img.style.width = "32px";
      img.style.height = "32px";
      content = img;
    } else {
      const pin = new window.google.maps.marker.PinElement({
        background: bgColor || "#EA4335",
        borderColor: "#FFFFFF",
        glyphColor: "white",
        glyphText: label || "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      content = pin as unknown as HTMLElement;
    }

    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      position,
      map,
      title,
      content,
      zIndex,
    });

    return () => {
      marker.map = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, position.lat, position.lng, title, label, iconUrl, bgColor, zIndex]);

  return null;
};

/* ------------------------------- MARKER COMPONENT ------------------------------- */
const CustomVehicleMarker = ({
  position,
  label,
}: {
  position: LocationPoint;
  label?: string;
}) => {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        style={{
          transform: "translate(-50%, -100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          pointerEvents: "auto",
        }}
      >
        {label && (
          <div
            style={{
              background: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(8px)",
              border: "1.5px solid rgba(59, 130, 246, 0.5)",
              color: "#FFFFFF",
              fontSize: "12px",
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: "8px",
              whiteSpace: "nowrap",
              letterSpacing: "0.05em",
              marginBottom: "6px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
            }}
          >
            {label}
          </div>
        )}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50% 50% 50% 0",
            transform: "rotate(-45deg)",
            background: "linear-gradient(135deg, #2563EB, #3B82F6)",
            border: "2.5px solid #FFFFFF",
            boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src="/icons/truck.svg"
            alt="truck"
            width={20}
            height={20}
            style={{
              transform: "rotate(45deg)",
              filter: "brightness(0) invert(1)",
            }}
            unoptimized
          />
        </div>
        <div
          style={{
            width: 10,
            height: 5,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.3)",
            marginTop: 2,
            filter: "blur(2px)",
          }}
        />
      </div>
    </OverlayView>
  );
};

/* ------------------------------- MAIN COMPONENT ------------------------------- */

export const RouteMap = ({
  origin,
  destination,
  stops = [],
  markers = [],
  height = "500px",
}: RouteMapProps) => {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [routePath, setRoutePath] = useState<LocationPoint[]>([]);
  const cachedResponseKey = useRef<string | null>(null);

  const routeKey = useMemo(() => {
    if (!origin || !destination) return null;
    const p = (loc: LocationPoint) =>
      `${Number(loc.lat).toFixed(5)},${Number(loc.lng).toFixed(5)}`;
    return `${p(origin)}|${p(destination)}|${stops.map(p).join("-")}`;
  }, [origin, destination, stops]);

  useEffect(() => {
    if (!routeKey || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) return;

    // Guard: don't call API with invalid (0,0) coordinates
    const isValidCoord = (loc: LocationPoint) =>
      loc &&
      loc.lat !== 0 &&
      loc.lng !== 0 &&
      !isNaN(loc.lat) &&
      !isNaN(loc.lng);

    if (!isValidCoord(origin) || !isValidCoord(destination)) {
      setTimeout(() => setRoutePath([]), 0);
      return;
    }

    if (cachedResponseKey.current === routeKey) return;

    const timer = setTimeout(async () => {
      // Filter out invalid stops
      const validStops = stops.filter(isValidCoord);

      const payload = {
        origin: {
          location: { latLng: { latitude: origin.lat, longitude: origin.lng } },
        },
        destination: {
          location: {
            latLng: { latitude: destination.lat, longitude: destination.lng },
          },
        },
        intermediates: validStops.map((s) => ({
          location: { latLng: { latitude: s.lat, longitude: s.lng } },
        })),
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
      };

      try {
        const res = await fetch(
          "https://routes.googleapis.com/directions/v2:computeRoutes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": process.env
                .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
              "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();

        if (data.routes && data.routes[0]) {
          const encodedPolyline = data.routes[0].polyline.encodedPolyline;
          const decoded = polyline
            .decode(encodedPolyline)
            .map(([lat, lng]) => ({ lat, lng }));
          setRoutePath(decoded);
          cachedResponseKey.current = routeKey;
        } else {
          console.error("Routes API v2 failed:", data);
          setRoutePath([]);
        }
      } catch (err) {
        console.error("Error fetching routes:", err);
      }
    }, 150);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  const mapCenter = useMemo(
    () => origin || { lat: 41.0082, lng: 28.9784 },
    [origin]
  );

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      mapId: "DEMO_MAP_ID",
    }),
    []
  );

  return (
    <div
      className="relative w-full overflow-hidden border border-gray-200 shadow-xl rounded-xl"
      style={{ height }}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
        options={mapOptions}
        onLoad={setMapInstance}
      >
        {routePath.length > 0 && (
          <PolylineF path={routePath} options={polylineOptions} />
        )}

        {routePath.length > 0 &&
          stops.map((stop, index) => (
            <AdvancedMarker
              key={`route-stop-${index}`}
              map={mapInstance}
              position={stop}
              label={(index + 1).toString()}
              bgColor="#F59E0B"
              zIndex={500}
            />
          ))}

        {/* Origin & Destination */}
        {origin && (
          <AdvancedMarker
            map={mapInstance}
            position={origin}
            label="A"
            bgColor="#10B981"
            zIndex={400}
          />
        )}
        {destination && (
          <AdvancedMarker
            map={mapInstance}
            position={destination}
            label="B"
            bgColor="#EF4444"
            zIndex={400}
          />
        )}

        {/* Render Extraneous Markers */}
        {markers.map((marker) => {
          if (marker.type === "vehicle") {
            return (
              <CustomVehicleMarker
                key={marker.id}
                position={marker.position}
                label={marker.label}
              />
            );
          }
          if (marker.type === "warehouse") {
            return (
              <AdvancedMarker
                key={marker.id}
                map={mapInstance}
                position={marker.position}
                iconUrl="/icons/warehouse.svg"
                title={marker.label}
              />
            );
          }
          if (marker.type === "customer") {
            return (
              <AdvancedMarker
                key={marker.id}
                map={mapInstance}
                position={marker.position}
                iconUrl="/icons/pin.svg"
                title={marker.label}
              />
            );
          }
          return null;
        })}
      </GoogleMap>
    </div>
  );
};

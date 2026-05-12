import React, { useCallback, useRef, useMemo, useState } from "react";
import { GoogleMap, MarkerF, OverlayView } from "@react-google-maps/api";
import Image from "next/image";

/* --------------------------------- STYLES --------------------------------- */
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
};

export type MarkerType =
  | "customer"
  | "warehouse"
  | "vehicle"
  | "route"
  | "default";

export interface MarkerData {
  id?: string;
  position: { lat: number; lng: number };
  label?: string;
  type?: MarkerType;
}

interface MapWithMarkerProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MarkerData[];
  height?: string | number;
  onMarkerClick?: (marker: MarkerData) => void;
  options?: google.maps.MapOptions;
}

const OptimizedMarker = React.memo(
  ({
    marker,
    onClick,
    offset = { x: 0, y: 0 },
    isExpanded = false,
  }: {
    marker: MarkerData;
    onClick?: (m: MarkerData) => void;
    offset?: { x: number; y: number };
    isExpanded?: boolean;
  }) => {
    const isVehicle = marker.type === "vehicle";

    const iconConfig = useMemo(() => {
      if (
        typeof window === "undefined" ||
        !window.google ||
        !marker.type ||
        isVehicle
      )
        return undefined;

      let url = "/icons/pin.svg";
      const scale = 1.6;

      switch (marker.type) {
        case "warehouse":
          url = "/icons/warehouse.svg";
          break;
        case "customer":
          url = "/icons/pin.svg";
          break;
      }

      // Note: For MarkerF, we'd need to use a complex icon or Symbol.
      // But since user wants SVGs in public, we'll use a simple URL if possible.
      return {
        url,
        scaledSize: new window.google.maps.Size(24 * scale, 24 * scale),
        anchor: new window.google.maps.Point(12 * scale, 24 * scale),
      };
    }, [marker.type, isVehicle]);

    const labelConfig = useMemo(() => {
      if (!marker.label || isVehicle) return undefined;
      return {
        text: marker.label.charAt(0).toUpperCase(),
        color: "#FFF",
        fontWeight: "bold",
        fontSize: "12px",
      };
    }, [marker.label, isVehicle]);

    if (isVehicle) {
      return (
        <OverlayView
          position={marker.position}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(marker);
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              zIndex: isExpanded ? 2000 : 1000,
              position: "absolute",
              // Use transform for smooth animation of the blooming offset
              // calc(-50% + offset.x) centers the marker and then applies the spiderfier offset
              transform: `translate(calc(-50% + ${offset.x}px), calc(-100% + ${offset.y}px)) ${isExpanded ? "scale(1.15)" : "scale(1)"}`,
              transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              pointerEvents: "auto",
            }}
          >
            {/* Plate badge */}
            <div
              style={{
                background: "rgba(15, 23, 42, 0.95)",
                backdropFilter: "blur(4px)",
                border: "1.5px solid rgba(59, 130, 246, 0.5)",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "8px",
                whiteSpace: "nowrap",
                marginBottom: "6px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
              }}
            >
              {marker.label}
            </div>

            {/* Marker shape with icon from public folder */}
            <div
              style={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                borderRadius: "50% 50% 50% 0",
                transform: "rotate(-45deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2.5px solid #FFFFFF",
                boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)",
              }}
            >
              <Image
                src="/icons/truck.svg"
                alt="truck"
                width={20}
                height={20}
                style={{
                  transform: "rotate(45deg)",
                  filter: "brightness(0) invert(1)", // Make it white
                }}
                unoptimized
              />
            </div>

            <div
              style={{
                width: 10,
                height: 5,
                background: "rgba(0,0,0,0.2)",
                borderRadius: "50%",
                marginTop: 2,
                filter: "blur(2px)",
              }}
            />
          </div>
        </OverlayView>
      );
    }

    return (
      <MarkerF
        position={marker.position}
        label={labelConfig}
        icon={iconConfig}
        title={marker.label}
        onClick={() => onClick?.(marker)}
      />
    );
  }
);

OptimizedMarker.displayName = "OptimizedMarker";

export const MapWithMarker = ({
  center,
  zoom = 14,
  markers = [],
  height = "400px",
  onMarkerClick,
  options,
}: MapWithMarkerProps) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const fitBoundsFired = useRef(false);

  const mapCenter = useMemo(
    () => center || { lat: 41.0082, lng: 28.9784 },
    [center]
  );

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      ...options,
    }),
    [options]
  );

  // Group markers by proximity (simple Spiderfier logic)
  const groupedMarkers = useMemo(() => {
    const groups: { [key: string]: MarkerData[] } = {};
    const threshold = 0.0001; // Proximity threshold

    markers.forEach((m) => {
      const key = `${Math.round(m.position.lat / threshold)},${Math.round(m.position.lng / threshold)}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    });

    return groups;
  }, [markers]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      if (markers && markers.length > 0 && !fitBoundsFired.current) {
        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach((marker) => {
          bounds.extend(
            new window.google.maps.LatLng(
              marker.position.lat,
              marker.position.lng
            )
          );
        });
        map.fitBounds(bounds);
        fitBoundsFired.current = true;

        const listener = window.google.maps.event.addListener(
          map,
          "idle",
          () => {
            if (map.getZoom()! > 16) map.setZoom(16);
            window.google.maps.event.removeListener(listener);
          }
        );
      }
    },
    [markers]
  );

  React.useEffect(() => {
    if (
      !center &&
      mapRef.current &&
      markers.length > 0 &&
      !fitBoundsFired.current
    ) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend(
          new window.google.maps.LatLng(
            marker.position.lat,
            marker.position.lng
          )
        );
      });
      mapRef.current.fitBounds(bounds);
      fitBoundsFired.current = true;
    }
  }, [markers, center]);

  React.useEffect(() => {
    if (center) {
      fitBoundsFired.current = false;
    }
  }, [center]);

  return (
    <div
      className="overflow-hidden border border-gray-200/10 rounded-xl shadow-2xl"
      style={{ height }}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={zoom}
        onLoad={onLoad}
        options={mapOptions}
        onClick={() => setExpandedGroupId(null)}
      >
        {Object.entries(groupedMarkers).map(([groupId, groupMarkers]) => {
          const isExpanded = expandedGroupId === groupId;
          const count = groupMarkers.length;

          return groupMarkers.map((marker, index) => {
            let offset = { x: 0, y: 0 };

            if (count > 1) {
              if (isExpanded) {
                // Bloom effect: Spread markers in a circle
                const angle = (index / count) * 2 * Math.PI;
                const radius = 80; // increased radius for better visibility
                offset = {
                  x: Math.cos(angle) * radius,
                  y: Math.sin(angle) * radius,
                };
              } else if (index > 0) {
                // Hide overlapping markers when not expanded
                return null;
              }
            }

            return (
              <OptimizedMarker
                key={`${marker.id || marker.label}-${index}`}
                marker={marker}
                offset={offset}
                isExpanded={isExpanded}
                onClick={(m) => {
                  if (count > 1 && !isExpanded) {
                    setExpandedGroupId(groupId);
                  } else {
                    onMarkerClick?.(m);
                  }
                }}
              />
            );
          });
        })}
      </GoogleMap>
    </div>
  );
};

export default MapWithMarker;

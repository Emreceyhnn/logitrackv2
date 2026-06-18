import React, { useCallback, useRef, useMemo, useState, useEffect } from "react";
import { GoogleMap, OverlayView } from "@react-google-maps/api";
import Image from "next/image";

/* --------------------------------- STYLES --------------------------------- */
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
};

export type MarkerType = "customer" | "warehouse" | "vehicle" | "route" | "default";

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

/* ------------------------------- ADVANCED MARKER ------------------------------- */
const AdvancedMarker = ({
  map,
  position,
  title,
  label,
  iconUrl,
  isExpanded,
  offset,
  onClick,
}: {
  map: google.maps.Map | null;
  position: { lat: number; lng: number };
  title?: string;
  label?: string;
  iconUrl?: string;
  isExpanded?: boolean;
  offset?: { x: number; y: number };
  onClick?: () => void;
}) => {
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  useEffect(() => {
    if (!map || typeof window === "undefined" || !window.google) return;

    let content: HTMLElement;

    if (iconUrl) {
      const img = document.createElement("img");
      img.src = iconUrl;
      img.style.width = "38px";
      img.style.height = "38px";
      img.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      
      if (offset) {
        img.style.transform = `translate(${offset.x}px, ${offset.y}px) ${isExpanded ? "scale(1.15)" : "scale(1)"}`;
      }
      content = img;
    } else {
      const pin = new window.google.maps.marker.PinElement({
        background: "#EA4335",
        borderColor: "#FFFFFF",
        glyphColor: "white",
        glyphText: label || "",
      });
      content = pin as unknown as HTMLElement;
      
      if (offset) {
        content.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
        content.style.transform = `translate(${offset.x}px, ${offset.y}px) ${isExpanded ? "scale(1.15)" : "scale(1)"}`;
      }
    }

    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      position,
      map,
      title,
      content,
    });

    let listener: google.maps.MapsEventListener | null = null;
    if (onClick) {
      listener = marker.addListener("gmp-click", () => onClick());
    }

    markerRef.current = marker;

    return () => {
      if (listener) window.google.maps.event.removeListener(listener);
      marker.map = null;
    };
  }, [map, position.lat, position.lng, title, label, iconUrl, isExpanded, offset?.x, offset?.y]);

  return null;
};

/* ------------------------------- OPTIMIZED MARKER ------------------------------- */
const OptimizedMarker = React.memo(
  ({
    map,
    marker,
    onClick,
    offset = { x: 0, y: 0 },
    isExpanded = false,
  }: {
    map: google.maps.Map | null;
    marker: MarkerData;
    onClick?: (m: MarkerData) => void;
    offset?: { x: number; y: number };
    isExpanded?: boolean;
  }) => {
    const isVehicle = marker.type === "vehicle";

    if (isVehicle) {
      return (
        <OverlayView position={marker.position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
          <div
            onClick={(e) => { e.stopPropagation(); onClick?.(marker); }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer",
              zIndex: isExpanded ? 2000 : 1000, position: "absolute",
              transform: `translate(calc(-50% + ${offset.x}px), calc(-100% + ${offset.y}px)) ${isExpanded ? "scale(1.15)" : "scale(1)"}`,
              transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              pointerEvents: "auto",
            }}
          >
            <div style={{ background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(4px)", border: "1.5px solid rgba(59, 130, 246, 0.5)", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "8px", whiteSpace: "nowrap", marginBottom: "6px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)" }}>
              {marker.label}
            </div>
            <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #2563EB, #3B82F6)", borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", display: "flex", alignItems: "center", justifyContent: "center", border: "2.5px solid #FFFFFF", boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)" }}>
              <Image src="/icons/truck.svg" alt="truck" width={20} height={20} style={{ transform: "rotate(45deg)", filter: "brightness(0) invert(1)" }} unoptimized />
            </div>
            <div style={{ width: 10, height: 5, background: "rgba(0,0,0,0.2)", borderRadius: "50%", marginTop: 2, filter: "blur(2px)" }} />
          </div>
        </OverlayView>
      );
    }

    let url = "/icons/pin.svg";
    if (marker.type === "warehouse") url = "/icons/warehouse.svg";
    
    const initial = marker.label ? marker.label.charAt(0).toUpperCase() : undefined;

    return (
      <AdvancedMarker
        map={map}
        position={marker.position}
        title={marker.label}
        label={initial}
        iconUrl={marker.type ? url : undefined}
        offset={offset}
        isExpanded={isExpanded}
        onClick={() => onClick?.(marker)}
      />
    );
  }
);
OptimizedMarker.displayName = "OptimizedMarker";

/* ------------------------------- MAIN COMPONENT ------------------------------- */
export const MapWithMarker = ({ center, zoom = 14, markers = [], height = "400px", onMarkerClick, options }: MapWithMarkerProps) => {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const fitBoundsFired = useRef(false);

  const mapCenter = useMemo(() => center || { lat: 41.0082, lng: 28.9784 }, [center]);

  const mapOptions = useMemo<google.maps.MapOptions>(() => ({
    disableDefaultUI: false, zoomControl: true, mapTypeControl: false, streetViewControl: false, fullscreenControl: true, mapId: "DEMO_MAP_ID", ...options,
  }), [options]);

  const groupedMarkers = useMemo(() => {
    const groups: { [key: string]: MarkerData[] } = {};
    const threshold = 0.0001;
    markers.forEach((m) => {
      const key = `${Math.round(m.position.lat / threshold)},${Math.round(m.position.lng / threshold)}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    });
    return groups;
  }, [markers]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapInstance(map);
    if (markers && markers.length > 0 && !fitBoundsFired.current) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((marker) => bounds.extend(new window.google.maps.LatLng(marker.position.lat, marker.position.lng)));
      map.fitBounds(bounds);
      fitBoundsFired.current = true;
      const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom()! > 16) map.setZoom(16);
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [markers]);

  useEffect(() => {
    if (!center && mapRef.current && markers.length > 0 && !fitBoundsFired.current) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((marker) => bounds.extend(new window.google.maps.LatLng(marker.position.lat, marker.position.lng)));
      mapRef.current.fitBounds(bounds);
      fitBoundsFired.current = true;
    }
  }, [markers, center]);

  useEffect(() => {
    if (center) fitBoundsFired.current = false;
  }, [center]);

  return (
    <div className="overflow-hidden border border-gray-200/10 rounded-xl shadow-2xl" style={{ height }}>
      <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={zoom} onLoad={onLoad} options={mapOptions} onClick={() => setExpandedGroupId(null)}>
        {Object.entries(groupedMarkers).map(([groupId, groupMarkers]) => {
          const isExpanded = expandedGroupId === groupId;
          const count = groupMarkers.length;
          return groupMarkers.map((marker, index) => {
            let offset = { x: 0, y: 0 };
            if (count > 1) {
              if (isExpanded) {
                const angle = (index / count) * 2 * Math.PI;
                const radius = 80;
                offset = { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
              } else if (index > 0) return null;
            }
            return (
              <OptimizedMarker
                key={`${marker.id || marker.label}-${index}`}
                map={mapInstance}
                marker={marker}
                offset={offset}
                isExpanded={isExpanded}
                onClick={(m) => {
                  if (count > 1 && !isExpanded) setExpandedGroupId(groupId);
                  else onMarkerClick?.(m);
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

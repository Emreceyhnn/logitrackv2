import React, { useCallback, useRef, useMemo } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
};

const PIN_SVG = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";
const TRUCK_SVG = "M20 8h-3V4H3v13h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zM18 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z";
const WAREHOUSE_SVG = "M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z";

export type MarkerType = "customer" | "warehouse" | "vehicle" | "route" | "default";

export interface MarkerData {
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

// Memoized Marker component to prevent unnecessary re-renders of individual markers
const OptimizedMarker = React.memo(({ marker, onClick }: { marker: MarkerData; onClick?: (m: MarkerData) => void }) => {
  const iconConfig = useMemo(() => {
    if (typeof window === "undefined" || !window.google || !marker.type) return undefined;
    
    let path = PIN_SVG;
    let fillColor = "#EA4335"; 
    let scale = 1.6;
    let anchor = new window.google.maps.Point(12, 24);
    let labelOrigin = new window.google.maps.Point(12, 9);
    
    switch (marker.type) {
      case "warehouse":
        fillColor = "#8B5CF6"; 
        path = WAREHOUSE_SVG;
        break;
      case "customer":
        fillColor = "#3B82F6"; 
        path = PIN_SVG;
        break;
      case "vehicle":
        fillColor = "#10B981"; 
        path = TRUCK_SVG;
        scale = 1.3;
        anchor = new window.google.maps.Point(12, 12);
        labelOrigin = new window.google.maps.Point(12, -4);
        break;
      case "route":
        fillColor = "#F59E0B"; 
        scale = 1.2;
        anchor = new window.google.maps.Point(12, 12);
        break;
    }

    return {
      path,
      fillColor,
      fillOpacity: 1,
      strokeWeight: 1.5,
      strokeColor: "#FFFFFF",
      scale,
      anchor,
      labelOrigin,
    };
  }, [marker.type]);

  const labelConfig = useMemo(() => {
    if (!marker.label) return undefined;
    return {
      text: marker.label.charAt(0).toUpperCase(),
      color: marker.type === "vehicle" ? "#000" : "#FFF",
      fontWeight: "bold",
      fontSize: "12px",
    };
  }, [marker.label, marker.type]);

    return (
      <MarkerF
        position={marker.position}
        label={labelConfig}
        icon={iconConfig}
        title={marker.label}
        onClick={() => onClick?.(marker)}
        // We can add animation here if needed, but Google Maps React doesn't support easy interpolation
        // Standard non-blocking updates are usually enough for 1s intervals
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
  options
}: MapWithMarkerProps) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const fitBoundsFired = useRef(false);

  const mapCenter = useMemo(() => center || { lat: 41.0082, lng: 28.9784 }, [center]);
  
  const mapOptions = useMemo<google.maps.MapOptions>(() => ({
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    ...options
  }), [options]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (markers && markers.length > 0 && !fitBoundsFired.current) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend(new window.google.maps.LatLng(marker.position.lat, marker.position.lng));
      });
      map.fitBounds(bounds);
      fitBoundsFired.current = true;
      
      const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom()! > 16) map.setZoom(16);
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [markers]);

  // Adjust bounds if markers change during runtime ONLY if center is not provided and bounds haven't been fit yet
  React.useEffect(() => {
    if (!center && mapRef.current && markers.length > 0 && !fitBoundsFired.current) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend(new window.google.maps.LatLng(marker.position.lat, marker.position.lng));
      });
      mapRef.current.fitBounds(bounds);
      fitBoundsFired.current = true;
    }
  }, [markers, center]);

  // Reset fitBounds tracking if the explicit center prop changes
  React.useEffect(() => {
    if (center) {
      fitBoundsFired.current = false;
    }
  }, [center]);

  return (
    <div className="overflow-hidden border border-gray-200/10 rounded-xl shadow-2xl" style={{ height }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={zoom}
        onLoad={onLoad}
        options={mapOptions}
      >
        {markers.map((marker, index) => (
          <OptimizedMarker 
            key={`${marker.label || 'm'}-${index}`} 
            marker={marker} 
            onClick={onMarkerClick}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default MapWithMarker;

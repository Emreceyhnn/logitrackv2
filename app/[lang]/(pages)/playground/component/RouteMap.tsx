"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  MarkerF,
  OverlayView,
} from "@react-google-maps/api";
import Image from "next/image";

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

/* ------------------------------- MARKER COMPONENT ------------------------------- */
const CustomVehicleMarker = ({ position, label }: { position: LocationPoint; label?: string }) => {
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
  const [response, setResponse] = useState<google.maps.DirectionsResult | null>(null);
  const cachedResponseKey = useRef<string | null>(null);
  const [apiCallCount, setApiCallCount] = useState(0); // For debugging to prove we don't spam

  // 1. STRICT MEMOIZATION: Generate a unique string key based on exact physical locations.
  // This ensures that even if the parent component passes a NEW array reference for stops,
  // we DO NOT re-trigger the route API unless the coordinates physically changed.
  const routeKey = useMemo(() => {
    if (!origin || !destination) return null;
    
    // Helper to format coordinate to 5 decimal places (approx 1.1 meters accuracy)
    const p = (loc: LocationPoint) => `${Number(loc.lat).toFixed(5)},${Number(loc.lng).toFixed(5)}`;
    
    // Format: origin|destination|stop1-stop2-stop3
    return `${p(origin)}|${p(destination)}|${stops.map(p).join("-")}`;
  }, [origin, destination, stops]);

  // 2. FETCH DIRECTIONS: Only runs when routeKey changes.
  useEffect(() => {
    if (!routeKey || typeof window === "undefined" || !window.google) return;

    // VERY IMPORTANT: Check if we ALREADY successfully fetched this exact route key
    // This prevents double-fetches in React Strict Mode or rapid re-renders.
    if (cachedResponseKey.current === routeKey) {
      console.log("RouteMap: using cached response for key", routeKey);
      return;
    }

    // Debounce just in case the props change rapidly within a few ms
    const timer = setTimeout(() => {
      console.log("RouteMap: fetching new directions for key", routeKey);
      
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin,
          destination,
          waypoints: stops.map((stop) => ({ location: stop, stopover: true })),
          optimizeWaypoints: false, // Strict order 1-2-3-4-5
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setResponse(result);
            cachedResponseKey.current = routeKey; // Save successful key to prevent refetching
            setApiCallCount(prev => prev + 1); // Track successful calls
          } else {
            console.error("Directions request failed:", status);
            setResponse(null);
          }
        }
      );
    }, 150);

    return () => clearTimeout(timer);
  }, [routeKey]);

  // 3. MAP CONFIGURATION
  const mapCenter = useMemo(() => {
    if (origin) return origin;
    return { lat: 41.0082, lng: 28.9784 }; // Fallback
  }, [origin]);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    }),
    []
  );

  return (
    <div className="relative w-full overflow-hidden border border-gray-200 shadow-xl rounded-xl" style={{ height }}>
      
      {/* Dev Tool: Prove to the user we are saving their money */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm border border-gray-100 text-xs font-mono">
        <div className="font-bold text-gray-800">Route API Optimizer (useMemo Active)</div>
        <div className={apiCallCount > 0 ? "text-green-600" : "text-gray-500"}>
          API Calls Made: <span className="font-bold">{apiCallCount}</span> 
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
        options={mapOptions}
      >
        {/* Draw Route Line */}
        {response && (
          <DirectionsRenderer
            options={{
              directions: response,
              suppressMarkers: true, // We draw our own custom markers
              polylineOptions: {
                strokeColor: "#3B82F6", // Blue
                strokeWeight: 6,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}

        {/* Draw Waypoints Markers (1, 2, 3, 4, 5) if route is successful */}
        {response && stops.map((stop, index) => (
          <MarkerF
            key={`route-stop-${index}`}
            position={stop}
            icon={{
              path: window.google?.maps.SymbolPath.CIRCLE,
              fillColor: "#F59E0B", // Amber
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
              scale: 8,
            }}
            label={{
              text: (index + 1).toString(),
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
            }}
            zIndex={500}
          />
        ))}

        {/* Origin Marker */}
        {origin && (
           <MarkerF
           position={origin}
           icon={{
             path: window.google?.maps.SymbolPath.CIRCLE,
             fillColor: "#10B981", // Emerald
             fillOpacity: 1,
             strokeColor: "#FFFFFF",
             strokeWeight: 2,
             scale: 8,
           }}
           label={{
             text: "A",
             color: "white",
             fontSize: "12px",
             fontWeight: "bold",
           }}
           zIndex={400}
         />
        )}

        {/* Destination Marker */}
        {destination && (
           <MarkerF
           position={destination}
           icon={{
             path: window.google?.maps.SymbolPath.CIRCLE,
             fillColor: "#EF4444", // Red
             fillOpacity: 1,
             strokeColor: "#FFFFFF",
             strokeWeight: 2,
             scale: 8,
           }}
           label={{
             text: "B",
             color: "white",
             fontSize: "12px",
             fontWeight: "bold",
           }}
           zIndex={400}
         />
        )}

        {/* Render Extraneous Markers (Vehicle, Warehouse, Customer) */}
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
               <MarkerF
                 key={marker.id}
                 position={marker.position}
                 icon={{
                   url: "/icons/warehouse.svg",
                   scaledSize: window.google ? new window.google.maps.Size(32, 32) : undefined,
                 }}
                 title={marker.label}
               />
             )
          }

          if (marker.type === "customer") {
            return (
              <MarkerF
                key={marker.id}
                position={marker.position}
                icon={{
                  url: "/icons/pin.svg",
                  scaledSize: window.google ? new window.google.maps.Size(32, 32) : undefined,
                }}
                title={marker.label}
              />
            )
          }

          return null;
        })}
      </GoogleMap>
    </div>
  );
};

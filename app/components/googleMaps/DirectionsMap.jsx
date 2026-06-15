"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  OverlayView,
} from "@react-google-maps/api";
import { useDictionary } from "../../lib/language/DictionaryContext";

/* --------------------------------- STYLES --------------------------------- */
const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

/* ------------------------------- MARKER COMPONENT ------------------------------- */
const VehicleMarker = ({ position, name }) => {
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
          cursor: "default",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {/* Plate badge */}
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
          {name}
        </div>
        {/* Truck icon bubble */}
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
              filter: "brightness(0) invert(1)"
            }} 
            unoptimized
          />
        </div>
        {/* Drop shadow dot */}
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

/**
 * @param {Object} props
 * @param {string|{lat:number, lng:number}} [props.origin]
 * @param {string|{lat:number, lng:number}} [props.destination]
 * @param {Array<{location: string|{lat:number, lng:number}, stopover?:boolean}>} [props.waypoints]
 * @param {{lat:number, lng:number, name:string, id:string}|null} [props.vehicleLocation]
 * @param {Function} [props.onRouteInfoUpdate]
 */
export const DirectionsMap = ({
  origin,
  destination,
  waypoints = [],
  vehicleLocation = null,
  onRouteInfoUpdate,
}) => {
  /* -------------------------------- VARIABLES ------------------------------- */
  const dict = useDictionary();

  /* --------------------------------- STATES --------------------------------- */
  const [response, setResponse] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);
  const lastRequestRef = useRef({ originKey: "", destinationKey: "", waypointsKey: "" });

  /* -------------------------------- LIFECYCLE ------------------------------- */
  useEffect(() => {
    if (!origin || !destination) {
      return;
    }

    const getKey = (p) => {
      if (typeof p === "string") return p;
      if (p?.lat && p?.lng) return `${p.lat},${p.lng}`;
      return "";
    };

    const originKey = getKey(origin);
    const destinationKey = getKey(destination);
    const waypointsKey = (waypoints || []).map(wp => getKey(wp.location)).join("|");

    if (!originKey || !destinationKey) {
      return;
    }

    if (
      lastRequestRef.current.originKey === originKey &&
      lastRequestRef.current.destinationKey === destinationKey &&
      lastRequestRef.current.waypointsKey === waypointsKey
    ) {
      return;
    }

    lastRequestRef.current = { originKey, destinationKey, waypointsKey };

    const timer = setTimeout(() => setIsRequesting(true), 0);

    if (typeof window === "undefined" || !window.google) {
      console.error("Google Maps API not loaded yet");
      const timer2 = setTimeout(() => setIsRequesting(false), 0);
      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
      };
    }

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints || [],
        optimizeWaypoints: false,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setIsRequesting(false);
        if (status === window.google.maps.DirectionsStatus.OK) {
          setResponse(result);
          setErrorCount(0);

          // Calculate total distance and duration across all legs
          const totalDistance = result.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0);
          const totalDuration = result.routes[0].legs.reduce((acc, leg) => acc + leg.duration.value, 0);

          if (onRouteInfoUpdate) {
            onRouteInfoUpdate({
              distanceKm: parseFloat((totalDistance / 1000).toFixed(1)),
              durationMin: Math.ceil(totalDuration / 60),
            });
          }
        } else {
          console.error("Directions request failed with status:", status);
          setErrorCount((prev) => prev + 1);
          setResponse(null);
        }
      }
    );

    return () => clearTimeout(timer);
  }, [origin, destination, waypoints, onRouteInfoUpdate]);

  const mapCenter = useMemo(() => {
    if (vehicleLocation?.lat && vehicleLocation?.lng) {
      return { lat: vehicleLocation.lat, lng: vehicleLocation.lng };
    }
    if (origin?.lat && origin?.lng) return origin;
    return { lat: 41.0082, lng: 28.9784 };
  }, [origin, vehicleLocation]);

  const mapOptions = useMemo(
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
    <div className="relative w-full h-full">
      {isRequesting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
          <div className="bg-white/90 px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-800 border border-white/20">
            {dict.maps.calculatingRoute}
          </div>
        </div>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
        options={mapOptions}
      >
        {response && (
          <DirectionsRenderer 
            options={{
              directions: response,
              suppressMarkers: true, // We will render our own markers for a premium look
              polylineOptions: {
                strokeColor: "#3182CE",
                strokeWeight: 5,
                strokeOpacity: 0.8,
              }
            }} 
          />
        )}

        {/* Custom Markers */}
        {origin && typeof origin !== "string" && origin.lat && origin.lng && (
          <Marker
            position={origin}
            icon={{
              path: window.google?.maps.SymbolPath.CIRCLE,
              fillColor: "#3182CE",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
              scale: 8,
            }}
            label={{
              text: "A",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold"
            }}
          />
        )}

        {waypoints?.map((wp, idx) => (
          wp.location && typeof wp.location !== "string" && wp.location.lat && wp.location.lng && (
            <Marker
              key={`wp-${idx}`}
              position={wp.location}
              icon={{
                path: window.google?.maps.SymbolPath.CIRCLE,
                fillColor: "#4299E1",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
                scale: 7,
              }}
              label={{
                text: (idx + 1).toString(),
                color: "white",
                fontSize: "10px",
                fontWeight: "bold"
              }}
            />
          )
        ))}

        {destination && typeof destination !== "string" && destination.lat && destination.lng && (
          <Marker
            position={destination}
            icon={{
              path: window.google?.maps.SymbolPath.CIRCLE,
              fillColor: "#48BB78",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
              scale: 8,
            }}
            label={{
              text: "B",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold"
            }}
          />
        )}

        {vehicleLocation?.lat && vehicleLocation?.lng && (
          <VehicleMarker
            position={{ lat: vehicleLocation.lat, lng: vehicleLocation.lng }}
            name={vehicleLocation.name || "Vehicle"}
          />
        )}
      </GoogleMap>

      {errorCount > 0 && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-red-500/90 text-white text-xs font-medium px-3 py-2 rounded-md shadow-lg backdrop-blur-sm">
            {dict.maps.unableCalculateRoute}
          </div>
        </div>
      )}
    </div>
  );
};

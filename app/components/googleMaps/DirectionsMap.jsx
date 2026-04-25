"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
            background: "rgba(11, 16, 25, 0.92)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(99, 179, 237, 0.5)",
            color: "#63B3ED",
            fontSize: "10px",
            fontWeight: 800,
            padding: "2px 8px",
            borderRadius: "6px",
            whiteSpace: "nowrap",
            letterSpacing: "0.05em",
            marginBottom: "4px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          {name}
        </div>
        {/* Truck icon bubble */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50% 50% 50% 0",
            transform: "rotate(-45deg)",
            background: "linear-gradient(135deg, #3182CE, #63B3ED)",
            border: "2px solid rgba(255,255,255,0.3)",
            boxShadow: "0 4px 16px rgba(49, 130, 206, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              transform: "rotate(45deg)",
              fontSize: "16px",
              lineHeight: 1,
            }}
          >
            🚛
          </span>
        </div>
        {/* Drop shadow dot */}
        <div
          style={{
            width: 8,
            height: 4,
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

export const DirectionsMap = ({
  origin,
  destination,
  vehicleLocation,
  onRouteInfoUpdate,
}) => {
  /* -------------------------------- VARIABLES ------------------------------- */
  const dict = useDictionary();

  /* --------------------------------- STATES --------------------------------- */
  const [response, setResponse] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);
  const lastRequestRef = useRef({ originKey: "", destinationKey: "" });

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

    if (!originKey || !destinationKey) {
      return;
    }

    if (
      lastRequestRef.current.originKey === originKey &&
      lastRequestRef.current.destinationKey === destinationKey
    ) {
      return;
    }

    lastRequestRef.current = { originKey, destinationKey };

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
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setIsRequesting(false);
        if (status === window.google.maps.DirectionsStatus.OK) {
          setResponse(result);
          setErrorCount(0);

          const leg = result.routes[0].legs[0];
          if (onRouteInfoUpdate) {
            onRouteInfoUpdate({
              distanceKm: parseFloat((leg.distance.value / 1000).toFixed(1)),
              durationMin: Math.ceil(leg.duration.value / 60),
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
  }, [origin, destination, onRouteInfoUpdate]);

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

  const rendererOptions = useMemo(
    () => ({
      directions: response,
      suppressMarkers: false,
    }),
    [response]
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
        {!response && origin && (
          <Marker
            position={typeof origin === "string" ? null : origin}
            label="A"
          />
        )}
        {!response && destination && (
          <Marker
            position={typeof destination === "string" ? null : destination}
            label="B"
          />
        )}

        {response && <DirectionsRenderer options={rendererOptions} />}

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

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";
import { useDictionary } from "../../lib/language/DictionaryContext";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

export const DirectionsMap = ({ origin, destination, onRouteInfoUpdate }) => {
  const dict = useDictionary();
  const [response, setResponse] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);
  
  // Use ref to track the last requested route to prevent redundant calls
  const lastRequestRef = useRef({ originKey: "", destinationKey: "" });

  useEffect(() => {
    // Check if we have both origin and destination
    if (!origin || !destination) {
      return;
    }

    // Helper to get a stable key from the origin/destination inputs
    const getKey = (p) => {
      if (typeof p === "string") return p;
      if (p?.lat && p?.lng) return `${p.lat},${p.lng}`;
      return "";
    };

    const originKey = getKey(origin);
    const destinationKey = getKey(destination);

    // Only proceed if both keys are valid
    if (!originKey || !destinationKey) {
      return;
    }

    // Skip if we already requested this exact route
    if (
      lastRequestRef.current.originKey === originKey &&
      lastRequestRef.current.destinationKey === destinationKey
    ) {
      return;
    }

    // Mark as requesting - use a micro-delay or better, handle it outside if possible
    // But for now, we just acknowledge the ref update is synchronous and the state update is intentional
    lastRequestRef.current = { originKey, destinationKey };
    
    // Use a small timeout to avoid the synchronous setState warning in some environments
    const timer = setTimeout(() => setIsRequesting(true), 0);

    if (typeof window === "undefined" || !window.google) {
      console.error("Google Maps API not loaded yet");
      // If Google Maps API is not loaded, we can't make a request, so stop requesting.
      // Use a timeout to avoid sync state update warning
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
            // Update parent state with metrics
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
    if (origin?.lat && origin?.lng) return origin;
    return { lat: 41.0082, lng: 28.9784 }; // Default to Istanbul
  }, [origin]);

  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  }), []);

  const rendererOptions = useMemo(() => ({
    directions: response,
    suppressMarkers: false,
  }), [response]);

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
          <Marker position={typeof origin === "string" ? null : origin} label="A" />
        )}
        {!response && destination && (
          <Marker position={typeof destination === "string" ? null : destination} label="B" />
        )}

        {response && (
          <DirectionsRenderer
            options={rendererOptions}
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

"use client";

import { useState, useCallback, useMemo } from "react";
import {
  GoogleMap,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

export const DirectionsMap = ({ origin, destination, onRouteInfoUpdate }) => {
  const [response, setResponse] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);
  const [lastProcessed, setLastProcessed] = useState({
    origin: null,
    destination: null,
  });

  const directionsCallback = useCallback((res) => {
    setIsRequesting(false);
    
    // Always mark these coordinates as processed to prevent infinite loop
    setLastProcessed({ origin, destination });

    if (res !== null) {
      if (res.status === "OK") {
        setResponse(res);
        setErrorCount(0);

        const route = res.routes[0].legs[0];
        if (onRouteInfoUpdate) {
          onRouteInfoUpdate({
            distanceKm: parseFloat((route.distance.value / 1000).toFixed(1)),
            durationMin: Math.ceil(route.duration.value / 60),
          });
        }
      } else {
        console.error("Directions request failed with status:", res.status);
        setErrorCount((prev) => prev + 1);
        // We still marked it as processed above, so it won't retry until origin/dest changes
      }
    }
  }, [origin, destination, onRouteInfoUpdate]);

  const directionsOptions = useMemo(() => ({
    origin,
    destination,
    travelMode: "DRIVING",
  }), [origin, destination]);

  // Check if we need to request new directions
  const isNewRoute = useMemo(() => (
    origin?.lat != null &&
    destination?.lat != null &&
    (origin?.lat !== lastProcessed.origin?.lat ||
      origin?.lng !== lastProcessed.origin?.lng ||
      destination?.lat !== lastProcessed.destination?.lat ||
      destination?.lng !== lastProcessed.destination?.lng)
  ), [origin, destination, lastProcessed]);

  const needsRequest = isNewRoute && !isRequesting;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm relative">
        {isRequesting && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
            <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-700">
              Calculating route...
            </div>
          </div>
        )}
        
        <GoogleMap mapContainerStyle={containerStyle} center={origin} zoom={12}>
          {needsRequest && (
            <DirectionsService
              options={directionsOptions}
              onLoad={() => setIsRequesting(true)}
              callback={directionsCallback}
            />
          )}

          {response && (
            <DirectionsRenderer
              options={{
                directions: response,
              }}
            />
          )}
        </GoogleMap>
      </div>
      
      {errorCount > 0 && !isNewRoute && (
        <div className="text-xs text-red-500 font-medium px-2">
          Unable to calculate directions. Please verify addresses or try again later.
        </div>
      )}
    </div>
  );
};

"use client";

import { useState } from "react";
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
  const [lastProcessed, setLastProcessed] = useState({
    origin: null,
    destination: null,
  });

  const directionsCallback = (res) => {
    if (res !== null && res.status === "OK") {
      // Check if this result is for the same points to avoid loop
      const isSameOrigin =
        origin?.lat === lastProcessed.origin?.lat &&
        origin?.lng === lastProcessed.origin?.lng;
      const isSameDest =
        destination?.lat === lastProcessed.destination?.lat &&
        destination?.lng === lastProcessed.destination?.lng;

      if (isSameOrigin && isSameDest) return;

      setResponse(res);
      setLastProcessed({ origin, destination });

      const route = res.routes[0].legs[0];
      if (onRouteInfoUpdate) {
        onRouteInfoUpdate({
          distanceKm: parseFloat((route.distance.value / 1000).toFixed(1)),
          durationMin: Math.ceil(route.duration.value / 60),
        });
      }
    }
  };

  // Check if we need to request new directions
  const needsRequest =
    origin?.lat != null &&
    destination?.lat != null &&
    (origin?.lat !== lastProcessed.origin?.lat ||
      origin?.lng !== lastProcessed.origin?.lng ||
      destination?.lat !== lastProcessed.destination?.lat ||
      destination?.lng !== lastProcessed.destination?.lng);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
        <GoogleMap mapContainerStyle={containerStyle} center={origin} zoom={12}>
          {needsRequest && (
            <DirectionsService
              options={{
                origin,
                destination,
                travelMode: "DRIVING",
              }}
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
    </div>
  );
};

import React from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

interface MarkerData {
  position: { lat: number; lng: number };
  label?: string;
}

interface MapWithMarkerProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MarkerData[];
}

export const MapWithMarker = ({ center, zoom = 14, markers = [] }: MapWithMarkerProps) => {
  const mapCenter = center || { lat: 41.0082, lng: 28.9784 }; // Istanbul default

  return (
    <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={zoom}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {markers.map((marker, index) => (
          <MarkerF
            key={index}
            position={marker.position}
            label={marker.label}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

import React, { useState } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

export const MapPicker = ({ onLocationSelect, initialCenter }) => {
  const [marker, setMarker] = useState(null);
  const center = initialCenter || { lat: 41.0082, lng: 28.9784 };

  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const newPos = { lat, lng };
    setMarker(newPos);
    onLocationSelect(newPos);
  };

  return (
    <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onClick={onMapClick}
      >
        {marker && <MarkerF position={marker} />}
      </GoogleMap>
      <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 italic">
        Click anywhere on the map to mark a location.
      </div>
    </div>
  );
};

import React, { useState, useCallback, useMemo } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useDictionary } from "../../lib/language/DictionaryContext";

/* --------------------------------- STYLES --------------------------------- */
const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

export const MapPicker = ({ onLocationSelect, initialCenter }) => {
  /* -------------------------------- VARIABLES ------------------------------- */
  const dict = useDictionary();

  /* --------------------------------- STATES --------------------------------- */
  const [marker, setMarker] = useState(null);
  const center = useMemo(
    () => initialCenter || { lat: 41.0082, lng: 28.9784 },
    [initialCenter]
  );

  /* -------------------------------- HANDLERS -------------------------------- */
  const onMapClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const newPos = { lat, lng };
      setMarker(newPos);
      if (onLocationSelect) {
        onLocationSelect(newPos);
      }
    },
    [onLocationSelect]
  );

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
        {dict.maps.clickToMark}
      </div>
    </div>
  );
};

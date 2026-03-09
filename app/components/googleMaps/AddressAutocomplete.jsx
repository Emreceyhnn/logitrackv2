"use client";

import { useState, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";

export const AddressAutocomplete = ({ onAddressSelect }) => {
  const [address, setAddress] = useState("");
  const autocompleteRef = useRef(null);

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const addressData = {
          formattedAddress: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setAddress(place.formatted_address);
        onAddressSelect(addressData);
      }
    }
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Search Address
      </label>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter an address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </Autocomplete>
    </div>
  );
};

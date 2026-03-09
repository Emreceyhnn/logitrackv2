import React, { useState } from "react";
import { GoogleMapsProvider } from "./GoogleMapsProvider";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { MapWithMarker } from "./MapWithMarker";
import { DirectionsMap } from "./DirectionsMap";
import { MapPicker } from "./MapPicker";

const GoogleMapDemo = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [pickedLocation, setPickedLocation] = useState(null);

  // Directions state
  const origin = { lat: 41.0082, lng: 28.9784 }; // Istanbul
  const destination = { lat: 41.0591, lng: 29.0125 }; // Besiktas

  return (
    <GoogleMapsProvider>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Google Maps Integration Components
            </h1>
            <p className="text-gray-500">
              Modular and production-ready React components for Google Maps.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. Address Autocomplete & Marker */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-800">
                  1. Address Input & Marker
                </h2>
                <p className="text-sm text-gray-500">
                  Search for an address and see it on the map.
                </p>
              </div>
              <AddressAutocomplete onAddressSelect={setSelectedAddress} />
              {selectedAddress && (
                <div className="p-3 bg-green-50 rounded-lg text-xs font-mono text-green-700">
                  Lat: {selectedAddress.lat.toFixed(6)}, Lng:{" "}
                  {selectedAddress.lng.toFixed(6)}
                  Address:{selectedAddress.formattedAddress}
                </div>
              )}
              <MapWithMarker
                center={
                  selectedAddress
                    ? { lat: selectedAddress.lat, lng: selectedAddress.lng }
                    : null
                }
                markers={
                  selectedAddress
                    ? [
                        {
                          position: {
                            lat: selectedAddress.lat,
                            lng: selectedAddress.lng,
                          },
                          label: "Selected",
                        },
                      ]
                    : []
                }
              />
            </section>

            {/* 2. Map Picker */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-800">
                  2. Map Picker
                </h2>
                <p className="text-sm text-gray-500">
                  Click on the map to select any point.
                </p>
              </div>
              <MapPicker onLocationSelect={setPickedLocation} />
              {pickedLocation && (
                <div className="p-3 bg-blue-50 rounded-lg text-xs font-mono text-blue-700">
                  Picked: {pickedLocation.lat.toFixed(6)},{" "}
                  {pickedLocation.lng.toFixed(6)}
                </div>
              )}
            </section>

            {/* 3. Directions Map */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 md:col-span-2">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-800">
                  3. Route Directions
                </h2>
                <p className="text-sm text-gray-500">
                  Visualizing travel routes with distance and duration.
                </p>
              </div>
              <DirectionsMap origin={origin} destination={destination} />
            </section>
          </div>
        </div>
      </div>
    </GoogleMapsProvider>
  );
};

export default GoogleMapDemo;

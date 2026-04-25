"use client";

import { useState } from "react";
import { GoogleMapsProvider } from "./GoogleMapsProvider";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { MapWithMarker } from "./MapWithMarker";
import { DirectionsMap } from "./DirectionsMap";
import { MapPicker } from "./MapPicker";
import { useDictionary } from "../../lib/language/DictionaryContext";

const GoogleMapDemo = () => {
  const dict = useDictionary();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [pickedLocation, setPickedLocation] = useState(null);

  const origin = { lat: 41.0082, lng: 28.9784 };
  const destination = { lat: 41.0591, lng: 29.0125 };

  return (
    <GoogleMapsProvider>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {dict.maps.demo.title}
            </h1>
            <p className="text-gray-500">{dict.maps.demo.subtitle}</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-800">
                  {dict.maps.demo.addressTitle}
                </h2>
                <p className="text-sm text-gray-500">
                  {dict.maps.demo.addressDesc}
                </p>
              </div>
              <AddressAutocomplete onAddressSelect={setSelectedAddress} />
              {selectedAddress && (
                <div className="p-3 bg-green-50 rounded-lg text-xs font-mono text-green-700">
                  {dict.maps.demo.lat}: {selectedAddress.lat.toFixed(6)},{" "}
                  {dict.maps.demo.lng}: {selectedAddress.lng.toFixed(6)}
                  <br />
                  {dict.maps.demo.address}: {selectedAddress.formattedAddress}
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
                          label: dict.maps.demo.selected,
                        },
                      ]
                    : []
                }
              />
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-800">
                  {dict.maps.demo.pickerTitle}
                </h2>
                <p className="text-sm text-gray-500">
                  {dict.maps.demo.pickerDesc}
                </p>
              </div>
              <MapPicker onLocationSelect={setPickedLocation} />
              {pickedLocation && (
                <div className="p-3 bg-blue-50 rounded-lg text-xs font-mono text-blue-700">
                  {dict.maps.demo.picked}: {pickedLocation.lat.toFixed(6)},{" "}
                  {pickedLocation.lng.toFixed(6)}
                </div>
              )}
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 md:col-span-2">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-800">
                  {dict.maps.demo.routeTitle}
                </h2>
                <p className="text-sm text-gray-500">
                  {dict.maps.demo.routeDesc}
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

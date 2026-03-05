import { useRef, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_LIBRARIES } from "@/app/lib/constants";

interface AddressAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  label?: string;
}

interface PlaceAutocompleteElement extends HTMLElement {
  placeholder: string;
}

interface PlaceSelectEvent extends Event {
  place: google.maps.places.Place;
}

export default function AddressAutocomplete({
  onPlaceSelect,
  label = "Search Address",
}: AddressAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  useEffect(() => {
    if (isLoaded && containerRef.current) {
      const initAutocomplete = async () => {
        try {
          if (google.maps.places?.PlaceAutocompleteElement) {
            containerRef.current!.innerHTML = "";

            const AutocompleteConstructor = google.maps.places
              .PlaceAutocompleteElement as unknown as {
              new (): PlaceAutocompleteElement;
            };
            const autocomplete = new AutocompleteConstructor();

            autocomplete.style.width = "100%";
            autocomplete.placeholder = label;

            const handlePlaceSelect = (event: Event) => {
              const place = (event as PlaceSelectEvent).place;
              if (place) {
                if (place.fetchFields) {
                  place
                    .fetchFields({
                      fields: [
                        "location",
                        "displayName",
                        "formattedAddress",
                        "viewport",
                      ],
                    })
                    .then(() => {
                      const placeResult: google.maps.places.PlaceResult = {
                        geometry: {
                          location:
                            (place.location as google.maps.LatLng) || undefined,
                          viewport:
                            (place.viewport as google.maps.LatLngBounds) ||
                            undefined,
                        },
                        formatted_address: place.formattedAddress || undefined,
                        name: place.displayName || undefined,
                      };
                      onPlaceSelect(placeResult);
                    });
                } else {
                  onPlaceSelect(
                    place as unknown as google.maps.places.PlaceResult
                  );
                }
              }
            };

            autocomplete.addEventListener("gmp-placeselect", handlePlaceSelect);

            containerRef.current?.appendChild(autocomplete);
          } else {
            console.error(
              "PlaceAutocompleteElement not available in google.maps.places"
            );
          }
        } catch (e) {
          console.error("Error initializing PlaceAutocompleteElement", e);
        }
      };

      initAutocomplete();
    }
  }, [isLoaded, label, onPlaceSelect]);

  return (
    <div style={{ width: "100%", marginBottom: "1rem" }}>
      <div ref={containerRef} style={{ width: "100%" }} />
    </div>
  );
}

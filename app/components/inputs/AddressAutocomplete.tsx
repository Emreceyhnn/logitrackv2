import { useRef, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_LIBRARIES } from "@/app/lib/constants";

interface AddressAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  label?: string;
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
          // Check if the new API is available
          if (google.maps.places?.PlaceAutocompleteElement) {
            // Clean up previous instances if any
            containerRef.current!.innerHTML = "";

            // Create the web component
            // Create the web component
            const autocomplete = new (google.maps.places
              .PlaceAutocompleteElement as any)();

            // Set styles to match MUI somewhat or be decent
            (autocomplete as any).style.width = "100%";
            (autocomplete as any).placeholder = label;

            // Add listener
            autocomplete.addEventListener("gmp-placeselect", (event: any) => {
              const place = event.place;
              if (place) {
                // The new API returns a simplified place object, might need to fetch details
                // verify what 'place' contains. It usually contains a 'fetchFields' method.
                if (place.fetchFields) {
                  place
                    .fetchFields({
                      fields: [
                        "location",
                        "displayName",
                        "formattedAddress",
                        "geometry",
                      ],
                    })
                    .then(() => {
                      // Adapt to google.maps.places.PlaceResult structure if needed by parent
                      // The parent expects PlaceResult.
                      const placeResult: google.maps.places.PlaceResult = {
                        geometry: place.geometry,
                        formatted_address: place.formattedAddress,
                        name: place.displayName,
                        // Add other fields as necessary
                      };
                      onPlaceSelect(placeResult);
                    });
                } else {
                  // Fallback if already populated
                  onPlaceSelect(place);
                }
              }
            });

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

  /* --------------------------------- render --------------------------------- */
  // We use a div container for the web component.
  // We can wrap it in a Box or similar to give it some structure.
  return (
    <div style={{ width: "100%", marginBottom: "1rem" }}>
      {/* Render a label if needed, or rely on the placeholder */}
      {/* Using a container for the web component */}
      <div ref={containerRef} style={{ width: "100%" }} />
    </div>
  );
}

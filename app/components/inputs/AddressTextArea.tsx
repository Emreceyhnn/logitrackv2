"use client";

import { alpha, Box, useTheme, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_LIBRARIES } from "@/app/lib/constants";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface AddressTextAreaProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
}

const AddressTextArea = ({
  label,
  name,
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Search address...",
  error,
  helperText,
}: AddressTextAreaProps) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  useEffect(() => {
    if (isLoaded && containerRef.current) {
      const initAutocomplete = async () => {
        try {
          // @ts-ignore
          const { PlaceAutocompleteElement } =
            await google.maps.importLibrary("places");

          if (PlaceAutocompleteElement) {
            containerRef.current!.innerHTML = "";
            const autocomplete = new PlaceAutocompleteElement();

            // @ts-expect-error - Custom element property
            autocomplete.placeholder = placeholder;

            // Add input listener for manual typing
            const inputElement = autocomplete.querySelector("input");
            if (inputElement) {
              inputElement.addEventListener("input", (event: Event) => {
                const target = event.target as HTMLInputElement;
                const newValue = target.value;
                // Update parent state with manual text, clear coordinates
                onChange({
                  target: {
                    name,
                    value: newValue,
                  },
                } as React.ChangeEvent<HTMLInputElement>);

                // Also trigger onPlaceSelect with null/empty to signal coordinate clearing if needed
                // or just rely on the fact that lat/lng aren't in this manual update.
              });
            }

            autocomplete.addEventListener(
              "gmp-placeselect",
              (event: { place: any }) => {
                const place = event.place;
                if (place) {
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
                          location: place.location as google.maps.LatLng,
                          viewport: place.viewport as google.maps.LatLngBounds,
                        },
                        formatted_address: place.formattedAddress,
                        name: place.displayName,
                      };
                      onPlaceSelect(placeResult);

                      // Trigger onChange for parent state
                      const syntheticEvent = {
                        target: {
                          name,
                          value:
                            place.formattedAddress || place.displayName || "",
                        },
                      } as unknown as React.ChangeEvent<HTMLInputElement>;
                      onChange(syntheticEvent);
                    });
                }
              }
            );

            containerRef.current?.appendChild(autocomplete);
          }
        } catch (e) {
          console.error("Error loading PlaceAutocompleteElement", e);
        }
      };
      initAutocomplete();
    }
  }, [isLoaded, onPlaceSelect, name, onChange, placeholder]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          border: `1px solid ${error ? theme.palette.error.main : alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 2,
          position: "relative",
          bgcolor: alpha("#1A202C", 0.5),
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            borderColor: alpha(theme.palette.primary.main, 0.3),
            bgcolor: alpha(theme.palette.primary.main, 0.02),
          },
          "&:focus-within": {
            borderColor: theme.palette.primary.main,
            borderWidth: "1px",
            boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
          },
          display: "flex",
          alignItems: "center",
          px: 1.5,
        }}
      >
        <LocationOnIcon
          sx={{
            color: alpha(theme.palette.primary.main, 0.7),
            fontSize: 20,
            mr: 1,
          }}
        />
        <div ref={containerRef} style={{ flex: 1 }}>
          {/* PlaceAutocompleteElement will be injected here */}
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          gmp-place-autocomplete {
            width: 100%;
          }
          gmp-place-autocomplete::part(input) {
            background-color: transparent !important;
            border: none !important;
            color: white !important;
            font-size: 0.9rem !important;
            padding: 14px 0 !important;
            font-family: inherit !important;
            outline: none !important;
          }
          .pac-container {
            background-color: #0B1019 !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 8px !important;
            margin-top: 4px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
            font-family: inherit !important;
          }
          .pac-item {
            border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
            padding: 12px 16px !important;
            color: rgba(255, 255, 255, 0.7) !important;
            cursor: pointer !important;
          }
          .pac-item:hover {
            background-color: rgba(33, 150, 243, 0.08) !important;
          }
          .pac-item-query {
            color: white !important;
            font-size: 0.9rem !important;
          }
          .pac-icon {
            filter: invert(1) brightness(2) !important;
          }
        `,
          }}
        />
      </Box>
      {helperText && (
        <Typography
          variant="caption"
          color={error ? "error" : "text.secondary"}
          sx={{ mt: 0.5, display: "block", px: 1 }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default AddressTextArea;

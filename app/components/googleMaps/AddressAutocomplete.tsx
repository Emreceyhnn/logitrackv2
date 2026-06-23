import React, { useState } from "react";
import AutocompleteModuleImport from "react-google-autocomplete";
import { Search } from "lucide-react";
import { Typography } from "@mui/material";

export interface AddressData {
  formattedAddress: string;
  lat: number;
  lng: number;
  address_components?: google.maps.GeocoderAddressComponent[];
}

export interface GooglePlaceLocation {
  lat: () => number;
  lng: () => number;
}

export interface GooglePlaceGeometry {
  location?: GooglePlaceLocation;
}

export interface GooglePlaceResult {
  geometry?: GooglePlaceGeometry;
  formatted_address?: string;
  name?: string;
  address_components?: google.maps.GeocoderAddressComponent[];
}

interface AddressAutocompleteProps {
  onAddressSelect?: (data: AddressData) => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

// Since react-google-autocomplete is compiled as a CommonJS module,
// Vite/React 19 pre-bundler sometimes imports the exports object instead of the default property.
// We safely resolve the Autocomplete component using runtime checking without using 'any'.
interface AutocompleteComponentProps {
  apiKey?: string;
  onPlaceSelected: (
    place: GooglePlaceResult,
    ref: React.RefObject<HTMLInputElement | null>,
    autocompleteRef: React.RefObject<unknown>
  ) => void;
  options?: {
    types?: string[];
    bounds?: unknown;
    fields?: string[];
    strictBounds?: boolean;
  };
  style?: React.CSSProperties;
  placeholder?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
  value?: string;
  disabled?: boolean;
}

const Autocomplete = ((
  AutocompleteModuleImport as unknown as {
    default?: React.ComponentType<AutocompleteComponentProps>;
  }
).default ||
  AutocompleteModuleImport) as React.ComponentType<AutocompleteComponentProps>;

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onAddressSelect,
  value = "",
  onChange,
  onBlur,
  placeholder = "Search destination...",
  name,
  disabled,
  error,
  helperText,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setInternalValue(value);
  }

  const handlePlaceSelected = (place: GooglePlaceResult) => {
    if (onAddressSelect && place.geometry?.location) {
      const lat =
        typeof place.geometry.location.lat === "function"
          ? place.geometry.location.lat()
          : (place.geometry.location.lat as unknown as number);
      const lng =
        typeof place.geometry.location.lng === "function"
          ? place.geometry.location.lng()
          : (place.geometry.location.lng as unknown as number);

      const formattedAddress = place.formatted_address || place.name || "";

      onAddressSelect({
        formattedAddress,
        lat,
        lng,
        address_components:
          place.address_components as google.maps.GeocoderAddressComponent[],
      });

      // Update internal state and fire onChange to keep Formik in sync
      setInternalValue(formattedAddress);
      if (onChange) {
        onChange({
          target: { name: name || "address", value: formattedAddress },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", marginBottom: "0px" }}>
      <div
        style={{ position: "relative", display: "flex", alignItems: "center" }}
      >
        <Search
          size={16}
          style={{
            position: "absolute",
            left: "12px",
            color: "var(--text-muted, #9ca3af)",
            pointerEvents: "none",
          }}
        />
        <Autocomplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
          onPlaceSelected={handlePlaceSelected}
          options={{
            types: ["geocode", "establishment"],
          }}
          name={name}
          value={internalValue}
          onChange={handleChange}
          disabled={disabled}
          style={{
            width: "100%",
            padding: "0.6rem 0.6rem 0.6rem 2.2rem",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: `1px solid ${error ? "#f44336" : "rgba(255, 255, 255, 0.1)"}`,
            borderRadius: "0.5rem",
            color: "#ffffff",
            fontSize: "0.875rem",
            outline: "none",
            transition: "border-color 0.2s",
            opacity: disabled ? 0.5 : 1,
          }}
          placeholder={placeholder}
          onFocus={(e) => {
            if (!error) e.target.style.borderColor = "var(--primary, #3b82f6)";
          }}
          onBlur={(e) => {
            if (!error) e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
            if (onBlur) onBlur(e);
          }}
        />
      </div>
      {error && helperText && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 0.5, display: "block", ml: 1 }}
        >
          {helperText}
        </Typography>
      )}
    </div>
  );
};

export default AddressAutocomplete;

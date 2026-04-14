"use client";

import { useState, useRef, useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { TextField,  useTheme } from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface AddressData {
  formattedAddress: string;
  lat: number;
  lng: number;
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

export const AddressAutocomplete = ({
  onAddressSelect,
  value = "",
  onChange,
  placeholder = "Search for an address...",
  name = "address",
  disabled = false,
  error = false,
  helperText,
  onBlur,
}: AddressAutocompleteProps) => {
  const theme = useTheme();
  const dict = useDictionary();
  const [address, setAddress] = useState(value);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    setAddress(value);
  }, [value]);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const addressData: AddressData = {
          formattedAddress: place.formatted_address || place.name || "",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address_components: place.address_components,
        };
        setAddress(addressData.formattedAddress);
        if (onAddressSelect) onAddressSelect(addressData);
      }
    }
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.text.darkBlue._alpha.main_50,
      borderRadius: 2,
      "& fieldset": {
        borderColor: theme.palette.divider_alpha.main_10,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary._alpha.main_30,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .MuiInputLabel-root": {
      color: "text.secondary",
      fontSize: "0.85rem",
      "&.Mui-focused": {
        color: theme.palette.primary.main,
      },
    },
    "& .MuiOutlinedInput-input": {
      color: "white",
    },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
      <TextField
        fullWidth
        name={name}
        value={address}
        onChange={handleInputChange}
        placeholder={placeholder || dict.maps.searchAddress}
        disabled={disabled}
        error={error}
        helperText={helperText}
        onBlur={onBlur}
        sx={textFieldStyles}
        variant="outlined"
      />
    </Autocomplete>
  );
};

export default AddressAutocomplete;

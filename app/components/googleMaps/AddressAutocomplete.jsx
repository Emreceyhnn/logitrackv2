"use client";

import { useState, useRef, useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { TextField, alpha, useTheme } from "@mui/material";

export const AddressAutocomplete = ({
  onAddressSelect,
  value = "",
  onChange,
  placeholder = "Search for an address...",
  name = "address",
  disabled = false,
}) => {
  const [address, setAddress] = useState(value);
  const autocompleteRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    setAddress(value);
  }, [value]);

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const addressData = {
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
      backgroundColor: alpha("#1A202C", 0.5),
      borderRadius: 2,
      "& fieldset": {
        borderColor: alpha(theme.palette.divider, 0.1),
      },
      "&:hover fieldset": {
        borderColor: alpha(theme.palette.primary.main, 0.3),
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

  const handleInputChange = (e) => {
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
        placeholder={placeholder}
        disabled={disabled}
        sx={textFieldStyles}
        variant="outlined"
      />
    </Autocomplete>
  );
};

export default AddressAutocomplete;

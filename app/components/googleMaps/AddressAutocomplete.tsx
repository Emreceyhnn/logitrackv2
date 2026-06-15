"use client";

import { useState, useRef, useEffect } from "react";
import { Autocomplete as MuiAutocomplete, TextField, useTheme, Typography, Grid } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

export interface AddressData {
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

  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<readonly google.maps.places.AutocompletePrediction[]>([]);

  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(value);
  }, [value]);

  const fetchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;

    if (typeof window !== "undefined" && window.google && !autocompleteService.current) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      geocoder.current = new window.google.maps.Geocoder();
    }

    if (inputValue === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOptions(value ? [{ description: value } as google.maps.places.AutocompletePrediction] : []);
      return undefined;
    }

    if (fetchTimeout.current) {
      clearTimeout(fetchTimeout.current);
    }

    fetchTimeout.current = setTimeout(() => {
      if (autocompleteService.current) {
        autocompleteService.current.getPlacePredictions(
          { input: inputValue },
          (results: google.maps.places.AutocompletePrediction[] | null) => {
            if (active) {
              let newOptions: readonly google.maps.places.AutocompletePrediction[] = [];

              if (value) {
                newOptions = [{ description: value } as google.maps.places.AutocompletePrediction];
              }

              if (results) {
                newOptions = [...newOptions, ...results];
              }

              setOptions(newOptions);
            }
          }
        );
      }
    }, 200);

    return () => {
      active = false;
    };
  }, [value, inputValue]);

  /* --------------------------------- STYLES --------------------------------- */
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

  return (
    <MuiAutocomplete
      fullWidth
      getOptionLabel={(option) => typeof option === 'string' ? option : option.description}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText={dict.maps?.searchAddress || "No locations"}
      onChange={(event: React.SyntheticEvent, newValue: google.maps.places.AutocompletePrediction | string | null) => {
        setOptions(newValue ? [typeof newValue === 'string' ? { description: newValue } as google.maps.places.AutocompletePrediction : newValue, ...options] : options);
        
        const selectedDesc = typeof newValue === 'string' ? newValue : newValue?.description || "";
        
        if (onChange) {
           const e = { target: { name, value: selectedDesc } } as React.ChangeEvent<HTMLInputElement>;
           onChange(e);
        }

        if (newValue && typeof newValue !== 'string' && newValue.place_id && geocoder.current) {
          geocoder.current.geocode({ placeId: newValue.place_id }, (results, status) => {
            if (status === "OK" && results && results[0] && onAddressSelect) {
              const data = results[0];
              onAddressSelect({
                formattedAddress: data.formatted_address,
                lat: data.geometry.location.lat(),
                lng: data.geometry.location.lng(),
                address_components: data.address_components
              });
            }
          });
        }
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          placeholder={placeholder || dict.maps?.searchAddress || "Search destination..."}
          disabled={disabled}
          error={error}
          helperText={helperText}
          onBlur={onBlur}
          sx={textFieldStyles}
          variant="outlined"
        />
      )}
      renderOption={(props, option, state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { key: _key, ...otherProps } = props as React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };
        const placeId = typeof option === 'string' ? option : option.place_id;
        const description = typeof option === 'string' ? option : option.description;
        const mainText = typeof option === 'string' ? option : option.structured_formatting?.main_text || description;
        const secondaryText = typeof option === 'string' ? "" : option.structured_formatting?.secondary_text || "";

        // Ensure key is ALWAYS unique using state.index and placeId to avoid duplicate key errors
        const uniqueKey = placeId ? `place-${placeId}-${state.index}` : `opt-${state.index}`;

        return (
          <li key={uniqueKey} {...otherProps}>
            <Grid container alignItems="center" spacing={2}>
              <Grid sx={{ display: 'flex', width: 44 }}>
                <LocationOnIcon sx={{ color: 'text.secondary' }} />
              </Grid>
              <Grid sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                <Typography variant="body2" color="text.primary">
                  {mainText}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {secondaryText}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

export default AddressAutocomplete;

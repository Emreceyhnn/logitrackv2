"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Autocomplete,
  TextField,
  useTheme,
  Typography,
  Box,
} from "@mui/material";
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
  value = "",
  onChange,
  onAddressSelect,
  ...props
}: AddressAutocompleteProps) => {
  const theme = useTheme();
  const dict = useDictionary();
  const [input, setInput] = useState(value);
  const [opts, setOpts] = useState<google.maps.places.AutocompletePrediction[]>(
    []
  );

  const api = typeof window !== "undefined" ? window.google : null;
  const geocoder = useMemo(() => (api ? new api.maps.Geocoder() : null), [api]);

  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    if (
      api &&
      !sessionTokenRef.current &&
      api.maps?.places?.AutocompleteSessionToken
    ) {
      sessionTokenRef.current = new api.maps.places.AutocompleteSessionToken();
    }
  }, [api]);

  useEffect(() => {
    // eslint-disable-next-line
    setInput(value);
  }, [value]);

  useEffect(() => {
    if (!input || !api) {
      // eslint-disable-next-line
      setOpts(
        value
          ? [
              {
                description: value,
              } as google.maps.places.AutocompletePrediction,
            ]
          : []
      );
      return;
    }

    let active = true;
    const timer = setTimeout(async () => {
      if (api.maps?.places?.AutocompleteSuggestion) {
        try {
          const { suggestions } =
            await api.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
              {
                input,
                sessionToken: sessionTokenRef.current || undefined,
              }
            );
          if (active) {
            interface SuggestionPayload {
              placePrediction?: {
                placeId?: string;
                text?: { text?: string };
                mainText?: { text?: string };
                secondaryText?: { text?: string };
              };
            }
            const mappedOpts: google.maps.places.AutocompletePrediction[] = (
              suggestions || []
            ).map((s: unknown) => {
              const suggestion = s as SuggestionPayload;
              return {
                place_id: suggestion.placePrediction?.placeId || "",
                description: suggestion.placePrediction?.text?.text || "",
                matched_substrings: [],
                terms: [],
                types: [],
                structured_formatting: {
                  main_text: suggestion.placePrediction?.mainText?.text || "",
                  secondary_text:
                    suggestion.placePrediction?.secondaryText?.text || "",
                  main_text_matched_substrings: [],
                },
              } as google.maps.places.AutocompletePrediction;
            });
            setOpts(mappedOpts);
          }
        } catch (err) {
          console.error("Error fetching autocomplete suggestions:", err);
          if (active) setOpts([]);
        }
      } else if (api.maps?.places?.AutocompleteService) {
        // Fallback for older Google Maps JS versions
        const service = new api.maps.places.AutocompleteService();
        service.getPlacePredictions(
          { input },
          (r: google.maps.places.AutocompletePrediction[] | null) =>
            active && setOpts(r || [])
        );
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [input, api, value]);

  return (
    <Autocomplete
      fullWidth
      autoComplete
      includeInputInList
      filterSelectedOptions
      disabled={props.disabled}
      filterOptions={(x) => x}
      options={
        opts.length
          ? opts
          : value
            ? [
                {
                  description: value,
                } as google.maps.places.AutocompletePrediction,
              ]
            : []
      }
      getOptionLabel={(o) => (typeof o === "string" ? o : o.description) || ""}
      value={
        value
          ? ({
              description: value,
            } as google.maps.places.AutocompletePrediction)
          : null
      }
      noOptionsText={dict.maps?.searchAddress || "No locations"}
      onChange={(
        _,
        val: google.maps.places.AutocompletePrediction | string | null
      ) => {
        const selectedDesc = typeof val === "string" ? val : val?.description;
        onChange?.({
          target: {
            name: props.name || "address",
            value: selectedDesc || "",
          },
        } as React.ChangeEvent<HTMLInputElement>);

        // Reset session token after a selection is made
        if (api && api.maps?.places?.AutocompleteSessionToken) {
          sessionTokenRef.current =
            new api.maps.places.AutocompleteSessionToken();
        }

        if (val && typeof val !== "string" && val.place_id && geocoder) {
          geocoder.geocode({ placeId: val.place_id }, (res, status) => {
            if (status === "OK" && res?.[0])
              onAddressSelect?.({
                formattedAddress: res[0].formatted_address,
                lat: res[0].geometry.location.lat(),
                lng: res[0].geometry.location.lng(),
                address_components: res[0].address_components,
              });
          });
        }
      }}
      onInputChange={(_, val) => setInput(val)}
      renderInput={(p) => (
        <TextField
          {...p}
          {...props}
          placeholder={
            props.placeholder ||
            dict.maps?.searchAddress ||
            "Search destination..."
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: theme.palette.text.darkBlue._alpha.main_50,
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
              "&.Mui-focused": { color: theme.palette.primary.main },
            },
            "& .MuiOutlinedInput-input": { color: "white" },
          }}
        />
      )}
      renderOption={(
        { key, ...p },
        opt: google.maps.places.AutocompletePrediction | string
      ) => {
        const option =
          typeof opt === "string"
            ? ({
                description: opt,
              } as google.maps.places.AutocompletePrediction)
            : opt;
        return (
          <li {...p} key={option.place_id || option.description || key}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: 44,
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <LocationOnIcon sx={{ color: "text.secondary" }} />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                  {option.structured_formatting?.main_text ||
                    option.description}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ wordBreak: "break-word" }}
                >
                  {option.structured_formatting?.secondary_text || ""}
                </Typography>
              </Box>
            </Box>
          </li>
        );
      }}
    />
  );
};

export default AddressAutocomplete;

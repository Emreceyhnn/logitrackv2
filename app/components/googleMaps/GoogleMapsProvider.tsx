import { useJsApiLoader, Libraries } from "@react-google-maps/api";
import React from "react";
import { Box, CircularProgress, Typography,  useTheme } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

const libraries: Libraries = ["places"];

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export const GoogleMapsProvider = ({ children }: GoogleMapsProviderProps) => {
  const theme = useTheme();
  const dict = useDictionary();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  if (loadError) {
    return (
      <Box
        sx={{
          p: 3,
          bgcolor: theme.palette.error._alpha.main_05,
          border: `1px solid ${theme.palette.error._alpha.main_20}`,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <WarningAmberIcon color="error" />
        <Box>
          <Typography variant="subtitle2" color="error" fontWeight={700}>
            {dict.maps.apiError}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {dict.maps.apiErrorDesc}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!isLoaded) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 8,
          gap: 2,
        }}
      >
        <CircularProgress size={32} thickness={5} sx={{ color: theme.palette.primary.main }} />
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          {dict.maps.initializing}
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

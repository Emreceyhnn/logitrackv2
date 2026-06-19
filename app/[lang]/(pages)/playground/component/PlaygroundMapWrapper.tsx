"use client";

import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { GoogleMapsProvider } from "./GoogleMapsProvider";
import { RouteMap, LocationPoint, RouteMarker } from "./RouteMap";
import { MapWithMarker } from "./MapWithMarker";

const MOCK_ORIGIN: LocationPoint = { lat: 41.0082, lng: 28.9784 };
const MOCK_DESTINATION: LocationPoint = { lat: 41.062, lng: 29.016 };

const ALL_STOPS: LocationPoint[] = [
  { lat: 41.02, lng: 28.98 }, // Stop 1: Karakoy
  { lat: 41.035, lng: 28.985 }, // Stop 2: Taksim
  { lat: 41.045, lng: 28.995 }, // Stop 3: Nisantasi
  { lat: 41.055, lng: 29.005 }, // Stop 4: Yildiz
  { lat: 41.06, lng: 29.01 }, // Stop 5: Barbaros
];

const MOCK_MARKERS: RouteMarker[] = [
  {
    id: "veh-1",
    position: { lat: 41.025, lng: 28.982 },
    type: "vehicle",
    label: "34 ABC 123",
  },
  {
    id: "wh-1",
    position: { lat: 41.0, lng: 28.95 },
    type: "warehouse",
    label: "Main Hub",
  },
  {
    id: "cust-1",
    position: { lat: 41.05, lng: 29.02 },
    type: "customer",
    label: "Customer A",
  },
];

export const PlaygroundMapWrapper = () => {
  const [stopCount, setStopCount] = useState(3);
  const [dummyRenderState, setDummyRenderState] = useState(0);

  // Derive stops based on the current count (simulating adding/removing stops)
  // Even if we slice a new array reference every render, RouteMap's deep memoization prevents API refetch!
  const currentStops = ALL_STOPS.slice(0, stopCount);

  return (
    <GoogleMapsProvider>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Section 1: Route Optimizer Map */}
        <Box
          sx={{
            p: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Route Optimizer Map
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Watch the &quot;API Calls Made&quot; counter. It only increases when stops
            physically change.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              Stops Config:
            </Typography>
            <Button
              variant="contained"
              size="small"
              disabled={stopCount >= 5}
              onClick={() => setStopCount((prev) => prev + 1)}
            >
              Add Stop (+1)
            </Button>
            <Button
              variant="outlined"
              size="small"
              disabled={stopCount <= 0}
              onClick={() => setStopCount((prev) => prev - 1)}
            >
              Remove Stop (-1)
            </Button>

            <Box sx={{ flexGrow: 1 }} />

            {/* This button forces a re-render. 
              The array reference `currentStops` will change, BUT the API should NOT refetch! */}
            <Button
              variant="text"
              color="secondary"
              size="small"
              onClick={() => setDummyRenderState((prev) => prev + 1)}
            >
              Force Re-render (Test Cache)
            </Button>
            <Typography variant="caption" color="text.secondary">
              Render ID: {dummyRenderState}
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "500px",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <RouteMap
              origin={MOCK_ORIGIN}
              destination={MOCK_DESTINATION}
              stops={currentStops}
              markers={[]} // Separated extraneous markers to the other map for clarity
            />
          </Box>
        </Box>

        {/* Section 2: Map With Markers */}
        <Box
          sx={{
            p: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Markers Map (Vehicle, Warehouse, Customer)
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Testing the MapWithMarker component with individual marker
            components and spiderfier blooming.
          </Typography>

          <MapWithMarker
            center={{ lat: 41.015, lng: 28.98 }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            markers={MOCK_MARKERS as any} // using cast if type mismatches slightly
            height="500px"
          />
        </Box>
      </Box>
    </GoogleMapsProvider>
  );
};

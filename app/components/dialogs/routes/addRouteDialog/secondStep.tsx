"use client";

import { alpha, Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import { AddRouteStep2 } from "@/app/lib/type/add-route";
import MapRoutesDialogCard from "../map";
import AddressTextArea from "../../../inputs/AddressTextArea";
import ExploreIcon from "@mui/icons-material/Explore";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import { useEffect, useState } from "react";
import { getDirections } from "@/app/lib/controllers/map";

interface SecondRouteDialogStepProps {
  state: AddRouteStep2;
  updateStep2: (data: Partial<AddRouteStep2>) => void;
}

const SecondRouteDialogStep = ({
  state,
  updateStep2,
}: SecondRouteDialogStepProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  /* --------------------------------- states --------------------------------- */
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  /* ------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    if (state.startLat && state.startLng && state.endLat && state.endLng) {
      const fetchMetrics = async () => {
        setLoadingMetrics(true);
        try {
          const origin = { lat: state.startLat!, lng: state.startLng! };
          const dest = { lat: state.endLat!, lng: state.endLng! };
          const data = await getDirections(origin, dest);

          if (data && data.routes && data.routes.length > 0) {
            const leg = data.routes[0].legs[0];
            updateStep2({
              distanceKm: parseFloat((leg.distance.value / 1000).toFixed(1)),
              durationMin: Math.ceil(leg.duration.value / 60),
            });
          }
        } catch (error) {
          console.error("Failed to fetch route metrics", error);
        } finally {
          setLoadingMetrics(false);
        }
      };
      fetchMetrics();
    }
  }, [state.startLat, state.startLng, state.endLat, state.endLng]);

  return (
    <Box>
      <Stack spacing={4}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ExploreIcon color="primary" />
          </Box>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={700} color="white">
              Step 2: Location Details
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Enter the starting point and destination to calculate the route
              metrics.
            </Typography>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  component="div"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "success.main",
                    }}
                  />
                  Start Address
                </Typography>
                <AddressTextArea
                  label="Enter origin location"
                  name="startAddress"
                  value={state.startAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateStep2({ startAddress: e.target.value })
                  }
                  onPlaceSelect={(place: google.maps.places.PlaceResult) => {
                    const lat = place.geometry?.location?.lat;
                    const lng = place.geometry?.location?.lng;
                    updateStep2({
                      startAddress: place.formatted_address || place.name || "",
                      startLat:
                        typeof lat === "function"
                          ? (lat as () => number)()
                          : (lat as unknown as number),
                      startLng:
                        typeof lng === "function"
                          ? (lng as () => number)()
                          : (lng as unknown as number),
                    });
                  }}
                />
              </Stack>

              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  component="div"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "error.main",
                    }}
                  />
                  End Address
                </Typography>
                <AddressTextArea
                  label="Enter destination location"
                  name="endAddress"
                  value={state.endAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateStep2({ endAddress: e.target.value })
                  }
                  onPlaceSelect={(place: google.maps.places.PlaceResult) => {
                    const lat = place.geometry?.location?.lat;
                    const lng = place.geometry?.location?.lng;
                    updateStep2({
                      endAddress: place.formatted_address || place.name || "",
                      endLat:
                        typeof lat === "function"
                          ? (lat as () => number)()
                          : (lat as unknown as number),
                      endLng:
                        typeof lng === "function"
                          ? (lng as () => number)()
                          : (lng as unknown as number),
                    });
                  }}
                />
              </Stack>

              <Stack direction="row" spacing={2}>
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.divider, 0.05),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Distance (km)
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="white">
                    {loadingMetrics
                      ? "..."
                      : state.distanceKm > 0
                        ? state.distanceKm
                        : "--"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.divider, 0.05),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Duration (min)
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="white">
                    {loadingMetrics
                      ? "..."
                      : state.durationMin > 0
                        ? state.durationMin
                        : "--"}
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                  display: "flex",
                  gap: 1.5,
                }}
              >
                <ElectricBoltIcon
                  fontSize="small"
                  sx={{ color: theme.palette.info.main, mt: 0.2 }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ lineHeight: 1.4 }}
                >
                  <Typography
                    component="span"
                    variant="caption"
                    fontWeight={700}
                    color="info.main"
                  >
                    Optimization Tip:
                  </Typography>{" "}
                  This route currently avoids major highways. You can adjust the
                  path by dragging the line on the map to avoid traffic or
                  congested areas.
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                height: "100%",
                minHeight: 350,
                borderRadius: 3,
                overflow: "hidden",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <MapRoutesDialogCard
                origin={
                  state.startLat && state.startLng
                    ? { lat: state.startLat, lng: state.startLng }
                    : undefined
                }
                destination={
                  state.endLat && state.endLng
                    ? { lat: state.endLat, lng: state.endLng }
                    : undefined
                }
              />
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default SecondRouteDialogStep;

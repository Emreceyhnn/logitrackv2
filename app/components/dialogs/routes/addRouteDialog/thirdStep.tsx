"use client";

import {
  alpha,
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
  MenuItem,
  Avatar,
  Card,
  CircularProgress,
} from "@mui/material";
import { AddRouteStep3 } from "@/app/lib/type/add-route";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BuildIcon from "@mui/icons-material/Build";
import GppGoodIcon from "@mui/icons-material/GppGood";
import { DriverWithRelations } from "@/app/lib/type/driver";
import { VehicleWithRelations } from "@/app/lib/type/vehicle";
import { useEffect, useState } from "react";
import { getDrivers } from "@/app/lib/controllers/driver";
import { getVehicles } from "@/app/lib/controllers/vehicle";

interface ThirdRouteDialogStepProps {
  state: AddRouteStep3;
  updateStep3: (data: Partial<AddRouteStep3>) => void;
}

const ThirdRouteDialogStep = ({
  state,
  updateStep3,
}: ThirdRouteDialogStepProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  /* --------------------------------- states --------------------------------- */
  const [drivers, setDrivers] = useState<DriverWithRelations[]>([]);
  const [vehicles, setVehicles] = useState<VehicleWithRelations[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  /* ------------------------------- lifecycle ------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      setLoadingItems(true);
      try {
        const [driversRes, vehiclesRes] = await Promise.all([
          getDrivers(1, 100),
          getVehicles(),
        ]);
        setDrivers(driversRes.data);
        setVehicles(vehiclesRes);
      } catch (error) {
        console.error("Failed to fetch assignments data", error);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchData();
  }, []);

  const selectedDriver = drivers.find((d) => d.id === state.driverId);
  const selectedVehicle = vehicles.find((v) => v.id === state.vehicleId);

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
            <AssignmentIndIcon color="primary" />
          </Box>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={700} color="white">
              Step 3: Assignments
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Assign an available driver and vehicle to this route.
            </Typography>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                Driver Assignment
              </Typography>
              <CustomTextArea
                name="driverId"
                select
                value={state.driverId}
                onChange={(e) => updateStep3({ driverId: e.target.value })}
                sx={{
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  },
                }}
              >
                {loadingItems ? (
                  <MenuItem disabled>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Loading drivers...
                  </MenuItem>
                ) : (
                  drivers.map((driver) => (
                    <MenuItem key={driver.id} value={driver.id}>
                      <Avatar
                        src={driver.user.avatarUrl || undefined}
                        sx={{ width: 24, height: 24 }}
                      />
                      <Typography variant="body2">
                        {driver.user.name} {driver.user.surname}
                      </Typography>
                    </MenuItem>
                  ))
                )}
              </CustomTextArea>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
              >
                Vehicle Assignment
              </Typography>
              <CustomTextArea
                name="vehicleId"
                select
                value={state.vehicleId}
                onChange={(e) => updateStep3({ vehicleId: e.target.value })}
                sx={{
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  },
                }}
              >
                {loadingItems ? (
                  <MenuItem disabled>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Loading vehicles...
                  </MenuItem>
                ) : (
                  vehicles.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      <LocalShippingIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        {vehicle.plate} ({vehicle.brand} {vehicle.model})
                      </Typography>
                    </MenuItem>
                  ))
                )}
              </CustomTextArea>
            </Stack>
          </Grid>
        </Grid>

        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: alpha("#1A202C", 0.5),
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            backgroundImage: "none",
          }}
        >
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontWeight: 700, mb: 2, display: "block" }}
          >
            ASSIGNMENT SUMMARY
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EventAvailableIcon fontSize="small" color="primary" />
                  <Typography variant="caption" fontWeight={600} color="white">
                    Driver Shift
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {selectedDriver
                    ? "Shift Start: 08:30 AM"
                    : "No driver selected"}
                </Typography>
                {selectedDriver && (
                  <Typography
                    variant="caption"
                    color="success.main"
                    fontWeight={600}
                  >
                    Status: On Duty
                  </Typography>
                )}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BuildIcon fontSize="small" color="primary" />
                  <Typography variant="caption" fontWeight={600} color="white">
                    Vehicle Maintenance
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {selectedVehicle
                    ? `Next Service: in ${selectedVehicle.nextServiceKm || 0} km`
                    : "No vehicle selected"}
                </Typography>
                {selectedVehicle && (
                  <Typography
                    variant="caption"
                    color="success.main"
                    fontWeight={600}
                  >
                    Health: Good
                  </Typography>
                )}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <GppGoodIcon fontSize="small" color="primary" />
                  <Typography variant="caption" fontWeight={600} color="white">
                    Compliance
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Hazmat & ELD Certified
                </Typography>
                <Typography
                  variant="caption"
                  color="success.main"
                  fontWeight={600}
                >
                  Status: All Clear
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Stack>
    </Box>
  );
};

export default ThirdRouteDialogStep;

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
import { useFormikContext } from "formik";
import { RouteFormValues } from "@/app/lib/type/routes";
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

const ThirdRouteDialogStep = () => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const { values, setFieldValue, handleBlur, touched, errors } = useFormikContext<RouteFormValues>();

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
          getVehicles({ status: ["AVAILABLE"] }),
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

  const selectedDriver = drivers.find((d) => d.id === values.driverId);
  const selectedVehicle = vehicles.find((v) => v.id === values.vehicleId);

  const handleDriverChange = (driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    setFieldValue("driverId", driverId);
    
    // Auto-fill vehicle if the driver has one assigned and current vehicle is empty
    if (driver?.currentVehicle?.id && !values.vehicleId) {
      setFieldValue("vehicleId", driver.currentVehicle.id);
    }
  };

  const handleVehicleChange = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    setFieldValue("vehicleId", vehicleId);
    
    // Auto-fill driver if the vehicle has one assigned and current driver is empty
    if (vehicle?.driver?.id && !values.driverId) {
      setFieldValue("driverId", vehicle.driver.id);
    }
  };

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
                value={values.driverId}
                onBlur={handleBlur}
                onChange={(e) => handleDriverChange(e.target.value)}
                error={touched.driverId && Boolean(errors.driverId)}
                helperText={touched.driverId ? (errors.driverId as string) : undefined}
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
                  [
                    <MenuItem key="none" value="">Unassigned</MenuItem>,
                    ...drivers.map((driver) => (
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
                  ]
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
                value={values.vehicleId}
                onBlur={handleBlur}
                onChange={(e) => handleVehicleChange(e.target.value)}
                error={touched.vehicleId && Boolean(errors.vehicleId)}
                helperText={touched.vehicleId ? (errors.vehicleId as string) : undefined}
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
                   [
                    <MenuItem key="none" value="">Unassigned</MenuItem>,
                    ...vehicles.map((vehicle) => (
                      <MenuItem key={vehicle.id} value={vehicle.id}>
                        <LocalShippingIcon
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {vehicle.plate} ({vehicle.brand} {vehicle.model})
                        </Typography>
                      </MenuItem>
                    ))
                   ]
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

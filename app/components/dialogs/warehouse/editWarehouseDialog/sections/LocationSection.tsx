"use client";

import {
  alpha,
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
  MenuItem,
} from "@mui/material";
import {
  EditWarehouseLocation,
  EditWarehousePageActions,
} from "@/app/lib/type/edit-warehouse";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import { AddressAutocomplete } from "@/app/components/googleMaps/AddressAutocomplete";
import { useEffect, useState } from "react";
import { getMyCompanyUsersAction } from "@/app/lib/controllers/users";

interface Manager {
  id: string;
  name: string;
  surname: string;
  role?: {
    name: string;
  } | null;
}

interface LocationSectionProps {
  state: EditWarehouseLocation;
  actions: EditWarehousePageActions;
}

const LocationSection = ({ state, actions }: LocationSectionProps) => {
  const theme = useTheme();
  const [managers, setManagers] = useState<Manager[]>([]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const users = await getMyCompanyUsersAction();
        const relevantUsers = users.filter(
          (u) =>
            u.role?.name === "ADMIN" ||
            u.role?.name === "MANAGER" ||
            u.role?.name === "role_admin" ||
            u.role?.name === "role_manager"
        );
        setManagers(relevantUsers);
      } catch (error) {
        console.error("Failed to fetch managers:", error);
      }
    };
    fetchManagers();
  }, []);

  return (
    <Box>
      <Stack spacing={4}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: theme.palette.primary.main,
              boxShadow: `0 0 10px ${theme.palette.primary.main}`,
            }}
          />
          <Typography variant="subtitle1" fontWeight={700} color="white">
            Facility Address
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                STREET ADDRESS
              </Typography>
              <AddressAutocomplete
                name="address"
                placeholder="e.g. 123 Logistics Way, Industrial District"
                value={state.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  actions.updateLocation({ address: e.target.value })
                }
                onAddressSelect={(data: {
                  formattedAddress: string;
                  lat: number;
                  lng: number;
                  address_components?: google.maps.GeocoderAddressComponent[];
                }) => {
                  const addressComponents = data.address_components || [];
                  const getComponent = (types: string[]) =>
                    addressComponents.find((c) =>
                      types.every((t) => c.types.includes(t))
                    )?.long_name || "";

                  actions.updateLocation({
                    address: data.formattedAddress,
                    city:
                      getComponent(["locality"]) ||
                      getComponent(["administrative_area_level_1"]),
                    country: getComponent(["country"]),
                    postalCode: getComponent(["postal_code"]),
                    lat: data.lat,
                    lng: data.lng,
                  });
                }}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                CITY
              </Typography>
              <CustomTextArea
                name="city"
                placeholder="e.g. Manchester"
                value={state.city}
                onChange={(e) =>
                  actions.updateLocation({ city: e.target.value })
                }
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                COUNTRY
              </Typography>
              <CustomTextArea
                name="country"
                placeholder="e.g. United Kingdom"
                value={state.country}
                onChange={(e) =>
                  actions.updateLocation({ country: e.target.value })
                }
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                POSTAL CODE
              </Typography>
              <CustomTextArea
                name="postalCode"
                placeholder="e.g. M1 1AA"
                value={state.postalCode}
                onChange={(e) =>
                  actions.updateLocation({ postalCode: e.target.value })
                }
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                WAREHOUSE MANAGER
              </Typography>
              <CustomTextArea
                name="managerId"
                select
                value={state.managerId}
                onChange={(e) =>
                  actions.updateLocation({ managerId: e.target.value })
                }
              >
                <MenuItem value="">Unassigned</MenuItem>
                {managers.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name} {m.surname} ({m.role?.name})
                  </MenuItem>
                ))}
              </CustomTextArea>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: theme.palette.primary.main,
              }}
            />
            <Typography variant="subtitle1" fontWeight={700} color="white">
              Location Preview
            </Typography>
          </Stack>
          <Box
            sx={{
              width: "100%",
              height: 200,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.divider, 0.05),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.2,
                backgroundImage: `radial-gradient(${theme.palette.primary.main} 0.5px, transparent 0.5px)`,
                backgroundSize: "20px 20px",
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Map integration pending exact coordinates
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default LocationSection;

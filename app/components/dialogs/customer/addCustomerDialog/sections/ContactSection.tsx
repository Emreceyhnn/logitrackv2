"use client";

import { alpha, Box, Button, Grid, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { AddCustomerContact } from "@/app/lib/type/add-customer";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import { AddressAutocomplete } from "@/app/components/googleMaps/AddressAutocomplete";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface ContactSectionProps {
  state: AddCustomerContact;
  updateContact: (data: Partial<AddCustomerContact>) => void;
}

const ContactSection = ({ state, updateContact }: ContactSectionProps) => {
  const theme = useTheme();

  const handleAddLocation = () => {
    updateContact({
      locations: [
        ...state.locations,
        {
          name: `Location ${state.locations.length + 1}`,
          address: "",
          lat: undefined,
          lng: undefined,
          isDefault: state.locations.length === 0,
        },
      ],
    });
  };

  const handleRemoveLocation = (index: number) => {
    const newLocations = [...state.locations];
    newLocations.splice(index, 1);
    
    // Ensure at least one default if there are locations left
    if (newLocations.length > 0 && !newLocations.some(l => l.isDefault)) {
      newLocations[0].isDefault = true;
    }
    
    updateContact({ locations: newLocations });
  };

  const updateLocation = (index: number, field: string, value: any) => {
    const newLocations = [...state.locations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    updateContact({ locations: newLocations });
  };

  return (
    <Box>
      <Stack spacing={4}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle1" fontWeight={700} color="white">
            Communication Details
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Set the primary contact methods for the customer.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                EMAIL ADDRESS
              </Typography>
              <CustomTextArea
                name="email"
                placeholder="e.g. logistics@client.com"
                value={state.email}
                onChange={(e) => updateContact({ email: e.target.value })}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                PHONE NUMBER
              </Typography>
              <CustomTextArea
                name="phone"
                placeholder="e.g. +44 20 7123 4567"
                value={state.phone}
                onChange={(e) => updateContact({ phone: e.target.value })}
              />
            </Stack>
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={700} color="white">
              Locations
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Add multiple offices or warehouses for this customer.
            </Typography>
          </Stack>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddLocation}
            sx={{
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.2) },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Add Location
          </Button>
        </Stack>

        <Stack spacing={3}>
          {state.locations.map((loc, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                bgcolor: alpha("#000", 0.2),
                position: "relative",
              }}
            >
              {state.locations.length > 1 && (
                <IconButton
                  size="small"
                  onClick={() => handleRemoveLocation(index)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: alpha(theme.palette.error.main, 0.7),
                    "&:hover": { color: theme.palette.error.main },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              )}

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      LOCATION NAME
                    </Typography>
                    <CustomTextArea
                      name={`loc-name-${index}`}
                      placeholder="e.g. HQ, London Branch"
                      value={loc.name}
                      onChange={(e) => updateLocation(index, "name", e.target.value)}
                    />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      ADDRESS
                    </Typography>
                    <AddressAutocomplete
                      name={`loc-address-${index}`}
                      placeholder="Search for an address..."
                      value={loc.address}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateLocation(index, "address", e.target.value)
                      }
                      onAddressSelect={(data: {
                        formattedAddress: string;
                        lat: number;
                        lng: number;
                      }) => {
                        updateLocation(index, "address", data.formattedAddress);
                        updateLocation(index, "lat", data.lat);
                        updateLocation(index, "lng", data.lng);
                      }}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ContactSection;

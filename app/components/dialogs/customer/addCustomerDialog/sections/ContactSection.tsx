import { alpha, Box, Button, Grid, IconButton, Stack, Typography, useTheme, SvgIconProps } from "@mui/material";
import { AddCustomerContact } from "@/app/lib/type/add-customer";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import { AddressAutocomplete } from "@/app/components/googleMaps/AddressAutocomplete";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ExploreIcon from "@mui/icons-material/Explore";

interface ContactSectionProps {
  state: AddCustomerContact;
  updateContact: (data: Partial<AddCustomerContact>) => void;
}

const LabelWithIcon = ({ icon: Icon, label }: { icon: React.ComponentType<SvgIconProps>, label: string }) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
    <Icon sx={{ fontSize: "0.9rem", color: "primary.main", opacity: 0.8 }} />
    <Typography
      variant="caption"
      color="text.secondary"
      fontWeight={700}
      sx={{ letterSpacing: "0.05em", textTransform: "uppercase" }}
    >
      {label}
    </Typography>
  </Stack>
);

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
    
    if (newLocations.length > 0 && !newLocations.some(l => l.isDefault)) {
      newLocations[0].isDefault = true;
    }
    
    updateContact({ locations: newLocations });
  };

  const updateLocation = (
    index: number,
    updates: Partial<AddCustomerContact["locations"][number]>
  ) => {
    const newLocations = [...state.locations];
    newLocations[index] = { ...newLocations[index], ...updates };
    updateContact({ locations: newLocations });
  };

  return (
    <Box sx={{ py: 1 }}>
      <Stack spacing={4}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={0}>
              <LabelWithIcon icon={EmailIcon} label="Primary Email" />
              <CustomTextArea
                name="email"
                placeholder="e.g. logistics@client.com"
                value={state.email}
                onChange={(e) => updateContact({ email: e.target.value })}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: alpha("#fff", 0.02),
                  }
                }}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={0}>
              <LabelWithIcon icon={PhoneIcon} label="Phone Number" />
              <CustomTextArea
                name="phone"
                placeholder="e.g. +44 20 7123 4567"
                value={state.phone}
                onChange={(e) => updateContact({ phone: e.target.value })}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: alpha("#fff", 0.02),
                  }
                }}
              />
            </Stack>
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="white">
              Operating Locations
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              ADD OFFICES, HUBS OR WAREHOUSES
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddLocation}
            sx={{
              borderColor: alpha(theme.palette.primary.main, 0.3),
              color: "primary.main",
              "&:hover": { 
                borderColor: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.05) 
              },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              px: 2,
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
                p: 3,
                borderRadius: 4,
                border: `1px solid ${alpha("#fff", 0.05)}`,
                bgcolor: alpha("#fff", 0.01),
                backgroundImage: `linear-gradient(135deg, ${alpha("#fff", 0.02)} 0%, transparent 100%)`,
                position: "relative",
                transition: "all 0.3s ease",
                "&:hover": {
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  bgcolor: alpha("#fff", 0.02),
                }
              }}
            >
              {state.locations.length > 1 && (
                <IconButton
                  size="small"
                  onClick={() => handleRemoveLocation(index)}
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    color: alpha(theme.palette.error.main, 0.5),
                    bgcolor: alpha(theme.palette.error.main, 0.05),
                    "&:hover": { 
                      color: theme.palette.error.main,
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                    },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              )}

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Stack spacing={0}>
                    <LabelWithIcon icon={MapIcon} label="Name" />
                    <CustomTextArea
                      name={`loc-name-${index}`}
                      placeholder="e.g. Headquarters"
                      value={loc.name}
                      onChange={(e) => updateLocation(index, { name: e.target.value })}
                    />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack spacing={0}>
                    <LabelWithIcon icon={LocationOnIcon} label="Full Address" />
                    <AddressAutocomplete
                      name={`loc-address-${index}`}
                      placeholder="Street, City, Country..."
                      value={loc.address}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateLocation(index, { address: e.target.value })
                      }
                      onAddressSelect={(data: {
                        formattedAddress: string;
                        lat: number;
                        lng: number;
                      }) => {
                        updateLocation(index, {
                          address: data.formattedAddress,
                          lat: data.lat,
                          lng: data.lng
                        });
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={0}>
                    <LabelWithIcon icon={ExploreIcon} label="Lat Boundary" />
                    <CustomTextArea
                      name={`loc-lat-${index}`}
                      placeholder="Coordinate Latitude"
                      value={loc.lat !== undefined ? String(loc.lat) : ""}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        updateLocation(index, { lat: isNaN(val) ? undefined : val });
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={0}>
                    <LabelWithIcon icon={ExploreIcon} label="Lng Boundary" />
                    <CustomTextArea
                      name={`loc-lng-${index}`}
                      placeholder="Coordinate Longitude"
                      value={loc.lng !== undefined ? String(loc.lng) : ""}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        updateLocation(index, { lng: isNaN(val) ? undefined : val });
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

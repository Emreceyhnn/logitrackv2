"use client";

import { Box, Grid, Stack, Typography } from "@mui/material";
import { AddCustomerContact } from "@/app/lib/type/add-customer";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import { AddressAutocomplete } from "@/app/components/googleMaps/AddressAutocomplete";

interface ContactSectionProps {
  state: AddCustomerContact;
  updateContact: (data: Partial<AddCustomerContact>) => void;
}

const ContactSection = ({ state, updateContact }: ContactSectionProps) => {
  return (
    <Box>
      <Stack spacing={4}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle1" fontWeight={700} color="white">
            Communication & Address
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Set the primary contact methods and physical location for the
            customer.
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
                OFFICE / BILLING ADDRESS
              </Typography>
              <AddressAutocomplete
                name="address"
                placeholder="e.g. 100 Business Park, Suite 500, London"
                value={state.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateContact({ address: e.target.value })
                }
                onAddressSelect={(data: {
                  formattedAddress: string;
                  lat: number;
                  lng: number;
                }) => {
                  updateContact({
                    address: data.formattedAddress,
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
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
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
      </Stack>
    </Box>
  );
};

export default ContactSection;

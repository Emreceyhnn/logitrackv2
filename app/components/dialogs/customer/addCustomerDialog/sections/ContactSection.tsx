"use client";

import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import {
  AddCustomerContact,
  AddCustomerPageActions,
} from "@/app/lib/type/add-customer";
import CustomTextArea from "@/app/components/inputs/customTextArea";

interface ContactSectionProps {
  state: AddCustomerContact;
  actions: AddCustomerPageActions;
}

const ContactSection = ({ state, actions }: ContactSectionProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

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
              <CustomTextArea
                name="address"
                placeholder="e.g. 100 Business Park, Suite 500, London"
                value={state.address}
                onChange={(e) =>
                  actions.updateContact({ address: e.target.value })
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
                EMAIL ADDRESS
              </Typography>
              <CustomTextArea
                name="email"
                placeholder="e.g. logistics@client.com"
                value={state.email}
                onChange={(e) =>
                  actions.updateContact({ email: e.target.value })
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
                PHONE NUMBER
              </Typography>
              <CustomTextArea
                name="phone"
                placeholder="e.g. +44 20 7123 4567"
                value={state.phone}
                onChange={(e) =>
                  actions.updateContact({ phone: e.target.value })
                }
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default ContactSection;

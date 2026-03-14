"use client";

import { Box, Grid, Stack, Typography, MenuItem } from "@mui/material";
import { AddCustomerIdentity } from "@/app/lib/type/add-customer";
import CustomTextArea from "@/app/components/inputs/customTextArea";

interface IdentitySectionProps {
  state: AddCustomerIdentity;
  updateIdentity: (data: Partial<AddCustomerIdentity>) => void;
}

const INDUSTRIES = [
  "Logistics & Transportation",
  "Retail & E-commerce",
  "Manufacturing",
  "Pharmaceuticals",
  "Automotive",
  "Aviation",
  "Technology",
  "Other",
];

const IdentitySection = ({ state, updateIdentity }: IdentitySectionProps) => {
  return (
    <Box>
      <Stack spacing={4}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle1" fontWeight={700} color="white">
            Company Identity
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Define the legal and operational identity of the customer.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                CUSTOMER NAME *
              </Typography>
              <CustomTextArea
                name="name"
                placeholder="e.g. Global Logistics Solutions Ltd."
                value={state.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateIdentity({ name: e.target.value })
                }
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                CUSTOMER CODE (OPTIONAL)
              </Typography>
              <CustomTextArea
                name="code"
                placeholder="e.g. CUST-001 (Leave blank to auto-generate)"
                value={state.code}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateIdentity({ code: e.target.value })
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
                INDUSTRY
              </Typography>
              <CustomTextArea
                name="industry"
                select
                value={state.industry}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateIdentity({ industry: e.target.value })
                }
              >
                <MenuItem value="" disabled>
                  Select an industry
                </MenuItem>
                {INDUSTRIES.map((ind) => (
                  <MenuItem key={ind} value={ind}>
                    {ind}
                  </MenuItem>
                ))}
              </CustomTextArea>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                TAX ID / VAT NUMBER
              </Typography>
              <CustomTextArea
                name="taxId"
                placeholder="e.g. GB123456789"
                value={state.taxId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateIdentity({ taxId: e.target.value })
                }
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default IdentitySection;

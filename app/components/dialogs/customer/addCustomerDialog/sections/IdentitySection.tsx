import { Box, Grid, Stack, Typography, MenuItem, alpha, SvgIconProps } from "@mui/material";
import { AddCustomerIdentity } from "@/app/lib/type/add-customer";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptIcon from "@mui/icons-material/Receipt";

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

const IdentitySection = ({ state, updateIdentity }: IdentitySectionProps) => {
  return (
    <Box sx={{ py: 1 }}>
      <Stack spacing={4}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Stack spacing={0}>
              <LabelWithIcon icon={BusinessIcon} label="Full Legal Company Name *" />
              <CustomTextArea
                name="name"
                placeholder="e.g. Global Logistics Solutions Ltd."
                value={state.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateIdentity({ name: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: alpha("#fff", 0.02),
                    "&:hover": { bgcolor: alpha("#fff", 0.04) },
                    "&.Mui-focused": { bgcolor: alpha("#fff", 0.04) },
                  }
                }}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={0}>
              <LabelWithIcon icon={BadgeIcon} label="Customer Code" />
              <CustomTextArea
                name="code"
                placeholder="e.g. CUST-01 (or leave blank)"
                value={state.code}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateIdentity({ code: e.target.value })
                }
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
              <LabelWithIcon icon={ReceiptIcon} label="Tax ID / VAT No" />
              <CustomTextArea
                name="taxId"
                placeholder="e.g. GB123456789"
                value={state.taxId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateIdentity({ taxId: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: alpha("#fff", 0.02),
                  }
                }}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Stack spacing={0}>
              <LabelWithIcon icon={CategoryIcon} label="Industry Vertical" />
              <CustomTextArea
                name="industry"
                select
                value={state.industry}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateIdentity({ industry: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: alpha("#fff", 0.02),
                  }
                }}
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
        </Grid>
      </Stack>
    </Box>
  );
};

export default IdentitySection;

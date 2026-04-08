import { Box, Grid, Stack, Typography, MenuItem, alpha, SvgIconProps } from "@mui/material";
import { AddCustomerIdentity } from "@/app/lib/type/add-customer";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptIcon from "@mui/icons-material/Receipt";

import { useFormikContext } from "formik";

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

const IdentitySection = () => {
  const { values, errors, touched, setFieldValue, handleBlur } = useFormikContext<AddCustomerIdentity>();

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
                value={values.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue("name", e.target.value)
                }
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name ? (errors.name as string) : ""}
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
                value={values.code}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue("code", e.target.value)
                }
                onBlur={handleBlur}
                error={touched.code && Boolean(errors.code)}
                helperText={touched.code ? (errors.code as string) : ""}
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
                value={values.taxId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue("taxId", e.target.value)
                }
                onBlur={handleBlur}
                error={touched.taxId && Boolean(errors.taxId)}
                helperText={touched.taxId ? (errors.taxId as string) : ""}
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
                value={values.industry}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue("industry", e.target.value)
                }
                onBlur={handleBlur}
                error={touched.industry && Boolean(errors.industry)}
                helperText={touched.industry ? (errors.industry as string) : ""}
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

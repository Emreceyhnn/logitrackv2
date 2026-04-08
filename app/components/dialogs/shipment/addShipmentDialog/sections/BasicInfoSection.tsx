"use client";

import {
  alpha,
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  useTheme,
  MenuItem,
  ButtonGroup,
} from "@mui/material";
import { useFormikContext } from "formik";
import { ShipmentFormValues } from "@/app/lib/type/shipment";
import { ShipmentPriority } from "@prisma/client";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

interface BasicInfoSectionProps {}

const BasicInfoSection = ({}: BasicInfoSectionProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const { values, setFieldValue, handleBlur, touched, errors } =
    useFormikContext<ShipmentFormValues>();

  const priorities: {
    label: string;
    value: ShipmentPriority;
    color: string;
  }[] = [
    { label: "Low", value: "LOW", color: theme.palette.success.main },
    { label: "Medium", value: "MEDIUM", color: theme.palette.warning.main },
    { label: "High", value: "HIGH", color: theme.palette.error.main },
    { label: "Critical", value: "CRITICAL", color: theme.palette.error.dark },
  ];

  return (
    <Box>
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: theme.palette.primary.main,
            }}
          />
          <Typography variant="subtitle2" fontWeight={700} color="white">
            Basic Information
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                SHIPMENT ID / REF (Optional)
              </Typography>
              <CustomTextArea
                name="referenceNumber"
                placeholder="e.g. SHP-8752-XP (Leave blank to auto-generate)"
                value={values.referenceNumber}
                onChange={(e) => setFieldValue("referenceNumber", e.target.value)}
                onBlur={handleBlur}
                error={touched.referenceNumber && Boolean(errors.referenceNumber)}
                helperText={touched.referenceNumber ? (errors.referenceNumber as string) : undefined}
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
                REFERENCE NUMBER
              </Typography>
              <CustomTextArea
                name="ref2"
                placeholder="PO-9821"
                value={values.referenceNumber}
                onChange={(e) =>
                  setFieldValue("referenceNumber", e.target.value)
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
                PRIORITY LEVEL
              </Typography>
              <ButtonGroup
                fullWidth
                sx={{ borderRadius: 2, overflow: "hidden" }}
              >
                {priorities.map((p) => (
                  <Button
                    key={p.value}
                    onClick={() => setFieldValue("priority", p.value)}
                    sx={{
                      py: 1.5,
                      bgcolor:
                        values.priority === p.value
                          ? alpha(p.color, 0.1)
                          : alpha("#1A202C", 0.5),
                      color:
                        values.priority === p.value ? p.color : "text.secondary",
                      borderColor: alpha(theme.palette.divider, 0.1),
                      borderWidth: "1px !important",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: alpha(p.color, 0.15),
                      },
                    }}
                  >
                    {p.label}
                  </Button>
                ))}
              </ButtonGroup>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                TYPE
              </Typography>
              <CustomTextArea
                name="type"
                select
                value={values.type}
                onChange={(e) => setFieldValue("type", e.target.value)}
                onBlur={handleBlur}
                error={touched.type && Boolean(errors.type)}
                helperText={touched.type ? (errors.type as string) : undefined}
              >
                <MenuItem value="Standard Freight">Standard Freight</MenuItem>
                <MenuItem value="Express">Express</MenuItem>
                <MenuItem value="Hazardous">Hazardous</MenuItem>
              </CustomTextArea>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                SLA DEADLINE
              </Typography>
              <DateTimePicker
                label="SLA Deadline"
                value={values.slaDeadline ? dayjs(values.slaDeadline) : null}
                onChange={(val) =>
                  setFieldValue("slaDeadline", val ? val.toDate() : null)
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    placeholder: "Select Date & Time",
                    error: touched.slaDeadline && Boolean(errors.slaDeadline),
                    helperText: touched.slaDeadline ? (errors.slaDeadline as string) : undefined,
                  },
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default BasicInfoSection;

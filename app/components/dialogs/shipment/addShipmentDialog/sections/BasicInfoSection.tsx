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
import {
  AddShipmentBasicInfo,
  AddShipmentPageActions,
  ShipmentPriority,
} from "@/app/lib/type/add-shipment";
import CustomTextArea from "@/app/components/inputs/customTextArea";

interface BasicInfoSectionProps {
  state: AddShipmentBasicInfo;
  actions: AddShipmentPageActions;
}

const BasicInfoSection = ({ state, actions }: BasicInfoSectionProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

  const priorities: {
    label: string;
    value: ShipmentPriority;
    color: string;
  }[] = [
    { label: "Low", value: "LOW", color: theme.palette.success.main },
    { label: "Medium", value: "MEDIUM", color: theme.palette.warning.main },
    { label: "High", value: "HIGH", color: theme.palette.error.main },
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
                SHIPMENT ID / REF
              </Typography>
              <CustomTextArea
                name="referenceNumber"
                placeholder="e.g. SHP-8752-XP"
                value={state.referenceNumber}
                onChange={(e) =>
                  actions.updateBasicInfo({ referenceNumber: e.target.value })
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
                REFERENCE NUMBER
              </Typography>
              <CustomTextArea
                name="ref2"
                placeholder="PO-9821"
                value={state.referenceNumber}
                onChange={(e) =>
                  actions.updateBasicInfo({ referenceNumber: e.target.value })
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
                    onClick={() =>
                      actions.updateBasicInfo({ priority: p.value })
                    }
                    sx={{
                      py: 1.5,
                      bgcolor:
                        state.priority === p.value
                          ? alpha(p.color, 0.1)
                          : alpha("#1A202C", 0.5),
                      color:
                        state.priority === p.value ? p.color : "text.secondary",
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
                value={state.type}
                onChange={(e) =>
                  actions.updateBasicInfo({ type: e.target.value })
                }
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
              <CustomTextArea
                name="slaDeadline"
                type="date"
                placeholder="mm/dd/yyyy"
                value={
                  state.slaDeadline
                    ? state.slaDeadline.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  actions.updateBasicInfo({
                    slaDeadline: e.target.value
                      ? new Date(e.target.value)
                      : null,
                  })
                }
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default BasicInfoSection;

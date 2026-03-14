"use client";

import {
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  AddWarehouseBasicInfo,
  AddWarehousePageActions,
} from "@/app/lib/type/add-warehouse";
import CustomTextArea from "@/app/components/inputs/customTextArea";

interface BasicInfoSectionProps {
  state: AddWarehouseBasicInfo;
  actions: AddWarehousePageActions;
}

const BasicInfoSection = ({ state, actions }: BasicInfoSectionProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

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
            Facility Identity
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
                WAREHOUSE NAME *
              </Typography>
              <CustomTextArea
                name="name"
                placeholder="e.g. North East Distribution Hub"
                value={state.name}
                onChange={(e) =>
                  actions.updateBasicInfo({ name: e.target.value })
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
                WAREHOUSE CODE
              </Typography>
              <CustomTextArea
                name="code"
                placeholder="e.g. WH-001 (Leave blank to auto-generate)"
                value={state.code}
                onChange={(e) =>
                  actions.updateBasicInfo({ code: e.target.value })
                }
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                WAREHOUSE TYPE
              </Typography>
              <CustomTextArea
                name="type"
                select
                value={state.type}
                onChange={(e) =>
                  actions.updateBasicInfo({ type: e.target.value as any })
                }
              >
                <MenuItem value="WAREHOUSE">Standard Warehouse</MenuItem>
                <MenuItem value="DISTRIBUTION_CENTER">
                  Distribution Center
                </MenuItem>
                <MenuItem value="CROSSDOCK">Cross-Docking Facility</MenuItem>
              </CustomTextArea>
            </Stack>
          </Grid>
        </Grid>

        <Stack spacing={2.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: theme.palette.primary.main,
                }}
              />
              <Typography variant="subtitle1" fontWeight={700} color="white">
                Operating Hours
              </Typography>
            </Stack>
            <FormControlLabel
              control={
                <Switch
                  defaultChecked
                  onClick={() =>
                    actions.updateBasicInfo({ is247: !state.is247 })
                  }
                  size="small"
                />
              }
              label={
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                >
                  24/7 OPERATION
                </Typography>
              }
              sx={{ color: "text.secondary" }}
            />
          </Stack>

          {state.is247 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={1}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    OPENING TIME
                  </Typography>
                  <CustomTextArea
                    name="openingTime"
                    type="time"
                    value={state.openingTime || ""}
                    onChange={(e) =>
                      actions.updateBasicInfo({ openingTime: e.target.value })
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
                    CLOSING TIME
                  </Typography>
                  <CustomTextArea
                    name="closingTime"
                    type="time"
                    value={state.closingTime || ""}
                    onChange={(e) =>
                      actions.updateBasicInfo({ closingTime: e.target.value })
                    }
                  />
                </Stack>
              </Grid>
            </Grid>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default BasicInfoSection;

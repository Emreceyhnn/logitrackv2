"use client";

import { Box, Grid, Stack, Typography, MenuItem } from "@mui/material";
import { useFormikContext } from "formik";
import { ShipmentFormValues } from "@/app/lib/type/shipment";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

const CargoSection = () => {
  /* -------------------------------- variables ------------------------------- */
  const dict = useDictionary();

  const { values, setFieldValue, handleBlur, touched, errors } =
    useFormikContext<ShipmentFormValues>();

  return (
    <Box>
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "theme.palette.primary.main",
            }}
          />
          <Typography variant="subtitle2" fontWeight={700} color="white">
            {dict.shipments.dialogs.sections.cargoDetails}
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                {dict.shipments.dialogs.fields.weight}
              </Typography>
              <CustomTextArea
                name="weightKg"
                type="number"
                placeholder="0.00"
                value={values.weightKg.toString()}
                onBlur={handleBlur}
                error={touched.weightKg && Boolean(errors.weightKg)}
                helperText={
                  touched.weightKg ? (errors.weightKg as string) : undefined
                }
                onChange={(e) =>
                  setFieldValue("weightKg", parseFloat(e.target.value) || 0)
                }
              >
                <MonitorWeightIcon
                  sx={{ fontSize: 18, color: "text.secondary" }}
                />
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
                {dict.shipments.dialogs.fields.volume}
              </Typography>
              <CustomTextArea
                name="volumeM3"
                type="number"
                placeholder="0.00"
                value={values.volumeM3.toString()}
                onBlur={handleBlur}
                error={touched.volumeM3 && Boolean(errors.volumeM3)}
                helperText={
                  touched.volumeM3 ? (errors.volumeM3 as string) : undefined
                }
                onChange={(e) =>
                  setFieldValue("volumeM3", parseFloat(e.target.value) || 0)
                }
              >
                <ViewInArIcon sx={{ fontSize: 18, color: "text.secondary" }} />
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
                {dict.shipments.dialogs.fields.palletCount}
              </Typography>
              <CustomTextArea
                name="palletCount"
                type="number"
                placeholder="Qty"
                value={values.palletCount.toString()}
                onBlur={handleBlur}
                error={touched.palletCount && Boolean(errors.palletCount)}
                helperText={
                  touched.palletCount
                    ? (errors.palletCount as string)
                    : undefined
                }
                onChange={(e) =>
                  setFieldValue("palletCount", parseInt(e.target.value) || 0)
                }
              >
                <InventoryIcon sx={{ fontSize: 18, color: "text.secondary" }} />
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
                {dict.shipments.dialogs.fields.cargoType}
              </Typography>
              <CustomTextArea
                name="cargoType"
                select
                value={values.cargoType}
                onBlur={handleBlur}
                error={touched.cargoType && Boolean(errors.cargoType)}
                helperText={
                  touched.cargoType ? (errors.cargoType as string) : undefined
                }
                onChange={(e) => setFieldValue("cargoType", e.target.value)}
              >
                <MenuItem value="General Cargo">General Cargo</MenuItem>
                <MenuItem value="Perishable">Perishable</MenuItem>
                <MenuItem value="Fragile">Fragile</MenuItem>
                <MenuItem value="Liquid">Liquid</MenuItem>
              </CustomTextArea>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default CargoSection;

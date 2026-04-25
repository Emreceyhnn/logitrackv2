import { Box, Grid, Stack, Typography, MenuItem } from "@mui/material";
import { useFormikContext } from "formik";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import { RouteFormValues } from "@/app/lib/type/routes";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import RouteIcon from "@mui/icons-material/Route";
import BoltIcon from "@mui/icons-material/Bolt";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ShipmentWithRelations } from "@/app/lib/type/shipment";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { useUser } from "@/app/hooks/useUser";
import { utcToUserTz } from "@/app/lib/utils/date";

interface FirstRouteDialogStepProps {
  shipments?: ShipmentWithRelations[];
  onShipmentSelect?: (id: string) => void;
}

const FirstRouteDialogStep = ({
  shipments = [],
  onShipmentSelect,
}: FirstRouteDialogStepProps) => {
  const dict = useDictionary();
  const { user } = useUser();
  const userTz = user?.timezone || "UTC";

  const { values, setFieldValue, handleBlur, touched, errors } =
    useFormikContext<RouteFormValues>();

  /**
   * Convert a Date (that represents a wall-clock time in userTz) to a dayjs
   * object so the picker shows the correct local time.
   * Because MobileDateTimePicker does not natively handle timezone offsets,
   * we manually shift the Date by the timezone offset to make it render
   * correctly in UTC mode.
   */
  const toPickerValue = (date: Date | null): dayjs.Dayjs | null => {
    if (!date) return null;
    // Convert UTC → user timezone, then represent as a "naive" dayjs
    // so the picker shows the user's local time correctly
    return utcToUserTz(date, userTz);
  };

  /**
   * When the picker changes, the returned dayjs is a "naive" local time
   * displayed in the user's timezone. Store it as a JS Date keeping
   * the wall-clock time (toUTC is applied on submit).
   */
  const fromPickerValue = (val: dayjs.Dayjs | null): Date | null => {
    if (!val) return null;
    // Store as a Date that represents the wall-clock time picked
    return val.toDate();
  };

  return (
    <Box>
      <Stack spacing={4}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: (theme) => theme.palette.primary._alpha.main_10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RouteIcon color="primary" />
          </Box>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={700} color="white">
              {dict.routes.dialogs.basicDetails}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {dict.routes.dialogs.basicDetailsDesc}
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={3}>
          {shipments.length > 0 && onShipmentSelect && (
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BoltIcon
                  sx={{
                    color: (theme) => theme.palette.warning.main,
                    fontSize: 18,
                  }}
                />
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="warning.main"
                >
                  {dict.routes.dialogs.quickStart}
                </Typography>
              </Stack>
              <CustomTextArea
                name="shipmentSelect"
                select
                placeholder={dict.routes.dialogs.chooseShipment}
                value=""
                onChange={(e) => onShipmentSelect(e.target.value)}
              >
                <MenuItem value="" disabled>
                  {dict.routes.dialogs.selectUnassigned}
                </MenuItem>
                {shipments.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.trackingId} - {s.customer?.name} ({s.destination})
                  </MenuItem>
                ))}
              </CustomTextArea>
              <Typography variant="caption" color="text.secondary">
                {dict.routes.dialogs.prefillNote}
              </Typography>
            </Stack>
          )}

          <Stack spacing={1.5}>
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              {dict.routes.dialogs.routeName}
            </Typography>
            <CustomTextArea
              name="name"
              placeholder={dict.routes.dialogs.routeNamePlaceholder}
              value={values.name}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name ? (errors.name as string) : undefined}
              onChange={(e) => setFieldValue("name", e.target.value)}
            />
          </Stack>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1.5}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {dict.routes.dialogs.expectedStart}
                  {userTz !== "UTC" && (
                    <Typography
                      component="span"
                      variant="caption"
                      color="primary.main"
                      sx={{ ml: 1 }}
                    >
                      ({userTz})
                    </Typography>
                  )}
                </Typography>
                <MobileDateTimePicker
                  value={toPickerValue(values.startTime)}
                  onChange={(val) =>
                    setFieldValue("startTime", fromPickerValue(val))
                  }
                  timezone={userTz}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      placeholder: dict.routes.dialogs.selectDateTime,
                      error: touched.startTime && Boolean(errors.startTime),
                      helperText: touched.startTime
                        ? (errors.startTime as string)
                        : undefined,
                    },
                  }}
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={1.5}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {dict.routes.dialogs.expectedEnd}
                  {userTz !== "UTC" && (
                    <Typography
                      component="span"
                      variant="caption"
                      color="primary.main"
                      sx={{ ml: 1 }}
                    >
                      ({userTz})
                    </Typography>
                  )}
                </Typography>
                <MobileDateTimePicker
                  value={toPickerValue(values.endTime)}
                  onChange={(val) =>
                    setFieldValue("endTime", fromPickerValue(val))
                  }
                  timezone={userTz}
                  minDateTime={
                    values.startTime
                      ? toPickerValue(values.startTime) || dayjs()
                      : dayjs()
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      placeholder: dict.routes.dialogs.selectDateTime,
                      error: touched.endTime && Boolean(errors.endTime),
                      helperText: touched.endTime
                        ? (errors.endTime as string)
                        : undefined,
                    },
                  }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Stack>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: (theme) => theme.palette.primary._alpha.main_05,
            border: (theme) =>
              `1px solid ${theme.palette.primary._alpha.main_10}`,
            display: "flex",
            gap: 2,
          }}
        >
          <InfoOutlinedIcon
            fontSize="small"
            sx={{ color: (theme) => theme.palette.primary.main, mt: 0.3 }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ lineHeight: 1.5 }}
          >
            {dict.routes.dialogs.timingGuidance}
            {userTz !== "UTC" && (
              <>
                {" "}
                <Typography
                  component="span"
                  variant="caption"
                  color="primary.main"
                  fontWeight={600}
                >
                  {userTz}
                </Typography>
              </>
            )}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default FirstRouteDialogStep;

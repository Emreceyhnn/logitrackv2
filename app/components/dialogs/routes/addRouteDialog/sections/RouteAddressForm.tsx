import { Box, Stack, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AddressAutocomplete } from "@/app/components/googleMaps/AddressAutocomplete";
import { Dictionary } from "@/app/lib/language/language";
import { FormikErrors, FormikTouched } from "formik";
import { RouteFormValues } from "@/app/lib/type/routes";

interface RouteAddressFormProps {
  values: RouteFormValues;
  setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void;
  touched: FormikTouched<RouteFormValues>;
  errors: FormikErrors<RouteFormValues>;
  dict: Dictionary;
}

interface AddressSelectPayload {
  lat: number;
  lng: number;
  formattedAddress: string;
}

export default function RouteAddressForm({ values, setFieldValue, touched, errors, dict }: RouteAddressFormProps) {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="body2" component="div" fontWeight={600} color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main" }} />
          {dict.routes.dialogs.startAddress}
        </Typography>
        <AddressAutocomplete
          value={values.stops?.[0]?.address}
          onAddressSelect={({ lat, lng, formattedAddress }: AddressSelectPayload) => {
            setFieldValue("startAddress", formattedAddress); setFieldValue("startLat", lat); setFieldValue("startLng", lng);
            const newStops = [...(values.stops || [])];
            if (newStops.length > 0) newStops[0] = { address: formattedAddress, lat, lng }; else newStops.push({ address: formattedAddress, lat, lng });
            setFieldValue("stops", newStops);
          }}
          error={touched.startAddress && Boolean(errors.startAddress)} helperText={touched.startAddress ? (errors.startAddress as string) : undefined}
        />
      </Stack>

      <Stack spacing={2}>
        {values.stops && values.stops.length > 2 && values.stops.slice(1, values.stops.length - 1).map((stop: { address?: string }, index: number) => {
          const actualIndex = index + 1;
          return (
            <Stack spacing={1} key={actualIndex}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" component="div" fontWeight={600} color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "warning.main" }} /> Stop {actualIndex}
                </Typography>
                <IconButton size="small" color="error" onClick={() => { const newStops = [...(values.stops || [])]; newStops.splice(actualIndex, 1); setFieldValue("stops", newStops); }}><CloseIcon fontSize="small" /></IconButton>
              </Stack>
              <AddressAutocomplete
                value={stop.address}
                onAddressSelect={({ lat, lng, formattedAddress }: AddressSelectPayload) => { setFieldValue(`stops[${actualIndex}]`, { address: formattedAddress, lat, lng }); }}
              />
            </Stack>
          );
        })}
        <Button
          variant="outlined" size="small" color="inherit"
          onClick={() => {
            const newStops = [...(values.stops || [])];
            if (newStops.length >= 2) newStops.splice(newStops.length - 1, 0, { address: "", lat: 0, lng: 0 });
            else { while (newStops.length < 2) { newStops.push({ address: "", lat: 0, lng: 0 }); } newStops.splice(1, 0, { address: "", lat: 0, lng: 0 }); }
            setFieldValue("stops", newStops);
          }}
          sx={{ alignSelf: "flex-start", mt: values.stops?.length ? 0 : 1 }}
        >
          + Add Stop
        </Button>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="body2" component="div" fontWeight={600} color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "error.main" }} />
          {dict.routes.dialogs.endAddress}
        </Typography>
        <AddressAutocomplete
          value={values.endAddress}
          onAddressSelect={({ lat, lng, formattedAddress }: AddressSelectPayload) => {
            setFieldValue("endAddress", formattedAddress); setFieldValue("endLat", lat); setFieldValue("endLng", lng);
            const newStops = [...(values.stops || [])];
            if (newStops.length > 1) newStops[newStops.length - 1] = { address: formattedAddress, lat, lng }; else if (newStops.length === 1) newStops.push({ address: formattedAddress, lat, lng }); else { newStops.push({ address: "", lat: 0, lng: 0 }); newStops.push({ address: formattedAddress, lat, lng }); }
            setFieldValue("stops", newStops);
          }}
          error={touched.endAddress && Boolean(errors.endAddress)} helperText={touched.endAddress ? (errors.endAddress as string) : undefined}
        />
      </Stack>
    </Stack>
  );
}

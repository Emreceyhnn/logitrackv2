import { Box, Grid, Stack, Typography, MenuItem } from "@mui/material";
import { useFormikContext } from "formik";
import { ShipmentFormValues } from "@/app/lib/type/shipment";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { AddressAutocomplete } from "@/app/components/googleMaps/AddressAutocomplete";
import { WarehouseWithRelations } from "@/app/lib/type/warehouse";
import { CustomerWithRelations } from "@/app/lib/type/customer";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface LogisticsSectionProps {
  warehouses: WarehouseWithRelations[];
  customers: CustomerWithRelations[];
}

const LogisticsSection = ({ warehouses, customers }: LogisticsSectionProps) => {
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
            {dict.shipments.dialogs.sections.logisticsParties}
          </Typography>
        </Stack>

        {/* Selected Origin Preview Card */}
        {values.originWarehouseId &&
          warehouses.find((w) => w.id === values.originWarehouseId) && (
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                }}
              >
                <WarehouseIcon />
              </Box>
              <Stack spacing={0.25}>
                <Typography
                  variant="caption"
                  color="primary.light"
                  fontWeight={700}
                  sx={{ letterSpacing: 0.5, textTransform: "uppercase" }}
                >
                  {dict.shipments.dialogs.fields.originWarehouse.toUpperCase()}
                </Typography>
                <Typography variant="body1" fontWeight={700} color="white">
                  {
                    warehouses.find((w) => w.id === values.originWarehouseId)
                      ?.name
                  }
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {
                    warehouses.find((w) => w.id === values.originWarehouseId)
                      ?.city
                  }
                  ,{" "}
                  {
                    warehouses.find((w) => w.id === values.originWarehouseId)
                      ?.address
                  }
                </Typography>
              </Stack>
            </Box>
          )}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                {dict.shipments.dialogs.fields.originWarehouse}
              </Typography>
              <CustomTextArea
                name="originWarehouseId"
                select
                placeholder={dict.shipments.dialogs.fields.originPlaceholder}
                value={values.originWarehouseId}
                onBlur={handleBlur}
                error={
                  touched.originWarehouseId && Boolean(errors.originWarehouseId)
                }
                helperText={
                  touched.originWarehouseId
                    ? (errors.originWarehouseId as string)
                    : undefined
                }
                onChange={(e) => {
                  const warehouseId = e.target.value;
                  const selectedWarehouse = warehouses.find(
                    (w) => w.id === warehouseId
                  );
                  if (selectedWarehouse) {
                    setFieldValue("originWarehouseId", warehouseId);
                    setFieldValue(
                      "originLat",
                      selectedWarehouse.lat ?? undefined
                    );
                    setFieldValue(
                      "originLng",
                      selectedWarehouse.lng ?? undefined
                    );
                  } else {
                    setFieldValue("originWarehouseId", warehouseId);
                  }
                }}
              >
                {warehouses.map((w) => (
                  <MenuItem key={w.id} value={w.id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <WarehouseIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2">{w.name}</Typography>
                    </Stack>
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
                {dict.shipments.dialogs.fields.destination}
              </Typography>
              <AddressAutocomplete
                placeholder={
                  dict.shipments.dialogs.fields.destinationPlaceholder
                }
                name="destination"
                value={values.destination}
                onBlur={handleBlur}
                error={touched.destination && Boolean(errors.destination)}
                helperText={
                  touched.destination
                    ? (errors.destination as string)
                    : undefined
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue("destination", e.target.value)
                }
                onAddressSelect={(data: {
                  formattedAddress: string;
                  lat: number;
                  lng: number;
                }) => {
                  setFieldValue("destination", data.formattedAddress);
                  setFieldValue("destinationLat", data.lat);
                  setFieldValue("destinationLng", data.lng);
                }}
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
                {dict.shipments.dialogs.fields.customerClient}
              </Typography>
              <CustomTextArea
                name="customerId"
                select
                placeholder={dict.shipments.dialogs.fields.customerPlaceholder}
                value={values.customerId}
                onBlur={handleBlur}
                error={touched.customerId && Boolean(errors.customerId)}
                helperText={
                  touched.customerId ? (errors.customerId as string) : undefined
                }
                onChange={(e) => {
                  const customerId = e.target.value;
                  if (!customerId) {
                    setFieldValue("customerId", "");
                    setFieldValue("customerLocationId", "");
                    setFieldValue("contactEmail", "");
                    return;
                  }

                  const selectedCustomer = customers.find(
                    (c) => c.id === customerId
                  );
                  const defaultLoc =
                    selectedCustomer?.locations?.find((l) => l.isDefault) ||
                    selectedCustomer?.locations?.[0];

                  setFieldValue("customerId", customerId);
                  setFieldValue("customerLocationId", defaultLoc?.id || "");
                  setFieldValue(
                    "destination",
                    defaultLoc?.address || values.destination
                  );
                  setFieldValue(
                    "destinationLat",
                    defaultLoc?.lat ?? values.destinationLat
                  );
                  setFieldValue(
                    "destinationLng",
                    defaultLoc?.lng ?? values.destinationLng
                  );
                  setFieldValue(
                    "contactEmail",
                    selectedCustomer?.email || values.contactEmail
                  );
                }}
              >
                <MenuItem value="">
                  <Typography variant="body2" color="text.secondary">
                    None / Manual Entry
                  </Typography>
                </MenuItem>
                {customers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2">{c.name}</Typography>
                    </Stack>
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
                {dict.shipments.dialogs.fields.deliveryLocation ||
                  "DELIVERY LOCATION"}
              </Typography>
              <CustomTextArea
                name="customerLocationId"
                select
                placeholder={
                  dict.shipments.dialogs.fields.locationPlaceholder ||
                  "Select depot"
                }
                disabled={!values.customerId}
                value={values.customerLocationId}
                onBlur={handleBlur}
                error={
                  touched.customerLocationId &&
                  Boolean(errors.customerLocationId)
                }
                helperText={
                  touched.customerLocationId
                    ? (errors.customerLocationId as string)
                    : undefined
                }
                onChange={(e) => {
                  const locationId = e.target.value;
                  const selectedCustomer = customers.find(
                    (c) => c.id === values.customerId
                  );
                  const selectedLoc = selectedCustomer?.locations?.find(
                    (l) => l.id === locationId
                  );

                  if (selectedLoc) {
                    setFieldValue("customerLocationId", locationId);
                    setFieldValue("destination", selectedLoc.address);
                    setFieldValue(
                      "destinationLat",
                      selectedLoc.lat ?? undefined
                    );
                    setFieldValue(
                      "destinationLng",
                      selectedLoc.lng ?? undefined
                    );
                  } else {
                    setFieldValue("customerLocationId", locationId);
                  }
                }}
              >
                {values.customerId ? (
                  customers
                    .find((c) => c.id === values.customerId)
                    ?.locations?.map((l) => (
                      <MenuItem key={l.id} value={l.id}>
                        <Typography variant="body2">
                          {l.name} {l.isDefault ? "(Default)" : ""}
                        </Typography>
                      </MenuItem>
                    ))
                ) : (
                  <MenuItem value="" disabled>
                    {dict.shipments.dialogs.fields.selectCustomerFirst ||
                      "Select a customer first"}
                  </MenuItem>
                )}
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
                {dict.shipments.dialogs.fields.contactEmail}
              </Typography>
              <CustomTextArea
                name="contactEmail"
                placeholder="client@example.com"
                value={values.contactEmail}
                onBlur={handleBlur}
                error={touched.contactEmail && Boolean(errors.contactEmail)}
                helperText={
                  touched.contactEmail
                    ? (errors.contactEmail as string)
                    : undefined
                }
                onChange={(e) => setFieldValue("contactEmail", e.target.value)}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                {dict.shipments.dialogs.fields.billingAccount}
              </Typography>
              <CustomTextArea
                name="billingAccount"
                select
                value={values.billingAccount}
                onBlur={handleBlur}
                error={touched.billingAccount && Boolean(errors.billingAccount)}
                helperText={
                  touched.billingAccount
                    ? (errors.billingAccount as string)
                    : undefined
                }
                onChange={(e) =>
                  setFieldValue("billingAccount", e.target.value)
                }
              >
                <MenuItem value="Standard Billing (Net 30)">
                  Standard Billing (Net 30)
                </MenuItem>
                <MenuItem value="Prepaid">Prepaid</MenuItem>
                <MenuItem value="Collect">Collect</MenuItem>
              </CustomTextArea>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default LogisticsSection;

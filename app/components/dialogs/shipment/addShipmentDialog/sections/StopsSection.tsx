import {
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  Grid,
  MenuItem,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { FieldArray, useFormikContext } from "formik";
import { ShipmentFormValues, ShipmentStopWithRelations } from "@/app/lib/type/shipment";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { AddressAutocomplete } from "@/app/components/googleMaps/AddressAutocomplete";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Reorder, useDragControls, AnimatePresence } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { CustomerWithRelations } from "@/app/lib/type/customer";
import { AddressData } from "@/app/components/googleMaps/AddressAutocomplete";

interface StopsSectionProps {
  customers: CustomerWithRelations[];
}

const StopItem = ({
  stop,
  index,
  remove,
  customers,
  isLast,
  syncTopLevelFields,
}: {
  stop: ShipmentStopWithRelations;
  index: number;
  remove: (index: number) => void;
  customers: CustomerWithRelations[];
  isLast: boolean;
  syncTopLevelFields: (stops: ShipmentStopWithRelations[]) => void;
}) => {
  const dict = useDictionary();
  const controls = useDragControls();
  const { values, setFieldValue } = useFormikContext<ShipmentFormValues>();

  const selectedCustomer = customers.find((c) => c.id === stop.customerId);

  return (
    <Reorder.Item
      value={stop}
      id={stop.id || `stop-${index}`}
      dragListener={false}
      dragControls={controls}
      style={{ listStyle: "none", marginBottom: "12px" }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.02)"
              : "rgba(0, 0, 0, 0.01)",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          position: "relative",
          "&:hover": {
            border: (theme) => `1px solid ${theme.palette.primary.main}`,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.04)"
                : "rgba(0, 0, 0, 0.02)",
          },
          transition: "all 0.2s ease",
        }}
      >
        <Grid container spacing={2} alignItems="flex-start">
          <Grid size={{ xs: 0.5 }} sx={{ display: "flex", alignItems: "center", pt: 1 }}>
            <Box
              onPointerDown={(e) => controls.start(e)}
              sx={{
                cursor: "grab",
                "&:active": { cursor: "grabbing" },
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
              }}
            >
              <DragIndicatorIcon fontSize="small" />
            </Box>
          </Grid>

          <Grid size={{ xs: 11.5 }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {dict.shipments.dialogs.sections.stop || "Stop"} {index + 1}
                  </Typography>
                </Stack>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => remove(index)}
                  sx={{
                    bgcolor: (theme) => theme.palette.error._alpha.main_10,
                    "&:hover": { bgcolor: (theme) => theme.palette.error._alpha.main_20 },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {dict.shipments.dialogs.fields.customerClient}
                    </Typography>
                    <CustomTextArea
                      name={`stops[${index}].customerId`}
                      select
                      value={stop.customerId || ""}
                      onChange={(e) => {
                        const customerId = e.target.value;
                        const customer = customers.find((c) => c.id === customerId);
                        const defaultLoc = customer?.locations?.find((l) => l.isDefault) || customer?.locations?.[0];

                        setFieldValue(`stops[${index}].customerId`, customerId);
                        setFieldValue(`stops[${index}].customerLocationId`, defaultLoc?.id || "");
                        setFieldValue(`stops[${index}].address`, defaultLoc?.address || "");
                        setFieldValue(`stops[${index}].lat`, defaultLoc?.lat || null);
                        setFieldValue(`stops[${index}].lng`, defaultLoc?.lng || null);

                        if (isLast) {
                          const updatedStops = [...values.stops];
                          updatedStops[index] = {
                            ...updatedStops[index],
                            customerId,
                            customerLocationId: defaultLoc?.id || "",
                            address: defaultLoc?.address || "",
                            lat: defaultLoc?.lat || null,
                            lng: defaultLoc?.lng || null,
                          };
                          syncTopLevelFields(updatedStops);
                        }
                      }}
                    >
                      <MenuItem value="">
                        <Typography variant="body2" color="text.secondary">Manual Entry</Typography>
                      </MenuItem>
                      {customers.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2">{c.name}</Typography>
                          </Stack>
                        </MenuItem>
                      ))}
                    </CustomTextArea>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {dict.shipments.dialogs.fields.deliveryLocation || "LOCATION"}
                    </Typography>
                    <CustomTextArea
                      name={`stops[${index}].customerLocationId`}
                      select
                      disabled={!stop.customerId}
                      value={stop.customerLocationId || ""}
                      onChange={(e) => {
                        const locId = e.target.value;
                        const loc = selectedCustomer?.locations?.find((l) => l.id === locId);
                        if (loc) {
                          setFieldValue(`stops[${index}].customerLocationId`, locId);
                          setFieldValue(`stops[${index}].address`, loc.address);
                          setFieldValue(`stops[${index}].lat`, loc.lat || null);
                          setFieldValue(`stops[${index}].lng`, loc.lng || null);

                          if (isLast) {
                            const updatedStops = [...values.stops];
                            updatedStops[index] = {
                              ...updatedStops[index],
                              customerLocationId: locId,
                              address: loc.address,
                              lat: loc.lat || null,
                              lng: loc.lng || null,
                            };
                            syncTopLevelFields(updatedStops);
                          }
                        }
                      }}
                    >
                      {selectedCustomer?.locations?.map((l) => (
                        <MenuItem key={l.id} value={l.id}>
                          <Typography variant="body2">{l.name}</Typography>
                        </MenuItem>
                      ))}
                    </CustomTextArea>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {dict.shipments.dialogs.fields.destination}
                    </Typography>
                    <AddressAutocomplete
                      placeholder={dict.shipments.dialogs.fields.destinationPlaceholder}
                      name={`stops[${index}].address`}
                      value={stop.address}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue(`stops[${index}].address`, e.target.value)}
                      onAddressSelect={(data: AddressData) => {
                        setFieldValue(`stops[${index}].address`, data.formattedAddress);
                        setFieldValue(`stops[${index}].lat`, data.lat);
                        setFieldValue(`stops[${index}].lng`, data.lng);

                        if (isLast) {
                          const updatedStops = [...values.stops];
                          updatedStops[index] = {
                            ...updatedStops[index],
                            address: data.formattedAddress,
                            lat: data.lat,
                            lng: data.lng,
                          };
                          syncTopLevelFields(updatedStops);
                        }
                      }}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Reorder.Item>
  );
};

const StopsSection = ({ customers }: StopsSectionProps) => {
  const theme = useTheme();
  const dict = useDictionary();
  const { values, setFieldValue } = useFormikContext<ShipmentFormValues>();

  const [entryData, setEntryData] = useState({
    customerId: "",
    customerLocationId: "",
    address: "",
    lat: null as number | null,
    lng: null as number | null,
  });

  // Imperative sync function to ensure top-level fields match the last stop immediately
  const syncTopLevelFields = (currentStops: ShipmentStopWithRelations[]) => {
    if (currentStops.length > 0) {
      const lastStop = currentStops[currentStops.length - 1];
      
      // Atomic updates via setValues or sequential setFieldValue
      // We use setFieldValue here for consistency with the rest of the form
      setFieldValue("destination", lastStop.address);
      setFieldValue("destinationLat", lastStop.lat ?? undefined);
      setFieldValue("destinationLng", lastStop.lng ?? undefined);
      setFieldValue("customerId", lastStop.customerId || "");
      setFieldValue("customerLocationId", lastStop.customerLocationId || "");
    } else {
      setFieldValue("destination", "");
      setFieldValue("destinationLat", undefined);
      setFieldValue("destinationLng", undefined);
      setFieldValue("customerId", "");
      setFieldValue("customerLocationId", "");
    }
  };

  const handleReorder = (newStops: ShipmentStopWithRelations[]) => {
    const updatedStops = newStops.map((stop, idx) => ({ ...stop, sequence: idx }));
    setFieldValue("stops", updatedStops);
    syncTopLevelFields(updatedStops);
  };

  const addStop = (data: typeof entryData) => {
    if (!data.address) return;
    
    const newStop: ShipmentStopWithRelations = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerId: data.customerId || null,
      customerLocationId: data.customerLocationId || null,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
      sequence: values.stops.length,
    };

    const updatedStops = [...values.stops, newStop];
    setFieldValue("stops", updatedStops);
    syncTopLevelFields(updatedStops);

    // Clear entry fields
    setEntryData({
      customerId: "",
      customerLocationId: "",
      address: "",
      lat: null,
      lng: null,
    });
  };

  return (
    <Box>
      <FieldArray name="stops">
        {(fieldArrayProps) => {
          const { remove: formikRemove } = fieldArrayProps;
          
          const handleRemove = (index: number) => {
            const newList = values.stops.filter((_, i) => i !== index);
            formikRemove(index);
            syncTopLevelFields(newList);
          };

          return (
            <Stack spacing={3}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 4,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(0, 0, 0, 0.02)",
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AddIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={700}>
                    {dict.shipments.dialogs.sections.addStop || "Quick Add Stop"}
                  </Typography>
                </Stack>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        {dict.shipments.dialogs.fields.customerClient}
                      </Typography>
                      <CustomTextArea
                        name="tempCustomerId"
                        select
                        value={entryData.customerId}
                        onChange={(e) => {
                          const customerId = e.target.value;
                          const customer = customers.find((c) => c.id === customerId);
                          const defaultLoc = customer?.locations?.find((l) => l.isDefault) || customer?.locations?.[0];
                          
                          setEntryData({
                            ...entryData,
                            customerId,
                            customerLocationId: defaultLoc?.id || "",
                            address: defaultLoc?.address || "",
                            lat: defaultLoc?.lat || null,
                            lng: defaultLoc?.lng || null,
                          });
                        }}
                      >
                        <MenuItem value="">
                          <Typography variant="body2" color="text.secondary">Manual Entry</Typography>
                        </MenuItem>
                        {customers.map((c) => (
                          <MenuItem key={c.id} value={c.id}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                              <Typography variant="body2">{c.name}</Typography>
                            </Stack>
                          </MenuItem>
                        ))}
                      </CustomTextArea>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        {dict.shipments.dialogs.fields.deliveryLocation || "LOCATION"}
                      </Typography>
                      <CustomTextArea
                        name="tempLocationId"
                        select
                        disabled={!entryData.customerId}
                        value={entryData.customerLocationId}
                        onChange={(e) => {
                          const locId = e.target.value;
                          const customer = customers.find((c) => c.id === entryData.customerId);
                          const loc = customer?.locations?.find((l) => l.id === locId);
                          if (loc) {
                            setEntryData({
                              ...entryData,
                              customerLocationId: locId,
                              address: loc.address,
                              lat: loc.lat || null,
                              lng: loc.lng || null,
                            });
                          }
                        }}
                      >
                        {customers.find(c => c.id === entryData.customerId)?.locations?.map((l) => (
                          <MenuItem key={l.id} value={l.id}>
                            <Typography variant="body2">{l.name}</Typography>
                          </MenuItem>
                        ))}
                      </CustomTextArea>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        {dict.shipments.dialogs.fields.destination}
                      </Typography>
                      <AddressAutocomplete
                        placeholder={dict.shipments.dialogs.fields.destinationPlaceholder}
                        name="tempAddress"
                        value={entryData.address}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEntryData({ ...entryData, address: e.target.value })}
                        onAddressSelect={(data: AddressData) => {
                          const updated = {
                            ...entryData,
                            address: data.formattedAddress,
                            lat: data.lat,
                            lng: data.lng,
                          };
                          addStop(updated);
                        }}
                      />
                    </Stack>
                  </Grid>
                </Grid>

                  <Button
                    variant="contained"
                    fullWidth
                    disabled={!entryData.address}
                    onClick={() => addStop(entryData)}
                    startIcon={<AddIcon />}
                    sx={{
                      borderRadius: 2,
                      py: 1.25,
                      textTransform: "none",
                      fontWeight: 800,
                      boxShadow: "none",
                      background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      "&:hover": { 
                        boxShadow: (theme) => `0 8px 20px ${theme.palette.primary._alpha.main_30}`,
                        transform: "translateY(-1px)"
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {dict.common.add || "Add to Route"}
                  </Button>
              </Stack>
            </Box>

            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={700}>
                  {dict.shipments.dialogs.sections.shipmentStops || "Planned Route"} ({values.stops.length})
                </Typography>
              </Stack>

            {values.stops.length === 0 ? (
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                  border: `2px dashed ${theme.palette.divider}`,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.01)"
                      : "rgba(0, 0, 0, 0.005)",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {dict.shipments.dialogs.sections.noStopsDefined || "No stops defined. Click + to add stops."}
                </Typography>
              </Box>
            ) : (
              <Reorder.Group
                axis="y"
                values={values.stops}
                onReorder={handleReorder}
                style={{ padding: 0 }}
              >
                <AnimatePresence>
                  {values.stops.map((stop, index) => (
                    <StopItem
                      key={stop.id || `stop-${index}`}
                      stop={stop}
                      index={index}
                      remove={handleRemove}
                      customers={customers}
                      isLast={index === values.stops.length - 1}
                      syncTopLevelFields={syncTopLevelFields}
                    />
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            )}
            </Stack>
          </Stack>
        );
      }}
      </FieldArray>
    </Box>
  );
};

export default StopsSection;

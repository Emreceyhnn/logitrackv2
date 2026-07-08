import {
  Box,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { FieldArray, useFormikContext } from "formik";
import {
  ShipmentFormValues,
  ShipmentStopWithRelations,
} from "@/app/lib/type/shipment";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { Reorder, AnimatePresence } from "framer-motion";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { CustomerWithRelations } from "@/app/lib/type/customer";
import { StopItem } from "./StopItem";
import { StopEntryForm, StopEntryData } from "./StopEntryForm";

interface StopsSectionProps {
  customers: CustomerWithRelations[];
}

const StopsSection = ({ customers }: StopsSectionProps) => {
  const theme = useTheme();
  const dict = useDictionary();
  const { values, setFieldValue } = useFormikContext<ShipmentFormValues>();

  const [entryData, setEntryData] = useState<StopEntryData>({
    customerId: "",
    customerLocationId: "",
    address: "",
    contactEmail: "",
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
    const updatedStops = newStops.map((stop, idx) => ({
      ...stop,
      sequence: idx,
    }));
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
      contactEmail: data.contactEmail,
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
      contactEmail: "",
      lat: null,
      lng: null,
    });
  };

  return (
    <Box
      sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
    >
      <FieldArray name="stops">
        {(fieldArrayProps) => {
          const { remove: formikRemove } = fieldArrayProps;

          const handleRemove = (index: number) => {
            const newList = values.stops.filter((_, i) => i !== index);
            formikRemove(index);
            syncTopLevelFields(newList);
          };

          return (
            <Stack
              spacing={3}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              <StopEntryForm
                entryData={entryData}
                setEntryData={setEntryData}
                customers={customers}
                addStop={addStop}
              />

              <Stack
                spacing={2}
                sx={{
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ flexShrink: 0 }}
                >
                  <LocationOnIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={700}>
                    {dict.shipments.dialogs.sections.shipmentStops ||
                      "Planned Route"}{" "}
                    ({values.stops.length})
                  </Typography>
                </Stack>

                <Box sx={{ flex: 1, pr: 1, minHeight: 0 }}>
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
                        {dict.shipments.dialogs.sections.noStopsDefined ||
                          "No stops defined. Click + to add stops."}
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
                </Box>
              </Stack>
            </Stack>
          );
        }}
      </FieldArray>
    </Box>
  );
};

export default StopsSection;

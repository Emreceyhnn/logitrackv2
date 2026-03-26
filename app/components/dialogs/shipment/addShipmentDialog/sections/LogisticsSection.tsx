"use client";

import {
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
  MenuItem,
} from "@mui/material";
import { AddShipmentLogistics } from "@/app/lib/type/add-shipment";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import { AddressAutocomplete } from "@/app/components/googleMaps/AddressAutocomplete";
import { WarehouseWithRelations } from "@/app/lib/type/warehouse";
import { CustomerWithRelations } from "@/app/lib/type/customer";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import PersonIcon from "@mui/icons-material/Person";

interface LogisticsSectionProps {
  state: AddShipmentLogistics;
  updateLogistics: (data: Partial<AddShipmentLogistics>) => void;
  warehouses: WarehouseWithRelations[];
  customers: CustomerWithRelations[];
}

const LogisticsSection = ({
  state,
  updateLogistics,
  warehouses,
  customers,
}: LogisticsSectionProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();

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
            Logistics & Parties
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
                ORIGIN WAREHOUSE
              </Typography>
              <CustomTextArea
                name="originWarehouseId"
                select
                placeholder="Search origin warehouse..."
                value={state.originWarehouseId}
                onChange={(e) => {
                  const warehouseId = e.target.value;
                  const selectedWarehouse = warehouses.find(
                    (w) => w.id === warehouseId
                  );
                  if (selectedWarehouse) {
                    updateLogistics({
                      originWarehouseId: warehouseId,
                      originLat: selectedWarehouse.lat ?? undefined,
                      originLng: selectedWarehouse.lng ?? undefined,
                    });
                  } else {
                    updateLogistics({ originWarehouseId: warehouseId });
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
                DESTINATION
              </Typography>
              <AddressAutocomplete
                placeholder="Search destination..."
                name="destination"
                value={state.destination}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateLogistics({ destination: e.target.value })
                }
                onAddressSelect={(data: {
                  formattedAddress: string;
                  lat: number;
                  lng: number;
                }) => {
                  updateLogistics({
                    destination: data.formattedAddress,
                    destinationLat: data.lat,
                    destinationLng: data.lng,
                  });
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
                CUSTOMER / CLIENT
              </Typography>
              <CustomTextArea
                name="customerId"
                select
                placeholder="Select customer"
                value={state.customerId}
                onChange={(e) => {
                  const customerId = e.target.value;
                  if (!customerId) {
                    updateLogistics({ 
                      customerId: "",
                      customerLocationId: "",
                      contactEmail: "",
                    });
                    return;
                  }

                  const selectedCustomer = customers.find(
                    (c) => c.id === customerId
                  );
                  const defaultLoc = selectedCustomer?.locations?.find((l) => l.isDefault) || selectedCustomer?.locations?.[0];
                  
                  updateLogistics({ 
                    customerId,
                    customerLocationId: defaultLoc?.id || "",
                    destination: defaultLoc?.address || state.destination,
                    destinationLat: defaultLoc?.lat ?? state.destinationLat,
                    destinationLng: defaultLoc?.lng ?? state.destinationLng,
                    contactEmail: selectedCustomer?.email || state.contactEmail,
                  });
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
                CUSTOMER LOCATION (DEPOT)
              </Typography>
              <CustomTextArea
                name="customerLocationId"
                select
                placeholder="Select depot"
                disabled={!state.customerId}
                value={state.customerLocationId}
                onChange={(e) => {
                  const locationId = e.target.value;
                  const selectedCustomer = customers.find(c => c.id === state.customerId);
                  const selectedLoc = selectedCustomer?.locations?.find(l => l.id === locationId);
                  
                  if (selectedLoc) {
                    updateLogistics({
                      customerLocationId: locationId,
                      destination: selectedLoc.address,
                      destinationLat: selectedLoc.lat ?? undefined,
                      destinationLng: selectedLoc.lng ?? undefined,
                    });
                  } else {
                    updateLogistics({ customerLocationId: locationId });
                  }
                }}
              >
                {state.customerId ? (
                  customers.find(c => c.id === state.customerId)?.locations?.map((l) => (
                    <MenuItem key={l.id} value={l.id}>
                      <Typography variant="body2">
                        {l.name} {l.isDefault ? "(Default)" : ""}
                      </Typography>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>Select a customer first</MenuItem>
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
                CONTACT EMAIL
              </Typography>
              <CustomTextArea
                name="contactEmail"
                placeholder="client@example.com"
                value={state.contactEmail}
                onChange={(e) =>
                  updateLogistics({ contactEmail: e.target.value })
                }
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
                BILLING ACCOUNT
              </Typography>
              <CustomTextArea
                name="billingAccount"
                select
                value={state.billingAccount}
                onChange={(e) =>
                  updateLogistics({ billingAccount: e.target.value })
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

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
import AddressTextArea from "@/app/components/inputs/AddressTextArea";
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
                onChange={(e) =>
                  updateLogistics({ originWarehouseId: e.target.value })
                }
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
              <AddressTextArea
                label="Search destination..."
                name="destination"
                value={state.destination}
                onChange={(e) =>
                  updateLogistics({ destination: e.target.value })
                }
                onPlaceSelect={(place: google.maps.places.PlaceResult) => {
                  const lat = place.geometry?.location?.lat;
                  const lng = place.geometry?.location?.lng;
                  updateLogistics({
                    destination: place.formatted_address || place.name || "",
                    destinationLat:
                      typeof lat === "function"
                        ? (lat as () => number)()
                        : (lat as unknown as number),
                    destinationLng:
                      typeof lng === "function"
                        ? (lng as () => number)()
                        : (lng as unknown as number),
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
                  updateLogistics({ customerId });

                  // Auto-fill logic
                  const selectedCustomer = customers.find(
                    (c) => c.id === customerId
                  );
                  if (selectedCustomer) {
                    updateLogistics({
                      destination:
                        selectedCustomer.address || state.destination,
                      destinationLat:
                        selectedCustomer.lat ?? state.destinationLat,
                      destinationLng:
                        selectedCustomer.lng ?? state.destinationLng,
                      contactEmail:
                        selectedCustomer.email || state.contactEmail,
                    });
                  }
                }}
              >
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

"use client";

import {
  alpha,
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  AddShipmentLogistics,
  AddShipmentPageActions,
} from "@/app/lib/type/add-shipment";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import { WarehouseWithRelations } from "@/app/lib/type/warehouse";
import { CustomerWithRelations } from "@/app/lib/type/customer";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import PersonIcon from "@mui/icons-material/Person";

interface LogisticsSectionProps {
  state: AddShipmentLogistics;
  actions: AddShipmentPageActions;
  warehouses: WarehouseWithRelations[];
  customers: CustomerWithRelations[];
}

const LogisticsSection = ({
  state,
  actions,
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
                  actions.updateLogistics({ originWarehouseId: e.target.value })
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
              <CustomTextArea
                name="destination"
                placeholder="Search destination..."
                value={state.destination}
                onChange={(e) =>
                  actions.updateLogistics({ destination: e.target.value })
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
                CUSTOMER / CLIENT
              </Typography>
              <CustomTextArea
                name="customerId"
                select
                placeholder="Select customer"
                value={state.customerId}
                onChange={(e) =>
                  actions.updateLogistics({ customerId: e.target.value })
                }
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
                  actions.updateLogistics({ contactEmail: e.target.value })
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
                  actions.updateLogistics({ billingAccount: e.target.value })
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

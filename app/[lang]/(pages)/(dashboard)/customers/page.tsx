"use client";

import {
  Box,
  Card,
  Stack,
  TextField,
  InputAdornment,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import {
  MapWithMarker,
  MarkerData,
} from "@/app/components/googleMaps/MapWithMarker";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import CustomerDetailDialog from "@/app/components/dialogs/customer/customerDetailDialog";
import EditCustomerDialog from "@/app/components/dialogs/customer/editCustomerDialog";
import AddCustomerDialog from "@/app/components/dialogs/customer/addCustomerDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import CustomerList from "@/app/components/dashboard/customer/CustomerList";
import { useState, useMemo } from "react";
import {
  CustomerPageActions,
  CustomerWithRelations,
} from "@/app/lib/type/customer";
import { useCustomers, useCustomerMutations } from "@/app/hooks/useCustomers";
import { useUser } from "@/app/lib/hooks/useUser";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { toast } from "sonner";

export default function CustomersPage() {
  /* -------------------------------- VARIABLES ------------------------------- */
  const { user } = useUser();
  const dict = useDictionary();

  /* ---------------------------------- STATE --------------------------------- */
  const [filters, setFilters] = useState<{ search: string }>({ search: "" });
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionCustomer, setActionCustomer] =
    useState<CustomerWithRelations | null>(null);

  /* ---------------------------------- HOOKS --------------------------------- */
  const {
    data: customers = [],
    isLoading: loading,
    refetch: refetchCustomers,
  } = useCustomers();
  const { deleteCustomer: deleteMutation } = useCustomerMutations();

  /* -------------------------------- HANDLERS -------------------------------- */
  const handleEdit = (customer: CustomerWithRelations) => {
    setActionCustomer(customer);
    setEditOpen(true);
  };

  const handleDelete = (customer: CustomerWithRelations) => {
    setActionCustomer(customer);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!actionCustomer || !user) return;
    try {
      await deleteMutation.mutateAsync(actionCustomer.id);
      toast.success(dict.customers.dialogs.successDelete || "Customer deleted successfully");
      setDeleteOpen(false);
      setDetailOpen(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : (dict.customers.dialogs.errorDelete || "Failed to delete customer");
      toast.error(message);
    }
  };

  /* --------------------------------- ACTIONS -------------------------------- */
  const actions: CustomerPageActions = {
    fetchCustomers: async () => {},
    selectCustomer: (id: string | null) => {
      setSelectedCustomerId(id);
      if (id) setDetailOpen(true);
    },
    updateFilters: (newFilters: Partial<{ search: string }>) =>
      setFilters((prev) => ({ ...prev, ...newFilters })),
  };

  /* --------------------------------- HELPERS -------------------------------- */
  const filteredCustomers = useMemo(() => {
    if (!filters.search) return customers;
    const lowerTerm = filters.search.toLowerCase();
    return customers.filter(
      (c: CustomerWithRelations) =>
        c.name.toLowerCase().includes(lowerTerm) ||
        c.code.toLowerCase().includes(lowerTerm)
    );
  }, [customers, filters.search]);

  const mapLocations = useMemo<MarkerData[]>(() => {
    return filteredCustomers.flatMap((c: CustomerWithRelations) => {
      if (!c.locations) return [];

      return c.locations
        .filter((loc) => loc.lat != null && loc.lng != null)
        .map((loc) => ({
          position: {
            lat: Number(loc.lat),
            lng: Number(loc.lng),
          },
          label: c.name.charAt(0).toUpperCase(),
          title: `${c.name} - ${loc.name}`,
          description: loc.address,
          type: "customer" as const,
        }));
    });
  }, [filteredCustomers]);

  return (
    <Box sx={{ height: "calc(100vh - 100px)", p: 3, display: "flex", gap: 3 }}>
      <Stack spacing={2} sx={{ width: 400, height: "100%" }}>
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              fullWidth
              placeholder={dict.customers.searchPlaceholder}
              size="small"
              value={filters.search || ""}
              onChange={(e) =>
                actions.updateFilters({ search: e.target.value })
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setAddOpen(true)}
              sx={{ whiteSpace: "nowrap", minWidth: "auto" }}
            >
              {dict.common.add}
            </Button>
          </Stack>
        </Paper>
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <CustomerList
            customers={filteredCustomers}
            selectedId={selectedCustomerId}
            loading={loading}
            onSelect={actions.selectCustomer}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Box>
      </Stack>

      <Card
        sx={{
          flex: 1,
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          height: "100%",
        }}
      >
        <GoogleMapsProvider>
          <MapWithMarker
            center={{ lat: 39.9334, lng: 32.8597 }}
            markers={mapLocations}
            zoom={6}
            height="100%"
          />
        </GoogleMapsProvider>
        {mapLocations.length === 0 && (
          <Box
            position="absolute"
            top={16}
            left={16}
            bgcolor="background.paper"
            p={1}
            borderRadius={1}
            zIndex={1}
          >
            <Typography variant="caption">{dict.customers.noGeoData}</Typography>
          </Box>
        )}
      </Card>

      <CustomerDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        customerId={selectedCustomerId}
      />

      <EditCustomerDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={refetchCustomers}
        customer={actionCustomer}
      />

      <AddCustomerDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={refetchCustomers}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={dict.customers.deleteTitle}
        description={dict.customers.deleteDesc.replace("{name}", actionCustomer?.name || (dict.common.this || "this"))}
        loading={deleteMutation.isPending}
      />
    </Box>
  );
}

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
import { MapWithMarker, MarkerData } from "@/app/components/googleMaps/MapWithMarker";
import { GoogleMapsProvider } from "@/app/components/googleMaps/GoogleMapsProvider";
import CustomerDetailDialog from "@/app/components/dialogs/customer/customerDetailDialog";
import EditCustomerDialog from "@/app/components/dialogs/customer/editCustomerDialog";
import AddCustomerDialog from "@/app/components/dialogs/customer/addCustomerDialog";
import DeleteConfirmationDialog from "@/app/components/dialogs/deleteConfirmationDialog";
import CustomerList from "@/app/components/dashboard/customer/CustomerList";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  CustomerPageState,
  CustomerPageActions,
  CustomerWithRelations,
} from "@/app/lib/type/customer";
import { getCustomers, deleteCustomer } from "@/app/lib/controllers/customer";
import { useUser } from "@/app/lib/hooks/useUser";
import { toast } from "sonner";

export default function CustomersPage() {
  const { user } = useUser();

  /* --------------------------------- states --------------------------------- */
  const [state, setState] = useState<CustomerPageState>({
    customers: [],
    selectedCustomerId: null,
    filters: {
      search: "",
    },
    loading: true,
    error: null,
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionCustomer, setActionCustomer] =
    useState<CustomerWithRelations | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    setDeleteLoading(true);
    try {
      await deleteCustomer(actionCustomer.id);
      toast.success("Customer deleted successfully");
      setDeleteOpen(false);
      setDetailOpen(false);
      fetchCustomers();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete customer";
      console.error("Failed to delete customer:", error);
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  /* --------------------------------- actions -------------------------------- */
  const fetchCustomers = useCallback(async () => {
    setState((prev: CustomerPageState) => ({ ...prev, loading: true }));
    try {
      const data = await getCustomers();

      setState((prev: CustomerPageState) => ({
        ...prev,
        customers: data,
        loading: false,
        error: null,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch customers";
      console.error("Failed to fetch customers", error);
      setState((prev: CustomerPageState) => ({ ...prev, loading: false, error: message }));
    }
  }, []);

  const actions: CustomerPageActions = {
    fetchCustomers,
    selectCustomer: (id: string | null) => {
      setState((prev: CustomerPageState) => ({ ...prev, selectedCustomerId: id }));
      if (id) setDetailOpen(true);
    },
    updateFilters: (filters: Partial<CustomerPageState["filters"]>) =>
      setState((prev: CustomerPageState) => ({
        ...prev,
        filters: { ...prev.filters, ...filters },
      })),
  };

  /* --------------------------------- effects -------------------------------- */
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  /* --------------------------------filters -------------------------------- */
  const filteredCustomers = useMemo(() => {
    if (!state.filters.search) return state.customers;
    const lowerTerm = state.filters.search.toLowerCase();
    return state.customers.filter(
      (c: CustomerWithRelations) =>
        c.name.toLowerCase().includes(lowerTerm) ||
        c.code.toLowerCase().includes(lowerTerm)
    );
  }, [state.customers, state.filters.search]);

  // Extract valid locations for all customers
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

  /* --------------------------------- render --------------------------------- */
  return (
    <Box sx={{ height: "calc(100vh - 100px)", p: 3, display: "flex", gap: 3 }}>
      <Stack spacing={2} sx={{ width: 400, height: "100%" }}>
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              fullWidth
              placeholder="Search customers..."
              size="small"
              value={state.filters.search || ""}
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
              Add
            </Button>
          </Stack>
        </Paper>
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <CustomerList
            customers={filteredCustomers}
            selectedId={state.selectedCustomerId}
            loading={state.loading}
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
            center={{ lat: 39.9334, lng: 32.8597 }} // Turkey Central
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
            <Typography variant="caption">No geo-data available</Typography>
          </Box>
        )}
      </Card>

      <CustomerDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        customerId={state.selectedCustomerId}
      />

      <EditCustomerDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={fetchCustomers}
        customer={actionCustomer}
      />

      <AddCustomerDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={fetchCustomers}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer?"
        description={`Are you sure you want to delete ${actionCustomer?.name || "this customer"}? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </Box>
  );
}

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
import GoogleMapView from "@/app/components/map";
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
      await deleteCustomer(actionCustomer.id, user.id);
      toast.success("Customer deleted successfully");
      setDeleteOpen(false);
      setDetailOpen(false);
      fetchCustomers();
    } catch (error: any) {
      console.error("Failed to delete customer:", error);
      toast.error(error.message || "Failed to delete customer");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* --------------------------------- actions -------------------------------- */
  const fetchCustomers = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const COMPANY_ID = "cmlgt985b0003x0cuhtyxoihd";
      const USER_ID = "usr_001";
      const data = await getCustomers(COMPANY_ID, USER_ID);

      setState((prev) => ({
        ...prev,
        customers: data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      console.error("Failed to fetch customers", error);
      setState((prev) => ({ ...prev, loading: false, error: error.message }));
    }
  }, []);

  const actions: CustomerPageActions = {
    fetchCustomers,
    selectCustomer: (id) => {
      setState((prev) => ({ ...prev, selectedCustomerId: id }));
      if (id) setDetailOpen(true);
    },
    updateFilters: (filters) =>
      setState((prev) => ({
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
      (c) =>
        c.name.toLowerCase().includes(lowerTerm) ||
        c.code.toLowerCase().includes(lowerTerm)
    );
  }, [state.customers, state.filters.search]);

  // Derived locations for map (Mocking coordinates for now as DB doesn't have lat/lng yet)
  const mapLocations = useMemo(() => {
    return [];
  }, []);

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
            onSelect={actions.selectCustomer} // Just selection
          />
        </Box>
      </Stack>

      <Card
        sx={{
          flex: 1,
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          minHeight: 400,
        }}
      >
        <GoogleMapView warehouseLoc={mapLocations} zoom={7} />
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
        onEdit={(customer) => handleEdit(customer)}
        onDelete={(customer) => handleDelete(customer)}
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

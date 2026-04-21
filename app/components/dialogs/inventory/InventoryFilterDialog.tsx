"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Stack,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { useState, useEffect } from "react";
import { useWarehouses } from "@/app/hooks/useWarehouses";
import { Warehouse } from "@/app/lib/type/enums";

interface InventoryFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    warehouseId?: string;
    status?: string[];
  };
  onApply: (filters: { warehouseId?: string; status?: string[] }) => void;
  isWarehouseView?: boolean;
}

const STOCK_STATUSES = [
  { value: "IN_STOCK", labelKey: "inStock" },
  { value: "LOW_STOCK", labelKey: "low" },
  { value: "OUT_OF_STOCK", labelKey: "out" },
];

export default function InventoryFilterDialog({
  isOpen,
  onClose,
  filters,
  onApply,
  isWarehouseView = false,
}: InventoryFilterDialogProps) {
  const dict = useDictionary();
  const { data: warehouses } = useWarehouses();

  const [localWarehouseId, setLocalWarehouseId] = useState(
    filters.warehouseId || ""
  );
  const [localStatus, setLocalStatus] = useState<string[]>(
    filters.status || []
  );

  useEffect(() => {
    if (isOpen) {
      setLocalWarehouseId(filters.warehouseId || "");
      setLocalStatus(filters.status || []);
    }
  }, [isOpen, filters]);

  const handleApply = () => {
    onApply({
      warehouseId: localWarehouseId || undefined,
      status: localStatus,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalWarehouseId("");
    setLocalStatus([]);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <FilterListIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            {dict.inventory.filters?.title || "Filter Inventory"}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Stack spacing={3}>
          {!isWarehouseView && (
            <FormControl fullWidth size="small">
              <InputLabel>
                {dict.inventory.filters?.warehouse || "Warehouse"}
              </InputLabel>
              <Select
                value={localWarehouseId}
                onChange={(e) => setLocalWarehouseId(e.target.value as string)}
                input={
                  <OutlinedInput
                    label={dict.inventory.filters?.warehouse || "Warehouse"}
                  />
                }
              >
                <MenuItem value="">
                  <em>{dict.common.all}</em>
                </MenuItem>
                {warehouses?.map((w: Warehouse) => (
                  <MenuItem key={w.id} value={w.id}>
                    {w.name} ({w.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl fullWidth size="small">
            <InputLabel>
              {dict.inventory.filters?.status || "Stock Status"}
            </InputLabel>
            <Select
              multiple
              value={localStatus}
              onChange={(e) =>
                setLocalStatus(
                  typeof e.target.value === "string"
                    ? e.target.value.split(",")
                    : (e.target.value as string[])
                )
              }
              input={
                <OutlinedInput
                  label={dict.inventory.filters?.status || "Stock Status"}
                />
              }
              renderValue={(selected) => (
                <Typography variant="body2">
                  {(selected as string[])
                    .map(
                      (s) =>
                        dict.inventory.status[
                          STOCK_STATUSES.find((opt) => opt.value === s)
                            ?.labelKey as keyof typeof dict.inventory.status
                        ] || s
                    )
                    .join(", ")}
                </Typography>
              )}
            >
              {STOCK_STATUSES.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  <Checkbox
                    checked={localStatus.indexOf(status.value) > -1}
                    size="small"
                  />
                  <ListItemText
                    primary={
                      dict.inventory.status[
                        status.labelKey as keyof typeof dict.inventory.status
                      ] || status.value
                    }
                    slotProps={{ primary: { sx: { fontSize: 14 } } }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleReset}
          variant="text"
          color="inherit"
          sx={{ fontWeight: 600 }}
        >
          {dict.common.reset || "Reset"}
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{ fontWeight: 600 }}
        >
          {dict.common.cancel}
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          disableElevation
          sx={{ fontWeight: 600 }}
        >
          {dict.common.apply || "Apply Filters"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

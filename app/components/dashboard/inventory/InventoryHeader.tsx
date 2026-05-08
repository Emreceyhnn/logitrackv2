import {
  Stack,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { useWarehouses } from "@/app/hooks/useWarehouses";
import { Warehouse } from "@/app/lib/type/enums";

interface InventoryHeaderProps {
  value: string;
  onSearch: (value: string) => void;
  onAddClick: () => void;
  warehouseId?: string;
  status?: string[];
  onWarehouseChange?: (id: string) => void;
  onStatusChange?: (status: string[]) => void;
  hideWarehouseFilter?: boolean;
}

const STOCK_STATUSES = [
  { value: "IN_STOCK", labelKey: "inStock" },
  { value: "LOW_STOCK", labelKey: "low" },
  { value: "OUT_OF_STOCK", labelKey: "out" },
];

const InventoryHeader = ({
  value,
  onSearch,
  onAddClick,
  warehouseId,
  status = [],
  onWarehouseChange,
  onStatusChange,
  hideWarehouseFilter = false,
}: InventoryHeaderProps) => {
  const dict = useDictionary();
  const { data: warehouses } = useWarehouses();

  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      spacing={3}
      alignItems={{ xs: "stretch", lg: "center" }}
      justifyContent="space-between"
      sx={{ mb: 4 }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          {dict.inventory.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {dict.inventory.subtitle}
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="center"
        flex={1}
        justifyContent="flex-end"
      >
        <TextField
          placeholder={dict.inventory.searchPlaceholder}
          size="small"
          value={value}
          onChange={(e) => onSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: { xs: "100%", md: 240 } }}
        />

        {!hideWarehouseFilter && (
          <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 180 } }}>
            <InputLabel>
              {dict.inventory.filters?.warehouse || "Warehouse"}
            </InputLabel>
            <Select
              value={warehouseId || ""}
              onChange={(e) => onWarehouseChange?.(e.target.value as string)}
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
                  {w.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 180 } }}>
          <InputLabel>
            {dict.inventory.filters?.status || "Stock Status"}
          </InputLabel>
          <Select
            multiple
            value={status}
            onChange={(e) =>
              onStatusChange?.(
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
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as string[])
                  .map(
                    (s) =>
                      dict.inventory.status[
                        STOCK_STATUSES.find((opt) => opt.value === s)
                          ?.labelKey as keyof typeof dict.inventory.status
                      ] || s
                  )
                  .join(", ")}
              </Box>
            )}
          >
            {STOCK_STATUSES.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                <Checkbox checked={status.indexOf(opt.value) > -1} size="small" />
                <ListItemText
                  primary={
                    dict.inventory.status[
                      opt.labelKey as keyof typeof dict.inventory.status
                    ] || opt.value
                  }
                  slotProps={{ primary: { sx: { fontSize: 14 } } }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddClick}
          sx={{
            height: 40,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            whiteSpace: "nowrap",
            width: { xs: "100%", md: "auto" },
          }}
        >
          {dict.inventory.addInventory}
        </Button>
      </Stack>
    </Stack>
  );
};

export default InventoryHeader;


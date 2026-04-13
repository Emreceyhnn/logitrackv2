"use client";

import {
  Stack,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface InventoryHeaderProps {
  onSearch: (value: string) => void;
  onFilterClick: () => void;
  onAddClick: () => void;
}

const InventoryHeader = ({
  onSearch,
  onFilterClick,
  onAddClick,
}: InventoryHeaderProps) => {
  const dict = useDictionary();

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={3}
      alignItems={{ xs: "stretch", md: "center" }}
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

      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          placeholder={dict.inventory.searchPlaceholder}
          size="small"
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
          sx={{ width: { xs: "100%", md: 300 } }}
        />

        <Tooltip title={dict.inventory.filters}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={onFilterClick}
            sx={{ height: 40 }}
          >
            {dict.inventory.filter}
          </Button>
        </Tooltip>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddClick}
          sx={{
            height: 40,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
          }}
        >
          {dict.inventory.addInventory}
        </Button>
      </Stack>
    </Stack>
  );
};

export default InventoryHeader;

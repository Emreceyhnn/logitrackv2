"use client";

import { Stack, Typography, Button, TextField, InputAdornment, IconButton, Tooltip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';

interface InventoryHeaderProps {
    onSearch: (value: string) => void;
    onFilterClick: () => void;
    onAddClick: () => void;
}

const InventoryHeader = ({ onSearch, onFilterClick, onAddClick }: InventoryHeaderProps) => {
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
                    Inventory
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage, track, and analyze inventory items efficiently
                </Typography>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                    placeholder="Search product, SKU..."
                    size="small"
                    onChange={(e) => onSearch(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }
                    }}
                    sx={{ width: { xs: "100%", md: 300 } }}
                />

                <Tooltip title="Filters">
                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        onClick={onFilterClick}
                        sx={{ height: 40 }}
                    >
                        Filter
                    </Button>
                </Tooltip>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAddClick}
                    sx={{
                        height: 40,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3
                    }}
                >
                    Add Inventory
                </Button>
            </Stack>
        </Stack>
    );
};

export default InventoryHeader;

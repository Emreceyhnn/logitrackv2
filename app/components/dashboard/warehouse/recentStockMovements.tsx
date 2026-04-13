"use client";
import { useState, useMemo } from "react";
import {
  Chip,
  Typography,
  Box,
  useTheme,
  alpha,
  Stack
} from "@mui/material";
import CustomCard from "../../cards/card";
import { InventoryMovementWithRelations } from "@/app/lib/type/warehouse";
import HistoryIcon from '@mui/icons-material/History';
import DataTable from "@/app/components/ui/DataTable";
import type { DataTableColumn } from "@/app/lib/type/dataTable";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface RecentStockMovementsProps {
  movements: InventoryMovementWithRelations[];
  loading?: boolean;
}

const RecentStockMovements = ({
  movements,
  loading,
}: RecentStockMovementsProps) => {
  const theme = useTheme();
  const dict = useDictionary();
  
  // Local pagination
  const [localPage, setLocalPage] = useState(1);
  const [localLimit, setLocalLimit] = useState(10);

  const paginatedMovements = movements.slice(
    (localPage - 1) * localLimit,
    localPage * localLimit
  );

  const meta = {
    page: localPage,
    limit: localLimit,
    total: movements.length,
  };

  const handlePageChange = (newPage: number) => {
    setLocalPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLocalLimit(newLimit);
    setLocalPage(1);
  };

  const columns: DataTableColumn<InventoryMovementWithRelations>[] = useMemo(() => [
    {
      key: "warehouse",
      label: dict.dashboard.warehouse.warehouse,
      render: (row) => (
        <Typography variant="body2" fontWeight={800} color="text.primary">
          {row.warehouse?.code}
        </Typography>
      ),
    },
    {
      key: "itemSku",
      label: dict.dashboard.warehouse.itemSku,
      render: (row) => (
        <>
          <Typography variant="body2" fontWeight={600}>
            {row.itemName}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
            {row.sku}
          </Typography>
        </>
      ),
    },
    {
      key: "type",
      label: dict.dashboard.warehouse.type,
      render: (row) => {
        const isPick = row.type === "PICK";
        return (
          <Chip
            label={row.type}
            size="small"
            sx={{
              bgcolor: alpha(isPick ? theme.palette.warning.main : theme.palette.success.main, 0.1),
              color: isPick ? theme.palette.warning.main : theme.palette.success.main,
              fontWeight: 800,
              borderRadius: "8px",
              fontSize: "0.65rem",
              height: 24,
              border: `1px solid ${alpha(isPick ? theme.palette.warning.main : theme.palette.success.main, 0.1)}`,
            }}
          />
        );
      },
    },
    {
      key: "quantity",
      label: dict.dashboard.warehouse.quantity,
      render: (row) => {
        const isPick = row.type === "PICK";
        return (
          <Typography 
            variant="body2" 
            fontWeight={800} 
            color={isPick ? "warning.main" : "success.main"}
          >
            {isPick ? "-" : "+"}
            {row.quantity}
          </Typography>
        );
      },
    },
    {
      key: "timestamp",
      label: dict.dashboard.warehouse.timestamp,
      align: "right",
      render: (row) => {
        const date = new Date(row.date);
        const timeDisplay = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const dateDisplay = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        return (
          <>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {timeDisplay}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
              {dateDisplay}
            </Typography>
          </>
        );
      },
    },
  ], [theme, dict]);

  if (loading) return (
    <CustomCard sx={{ flex: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography color="text.secondary">{dict.dashboard.warehouse.loadingMovements}</Typography>
    </CustomCard>
  );

  return (
    <CustomCard sx={{ flex: 7, p: 0, overflow: 'hidden' }}>
      <Box sx={{ p: 3, pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ 
            p: 1, 
            borderRadius: '12px', 
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            display: 'flex'
          }}>
            <HistoryIcon fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
            {dict.dashboard.warehouse.recentMovements}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}` }}>
        <DataTable<InventoryMovementWithRelations>
          rows={paginatedMovements}
          columns={columns}
          emptyMessage={dict.dashboard.warehouse.noMovements}
          meta={meta}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </Box>
    </CustomCard>
  );
};

export default RecentStockMovements;

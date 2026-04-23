"use client";

import {
  
  Avatar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { WarehouseWithRelations } from "@/app/lib/type/warehouse";
import { useState } from "react";
import OverviewTab from "./overviewTab";
import InventoryTab from "./inventoryTab";
import CloseIcon from "@mui/icons-material/Close";

import WarehouseIcon from "@mui/icons-material/Storefront";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import EditIcon from "@mui/icons-material/Edit";
import EditWarehouseDialog from "../editWarehouseDialog";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface WarehouseDialogParams {
  open: boolean;
  onClose: () => void;
  warehouseData?: WarehouseWithRelations;
  onEditSuccess?: () => void;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`warehouse-tabpanel-${index}`}
      aria-labelledby={`warehouse-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, minHeight: 400 }}>{children}</Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `warehouse-tab-${index}`,
    "aria-controls": `warehouse-tabpanel-${index}`,
  };
}

const WarehouseDetailsDialog = ({
  open,
  onClose,
  warehouseData,
  onEditSuccess,
}: WarehouseDialogParams) => {
  /* --------------------------------- states --------------------------------- */
  const dict = useDictionary();
  const [value, setValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const theme = useTheme();

  /* -------------------------------- handlers -------------------------------- */
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (!warehouseData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          overflow: "hidden",
          minHeight: "80vh",
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: theme.palette.primary._alpha.main_10,
                color: theme.palette.primary.main,
                width: 72,
                height: 72,
                borderRadius: 2,
              }}
            >
              <WarehouseIcon fontSize="large" />
            </Avatar>
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="h4"
                  fontWeight={800}
                  color="text.primary"
                >
                  {warehouseData.name}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <BusinessIcon fontSize="small" sx={{ fontSize: "1rem" }} />
                  {warehouseData.code}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <LocationOnIcon fontSize="small" sx={{ fontSize: "1rem" }} />
                  {warehouseData.city}, {warehouseData.country}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              onClick={() => setEditDialogOpen(true)}
              size="small"
              sx={{
                color: "text.secondary",
                "& :hover": { color: theme.palette.primary.main }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: "text.secondary",
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Stack>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: theme.palette.divider_alpha.main_10,
              px: 3,
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="warehouse details tabs"
            >
              <Tab label={dict.warehouses.dialogs.details.overview} {...a11yProps(0)} />
              <Tab label={dict.warehouses.dialogs.details.inventory} {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <OverviewTab warehouse={warehouseData} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <InventoryTab warehouse={warehouseData} />
          </CustomTabPanel>
        </Stack>
      </DialogContent>
      
      <EditWarehouseDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSuccess={() => {
          setEditDialogOpen(false);
          onEditSuccess?.();
        }}
        warehouseData={warehouseData}
      />
    </Dialog>
  );
};

export default WarehouseDetailsDialog;

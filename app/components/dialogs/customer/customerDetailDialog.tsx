import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  Typography,
  Chip,
  Divider,
  Avatar,
  useTheme,
  alpha,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useEffect, useState } from "react";
import { getCustomerById } from "@/app/lib/controllers/customer";
import { CustomerWithRelations } from "@/app/lib/type/customer";

interface CustomerDetailDialogParams {
  open: boolean;
  onClose: () => void;
  customerId: string | null;
  onEdit?: (customer: CustomerWithRelations) => void;
  onDelete?: (customer: CustomerWithRelations) => void;
}

const CustomerDetailDialog = ({
  open,
  onClose,
  customerId,
  onEdit,
  onDelete,
}: CustomerDetailDialogParams) => {
  /* --------------------------------- states --------------------------------- */
  const theme = useTheme();
  const [customer, setCustomer] = useState<CustomerWithRelations | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && customerId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const USER_ID = "usr_001"; // TODO: Context
          const data = await getCustomerById(customerId, USER_ID);
          // @ts-ignore - Controller returns specific include, type might match or close enough.
          // Assuming response matches CustomerWithRelations structure roughly
          setCustomer(data as any);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setCustomer(null);
    }
  }, [open, customerId]);

  if (!customerId) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      {loading || !customer ? (
        <Box p={5} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              p: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
              borderBottom: `1px solid ${theme.palette.divider}`,
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
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main,
                    width: 72,
                    height: 72,
                    fontSize: "2rem",
                    fontWeight: 800,
                    borderRadius: 2,
                  }}
                >
                  {customer.name?.charAt(0)}
                </Avatar>
                <Stack spacing={0.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {customer.name}
                    </Typography>
                    <VerifiedIcon color="primary" sx={{ fontSize: "1.2rem" }} />
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip
                      label={customer.industry || "General"}
                      size="small"
                      sx={{
                        height: 24,
                        fontWeight: 600,
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.dark,
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <BusinessIcon
                        fontSize="small"
                        sx={{ fontSize: "1rem" }}
                      />
                      {customer.code}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  size="small"
                  onClick={() => onEdit?.(customer)}
                  sx={{
                    textTransform: "none",
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      borderColor: theme.palette.text.primary,
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  Edit
                </Button>
                {onDelete && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => onDelete(customer)}
                    sx={{ textTransform: "none" }}
                  >
                    Delete
                  </Button>
                )}
                <IconButton
                  onClick={onClose}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.text.secondary, 0.1),
                    "&:hover": {
                      bgcolor: alpha(theme.palette.text.secondary, 0.2),
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Box>

          <DialogContent sx={{ p: 0 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                minHeight: 400,
              }}
            >
              {/* Left Sidebar: Contact & Billing */}
              <Box
                sx={{
                  width: { xs: "100%", md: "35%" },
                  p: 3,
                  borderRight: { md: `1px solid ${theme.palette.divider}` },
                  borderBottom: {
                    xs: `1px solid ${theme.palette.divider}`,
                    md: "none",
                  },
                  bgcolor: alpha(theme.palette.background.default, 0.4),
                }}
              >
                <Stack spacing={4}>
                  {/* Primary Contact */}
                  <Box>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      fontWeight={700}
                      letterSpacing={1.2}
                      display="block"
                      mb={2}
                    >
                      Contact Info
                    </Typography>

                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{ width: 32, height: 32, fontSize: "0.875rem" }}
                          >
                            {customer.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700}>
                              {customer.email || "No Email"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {customer.phone || "No Phone"}
                            </Typography>
                          </Box>
                        </Stack>
                        <Divider sx={{ borderStyle: "dashed" }} />
                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <PhoneIcon
                              fontSize="small"
                              color="action"
                              sx={{ fontSize: "1rem" }}
                            />
                            <Typography variant="body2">
                              {customer.phone || "N/A"}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <EmailIcon
                              fontSize="small"
                              color="action"
                              sx={{ fontSize: "1rem" }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ wordBreak: "break-all" }}
                            >
                              {customer.email || "N/A"}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Box>

                  {/* Billing Address */}
                  <Box>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      fontWeight={700}
                      letterSpacing={1.2}
                      display="block"
                      mb={2}
                    >
                      Address Details
                    </Typography>
                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                      >
                        <LocationOnIcon
                          color="action"
                          fontSize="small"
                          sx={{ mt: 0.2 }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {customer.address || "No address provided"}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ pt: 1 }}
                      >
                        <AssignmentIcon color="action" fontSize="small" />
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          color="text.secondary"
                        >
                          TAX ID:{" "}
                          <Box component="span" color="text.primary">
                            {customer.taxId || "N/A"}
                          </Box>
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              {/* Right Content: Stats & Sites */}
              <Box sx={{ width: { xs: "100%", md: "65%" }, p: 3 }}>
                {/* KPI Cards */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ mb: 4 }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography
                            variant="caption"
                            fontWeight={600}
                            color="text.secondary"
                          >
                            TOTAL SHIPMENTS
                          </Typography>
                          <LocalShippingIcon fontSize="small" color="primary" />
                        </Stack>
                        <Typography variant="h5" fontWeight={700}>
                          {/* We don't have shipment count in single fetch unless included. 
                          The controller includes `shipments` array (limit 5). 
                          We can use checking shipments length or another count if provided.
                      */}
                          {customer.shipments?.length || 0} (Recent)
                        </Typography>
                      </Stack>
                    </Paper>
                  </Box>
                </Stack>

                {/* Recent Shipments */}
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      fontWeight={700}
                      letterSpacing={1.2}
                    >
                      Recent Shipments
                    </Typography>
                    <Chip
                      label={`${customer.shipments?.length || 0} Records`}
                      size="small"
                      sx={{ height: 20, fontSize: "0.65rem", fontWeight: 600 }}
                    />
                  </Stack>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {customer.shipments?.map((shipment: any) => (
                      <Paper
                        key={shipment.id}
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" fontWeight={600}>
                            {shipment.trackingId}
                          </Typography>
                          <Chip label={shipment.status} size="small" />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {(shipment.origin as any)?.address ||
                            (typeof shipment.origin === "string"
                              ? shipment.origin
                              : "N/A")}{" "}
                          {" -> "}
                          {(shipment.destination as any)?.address ||
                            (typeof shipment.destination === "string"
                              ? shipment.destination
                              : "N/A")}
                        </Typography>
                      </Paper>
                    ))}
                    {(!customer.shipments ||
                      customer.shipments.length === 0) && (
                      <Typography variant="body2" color="text.secondary">
                        No recent shipments
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default CustomerDetailDialog;

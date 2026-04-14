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
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface CustomerDetailDialogParams {
  open: boolean;
  onClose: () => void;
  customerId: string | null;


}

const CustomerDetailDialog = ({
  open,
  onClose,
  customerId,

}: CustomerDetailDialogParams) => {
  /* --------------------------------- states --------------------------------- */
  const theme = useTheme();
  const dict = useDictionary();
  const [customer, setCustomer] = useState<CustomerWithRelations | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && customerId) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getCustomerById(customerId);
          setCustomer(data as unknown as CustomerWithRelations);
        } catch (err: unknown) {
          const message =
            err instanceof Error
              ? err.message
              : dict.customers.dialogs.errorAdd; // Use errorAdd as generic error
          setError(message);
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setCustomer(null);
      setError(null);
    }
  }, [open, customerId, dict]);

  const getIndustryLabel = (industry: string | null) => {
    if (!industry) return dict.customers.industryGeneral;
    // Common mapping for database values to dictionary keys
    const mapping: Record<string, keyof typeof dict.industries> = {
      "Logistics & Transportation": "logistics",
      "Retail & E-commerce": "retail",
      "E-commerce": "ecommerce",
      "Manufacturing": "manufacturing",
      "Pharmaceuticals": "pharmaceuticals",
      "Automotive": "automotive",
      "Aviation": "aviation",
      "Technology": "technology",
      "Other": "other"
    };

    const key = mapping[industry];
    return key ? dict.industries[key] : industry;
  };

  if (!customerId) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#0B0F19",
          backgroundImage: "none",
          borderRadius: 4,
          border: `1px solid ${(theme.palette as any).divider_alpha.main_10}`,
          overflow: "hidden",
        },
      }}
    >
      {loading ? (
        <Box p={5} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box p={5} textAlign="center">
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
          <Button onClick={onClose}>{dict.common.close}</Button>
        </Box>
      ) : !customer ? (
        <Box p={5} textAlign="center">
          <Typography color="text.secondary">{dict.customers.customerNotFound}</Typography>
          <Button onClick={onClose}>{dict.common.close}</Button>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              p: 3,
              background: `linear-gradient(135deg, ${(theme.palette.primary as any)._alpha.main_05} 0%, #0B0F19 100%)`,
              borderBottom: `1px solid ${(theme.palette as any).divider_alpha.main_05}`,
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
                    bgcolor: (theme.palette.secondary as any)._alpha.main_10,
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
                      sx={{ color: "white" }}
                    >
                      {customer.name}
                    </Typography>
                    <VerifiedIcon color="primary" sx={{ fontSize: "1.2rem" }} />
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip
                      label={getIndustryLabel(customer.industry)}
                      size="small"
                      sx={{
                        height: 24,
                        fontWeight: 600,
                        bgcolor: (theme.palette.secondary as any)._alpha.main_10,
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
                <IconButton
                  onClick={onClose}
                  size="small"
                  sx={{
                    color: "text.secondary",
                    bgcolor: (theme.palette as any).divider_alpha.main_05,
                    "&:hover": {
                      bgcolor: (theme.palette as any).divider_alpha.main_10,
                      color: "white",
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
                  borderRight: {
                    md: `1px solid ${(theme.palette as any).divider_alpha.main_05}`,
                  },
                  borderBottom: {
                    xs: `1px solid ${(theme.palette as any).divider_alpha.main_05}`,
                    md: "none",
                  },
                  bgcolor: (theme.palette.common as any).black_alpha.main_20,
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
                      {dict.common.contactInfo}
                    </Typography>

                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: (theme.palette.background as any).paper_alpha.main_02,
                        borderColor: (theme.palette as any).divider_alpha.main_10,
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
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              color="white"
                            >
                              {customer.email || dict.common.noEmail}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {customer.phone || dict.common.noPhone}
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
                              {customer.phone || dict.common.na}
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
                              sx={{
                                wordBreak: "break-all",
                                color: (theme.palette.common as any).white_alpha.main_70,
                              }}
                            >
                              {customer.email || dict.common.na}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Box>

                  {/* Address Details (Locations) */}
                  <Box>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      fontWeight={700}
                      letterSpacing={1.2}
                      display="block"
                      mb={2}
                    >
                      {dict.customers.registeredLocations}
                    </Typography>
                    <Stack spacing={2}>
                      {customer.locations && customer.locations.length > 0 ? (
                        customer.locations.map((loc, idx) => (
                          <Stack
                            key={loc.id || idx}
                            direction="row"
                            spacing={1.5}
                            alignItems="flex-start"
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: (theme.palette.background as any).paper_alpha.main_02,
                              border: `1px solid ${(theme.palette as any).divider_alpha.main_05}`
                            }}
                          >
                            <LocationOnIcon
                              color={loc.isDefault ? "primary" : "action"}
                              fontSize="small"
                              sx={{ mt: 0.2 }}
                            />
                            <Box>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                  {loc.name}
                                </Typography>
                                {loc.isDefault && (
                                  <Chip
                                    label={dict.customers.fields.isDefault}
                                    size="small"
                                    sx={{ height: 16, fontSize: '0.6rem', bgcolor: (theme.palette.primary as any)._alpha.main_10, color: theme.palette.primary.main }}
                                  />
                                )}
                              </Stack>
                              <Typography variant="body2" fontWeight={500} mt={0.5}>
                                {loc.address || dict.customers.noLocations}
                              </Typography>
                            </Box>
                          </Stack>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          {dict.customers.noLocations}
                        </Typography>
                      )}
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{ pt: 3 }}
                    >
                      <AssignmentIcon color="action" fontSize="small" />
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color="text.secondary"
                      >
                        {dict.customers.fields.taxId.split(" / ")[0]}:{" "}
                        <Box component="span" color="white">
                          {customer.taxId || dict.common.na}
                        </Box>
                      </Typography>
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
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: (theme.palette.primary as any)._alpha.main_02,
                        borderColor: (theme.palette.primary as any)._alpha.main_10,
                      }}
                    >
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography
                            variant="caption"
                            fontWeight={600}
                            color="text.secondary"
                          >
                            {dict.customers.totalShipments}
                          </Typography>
                          <LocalShippingIcon fontSize="small" color="primary" />
                        </Stack>
                        <Typography variant="h5" fontWeight={700}>
                          {customer.shipments?.length || 0} ({dict.common.recent})
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
                      {dict.customers.recentShipments}
                    </Typography>
                    <Chip
                      label={`${customer.shipments?.length || 0} ${dict.customers.records}`}
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
                    {customer.shipments?.map((shipment) => (
                      <Paper
                        key={shipment.id}
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: (theme.palette.background as any).paper_alpha.main_02,
                          borderColor: (theme.palette as any).divider_alpha.main_05,
                          "&:hover": {
                            borderColor: (theme.palette.primary as any)._alpha.main_20,
                            bgcolor: (theme.palette.primary as any)._alpha.main_02,
                          },
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" fontWeight={600}>
                            {shipment.trackingId}
                          </Typography>
                          <Chip 
                            label={(dict.routes?.statuses as Record<string, string>)?.[shipment.status] || shipment.status} 
                            size="small" 
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {(shipment.origin as { address?: string })?.address ||
                            (typeof shipment.origin === "string"
                              ? shipment.origin
                              : dict.common.na)}{" "}
                          {" -> "}
                          {(shipment.destination as { address?: string })
                            ?.address ||
                            (typeof shipment.destination === "string"
                              ? shipment.destination
                              : dict.common.na)}
                        </Typography>
                      </Paper>
                    ))}
                    {(!customer.shipments ||
                      customer.shipments.length === 0) && (
                        <Typography variant="body2" color="text.secondary">
                          {dict.customers.noRecentShipments}
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

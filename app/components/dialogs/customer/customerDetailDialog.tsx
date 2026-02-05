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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentIcon from "@mui/icons-material/Assignment";
import mockData from "@/app/lib/mockData.json";

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

  if (!customerId) return null;

  const customer = mockData.customers.find((c) => c.id === customerId);

  if (!customer) return null;

  const totalOrders = Math.floor(Math.random() * 500) + 50;
  const activeOrders = Math.floor(Math.random() * 20) + 2;

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
              {customer.name.charAt(0)}
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
                  label={customer.industry}
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
                  <BusinessIcon fontSize="small" sx={{ fontSize: "1rem" }} />
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
                  Primary Contact
                </Typography>
                {customer.contacts[0] ? (
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}
                  >
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{ width: 32, height: 32, fontSize: "0.875rem" }}
                        >
                          {customer.contacts[0].name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>
                            {customer.contacts[0].name}
                          </Typography>
                          {(customer.contacts[0] as any).role && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {(customer.contacts[0] as any).role}
                            </Typography>
                          )}
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
                            {customer.contacts[0].phone}
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
                            {customer.contacts[0].email}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Paper>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No contact info available.
                  </Typography>
                )}
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
                  Billing Details
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <LocationOnIcon
                      color="action"
                      fontSize="small"
                      sx={{ mt: 0.2 }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {customer.billingAddress.line1}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.billingAddress.district},{" "}
                        {customer.billingAddress.city}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.billingAddress.country.toUpperCase()},{" "}
                        {customer.billingAddress.postalCode}
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
                        {customer.taxId}
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
                        TOTAL ORDERS
                      </Typography>
                      <LocalShippingIcon fontSize="small" color="primary" />
                    </Stack>
                    <Typography variant="h5" fontWeight={700}>
                      {totalOrders}
                    </Typography>
                  </Stack>
                </Paper>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color="text.secondary"
                      >
                        ACTIVE
                      </Typography>
                      <AccessTimeIcon fontSize="small" color="warning" />
                    </Stack>
                    <Typography variant="h5" fontWeight={700}>
                      {activeOrders}
                    </Typography>
                  </Stack>
                </Paper>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color="text.secondary"
                      >
                        ON-TIME RATE
                      </Typography>
                      <VerifiedIcon fontSize="small" color="success" />
                    </Stack>
                    <Typography variant="h5" fontWeight={700}>
                      {customer.sla.onTimeTargetPct}%
                    </Typography>
                  </Stack>
                </Paper>
              </Box>
            </Stack>

            {/* Delivery Sites Map/List */}
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
                  Delivery Sites
                </Typography>
                <Chip
                  label={`${customer.deliverySites.length} Locations`}
                  size="small"
                  sx={{ height: 20, fontSize: "0.65rem", fontWeight: 600 }}
                />
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: 2,
                }}
              >
                {customer.deliverySites.map((site) => (
                  <Paper
                    key={site.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      },
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        variant="rounded"
                        sx={{
                          bgcolor: alpha(theme.palette.grey[500], 0.1),
                          color: "text.primary",
                        }}
                      >
                        <BusinessIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {site.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {site.address.city}, {site.address.country}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailDialog;

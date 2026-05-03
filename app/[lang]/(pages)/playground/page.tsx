import { createNotification } from "@/app/lib/notifications";
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import {
  NotificationsActive as NotifyIcon,
  Business as CompanyIcon,
  CheckCircle as SuccessIcon,
} from "@mui/icons-material";

export default async function Playground() {
  const companyId = "cmo68dbmy0006crmnmgdvn5lw";

  const result = await createNotification(
    {
      companyId: companyId,
    },
    {
      title: "Company-Wide Update 🏢",
      message:
        "Bu bildirim tüm şirket personeline gönderilmiştir. Lojistik operasyonlarındaki yeni güncellemeleri kontrol edin.",
      type: "INFO",
    }
  );

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
              }}
            >
              <NotifyIcon />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Notification Playground
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Testing Firebase real-time notifications for company groups
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Target Context
              </Typography>
              <Chip
                icon={<CompanyIcon />}
                label={`Company: ${companyId}`}
                variant="outlined"
                size="small"
              />
            </Box>

            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "background.default",
                border: "1px dashed",
                borderColor: "primary.light",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                gutterBottom
                sx={{ display: "block" }}
              >
                PAYLOAD SENT
              </Typography>
              <Typography variant="h6" color="primary.main" gutterBottom>
                Company-Wide Update 🏢
              </Typography>
              <Typography variant="body1">
                Bu bildirim tüm şirket personeline gönderilmiştir. Lojistik
                operasyonlarındaki yeni güncellemeleri kontrol edin.
              </Typography>
            </Box>

            {result.success && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "success.main",
                  color: "success.contrastText",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <SuccessIcon />
                <Typography variant="body2" fontWeight={600}>
                  Notification successfully dispatched to:
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                RAW RESPONSE:
              </Typography>
              <Box
                component="pre"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "grey.900",
                  color: "grey.300",
                  fontSize: "0.75rem",
                  overflowX: "auto",
                  mt: 1,
                }}
              >
                {JSON.stringify(result, null, 2)}
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

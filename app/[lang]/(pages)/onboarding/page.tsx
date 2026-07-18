"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import { Business, AddBusiness } from "@mui/icons-material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { formatMessage } from "@/app/lib/language/language";
import CreateCompanyDialog from "@/app/components/dialogs/company/CreateCompanyDialog";

export default function OnboardingPage() {
  const theme = useTheme();
  const dict = useDictionary();
  const params = useParams();
  const locale = (params?.lang as string) || "en";

  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            {formatMessage(
              dict.onboarding?.welcomeTitle || "Welcome to {name}",
              { name: dict.common.logitrack }
            )}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            maxWidth="sm"
            mx="auto"
          >
            {dict.onboarding?.welcomeSubtitle ||
              "You have successfully registered your account. To proceed to the dashboard, you need to be associated with a company."}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          justifyContent="center"
        >
          {/* Create Company */}
          <Card
            sx={{
              flex: 1,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[4],
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <CardContent
              sx={{
                p: 4,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  backgroundColor: theme.palette.primary._alpha.main_10,
                  color: theme.palette.primary.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <AddBusiness fontSize="large" />
              </Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {dict.onboarding?.createTitle || "Create a New Company"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 4, flex: 1 }}
              >
                {dict.onboarding?.createDescription ||
                  "Register a new logistics or transport company. You will be set as the initial Administrator with full control."}
              </Typography>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => setIsCreateCompanyOpen(true)}
                sx={{ borderRadius: 2, py: 1.5 }}
              >
                {dict.onboarding?.createButton || "Create Company"}
              </Button>
            </CardContent>
          </Card>

          {/* Join Company — not yet available. Shown dimmed with a "Coming
              soon" badge and a disabled button so it reads as a preview rather
              than an equal-weight option that then fails with a toast. */}
          <Card
            aria-disabled
            sx={{
              flex: 1,
              position: "relative",
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              opacity: 0.6,
            }}
          >
            <Chip
              label={dict.common?.comingSoon || "Coming Soon"}
              size="small"
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                fontWeight: 700,
                bgcolor: theme.palette.text.secondary_alpha?.main_10 ||
                  "rgba(0,0,0,0.08)",
                color: "text.secondary",
              }}
            />
            <CardContent
              sx={{
                p: 4,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  backgroundColor:
                    theme.palette.secondary._alpha?.main_10 ||
                    "rgba(156, 39, 176, 0.1)",
                  color: theme.palette.secondary.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <Business fontSize="large" />
              </Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {dict.onboarding?.joinTitle || "Join an Existing Company"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 4, flex: 1 }}
              >
                {dict.onboarding?.joinDescription ||
                  "If your company already uses LogiTrack, you can request to join using an invite code or your company email."}
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                fullWidth
                disabled
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  borderWidth: 2,
                }}
              >
                {dict.onboarding?.joinButton || "Join Company"}
              </Button>
            </CardContent>
          </Card>
        </Stack>
      </Container>
      
      <CreateCompanyDialog
        open={isCreateCompanyOpen}
        onClose={() => setIsCreateCompanyOpen(false)}
        onSuccess={() => {
          setIsCreateCompanyOpen(false);
          // Land directly on the dashboard. A full navigation (not client
          // router) is intentional: creating the company changes companyId, so
          // the proxy must re-mint the token on the next request for the
          // dashboard's tenant-scoped queries to resolve.
          window.location.href = `/${locale}/overview`;
        }}
      />
    </Box>
  );
}

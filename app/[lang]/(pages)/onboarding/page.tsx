"use client";

import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import { Business, AddBusiness } from "@mui/icons-material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { toast } from "sonner";

export default function OnboardingPage() {
  const theme = useTheme();
  const dict = useDictionary();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAction = (action: "create" | "join") => {
    toast.info("This feature is currently under development.");
  };

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
            Welcome to {dict.common.logitrack}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            maxWidth="sm"
            mx="auto"
          >
            You have successfully registered your account. To proceed to the
            dashboard, you need to be associated with a company.
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
                Create a New Company
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 4, flex: 1 }}
              >
                Register a new logistics or transport company. You will be set
                as the initial Administrator with full control.
              </Typography>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => handleAction("create")}
                sx={{ borderRadius: 2, py: 1.5 }}
              >
                Create Company
              </Button>
            </CardContent>
          </Card>

          {/* Join Company */}
          <Card
            sx={{
              flex: 1,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[4],
                borderColor: theme.palette.secondary.main,
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
                Join an Existing Company
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 4, flex: 1 }}
              >
                If your company already uses LogiTrack, you can request to join
                using an invite code or your company email.
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                fullWidth
                onClick={() => handleAction("join")}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  borderWidth: 2,
                  "&:hover": { borderWidth: 2 },
                }}
              >
                Join Company
              </Button>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}

import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/app/lib/auth-middleware";
import { Box, Typography, Container, Card, CardContent } from "@mui/material";
import { LocalGasStation } from "@mui/icons-material";

export default async function FuelPage() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    redirect("/en/auth/sign-in");
  }

  return (
    <Box p={4} width="100%">
      <Container maxWidth="lg">
        <Box mb={4}>
          <Typography variant="h4" fontWeight={800} color="text.primary" gutterBottom>
            Fuel Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage fuel logs, track consumption, and monitor vehicle efficiency.
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
          <CardContent sx={{ textAlign: "center", py: 10 }}>
            <LocalGasStation sx={{ fontSize: 64, color: "text.secondary", mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary" maxWidth="sm" mx="auto">
              We are currently building the advanced fuel management module. This feature will allow you to track fuel consumption per vehicle, integrate with fuel cards, and generate efficiency reports.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

import { Box, Container, Typography } from "@mui/material";

export default function Playground() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box
        sx={{
          p: 4,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Playground
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Developer sandbox — no active tests.
        </Typography>
      </Box>
    </Container>
  );
}

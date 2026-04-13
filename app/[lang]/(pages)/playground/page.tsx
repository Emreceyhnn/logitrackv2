import { getDictionary } from "@/app/lib/language/language";
import ClientExample from "./ClientExample";
import { Container, Typography, Box, Stack, Paper, Divider } from "@mui/material";

export default async function Playground({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  // 1. Fetch dictionary on the SERVER
  // This is safe and performant because only one language JSON is loaded.
  const dict = await getDictionary(lang);

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        bgcolor: "#0f172a", 
        color: "#f1f5f9",
        py: 8 
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={800} gutterBottom sx={{
          background: "linear-gradient(120deg, #f8fafc 0%, #38bdf8 55%, #a855f7 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          I18n Demo Playground
        </Typography>
        
        <Typography variant="body1" color="rgba(203, 213, 245, 0.8)" mb={6}>
          This page demonstrates how the new asynchronous i18n system works in both 
          <strong> Server Components</strong> and <strong>Client Components</strong>.
        </Typography>

        <Stack spacing={4}>
          {/* Server Component Example */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              bgcolor: "rgba(30, 41, 59, 0.3)", 
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 4
            }}
          >
            <Typography variant="h6" color="#a855f7" gutterBottom sx={{ fontWeight: 700 }}>
              Server Component Usage
            </Typography>
            <Typography variant="body2" color="rgba(203, 213, 245, 0.7)" mb={2}>
              We fetch the dictionary using <code>await getDictionary(lang)</code>. 
              No hooks or context involved, purely server-side.
            </Typography>
            
            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 2 }} />
            
            <Stack spacing={1}>
              <Typography variant="body1">
                <strong>Main Title:</strong> {dict.landing.hero.title}
              </Typography>
              <Typography variant="body1">
                <strong>Hero Badge:</strong> {dict.landing.hero.badge}
              </Typography>
            </Stack>
          </Paper>

          {/* Client Component Example */}
          <ClientExample />
          
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
            <Typography variant="body2" color="#38bdf8">
              <strong>Why useMemo?</strong> In Client Components, <code>useMemo</code> is 
              typically used to prevent expensive re-calculations of UI data that depends 
              on the dictionary. It isn't "wrong", but in Next.js App Router, we aim to 
              do as much as possible in Server Components (above) to keep the client 
              bundle small.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

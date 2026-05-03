import Link from "next/link";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import SignUpStepper from "./register/signUpStepper";
import { getDictionary } from "@/app/lib/language/language";

export default async function RegisterForm({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  /* -------------------------------- VARIABLES ------------------------------- */
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <Box
      maxWidth={{ sm: 600, xs: "95%" }}
      width={"100%"}
      bgcolor={"rgba(8, 12, 24, 0.75)"}
      sx={{
        backdropFilter: "blur(25px)",
        border: "1px solid rgba(56, 189, 248, 0.15)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)",
      }}
      borderRadius={"24px"}
    >
      <Box p={{ xs: "30px", sm: "50px" }}>
        <Stack alignItems="center" mb={4}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #38bdf8, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 16px rgba(56, 189, 248, 0.2)",
              mb: 2,
            }}
          >
            <Image
              src="/logo.svg"
              alt="LogiTrack"
              width={40}
              height={40}
            />
          </Box>
          <Typography
            sx={{
              fontWeight: 800,
              letterSpacing: 2,
              fontSize: 14,
              textTransform: "uppercase",
              color: "#38bdf8",
            }}
          >
            LogiTrack
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={3}
          mb={6}
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "24px",
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: 0,
                width: "100%",
                height: 2,
                bgcolor: "#38bdf8",
                borderRadius: 2,
              },
            }}
          >
            {dict.auth.register}
          </Typography>

          <Typography
            component={Link}
            href={`/${lang}/auth/sign-in`}
            sx={{
              fontWeight: 500,
              fontSize: "24px",
              letterSpacing: "-0.02em",
              color: "rgba(255, 255, 255, 0.3)",
              textDecoration: "none",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "rgba(255, 255, 255, 0.6)",
              },
            }}
          >
            {dict.auth.login}
          </Typography>
        </Stack>

        <SignUpStepper />
      </Box>
    </Box>
  );
}

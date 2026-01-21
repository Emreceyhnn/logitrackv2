import RegisterForm from "@/app/components/forms/signUpForm";
import { Box } from "@mui/material";

export default function SignInPage() {
  return (
    <Box
      sx={{
        width: "100dvw",
        minHeight: "100dvh",
        position: "absolute",
        backgroundColor: "white",
      }}
    >
      <Box
        sx={{
          width: "100dvw",
          minHeight: "100dvh",
          position: "absolute",
          zIndex: 2,
          background:
            "linear-gradient(180deg, rgba(196, 196, 196, 0) 25%, #38bdf8 92.19%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RegisterForm />
      </Box>
    </Box>
  );
}

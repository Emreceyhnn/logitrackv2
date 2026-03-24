import RegisterForm from "@/app/components/forms/signUpForm";
import { Box } from "@mui/material";

export default function SignInPage() {
  return (
    <Box
      sx={{
        width: "100dvw",
        minHeight: "100dvh",
        position: "relative",
        background: "linear-gradient(135deg, #020617 0%, #070b14 100%)",
        overflow: "hidden",
      }}
    >

      <Box
        sx={{
          position: "absolute",
          top: "-5%",
          left: "-5%",
          width: "50%",
          height: "50%",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(56, 189, 248, 0) 70%)",
          filter: "blur(100px)",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-5%",
          right: "-5%",
          width: "50%",
          height: "50%",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0) 70%)",
          filter: "blur(100px)",
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          width: "100%",
          minHeight: "100dvh",
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <RegisterForm />
      </Box>
    </Box>
  );
}

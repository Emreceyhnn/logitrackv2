"use client";

import { Box, Stack, Typography, Avatar } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function Step3Profile() {
  return (
    <Stack spacing={3} alignItems="center">
      <Box sx={{ width: "100%", textAlign: "left" }}>
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
          Final Touches
        </Typography>
        <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px" }}>
          Almost there! Complete your profile to join the LogiTrack team.
        </Typography>
      </Box>

      <Box sx={{ position: "relative", my: 2 }}>
        <Avatar
          sx={{
            width: 120,
            height: 120,
            bgcolor: "rgba(255, 255, 255, 0.05)",
            border: "2px dashed rgba(255, 255, 255, 0.2)",
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 40, color: "rgba(255, 255, 255, 0.3)" }} />
        </Avatar>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1,
            color: "rgba(255, 255, 255, 0.5)",
            textAlign: "center",
          }}
        >
          Upload Profile Picture
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: "rgba(56, 189, 248, 0.05)",
          p: 3,
          borderRadius: "12px",
          border: "1px solid rgba(56, 189, 248, 0.2)",
          width: "100%",
        }}
      >
        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.6 }}>
          By clicking &quot;Complete Registration&quot;, you agree to our Terms of Service and Privacy Policy. Your account will be created and you&apos;re redirected to the dashboard.
        </Typography>
      </Box>
    </Stack>
  );
}

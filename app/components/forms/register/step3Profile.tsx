"use client";

import { useState, useRef } from "react";
import { Box, Stack, Typography, Avatar, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFormikContext } from "formik";
import { uploadImageAction } from "@/app/lib/actions/upload";

export default function Step3Profile() {
  const { values, setFieldValue } = useFormikContext<{ avatarUrl: string }>();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const result = await uploadImageAction(base64String, "avatars", "register-flow");
        
        if (result.success) {
          setFieldValue("avatarUrl", result.url);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

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

      <Box sx={{ position: "relative", my: 2, cursor: "pointer" }} onClick={handleAvatarClick}>
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
        <Avatar
          src={values.avatarUrl || undefined}
          sx={{
            width: 120,
            height: 120,
            bgcolor: "rgba(255, 255, 255, 0.05)",
            border: "2px dashed rgba(255, 255, 255, 0.2)",
            position: "relative",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "#38bdf8",
              bgcolor: "rgba(56, 189, 248, 0.05)",
            }
          }}
        >
          {uploading ? (
            <CircularProgress size={40} sx={{ color: "#38bdf8" }} />
          ) : !values.avatarUrl && (
            <CloudUploadIcon sx={{ fontSize: 40, color: "rgba(255, 255, 255, 0.3)" }} />
          )}
        </Avatar>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1,
            color: uploading ? "#38bdf8" : "rgba(255, 255, 255, 0.5)",
            textAlign: "center",
          }}
        >
          {uploading ? "Uploading..." : values.avatarUrl ? "Change Photo" : "Upload Profile Picture"}
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

"use client";

import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import { toast } from "sonner";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

export default function ForgotPasswordPage() {
  const dict = useDictionary();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(dict.auth?.resetLinkSent || "Password reset link sent to your email!");
      setEmail("");
    }, 1500);
  };

  return (
    <Box>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your email address and we&apos;ll send you a link to reset your
            password.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </Stack>
        </form>

        <Box textAlign="center" mt={2}>
          <Button
            component={Link}
            href="/en/auth/sign-in"
            startIcon={<ArrowBack />}
            sx={{ textTransform: "none", color: "text.secondary" }}
          >
            Back to Sign In
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

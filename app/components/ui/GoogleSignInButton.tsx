"use client";

import {
  Box,
  Stack,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GoogleSignInButtonProps {
  onCredential: (idToken: string) => void | Promise<void>;
  onError?: () => void;
  disabled?: boolean;
}

// ─── Google multicolour "G" icon ──────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M47.532 24.552c0-1.636-.148-3.2-.422-4.701H24.48v8.884h12.948c-.558 3.007-2.25 5.556-4.795 7.268v6.044h7.764c4.542-4.183 7.135-10.34 7.135-17.495z" fill="#4285F4" />
      <path d="M24.48 48c6.504 0 11.955-2.156 15.94-5.853l-7.764-6.044c-2.153 1.446-4.908 2.3-8.176 2.3-6.286 0-11.61-4.245-13.517-9.953H3.012v6.24C6.98 42.87 15.164 48 24.48 48z" fill="#34A853" />
      <path d="M10.963 28.45A14.485 14.485 0 0 1 10.19 24c0-1.549.266-3.054.773-4.45v-6.24H3.012A23.98 23.98 0 0 0 .48 24c0 3.867.924 7.525 2.532 10.69l8.951-6.24z" fill="#FBBC05" />
      <path d="M24.48 9.597c3.543 0 6.723 1.218 9.226 3.61l6.92-6.92C36.43 2.39 30.979 0 24.48 0 15.164 0 6.98 5.13 3.012 13.31l7.951 6.24C12.87 13.842 18.194 9.597 24.48 9.597z" fill="#EA4335" />
    </svg>
  );
}

/**
 * GoogleSignInButton
 *
 * Architecture:
 * - A fully custom-styled button that matches the site's glassmorphism dark theme.
 * - Underneath, the real `<GoogleLogin>` component (id_token flow) is rendered
 *   off-screen. Clicking our custom button triggers a click on the hidden Google
 *   button so the popup opens and an id_token is returned — keeping the existing
 *   backend (which calls googleClient.verifyIdToken) working unchanged.
 */
export default function GoogleSignInButton({
  onCredential,
  onError,
  disabled,
}: GoogleSignInButtonProps) {
  const dict = useDictionary();
  const hiddenBtnRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      setIsLoading(false);
      onError?.();
      return;
    }
    try {
      await onCredential(response.credential);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    setIsLoading(false);
    onError?.();
  };

  const handleClick = () => {
    if (disabled || isLoading) return;
    setIsLoading(true);

    // Find and click the hidden Google button to open the OAuth popup
    const googleBtn = hiddenBtnRef.current?.querySelector<HTMLElement>("div[role=button]");
    if (googleBtn) {
      googleBtn.click();
    } else {
      // Fallback: click any button/iframe inside
      const anyBtn = hiddenBtnRef.current?.querySelector<HTMLElement>("button, [role=button]");
      anyBtn?.click();
      if (!anyBtn) setIsLoading(false);
    }
  };

  const continueWithGoogle = dict.auth.continueWithGoogle ?? "Continue with Google";

  return (
    <Stack spacing={2.5}>
      {/* ── OR divider ──────────────────────────────────────────────────── */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Divider sx={{ flex: 1, borderColor: "rgba(255,255,255,0.08)" }} />
        <Typography
          sx={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {dict.auth.orContinueWith}
        </Typography>
        <Divider sx={{ flex: 1, borderColor: "rgba(255,255,255,0.08)" }} />
      </Stack>

      {/* ── Custom Google button ─────────────────────────────────────────── */}
      <Box sx={{ position: "relative" }}>
        {/* Hidden real GoogleLogin — off-screen but interactive */}
        <Box
          ref={hiddenBtnRef}
          aria-hidden="true"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1,
            height: 1,
            overflow: "hidden",
            opacity: 0,
            pointerEvents: "none",
            zIndex: -1,
            "& > div": { width: "340px !important" },
            "& iframe": { width: "340px !important" },
          }}
        >
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            theme="filled_black"
            shape="pill"
            width={340}
            text="continue_with"
          />
        </Box>

        {/* Our custom-styled button */}
        <Box
          component="button"
          type="button"
          id="google-signin-btn"
          aria-label="Continue with Google"
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsPressed(false);
          }}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          disabled={disabled || isLoading}
          sx={{
            width: "100%",
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            position: "relative",
            cursor: disabled || isLoading ? "not-allowed" : "pointer",
            border: "none",
            borderRadius: "14px",
            overflow: "hidden",
            outline: "none",
            p: 0,
            // Glassmorphism base
            background:
              isHovered && !disabled && !isLoading
                ? "linear-gradient(135deg, rgba(56,189,248,0.10) 0%, rgba(99,102,241,0.07) 100%)"
                : "rgba(255,255,255,0.04)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            // Border glow
            boxShadow:
              isHovered && !disabled && !isLoading
                ? [
                    "0 0 0 1px rgba(56,189,248,0.45)",
                    "0 4px 24px rgba(56,189,248,0.12)",
                    "inset 0 1px 0 rgba(255,255,255,0.10)",
                  ].join(", ")
                : [
                    "0 0 0 1px rgba(255,255,255,0.09)",
                    "0 2px 12px rgba(0,0,0,0.35)",
                    "inset 0 1px 0 rgba(255,255,255,0.05)",
                  ].join(", "),
            transform: isPressed
              ? "scale(0.97)"
              : isHovered
                ? "translateY(-1px)"
                : "none",
            opacity: disabled ? 0.4 : 1,
            transition: [
              "background 0.22s ease",
              "box-shadow 0.22s ease",
              "transform 0.15s ease",
              "opacity 0.2s ease",
            ].join(", "),
          }}
        >
          {/* Top shimmer line */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "20%",
              right: "20%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
              pointerEvents: "none",
            }}
          />

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <CircularProgress
                  size={18}
                  thickness={5}
                  sx={{ color: "#38bdf8" }}
                />
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: "13.5px",
                    fontWeight: 500,
                  }}
                >
                  Connecting…
                </Typography>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                {/* Google "G" icon badge */}
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isHovered
                      ? "rgba(255,255,255,0.13)"
                      : "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    flexShrink: 0,
                    transition: "background 0.22s ease",
                  }}
                >
                  <GoogleIcon />
                </Box>

                <Typography
                  sx={{
                    color: isHovered ? "#fff" : "rgba(255,255,255,0.72)",
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.005em",
                    userSelect: "none",
                    transition: "color 0.22s ease",
                  }}
                >
                  {continueWithGoogle}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Stack>
  );
}

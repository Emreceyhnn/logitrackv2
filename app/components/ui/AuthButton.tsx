"use client";

import { Button, ButtonProps, CircularProgress, Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

interface AuthButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

const AuthButton = ({
  children,
  loading = false,
  loadingText,
  disabled,
  sx,
  ...props
}: AuthButtonProps) => {
  return (
    <Button
      fullWidth
      variant="contained"
      disabled={loading || disabled}
      sx={{
        height: 52,
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 700,
        fontSize: "0.95rem",
        position: "relative",
        overflow: "hidden",
        bgcolor: "theme.palette.primary.main",
        "&:hover": {
          bgcolor: "theme.palette.primary.dark",
        },
        "&.Mui-disabled": {
          bgcolor: "theme.palette.primary._alpha.main_50",
          color: "theme.palette.common.white_alpha.main_50",
        },
        boxShadow: `0 8px 16px theme.palette.primary._alpha.main_25`,
        transition: "all 0.2s ease-in-out",
        ...sx,
      }}
      {...props}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <CircularProgress
              size={20}
              thickness={5}
              sx={{ color: "inherit" }}
            />
            {loadingText && (
              <Box
                component="span"
                sx={{ fontSize: "0.9rem", fontWeight: 600 }}
              >
                {loadingText}
              </Box>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};

export default AuthButton;

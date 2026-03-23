"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Stack,
  alpha,
  Button,
  CircularProgress,
  useTheme,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useState } from "react";

interface DocumentViewerDialogProps {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
  fileType?: string;
}

export default function DocumentViewerDialog({
  open,
  onClose,
  url,
  title,
  fileType,
}: DocumentViewerDialogProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Determine if it's likely a PDF or Image based on URL if fileType not provided
  const isPdf =
    fileType?.toLowerCase().includes("pdf") ||
    url.toLowerCase().endsWith(".pdf") ||
    url.includes("/raw/upload/") === false;

  // Use a key to force reset state when URL changes
  const viewerKey = `${url}-${open}`;

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        backdrop: {
          sx: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#0B1019",
          backgroundImage: "none",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 2.5,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          bgcolor: alpha("#0B1019", 0.8),
          backdropFilter: "blur(10px)",
          zIndex: 10,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 1,
                borderRadius: 1.5,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                display: "flex",
              }}
            >
              <FileOpenIcon fontSize="small" />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ color: "white", lineHeight: 1.2 }}
              >
                {title}
              </Typography>
              <Typography variant="caption" sx={{ color: alpha("#fff", 0.5) }}>
                {isPdf ? "PDF Document" : "Image File"}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5}>
            <Tooltip title="Open in New Tab">
              <IconButton
                component="a"
                href={url}
                target="_blank"
                size="small"
                sx={{
                  color: alpha("#fff", 0.7),
                  border: `1px solid ${alpha("#fff", 0.1)}`,
                  "&:hover": {
                    color: "primary.main",
                    borderColor: "primary.main",
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Download File">
              <IconButton
                component="a"
                href={url}
                download
                target="_blank"
                size="small"
                sx={{
                  color: alpha("#fff", 0.7),
                  border: `1px solid ${alpha("#fff", 0.1)}`,
                  "&:hover": {
                    color: "success.main",
                    borderColor: "success.main",
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                  },
                }}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: alpha("#fff", 0.7),
                "&:hover": {
                  color: "error.main",
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          bgcolor: "#05070A",
          overflow: "hidden",
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#05070A",
              zIndex: 5,
            }}
          >
            <CircularProgress color="primary" size={32} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ opacity: 0.7 }}
            >
              Securely loading document...
            </Typography>
          </Box>
        )}

        {error && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#05070A",
              zIndex: 6,
              p: 4,
              textAlign: "center",
            }}
          >
            <ErrorOutlineIcon
              sx={{ fontSize: 64, color: alpha(theme.palette.error.main, 0.5) }}
            />
            <Box>
              <Typography variant="h6" color="white" gutterBottom>
                Preview Unavailable
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 400 }}
              >
                High-security documents or specific file formats may not be
                visible in the embedded browser viewer.
              </Typography>
            </Box>
            <Button
              variant="contained"
              component="a"
              href={url}
              target="_blank"
              startIcon={<VisibilityIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 4,
                boxShadow: theme.shadows[10],
              }}
            >
              Open in Secure Viewer
            </Button>
          </Box>
        )}

        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {isPdf ? (
            <iframe
              key={viewerKey}
              src={url}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              onLoad={handleLoad}
              onError={handleError}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
              }}
            >
              <Box
                component="img"
                src={url}
                alt={title}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))",
                  borderRadius: 2,
                }}
                onLoad={handleLoad}
                onError={handleError}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

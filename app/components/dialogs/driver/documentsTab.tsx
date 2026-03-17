import {
  alpha,
  Box,
  Card,
  Stack,
  Typography,
  IconButton,
  useTheme,
  Grid,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { toast } from "sonner";
import { useState } from "react";
import { getSignedUrlAction } from "@/app/lib/actions/upload";
import DocumentViewerDialog from "../shared/DocumentViewerDialog";

import { DriverWithRelations } from "@/app/lib/type/driver";

interface DocumentsTabProps {
  driver?: DriverWithRelations;
}

const DocumentsTab = ({ driver }: DocumentsTabProps) => {
  const theme = useTheme();

  /* --------------------------------- states --------------------------------- */
  const [viewerOpen, setViewerOpen] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{
    url: string;
    title: string;
  } | null>(null);

  if (!driver) {
    return <Typography color="text.secondary">No driver selected</Typography>;
  }

  const hasValidLicense =
    driver.licenseNumber &&
    driver.licenseExpiry &&
    new Date(driver.licenseExpiry) > new Date();

  /* -------------------------------- handlers -------------------------------- */
  const handleViewDoc = async (url: string, title: string) => {
    if (!url) {
      toast.error("Document link not found");
      return;
    }

    try {
      setLoadingDoc(true);
      const result = await getSignedUrlAction(url);
      if (result.success && result.url) {
        setSelectedDoc({ url: result.url, title });
        setViewerOpen(true);
      } else {
        toast.error("Failed to get file access permission");
      }
    } catch (error) {
      console.error("View doc error:", error);
      toast.error("An error occurred while loading the file");
    } finally {
      setLoadingDoc(false);
    }
  };

  return (
    <Stack
      spacing={3}
      sx={{
        overflowY: "auto",
        maxHeight: 450,
        pr: 1,
        "&::-webkit-scrollbar": {
          width: 6,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: alpha(theme.palette.background.paper, 0.1),
          borderRadius: 4,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: alpha(theme.palette.text.secondary, 0.2),
          borderRadius: 4,
          "&:hover": {
            backgroundColor: alpha(theme.palette.text.secondary, 0.4),
          },
        },
      }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: alpha(
                hasValidLicense
                  ? theme.palette.success.main
                  : theme.palette.error.main,
                0.05
              ),
              border: `1px solid ${alpha(
                hasValidLicense
                  ? theme.palette.success.main
                  : theme.palette.error.main,
                0.2
              )}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              height: "100%",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: alpha(
                  hasValidLicense
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  0.1
                ),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: hasValidLicense ? "success.main" : "error.main",
              }}
            >
              {hasValidLicense ? (
                <CheckCircleOutlineIcon fontSize="medium" />
              ) : (
                <ErrorOutlineIcon fontSize="medium" />
              )}
            </Box>
            <Stack alignItems="center" spacing={0.5}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                License Status
              </Typography>
              <Typography
                variant="h6"
                fontWeight={700}
                color={hasValidLicense ? "success.main" : "error.main"}
              >
                {hasValidLicense ? "Compliant" : "Action Required"}
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  display: "flex",
                }}
              >
                <InsertDriveFileOutlinedIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} color="white">
                Official Documents
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              {driver.documents && driver.documents.length > 0 ? (
                driver.documents.map((doc) => (
                  <Stack
                    key={doc.id}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.background.paper, 0.3),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        display: "flex",
                      }}
                    >
                      <InsertDriveFileOutlinedIcon />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color="white"
                        noWrap
                      >
                        {doc.name} - {doc.type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {doc.expiryDate
                          ? `Expiry: ${new Date(doc.expiryDate).toLocaleDateString()}`
                          : "No expiry date"}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDoc(doc.url, doc.name);
                        }}
                        sx={{
                          color: theme.palette.primary.main,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                          },
                        }}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        component="a"
                        href={doc.url}
                        target="_blank"
                        sx={{
                          color: theme.palette.primary.main,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                          },
                        }}
                      >
                        <FileDownloadOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>
                ))
              ) : (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.error.main, 0.05),
                    border: `1px dashed ${alpha(theme.palette.error.main, 0.2)}`,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                  }}
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    color="error"
                    sx={{ mt: 0.2 }}
                  />
                  <Box>
                    <Typography variant="body2" color="white" fontWeight={600}>
                      No Documents Uploaded
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      This driver does not have any official documents registered in the system.
                    </Typography>
                  </Box>
                </Box>
              )}
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingDoc}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {selectedDoc && (
        <DocumentViewerDialog
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
          url={selectedDoc.url}
          title={selectedDoc.title}
        />
      )}
    </Stack>
  );
};

export default DocumentsTab;

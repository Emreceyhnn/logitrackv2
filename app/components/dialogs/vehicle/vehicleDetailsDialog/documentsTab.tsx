"use client";

import {
  Box,
  Button,
  Card,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  alpha,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import WarningIcon from "@mui/icons-material/Warning";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "sonner";
import { getSignedUrlAction } from "@/app/lib/actions/upload";
import { deleteDocument } from "@/app/lib/controllers/documents";
import { StatusChip } from "../../../chips/statusChips";
import { VehicleWithRelations } from "@/app/lib/type/vehicle";
import { useState } from "react";
import UploadDocumentDialog from "../uploadDocumentDialog";
import DocumentViewerDialog from "../../shared/DocumentViewerDialog";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import {
  Dialog as ConfirmDialog,
  DialogContent as ConfirmDialogContent,
} from "@mui/material";

interface DocumentsTabProps {
  vehicle?: VehicleWithRelations;
  onUpdate?: () => void;
}

const DocumentsTab = ({ vehicle, onUpdate }: DocumentsTabProps) => {
  const theme = useTheme();
  /* --------------------------------- states --------------------------------- */
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeletingDoc, setIsDeletingDoc] = useState(false);

  if (!vehicle) {
    return <Typography color="text.secondary">No vehicle selected</Typography>;
  }

  /* -------------------------------- handlers -------------------------------- */
  const handleUploadSuccess = () => {
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleViewDoc = async (url: string, title: string) => {
    if (!url) {
      toast.error("Döküman bağlantısı bulunamadı");
      return;
    }

    try {
      setLoadingDoc(true);
      const result = await getSignedUrlAction(url);
      if (result.success && result.url) {
        setSelectedDoc({ url: result.url, title });
        setViewerOpen(true);
      } else {
        toast.error("Dosya erişim yetkisi alınamadı");
      }
    } catch (error) {
      console.error("View doc error:", error);
      toast.error("Dosya yüklenirken bir hata oluştu");
    } finally {
      setLoadingDoc(false);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDocToDelete({ id, name });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!docToDelete) return;
    try {
      setIsDeletingDoc(true);
      await deleteDocument(docToDelete.id);
      toast.success("Döküman başarıyla silindi");
      setDeleteConfirmOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error("Delete doc error:", error);
      toast.error("Döküman silinirken bir hata oluştu");
    } finally {
      setIsDeletingDoc(false);
      setDocToDelete(null);
    }
  };

  /* -------------------------------- variables ------------------------------- */
  const now = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(now.getMonth() + 1);

  const activeCount = vehicle.documents.filter(
    (d) => d.expiryDate && new Date(d.expiryDate) > now
  ).length;

  const expiringSoonCount = vehicle.documents.filter((d) => {
    if (!d.expiryDate) return false;
    const expiry = new Date(d.expiryDate);
    return expiry > now && expiry <= oneMonthLater;
  }).length;

  const missingOrExpiredCount = vehicle.documents.filter((d) => {
    if (!d.expiryDate) return true;
    const expiry = new Date(d.expiryDate);
    return expiry <= now;
  }).length;

  const lastUploadDate = vehicle.documents.reduce((latest, d) => {
    const created = new Date(d.createdAt); // Use createdAt for last upload
    return created > latest ? created : latest;
  }, new Date(0));

  return (
    <>
      <Stack
        spacing={2}
        direction={"row"}
        maxHeight={450}
        height={"100%"}
        alignItems={"start"}
      >
        <Stack spacing={2} sx={{ flexGrow: 1 }}>
          <Stack spacing={2} direction={"row"}>
            <Card
              sx={{
                p: 2,
                borderRadius: "8px",
                width: "100%",
                gap: 2,
                bgcolor: alpha("#1A202C", 0.5),
                backgroundImage: "none",
                boxShadow: "none",
                border: `1px solid ${alpha("#ffffff", 0.05)}`,
              }}
            >
              <Box
                sx={{
                  borderRadius: "8px",
                  bgcolor: "success.main",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <CheckCircleIcon sx={{ width: 18, height: 19 }} />
              </Box>
              <Typography sx={{ fontSize: 22, color: "text.secondary" }}>
                Active
              </Typography>
              <Typography
                sx={{ fontSize: 18, marginTop: "auto", color: "white" }}
              >
                {activeCount}
              </Typography>
            </Card>
            <Card
              sx={{
                p: 2,
                borderRadius: "8px",
                width: "100%",
                gap: 2,
                bgcolor: alpha("#1A202C", 0.5),
                backgroundImage: "none",
                boxShadow: "none",
                border: `1px solid ${alpha("#ffffff", 0.05)}`,
              }}
            >
              <Box
                sx={{
                  borderRadius: "8px",
                  bgcolor: "warning.main",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <QueryBuilderIcon sx={{ width: 18, height: 19 }} />
              </Box>
              <Typography sx={{ fontSize: 22, color: "text.secondary" }}>
                Expiring
              </Typography>
              <Typography
                sx={{ fontSize: 18, marginTop: "auto", color: "white" }}
              >
                {expiringSoonCount}
              </Typography>
            </Card>
          </Stack>
          <Stack spacing={2} direction={"row"}>
            <Card
              sx={{
                p: 2,
                borderRadius: "8px",
                width: "100%",
                gap: 2,
                bgcolor: alpha("#1A202C", 0.5),
                backgroundImage: "none",
                boxShadow: "none",
                border: `1px solid ${alpha("#ffffff", 0.05)}`,
              }}
            >
              <Box
                sx={{
                  borderRadius: "8px",
                  bgcolor: "error.main",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <WarningIcon sx={{ width: 18, height: 19 }} />
              </Box>
              <Typography sx={{ fontSize: 22, color: "text.secondary" }}>
                Missing
              </Typography>
              <Typography
                sx={{ fontSize: 18, marginTop: "auto", color: "white" }}
              >
                {missingOrExpiredCount}
              </Typography>
            </Card>
            <Card
              sx={{
                p: 2,
                borderRadius: "8px",
                width: "100%",
                gap: 2,
                bgcolor: alpha("#1A202C", 0.5),
                backgroundImage: "none",
                boxShadow: "none",
                border: `1px solid ${alpha("#ffffff", 0.05)}`,
              }}
            >
              <Box
                sx={{
                  borderRadius: "8px",
                  bgcolor: "info.main",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <FileUploadIcon sx={{ width: 18, height: 19 }} />
              </Box>
              <Typography sx={{ fontSize: 22, color: "text.secondary" }}>
                Upload
              </Typography>
              <Typography
                sx={{ fontSize: 18, marginTop: "auto", color: "white" }}
              >
                {lastUploadDate.getTime() > 0
                  ? lastUploadDate.toLocaleDateString()
                  : "N/A"}
              </Typography>
            </Card>
          </Stack>
          <Button
            variant="contained"
            sx={{
              borderRadius: "8px",
              bgcolor: "#246BFD",
              textTransform: "none",
              "&:hover": { bgcolor: alpha("#246BFD", 0.9) },
            }}
            onClick={() => setUploadDialogOpen(true)}
            startIcon={<FileUploadIcon />}
          >
            Upload New Document
          </Button>
        </Stack>
        <Stack sx={{ flexGrow: 2 }}>
          <Card
            sx={{
              p: 2,
              borderRadius: "8px",
              gap: 2,
              bgcolor: alpha("#1A202C", 0.5),
              backgroundImage: "none",
              boxShadow: "none",
              border: `1px solid ${alpha("#ffffff", 0.05)}`,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      borderBottomColor: alpha("#ffffff", 0.05),
                    }}
                  >
                    Document Type
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      borderBottomColor: alpha("#ffffff", 0.05),
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      borderBottomColor: alpha("#ffffff", 0.05),
                    }}
                  >
                    Expiry Date
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "text.secondary",
                      borderBottomColor: alpha("#ffffff", 0.05),
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {vehicle.documents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ borderBottom: "none" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No documents found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  vehicle.documents.map((v, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:hover": { bgcolor: alpha("#ffffff", 0.02) },
                      }}
                      onClick={() => handleViewDoc(v.url, v.name)}
                    >
                      <TableCell
                        sx={{ borderBottomColor: alpha("#ffffff", 0.05) }}
                      >
                        <Stack>
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "white",
                            }}
                          >
                            {v.type}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                            sx={{ maxWidth: 150 }}
                          >
                            {v.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{ borderBottomColor: alpha("#ffffff", 0.05) }}
                      >
                        <StatusChip status={v.status} />
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          borderBottomColor: alpha("#ffffff", 0.05),
                        }}
                      >
                        {v.expiryDate
                          ? new Date(v.expiryDate).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderBottomColor: alpha("#ffffff", 0.05) }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDoc(v.url, v.name);
                            }}
                          >
                            <VisibilityIcon sx={{ width: 20, height: 20 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="secondary"
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            disabled={!v.url}
                          >
                            <DownloadIcon sx={{ width: 20, height: 20 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(v.id, v.name);
                            }}
                            sx={{
                              color: alpha(theme.palette.error.main, 0.7),
                              "&:hover": {
                                color: theme.palette.error.main,
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                              },
                            }}
                          >
                            <DeleteIcon sx={{ width: 20, height: 20 }} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </Stack>
      </Stack>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => !isDeletingDoc && setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            bgcolor: "#0B1019",
            backgroundImage: "none",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          },
        }}
      >
        <Box sx={{ p: 3, pb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                p: 1.25,
                borderRadius: 2,
                display: "flex",
              }}
            >
              <WarningIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} color="white">
                Delete Document?
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: alpha("#fff", 0.4), mt: 0.5, display: "block" }}
              >
                This action cannot be undone.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <ConfirmDialogContent sx={{ p: 3, pt: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            Are you sure you want to delete <strong>{docToDelete?.name}</strong>?
            The file and its metadata will be permanently removed.
          </Typography>
        </ConfirmDialogContent>

        <Box
          sx={{
            p: 3,
            pt: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
          }}
        >
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isDeletingDoc}
              sx={{
                color: "text.secondary",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              disabled={isDeletingDoc}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                boxShadow: `0 8px 24px ${alpha(theme.palette.error.main, 0.2)}`,
                fontWeight: 700,
                minWidth: 100,
              }}
            >
              {isDeletingDoc ? "Deleting..." : "Delete"}
            </Button>
          </Stack>
        </Box>
      </ConfirmDialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingDoc}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <UploadDocumentDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        vehicleId={vehicle.id}
        onSuccess={handleUploadSuccess}
      />

      {selectedDoc && (
        <DocumentViewerDialog
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
          url={selectedDoc.url}
          title={selectedDoc.title}
        />
      )}
    </>
  );
};

export default DocumentsTab;

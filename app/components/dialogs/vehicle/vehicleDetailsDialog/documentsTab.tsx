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
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { getSignedUrlAction } from "@/app/lib/actions/upload";
import { deleteDocument } from "@/app/lib/controllers/documents";
import { StatusChip } from "../../../chips/statusChips";
import { VehicleWithRelations } from "@/app/lib/type/vehicle";
import { useState } from "react";
import UploadDocumentDialog from "../uploadDocumentDialog";
import DocumentViewerDialog from "../../shared/DocumentViewerDialog";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import DeleteConfirmationDialog from "../../deleteConfirmationDialog";

interface DocumentsTabProps {
  vehicle?: VehicleWithRelations;
  onUpdate?: () => void;
}

const DocumentsTab = ({ vehicle, onUpdate }: DocumentsTabProps) => {
  const theme = useTheme();
  const dict = useDictionary();
  /* --------------------------------- states --------------------------------- */
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeletingDoc, setIsDeletingDoc] = useState(false);

  if (!vehicle) {
    return <Typography color="text.secondary">{dict.common.noData}</Typography>;
  }

  /* -------------------------------- handlers -------------------------------- */
  const handleUploadSuccess = () => {
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleViewDoc = async (url: string, title: string) => {
    if (!url) {
      toast.error(dict.toasts.errorNoConnection);
      return;
    }

    try {
      setLoadingDoc(true);
      const result = await getSignedUrlAction(url);
      if (result.success && result.url) {
        setSelectedDoc({ url: result.url, title });
        setViewerOpen(true);
      } else {
        toast.error(dict.toasts.errorNoPermission);
      }
    } catch (error) {
      console.error("View doc error:", error);
      toast.error(dict.toasts.errorUpload);
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
      toast.success(dict.toasts.successDocumentDelete);
      setDeleteConfirmOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error("Delete doc error:", error);
      toast.error(dict.toasts.errorDocumentDelete);
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
                bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                backgroundImage: "none",
                boxShadow: "none",
                border: `1px solid ${theme.palette.divider}`,
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
                {dict.common.active}
              </Typography>
              <Typography
                sx={{ fontSize: 18, marginTop: "auto", color: "text.primary", fontWeight: 800 }}
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
                bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                backgroundImage: "none",
                boxShadow: "none",
                border: `1px solid ${theme.palette.divider}`,
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
                {dict.common.expiring}
              </Typography>
              <Typography
                sx={{ fontSize: 18, marginTop: "auto", color: "text.primary", fontWeight: 800 }}
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
                bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                backgroundImage: "none",
                boxShadow: "none",
                border: `1px solid ${theme.palette.divider}`,
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
                {dict.common.missing}
              </Typography>
              <Typography
                sx={{ fontSize: 18, marginTop: "auto", color: "text.primary", fontWeight: 800 }}
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
                bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                backgroundImage: "none",
                boxShadow: "none",
                border: `1px solid ${theme.palette.divider}`,
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
                {dict.common.upload}
              </Typography>
              <Typography
                sx={{ fontSize: 18, marginTop: "auto", color: "text.primary", fontWeight: 800 }}
              >
                {lastUploadDate.getTime() > 0
                  ? lastUploadDate.toLocaleDateString()
                  : dict.common.na}
              </Typography>
            </Card>
          </Stack>
          <Button
            variant="contained"
            sx={{
              borderRadius: "8px",
              bgcolor: "#246BFD",
              textTransform: "none",
              "&:hover": { bgcolor: theme.palette.primary._alpha.main_90 },
            }}
            onClick={() => setUploadDialogOpen(true)}
            startIcon={<FileUploadIcon />}
          >
            {dict.common.uploadNew}
          </Button>
        </Stack>
        <Stack sx={{ flexGrow: 2 }}>
          <Card
            sx={{
              p: 2,
              borderRadius: "8px",
              gap: 2,
              bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
              backgroundImage: "none",
              boxShadow: "none",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      borderBottomColor: "divider",
                    }}
                  >
                    {dict.common.docType}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      borderBottomColor:
                        theme.palette.common.white_alpha.main_05,
                    }}
                  >
                    {dict.common.status}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      borderBottomColor:
                        theme.palette.common.white_alpha.main_05,
                    }}
                  >
                    {dict.common.expiryDate}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "text.secondary",
                      borderBottomColor:
                        theme.palette.common.white_alpha.main_05,
                    }}
                  >
                    {dict.common.actions}
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
                        {dict.common.noDocuments}
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
                        "&:hover": {
                          bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                        },
                      }}
                      onClick={() => handleViewDoc(v.url, v.name)}
                    >
                      <TableCell
                        sx={{
                          borderBottomColor: "divider",
                        }}
                      >
                        <Stack>
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "text.primary",
                            }}
                          >
                            {dict.vehicles.docTypes[
                              v.type as keyof typeof dict.vehicles.docTypes
                            ] || v.type}
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
                        sx={{
                          borderBottomColor: "divider",
                        }}
                      >
                        <StatusChip status={v.status} />
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "text.primary",
                          fontWeight: 600,
                          borderBottomColor: "divider",
                        }}
                      >
                        {v.expiryDate
                          ? new Date(v.expiryDate).toLocaleDateString()
                          : dict.common.na}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          borderBottomColor: "divider",
                        }}
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
                              color: theme.palette.error._alpha.main_70,
                              "&:hover": {
                                color: theme.palette.error.main,
                                bgcolor: theme.palette.error._alpha.main_10,
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
      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        onClose={() => !isDeletingDoc && setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={dict.common.deleteDocumentTitle}
        description={dict.common.deleteDocumentDesc}
        loading={isDeletingDoc}
      />

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

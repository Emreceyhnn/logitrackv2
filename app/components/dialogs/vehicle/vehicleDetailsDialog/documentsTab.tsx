"use client";

import { Stack, Typography, CircularProgress, Backdrop } from "@mui/material";
import { toast } from "sonner";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { getSignedUrlAction } from "@/app/lib/actions/upload";
import { deleteDocument } from "@/app/lib/controllers/documents";
import { VehicleWithRelations } from "@/app/lib/type/vehicle";
import { useState } from "react";
import UploadDocumentDialog from "../uploadDocumentDialog";
import DocumentViewerDialog from "../../shared/DocumentViewerDialog";
import { useDateSettings } from "@/app/hooks/useDateSettings";
import DeleteConfirmationDialog from "../../deleteConfirmationDialog";
import { logger } from "@/app/lib/logger";

import DocumentStatsCards from "./sections/DocumentStatsCards";
import DocumentTable from "./sections/DocumentTable";

interface DocumentsTabProps {
  vehicle?: VehicleWithRelations | undefined;
  onUpdate?: (() => void) | undefined;
}

const DocumentsTab = ({ vehicle, onUpdate }: DocumentsTabProps) => {
  const dict = useDictionary();
  const dateSettings = useDateSettings();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{ url: string; title: string; } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<{ id: string; name: string; } | null>(null);
  const [isDeletingDoc, setIsDeletingDoc] = useState(false);

  if (!vehicle) return <Typography color="text.secondary">{dict.common.noData}</Typography>;

  const handleUploadSuccess = () => {
    if (onUpdate) onUpdate();
  };

  const handleViewDoc = async (url: string, title: string) => {
    if (!url) return toast.error(dict.toasts.errorNoConnection);
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
      logger.error("View doc error:", error);
      toast.error(dict.toasts.errorUpload);
    } finally {
      setLoadingDoc(false);
    }
  };

  const handleDownloadDoc = async (url: string) => {
    if (!url) return toast.error(dict.toasts.errorNoConnection);
    try {
      const result = await getSignedUrlAction(url);
      if (result.success && result.url) {
        window.open(result.url, "_blank", "noopener,noreferrer");
      } else {
        toast.error(dict.toasts.errorNoPermission);
      }
    } catch (error) {
      logger.error("Download doc error:", error);
      toast.error(dict.toasts.errorUpload);
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
      logger.error("Delete doc error:", error);
      toast.error(dict.toasts.errorDocumentDelete);
    } finally {
      setIsDeletingDoc(false);
      setDocToDelete(null);
    }
  };

  const now = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(now.getMonth() + 1);

  const activeCount = vehicle.documents.filter((d) => d.expiryDate && new Date(d.expiryDate) > now).length;
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
    const created = new Date(d.createdAt);
    return created > latest ? created : latest;
  }, new Date(0));

  return (
    <>
      <Stack spacing={2} direction={"row"} maxHeight={450} height={"100%"} alignItems={"start"}>
        <DocumentStatsCards
          dict={dict}
          dateSettings={dateSettings}
          activeCount={activeCount}
          expiringSoonCount={expiringSoonCount}
          missingOrExpiredCount={missingOrExpiredCount}
          lastUploadDate={lastUploadDate}
          onUploadClick={() => setUploadDialogOpen(true)}
        />
        <DocumentTable
          dict={dict}
          dateSettings={dateSettings}
          documents={vehicle.documents}
          onViewDoc={handleViewDoc}
          onDownloadDoc={handleDownloadDoc}
          onDeleteClick={handleDeleteClick}
        />
      </Stack>
      <DeleteConfirmationDialog open={deleteConfirmOpen} onClose={() => !isDeletingDoc && setDeleteConfirmOpen(false)} onConfirm={handleConfirmDelete} title={dict.common.deleteDocumentTitle} description={dict.common.deleteDocumentDesc} loading={isDeletingDoc} />
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loadingDoc}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <UploadDocumentDialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} vehicleId={vehicle.id} onSuccess={handleUploadSuccess} />
      {selectedDoc && <DocumentViewerDialog open={viewerOpen} onClose={() => setViewerOpen(false)} url={selectedDoc.url} title={selectedDoc.title} />}
    </>
  );
};

export default DocumentsTab;

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
  Link,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import WarningIcon from "@mui/icons-material/Warning";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import { StatusChip } from "../../../chips/statusChips";
import { VehicleWithRelations } from "@/app/lib/type/vehicle";
import { useState } from "react";
import UploadDocumentDialog from "../uploadDocumentDialog";

interface DocumentsTabProps {
  vehicle?: VehicleWithRelations;
  onUpdate?: () => void;
}

const DocumentsTab = ({ vehicle, onUpdate }: DocumentsTabProps) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  if (!vehicle) {
    return <Typography color="text.secondary">No vehicle selected</Typography>;
  }

  const handleUploadSuccess = () => {
    if (onUpdate) {
      onUpdate();
    }
  };

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
                }}
              >
                <CheckCircleIcon sx={{ width: 18, height: 19 }} />
              </Box>
              <Typography sx={{ fontSize: 22 }}>Active</Typography>
              <Typography sx={{ fontSize: 18, marginTop: "auto" }}>
                {activeCount}
              </Typography>
            </Card>
            <Card
              sx={{
                p: 2,
                borderRadius: "8px",
                width: "100%",
                gap: 2,
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
                }}
              >
                <QueryBuilderIcon sx={{ width: 18, height: 19 }} />
              </Box>
              <Typography sx={{ fontSize: 22 }}>Expiring Soon</Typography>
              <Typography sx={{ fontSize: 18, marginTop: "auto" }}>
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
                }}
              >
                <WarningIcon sx={{ width: 18, height: 19 }} />
              </Box>
              <Typography sx={{ fontSize: 22 }}>Missing / Expired</Typography>
              <Typography sx={{ fontSize: 18, marginTop: "auto" }}>
                {missingOrExpiredCount}
              </Typography>
            </Card>
            <Card
              sx={{
                p: 2,
                borderRadius: "8px",
                width: "100%",
                gap: 2,
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
                }}
              >
                <FileUploadIcon sx={{ width: 18, height: 19 }} />
              </Box>
              <Typography sx={{ fontSize: 22 }}>Last Upload</Typography>
              <Typography sx={{ fontSize: 18, marginTop: "auto" }}>
                {lastUploadDate.getTime() > 0
                  ? lastUploadDate.toLocaleDateString()
                  : "N/A"}
              </Typography>
            </Card>
          </Stack>
          <Button
            variant="contained"
            sx={{ borderRadius: "8px" }}
            onClick={() => setUploadDialogOpen(true)}
            startIcon={<FileUploadIcon />}
          >
            Upload New Document
          </Button>
        </Stack>
        <Stack sx={{ flexGrow: 2 }}>
          <Card sx={{ p: 2, borderRadius: "8px", gap: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Document Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell>Download</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {vehicle.documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No documents found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  vehicle.documents.map((v, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Stack>
                          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
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
                      <TableCell>
                        <StatusChip status={v.status} />
                      </TableCell>
                      <TableCell>
                        {v.expiryDate
                          ? new Date(v.expiryDate).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          href={v.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          disabled={!v.url}
                        >
                          <DownloadIcon sx={{ width: 20, height: 20 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </Stack>
      </Stack>

      <UploadDocumentDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        vehicleId={vehicle.id}
        onSuccess={handleUploadSuccess}
      />
    </>
  );
};

export default DocumentsTab;

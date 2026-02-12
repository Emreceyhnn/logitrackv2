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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import WarningIcon from "@mui/icons-material/Warning";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { StatusChip } from "../../chips/statusChips";
import { VehicleWithRelations } from "@/app/lib/type/vehicle";

interface OverviewTabProps {
  vehicle?: VehicleWithRelations;
}

const DocumentsTab = ({ vehicle }: OverviewTabProps) => {
  if (!vehicle) {
    return <Typography color="text.secondary">No vehicle selected</Typography>;
  }

  const now = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(now.getMonth() + 1);

  const activeCount = vehicle.documents.filter(
    (d) => d.expiryDate && d.expiryDate > now
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
    if (!d.expiryDate) return latest;

    const expiry = new Date(d.expiryDate);

    return expiry > latest ? expiry : latest;
  }, new Date(0));

  return (
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
              {lastUploadDate.toLocaleDateString()}
            </Typography>
          </Card>
        </Stack>
        <Button variant="contained" sx={{ borderRadius: "8px" }}>
          Upload New Document
        </Button>
      </Stack>
      <Stack>
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
              {(vehicle.documents || []).map((v, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography sx={{ fontSize: 12 }}>{v.type}</Typography>
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
                    <IconButton sx={{ bgcolor: "success.main" }}>
                      <FileUploadIcon sx={{ width: 15, height: 15 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Stack>
    </Stack>
  );
};

export default DocumentsTab;

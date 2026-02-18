import {
  Box,
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
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { DriverWithRelations } from "@/app/lib/type/driver";

interface DocumentsTabProps {
  driver?: DriverWithRelations;
}

const DocumentsTab = ({ driver }: DocumentsTabProps) => {
  if (!driver) {
    return <Typography color="text.secondary">No driver selected</Typography>;
  }

  const hasValidLicense =
    driver.licenseNumber &&
    driver.licenseExpiry &&
    new Date(driver.licenseExpiry) > new Date();

  return (
    <Stack
      spacing={2}
      direction={"row"}
      maxHeight={450}
      height={"100%"}
      justifyContent={"space-center"}
    >
      <Stack spacing={2} minWidth={300}>
        <Stack spacing={2} direction={"row"}>
          <Card
            sx={{
              p: 2,
              borderRadius: "8px",
              width: "100%",
              gap: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                borderRadius: "8px",
                bgcolor: hasValidLicense ? "success.main" : "error.main",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircleIcon sx={{ width: 18, height: 19, color: "white" }} />
            </Box>
            <Typography sx={{ fontSize: 22 }}>License Status</Typography>
            <Typography sx={{ fontSize: 18, marginTop: "auto" }}>
              {hasValidLicense ? "Valid" : "Expired / Missing"}
            </Typography>
          </Card>
        </Stack>
        {/* Upload functionality coming soon */}
        {/* <Button variant="contained" sx={{ borderRadius: "8px" }}>
          Upload New Document
        </Button> */}
      </Stack>
      <Stack flexGrow={1}>
        <Card sx={{ p: 2, borderRadius: "8px", gap: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>License Type</TableCell>
                <TableCell>Number</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Download</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {driver.licenseNumber ? (
                <TableRow>
                  <TableCell>
                    <Typography sx={{ fontSize: 12 }}>
                      {driver.licenseType}
                    </Typography>
                  </TableCell>
                  <TableCell>{driver.licenseNumber}</TableCell>
                  <TableCell>
                    {driver.licenseExpiry
                      ? new Date(driver.licenseExpiry).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      sx={{
                        bgcolor: "success.main",
                        color: "white",
                        "&:hover": { bgcolor: "success.dark" },
                      }}
                    >
                      <FileUploadIcon sx={{ width: 15, height: 15 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No license information available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </Stack>
    </Stack>
  );
};

export default DocumentsTab;

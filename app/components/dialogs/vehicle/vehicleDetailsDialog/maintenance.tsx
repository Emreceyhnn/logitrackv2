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
  Divider,
  CardActionArea,
} from "@mui/material";
import { VehicleWithRelations } from "@/app/lib/type/vehicle";
import BuildIcon from "@mui/icons-material/Build";
import AddIcon from "@mui/icons-material/Add";
import { PriorityChip } from "../../../chips/priorityChips";
import { useState } from "react";
import ReportIssueDialog from "../reportIssueDialog";
import MaintenanceRecordDialog from "../maintenanceRecordDialog";
import IssueDetailDialog from "../issueDetailDialog";

interface MaintenanceTabProps {
  vehicle?: VehicleWithRelations;
  onUpdate?: () => void;
}

const MaintenanceTab = ({ vehicle, onUpdate }: MaintenanceTabProps) => {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [issueDetailOpen, setIssueDetailOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  if (!vehicle) {
    return <Typography color="text.secondary">No vehicle selected</Typography>;
  }

  const handleUpdate = () => {
    onUpdate?.();
  };

  const handleIssueClick = (issue: any) => {
    setSelectedIssue(issue);
    setIssueDetailOpen(true);
  };

  const maintenanceHistory = (vehicle.maintenanceRecords || []).slice(-4);
  const openIssues =
    vehicle.issues?.filter(
      (i) => i.status === "OPEN" || i.status === "IN_PROGRESS"
    ) || [];

  return (
    <Stack spacing={2} maxHeight={750}>
      <Stack spacing={2} direction={"row"} justifyContent={"space-between"}>
        <Card
          sx={{
            boxShadow: 3,
            p: 2,
            flex: 1,
            gap: 1,
            display: "flex",
            flexDirection: "column",
            borderRadius: "8px",
            justifyContent: "space-evenly",
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 300 }}>
              Next Service
            </Typography>
            <BuildIcon sx={{ fontSize: 18, color: "text.secondary" }} />
          </Stack>
          <Typography sx={{ fontSize: 24, fontWeight: 800 }}>
            {vehicle.nextServiceKm && vehicle.odometerKm
              ? `${(vehicle.nextServiceKm - vehicle.odometerKm).toLocaleString()} km`
              : "N/A"}
          </Typography>
          <Typography
            sx={{ fontSize: 14, fontWeight: 200, color: "text.secondary" }}
          >
            left until next scheduled service
          </Typography>
          <Divider sx={{ color: "text.disabled" }} />
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary" }}
            >
              ESTIMATED DATE
            </Typography>
            <Typography
              sx={{ fontSize: 14, fontWeight: 300, color: "info.main" }}
            >
              {vehicle.nextServiceKm ? "Calculated based on km" : "N/A"}
            </Typography>
          </Stack>
        </Card>
        <Card sx={{ boxShadow: 3, p: 2, flex: 2, borderRadius: "8px" }}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
              Open Issues
            </Typography>
            <Button
              variant="contained"
              sx={{ color: "#fff", boxShadow: 3 }}
              onClick={() => setReportDialogOpen(true)}
            >
              + Report Issue
            </Button>
          </Stack>
          <Stack maxHeight={190} overflow={"auto"} spacing={2} mt={2}>
            {openIssues.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                No open issues.
              </Typography>
            ) : (
              openIssues.map((i, index) => (
                <Card
                  key={index}
                  sx={{
                    borderRadius: "8px",
                    bgcolor: "background.dashboardBg",
                    overflow: "hidden",
                  }}
                >
                  <CardActionArea
                    onClick={() => handleIssueClick(i)}
                    sx={{ p: 2 }}
                  >
                    <Stack direction="row" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          height: 10,
                          width: 10,
                          borderRadius: "50%",
                          bgcolor: "error.main",
                        }}
                      />
                      <Stack flexGrow={1}>
                        <Typography sx={{ fontSize: 16, fontWeight: 400 }}>
                          {i.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 200,
                            color: "text.secondary",
                          }}
                        >
                          Reported on{" "}
                          {new Date(i.createdAt).toLocaleDateString()}
                        </Typography>
                      </Stack>
                      <PriorityChip status={i.priority} />
                    </Stack>
                  </CardActionArea>
                </Card>
              ))
            )}
          </Stack>
        </Card>
      </Stack>
      <Stack>
        <Card sx={{ boxShadow: 3, p: 2, flex: 1, borderRadius: "8px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
              Recent Maintenance
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setMaintenanceDialogOpen(true)}
            >
              Add Record
            </Button>
          </Stack>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="left">DATE</TableCell>
                <TableCell align="left">SERVICE TYPE</TableCell>
                <TableCell align="left">TECHNICIAN</TableCell>
                <TableCell align="left">COST</TableCell>
                <TableCell align="left">STATUS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {maintenanceHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No maintenance records found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                maintenanceHistory.map((v, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 12 }}>
                        {new Date(v.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography sx={{ fontSize: 12 }}>{v.type}</Typography>
                    </TableCell>
                    <TableCell align="left">
                      {v.description?.split(":")[1] || "N/A"}
                    </TableCell>
                    <TableCell align="left">{`$${v.cost}`}</TableCell>
                    <TableCell align="left">
                      <Box
                        sx={{
                          padding: "6px 1px",
                          borderRadius: "35px",
                          bgcolor: "success.main",
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}
                        >
                          COMPLETED
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </Stack>

      {/* Report Issue Dialog */}
      <ReportIssueDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        onSuccess={handleUpdate}
        vehicleId={vehicle.id}
        vehiclePlate={vehicle.plate}
      />

      {/* Maintenance Record Dialog */}
      <MaintenanceRecordDialog
        open={maintenanceDialogOpen}
        onClose={() => setMaintenanceDialogOpen(false)}
        onSuccess={handleUpdate}
        vehicleId={vehicle.id}
      />

      {/* Issue Detail Dialog */}
      <IssueDetailDialog
        open={issueDetailOpen}
        onClose={() => setIssueDetailOpen(false)}
        issue={selectedIssue}
        onUpdate={handleUpdate}
      />
    </Stack>
  );
};

export default MaintenanceTab;

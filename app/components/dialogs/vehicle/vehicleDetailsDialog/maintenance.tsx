import { Box, Button, Card, Stack, Typography, Table, TableBody, TableCell, TableHead, TableRow, Divider, CardActionArea, alpha } from "@mui/material";
import { Issue, MaintenanceRecord } from "@prisma/client";
import { VehicleWithRelations } from "@/app/lib/type/vehicle";
import AddIcon from "@mui/icons-material/Add";
import { PriorityChip } from "../../../chips/priorityChips";
import { useState } from "react";
import ReportIssueDialog from "../reportIssueDialog";
import MaintenanceRecordDialog from "../maintenanceRecordDialog";
import MaintenanceDetailDialog from "../maintenanceDetailDialog";
import IssueDetailDialog from "../issueDetailDialog";
import { updateVehicleStatus } from "@/app/lib/controllers/vehicle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PendingIcon from "@mui/icons-material/Pending";
import { VehicleStatus, IssueStatus } from "@prisma/client";
import { MenuItem, Select, FormControl } from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface MaintenanceTabProps {
  vehicle?: VehicleWithRelations;
  onUpdate?: () => void;
}

const MaintenanceTab = ({ vehicle, onUpdate }: MaintenanceTabProps) => {
  const dict = useDictionary();
  /* --------------------------------- states --------------------------------- */
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [maintenanceDetailOpen, setMaintenanceDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [issueDetailOpen, setIssueDetailOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null); 

  if (!vehicle) {
    return <Typography color="text.secondary">{dict.common.noData}</Typography>;
  }

  /* -------------------------------- handlers -------------------------------- */
  const handleUpdate = () => {
    onUpdate?.();
  };

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setIssueDetailOpen(true);
  };

  const handleVehicleStatusChange = async (newStatus: VehicleStatus) => {
    try {
      await updateVehicleStatus(vehicle.id, newStatus);
      handleUpdate();
    } catch (error) {
      console.error("Failed to update vehicle status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "#48BB78";
      case "IN_PROGRESS": return "#4299E1";
      case "SCHEDULED": return "#F6AD55";
      case "CANCELLED": return "#F56565";
      default: return "success.main";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED": return <CheckCircleIcon sx={{ fontSize: 14 }} />;
      case "IN_PROGRESS": return <PendingIcon sx={{ fontSize: 14 }} />;
      case "SCHEDULED": return <ErrorIcon sx={{ fontSize: 14 }} />;
      case "CANCELLED": return <CancelIcon sx={{ fontSize: 14 }} />;
      default: return null;
    }
  };

  /* -------------------------------- variables ------------------------------- */
  const maintenanceHistory = (vehicle.maintenanceRecords || []).slice(-4);
  const openIssues =
    vehicle.issues?.filter(
      (i) => i.status === IssueStatus.OPEN || i.status === IssueStatus.IN_PROGRESS
    ) || [];

  return (
    <Stack spacing={2} maxHeight={750}>
      <Stack spacing={2} direction={"row"} justifyContent={"space-between"}>
        <Card
          sx={{
            p: 2,
            flex: 1,
            gap: 1,
            display: "flex",
            flexDirection: "column",
            borderRadius: "8px",
            justifyContent: "space-evenly",
            bgcolor: alpha("#1A202C", 0.5),
            backgroundImage: "none",
            boxShadow: "none",
            border: `1px solid ${alpha("#ffffff", 0.05)}`,
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography
              sx={{ fontSize: 16, fontWeight: 300, color: "text.secondary" }}
            >
              {dict.vehicles.dialogs.vehicleStatus}
            </Typography>
            <Box sx={{ 
              width: 10, 
               height: 10, 
               borderRadius: "50%", 
               bgcolor: vehicle.status === VehicleStatus.AVAILABLE ? "success.main" : vehicle.status === VehicleStatus.MAINTENANCE ? "warning.main" : "info.main" 
             }} />
          </Stack>
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <Select
              value={vehicle.status}
              onChange={(e) => handleVehicleStatusChange(e.target.value as VehicleStatus)}
              sx={{
                color: "white",
                fontSize: "1.1rem",
                fontWeight: 700,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiSelect-select": { paddingLeft: 0 },
                "& .MuiSvgIcon-root": { color: alpha("#fff", 0.3) }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#1A202C",
                    backgroundImage: "none",
                    border: `1px solid ${alpha("#ffffff", 0.1)}`,
                  }
                }
              }}
            >
                <MenuItem value={VehicleStatus.AVAILABLE}>{dict.vehicles.statuses.AVAILABLE}</MenuItem>
                <MenuItem value={VehicleStatus.ON_TRIP}>{dict.vehicles.statuses.ON_TRIP}</MenuItem>
                <MenuItem value={VehicleStatus.MAINTENANCE}>{dict.vehicles.statuses.MAINTENANCE}</MenuItem>
            </Select>
          </FormControl>
          <Typography
            sx={{ fontSize: 12, fontWeight: 200, color: "text.secondary", mt: 0.5 }}
          >
            {dict.vehicles.dialogs.manageAvailability}
          </Typography>
          <Divider sx={{ mt: 1, color: "text.disabled" }} />
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mt={1}
          >
            <Typography
              sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary" }}
            >
              {dict.vehicles.fields.service}
            </Typography>
            <Typography
              sx={{ fontSize: 13, fontWeight: 300, color: "info.main" }}
            >
              {vehicle.nextServiceKm && vehicle.odometerKm
                ? `${(vehicle.nextServiceKm - vehicle.odometerKm).toLocaleString()} ${dict.vehicles.dialogs.kmLeft}`
                : dict.common.na}
            </Typography>
          </Stack>
        </Card>
        <Card
          sx={{
            p: 2,
            flex: 2,
            borderRadius: "8px",
            bgcolor: alpha("#1A202C", 0.5),
            backgroundImage: "none",
            boxShadow: "none",
            border: `1px solid ${alpha("#ffffff", 0.05)}`,
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 600, color: "white" }}>
              {dict.vehicles.dialogs.openIssues}
            </Typography>
            <Button
              variant="contained"
              sx={{
                color: "#fff",
                boxShadow: "none",
                bgcolor: "#246BFD",
                textTransform: "none",
                "&:hover": { bgcolor: alpha("#246BFD", 0.9) },
              }}
              onClick={() => setReportDialogOpen(true)}
            >
              + {dict.vehicles.dialogs.reportIssue}
            </Button>
          </Stack>
          <Stack maxHeight={190} overflow={"auto"} spacing={2} mt={2}>
            {openIssues.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                {dict.vehicles.dialogs.noOpenIssues}
              </Typography>
            ) : (
              openIssues.map((i, index) => (
                <Card
                  key={index}
                  sx={{
                    borderRadius: "8px",
                    bgcolor: alpha("#ffffff", 0.03),
                    overflow: "hidden",
                    backgroundImage: "none",
                    boxShadow: "none",
                  }}
                >
                  <CardActionArea
                    onClick={() => handleIssueClick(i)}
                    sx={{
                      p: 2,
                      "&:hover": { bgcolor: alpha("#ffffff", 0.05) },
                    }}
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
                        <Typography
                          sx={{ fontSize: 16, fontWeight: 400, color: "white" }}
                        >
                          {i.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 200,
                            color: "text.secondary",
                          }}
                        >
                          {dict.vehicles.dialogs.reportedOn}{" "}
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
      <Stack sx={{ flex: 1, minHeight: 0 }}>
        <Card
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            borderRadius: "8px",
            bgcolor: alpha("#1A202C", 0.5),
            backgroundImage: "none",
            boxShadow: "none",
            border: `1px solid ${alpha("#ffffff", 0.05)}`,
            maxHeight: 350,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 600, color: "white" }}>
              {dict.vehicles.dialogs.recentMaintenance}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setMaintenanceDialogOpen(true)}
            >
              {dict.vehicles.dialogs.addRecord}
            </Button>
          </Stack>
          <Box sx={{ overflowX: "auto", overflowY: "auto", flex: 1 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    sx={{
                      color: "text.secondary",
                      borderBottomColor: alpha("#ffffff", 0.05),
                      bgcolor: "#1A202C", // Match card bg for sticky header
                    }}
                  >
                    DATE
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: "text.secondary",
                      borderBottomColor: alpha("#ffffff", 0.05),
                      bgcolor: "#1A202C",
                    }}
                  >
                    SERVICE TYPE
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: "text.secondary",
                      borderBottomColor: alpha("#ffffff", 0.05),
                      bgcolor: "#1A202C",
                    }}
                  >
                    TECHNICIAN
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: "text.secondary",
                      borderBottomColor: alpha("#ffffff", 0.05),
                      bgcolor: "#1A202C",
                    }}
                  >
                    COST
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: "text.secondary",
                      borderBottomColor: alpha("#ffffff", 0.05),
                      bgcolor: "#1A202C",
                    }}
                  >
                    STATUS
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                  {maintenanceHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="text.secondary">
                          {dict.vehicles.dialogs.noMaintenanceFound}
                        </Typography>
                      </TableCell>
                    </TableRow>
                ) : (
                  maintenanceHistory.map((v, index) => (
                    <TableRow
                      key={index}
                      onClick={() => {
                        setSelectedRecord(v);
                        setMaintenanceDetailOpen(true);
                      }}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": {
                          bgcolor: alpha("#ffffff", 0.02),
                          cursor: "pointer",
                        },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell
                        align="left"
                        sx={{
                          color: "white",
                          borderBottomColor: alpha("#ffffff", 0.05),
                        }}
                      >
                        <Typography sx={{ fontSize: 12 }}>
                          {new Date(v.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          color: "white",
                          borderBottomColor: alpha("#ffffff", 0.05),
                        }}
                      >
                        <Typography sx={{ fontSize: 12 }}>{v.type}</Typography>
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          color: "white",
                          borderBottomColor: alpha("#ffffff", 0.05),
                        }}
                      >
                        {v.description?.split(":")[1] || dict.common.na}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          color: "white",
                          borderBottomColor: alpha("#ffffff", 0.05),
                        }}
                      >{`$${v.cost}`}</TableCell>
                      <TableCell
                        align="left"
                        sx={{ borderBottomColor: alpha("#ffffff", 0.05) }}
                      >
                        <Box
                          sx={{
                            padding: "4px 8px",
                            borderRadius: "12px",
                            bgcolor: alpha(getStatusColor(v.status || "COMPLETED"), 0.1),
                            border: `1px solid ${alpha(getStatusColor(v.status || "COMPLETED"), 0.2)}`,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Box sx={{ color: getStatusColor(v.status || "COMPLETED"), display: "flex" }}>
                            {getStatusIcon(v.status || "COMPLETED")}
                          </Box>
                          <Typography
                            sx={{ 
                              fontSize: 11, 
                              fontWeight: 700,
                              color: getStatusColor(v.status || "COMPLETED"),
                              textTransform: "uppercase"
                            }}
                          >
                            {dict.vehicles.statuses[v.status as keyof typeof dict.vehicles.statuses] || v.status || dict.vehicles.statuses.COMPLETED}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
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
      {/* Maintenance Detail Dialog */}
      <MaintenanceDetailDialog
        open={maintenanceDetailOpen}
        onClose={() => {
          setMaintenanceDetailOpen(false);
          setSelectedRecord(null);
        }}
        record={selectedRecord}
        onSuccess={handleUpdate}
      />
    </Stack>
  );
};

export default MaintenanceTab;

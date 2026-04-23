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
  useTheme,
} from "@mui/material";
import type { Issue, MaintenanceRecord } from "@/app/lib/type/enums";
import { VehicleStatus, IssueStatus } from "@/app/lib/type/enums";
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
import CancelIcon from "@mui/icons-material/Cancel";
import { getStatusMeta } from "@/app/lib/priorityColor";
import { MenuItem, Select, FormControl } from "@mui/material";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface MaintenanceTabProps {
  vehicle?: VehicleWithRelations;
  onUpdate?: () => void;
}

const MaintenanceTab = ({ vehicle, onUpdate }: MaintenanceTabProps) => {
  const theme = useTheme();
  const dict = useDictionary();
  /* --------------------------------- states --------------------------------- */
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [maintenanceDetailOpen, setMaintenanceDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<MaintenanceRecord | null>(null);
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

  const getStatusIcon = (status: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "COMPLETED":
        return <CheckCircleIcon sx={{ fontSize: 14 }} />;
      case "IN_PROGRESS":
        return (
          <PendingIcon 
            sx={{ 
              fontSize: 14,
              animation: "pulse 2s infinite ease-in-out",
              "@keyframes pulse": {
                "0%": { opacity: 1, transform: "scale(1)" },
                "50%": { opacity: 0.5, transform: "scale(1.2)" },
                "100%": { opacity: 1, transform: "scale(1)" },
              }
            }} 
          />
        );
      case "SCHEDULED":
      case "OPEN":
        return <ErrorIcon sx={{ fontSize: 14 }} />;
      case "CANCELLED":
        return <CancelIcon sx={{ fontSize: 14 }} />;
      default:
        return null;
    }
  };

  /* -------------------------------- variables ------------------------------- */
  const maintenanceHistory = (vehicle.maintenanceRecords || []).slice(-10);
  const openIssues =
    vehicle.issues?.filter(
      (i) =>
        i.status === IssueStatus.OPEN || i.status === IssueStatus.IN_PROGRESS
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
            bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
            backgroundImage: "none",
            boxShadow: "none",
            border: `1px solid ${theme.palette.divider}`,
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
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: getStatusMeta(vehicle.status, dict).color,
              }}
            />
          </Stack>
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <Select
              value={vehicle.status}
              onChange={(e) =>
                handleVehicleStatusChange(e.target.value as VehicleStatus)
              }
              sx={{
                color: "text.primary",
                fontSize: "1.1rem",
                fontWeight: 800,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiSelect-select": { paddingLeft: 0 },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundImage: "none",
                  },
                },
              }}
            >
              <MenuItem value={VehicleStatus.AVAILABLE}>
                {dict.vehicles.statuses.AVAILABLE}
              </MenuItem>
              <MenuItem value={VehicleStatus.ON_TRIP}>
                {dict.vehicles.statuses.ON_TRIP}
              </MenuItem>
              <MenuItem value={VehicleStatus.MAINTENANCE}>
                {dict.vehicles.statuses.MAINTENANCE}
              </MenuItem>
            </Select>
          </FormControl>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 200,
              color: "text.secondary",
              mt: 0.5,
            }}
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
            bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
            backgroundImage: "none",
            boxShadow: "none",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "text.primary" }}>
              {dict.vehicles.dialogs.openIssues}
            </Typography>
            <Button
              variant="contained"
              sx={{
                color: "#fff",
                boxShadow: "none",
                bgcolor: theme.palette.primary.main,
                textTransform: "none",
                "&:hover": { bgcolor: theme.palette.primary._alpha.main_90 },
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
                    bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.01)",
                    overflow: "hidden",
                    backgroundImage: "none",
                    boxShadow: "none",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardActionArea
                    onClick={() => handleIssueClick(i)}
                    sx={{
                      p: 2,
                      "&:hover": {
                        bgcolor: theme.palette.common.white_alpha.main_05,
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          height: 10,
                          width: 10,
                          borderRadius: "50%",
                          bgcolor: getStatusMeta(i.priority, dict).color,
                        }}
                      />
                      <Stack flexGrow={1}>
                        <Typography
                          sx={{ fontSize: 16, fontWeight: 700, color: "text.primary" }}
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
            bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
            backgroundImage: "none",
            boxShadow: "none",
            border: `1px solid ${theme.palette.divider}`,
            maxHeight: 350,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "text.primary" }}>
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
                      borderBottomColor: "divider",
                      bgcolor: "background.paper", // Match card bg for sticky header
                    }}
                  >
                    DATE
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: "text.secondary",
                      borderBottomColor: "divider",
                      bgcolor: "background.paper",
                    }}
                  >
                    SERVICE TYPE
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: "text.secondary",
                      borderBottomColor: "divider",
                      bgcolor: "background.paper",
                    }}
                  >
                    TECHNICIAN
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: "text.secondary",
                      borderBottomColor: "divider",
                      bgcolor: "background.paper",
                    }}
                  >
                    COST
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: "text.secondary",
                      borderBottomColor: "divider",
                      bgcolor: "background.paper",
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
                          bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                          cursor: "pointer",
                        },
                        transition: "all 0.2s",
                        opacity: (v.status === "COMPLETED" || v.status === "CANCELLED") ? 0.5 : 1,
                        filter: (v.status === "COMPLETED" || v.status === "CANCELLED") ? "grayscale(0.6)" : "none",
                      }}
                    >
                      <TableCell
                        align="left"
                        sx={{
                          color: "text.primary",
                          borderBottomColor: "divider",
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
                          color: "text.primary",
                          borderBottomColor: "divider",
                        }}
                      >
                        <Typography sx={{ fontSize: 12 }}>{v.type}</Typography>
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          color: "text.primary",
                          borderBottomColor: "divider",
                        }}
                      >
                        {v.description?.split(":")[1] || dict.common.na}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          color: "text.primary",
                          borderBottomColor: "divider",
                        }}
                      >{`$${v.cost}`}</TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          borderBottomColor: "divider",
                        }}
                      >
                        {(() => {
                          const statusMeta = getStatusMeta(
                            v.status || "COMPLETED",
                            dict
                          );
                          const paletteKey = statusMeta.paletteKey || "success";
                          return (
                            <Box
                              sx={{
                                padding: "4px 8px",
                                borderRadius: "12px",
                                bgcolor: `${paletteKey}._alpha.main_10`,
                                border: `1px solid ${paletteKey}._alpha.main_20`,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  color: `${paletteKey}.main`,
                                  display: "flex",
                                }}
                              >
                                {getStatusIcon(v.status || "COMPLETED")}
                              </Box>
                              <Typography
                                sx={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: `${paletteKey}.main`,
                                  textTransform: "uppercase",
                                }}
                              >
                                {statusMeta.label}
                              </Typography>
                            </Box>
                          );
                        })()}
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

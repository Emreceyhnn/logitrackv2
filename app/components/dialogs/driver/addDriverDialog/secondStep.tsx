"use client";

import {
  alpha,
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Typography,
  useTheme,
  Button,
  Switch,
} from "@mui/material";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import {
  AddDriverStep1,
  AddDriverStep2,
  EligibleUser,
} from "@/app/lib/type/driver";
import { getEligibleUsersForDriver } from "@/app/lib/controllers/driver";
import { getWarehouses } from "@/app/lib/controllers/warehouse";
import { getVehicles } from "@/app/lib/controllers/vehicle";
import { useUser } from "@/app/lib/hooks/useUser";

import WarehouseIcon from "@mui/icons-material/HomeRepairService";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BadgeIcon from "@mui/icons-material/Badge";

interface SecondDriverDialogStepProps {
  state: AddDriverStep2;
  updateStep2: (data: Partial<AddDriverStep2>) => void;
  step1Data: AddDriverStep1;
  setStep: (step: number) => void;
}

const SecondDriverDialogStep = ({
  state,
  updateStep2,
  step1Data,
  setStep,
}: SecondDriverDialogStepProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const { user } = useUser();

  /* --------------------------------- states --------------------------------- */
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [users, setUsers] = useState<EligibleUser[]>([]);

  /* ------------------------------- lifecycles ------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [wData, vData, uData] = await Promise.all([
          getWarehouses(),
          getVehicles({ status: ["AVAILABLE", "IDLE"] }),
          getEligibleUsersForDriver(),
        ]);
        setWarehouses(wData);
        setVehicles(vData);
        setUsers(uData);
      } catch (error) {
        console.error("Failed to fetch Step 2 data:", error);
      }
    };
    fetchData();
  }, [user]);

  /* -------------------------------- handlers -------------------------------- */
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocs = Array.from(e.target.files).map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: "OTHER",
        expiryDate: null,
        file: file,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        uploadedAt: new Date().toLocaleDateString(),
      }));
      updateStep2({
        documents: [...state.documents, ...newDocs],
      });
    }
  };

  const removeDoc = (id: string) => {
    updateStep2({
      documents: state.documents.filter((doc) => doc.id !== id),
    });
  };

  const selectedUser = users.find((u) => u.id === step1Data.userId);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 7.5 }}>
        <Stack spacing={4}>
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  display: "flex",
                }}
              >
                <WarehouseIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} color="white">
                Operational Assignment
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, display: "block", fontWeight: 500 }}
                >
                  Home Base Warehouse
                </Typography>
                <CustomTextArea
                  name="homeWareHouseId"
                  placeholder="Select warehouse"
                  value={state.homeWareHouseId}
                  onChange={(e) =>
                    updateStep2({ homeWareHouseId: e.target.value })
                  }
                  select
                >
                  {warehouses.map((w) => (
                    <MenuItem key={w.id} value={w.id}>
                      {w.name}
                    </MenuItem>
                  ))}
                </CustomTextArea>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, display: "block", fontWeight: 500 }}
                >
                  Current Vehicle Assignment
                </Typography>
                <CustomTextArea
                  name="currentVehicleId"
                  placeholder="No vehicle assigned (Floating)"
                  value={state.currentVehicleId}
                  onChange={(e) =>
                    updateStep2({ currentVehicleId: e.target.value })
                  }
                  select
                >
                  <MenuItem value="">No vehicle assigned (Floating)</MenuItem>
                  {vehicles.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                      {v.plate} ({v.brand} {v.model})
                    </MenuItem>
                  ))}
                </CustomTextArea>
              </Grid>
            </Grid>
          </Stack>

          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  display: "flex",
                }}
              >
                <FlashOnIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} color="white">
                Driver Configuration
              </Typography>
            </Stack>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block", fontWeight: 500 }}
            >
              Initial Operational Status
            </Typography>

            <Stack direction="row" spacing={2}>
              {[
                {
                  id: "OFF_DUTY",
                  label: "Off Duty",
                  icon: <PowerSettingsNewIcon />,
                },
                { id: "ON_JOB", label: "On Duty", icon: <FlashOnIcon /> },
              ].map((status) => (
                <Box
                  key={status.id}
                  onClick={() => updateStep2({ status: status.id })}
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 3,
                    border: `1px solid ${
                      state.status === status.id
                        ? theme.palette.primary.main
                        : alpha(theme.palette.divider, 0.1)
                    }`,
                    bgcolor:
                      state.status === status.id
                        ? alpha(theme.palette.primary.main, 0.05)
                        : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Box
                    sx={{
                      color:
                        state.status === status.id
                          ? theme.palette.primary.main
                          : "text.secondary",
                    }}
                  >
                    {status.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={
                      state.status === status.id ? "white" : "text.secondary"
                    }
                  >
                    {status.label}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                display: "flex",
                gap: 2,
              }}
            >
              <InfoOutlinedIcon
                fontSize="small"
                sx={{ color: theme.palette.primary.main, mt: 0.3 }}
              />
              <Typography variant="caption" color="text.secondary">
                By setting the status to <strong>Off Duty</strong>, the driver
                will not receive new route assignments until they manually check
                in via the mobile app.
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                variant="body2"
                fontWeight={500}
                color="text.secondary"
              >
                Hazmat Certified
              </Typography>
              <Switch
                checked={state.hazmatCertified}
                onChange={(e) =>
                  updateStep2({ hazmatCertified: e.target.checked })
                }
                color="primary"
              />
            </Stack>

            <Stack spacing={1}>
              <Typography
                variant="body2"
                fontWeight={500}
                color="text.secondary"
              >
                Language Proficiency (comma separated)
              </Typography>
              <CustomTextArea
                name="languages"
                placeholder="e.g. EN, ES"
                value={state.languages.join(", ")}
                onChange={(e) =>
                  updateStep2({
                    languages: e.target.value
                      .split(",")
                      .map((lang) => lang.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Stack>
          </Stack>

          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  display: "flex",
                }}
              >
                <CloudUploadIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} color="white">
                Documents & Certification
              </Typography>
            </Stack>

            <Box
              component="label"
              sx={{
                p: 3,
                borderRadius: 3,
                border: `2px dashed ${alpha(theme.palette.divider, 0.2)}`,
                bgcolor: alpha(theme.palette.background.paper, 0.3),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              <input type="file" hidden multiple onChange={handleFileUpload} />
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "50%",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                <CloudUploadIcon />
              </Box>
              <Typography variant="body2" fontWeight={600} color="white">
                Add medical records, training certificates, or other docs
              </Typography>
              <Typography variant="caption" color="text.secondary">
                PNG, JPG (MAX 10MB)
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              {state.documents.map((doc) => (
                <Stack
                  key={doc.id}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha("#1A202C", 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      display: "flex",
                    }}
                  >
                    <InsertDriveFileIcon fontSize="small" />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="white"
                      noWrap
                    >
                      {doc.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {doc.size} • Added {doc.uploadedAt}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => removeDoc(doc.id)}
                    sx={{ color: "text.secondary" }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, md: 4.5 }}>
        <Card
          sx={{
            p: 3,
            bgcolor: "#0F172A",
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            position: "sticky",
            top: 0,
          }}
        >
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle2" fontWeight={700} color="white">
                PROFILE SUMMARY
              </Typography>
              <Button
                size="small"
                onClick={() => setStep(1)}
                sx={{ opacity: 0.7, textTransform: "none" }}
              >
                Edit Info
              </Button>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  fontWeight: 800,
                }}
              >
                {selectedUser
                  ? `${selectedUser.name[0]}${selectedUser.surname[0]}`
                  : "??"}
              </Box>
              <Stack spacing={0.5}>
                <Typography variant="body1" fontWeight={700} color="white">
                  {selectedUser
                    ? `${selectedUser.name} ${selectedUser.surname}`
                    : "No user selected"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {step1Data.licenseType || "No license class set"}
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.05) }} />

            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <LocalShippingIcon
                  fontSize="small"
                  sx={{ color: "text.secondary", mt: 0.3 }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body2" color="white">
                    {step1Data.phone || "Not provided"}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2}>
                <InsertDriveFileIcon
                  fontSize="small"
                  sx={{ color: "text.secondary", mt: 0.3 }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body2" color="white" noWrap>
                    {selectedUser?.email || "No email info"}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2}>
                <BadgeIcon
                  fontSize="small"
                  sx={{ color: "text.secondary", mt: 0.3 }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    License Detail
                  </Typography>
                  <Typography variant="body2" color="white">
                    LIC: {step1Data.licenseNo || "N/A"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    EXP:{" "}
                    {step1Data.licenseExpiry
                      ? new Date(step1Data.licenseExpiry).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.05) }} />

            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  Language Proficiency
                </Typography>
                <Typography variant="caption" color="white" fontWeight={600}>
                  {state.languages.length > 0
                    ? state.languages.join(", ")
                    : "None"}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  Hazmat Certified
                </Typography>
                <Typography
                  variant="caption"
                  color={
                    state.hazmatCertified ? "success.main" : "text.secondary"
                  }
                  fontWeight={600}
                >
                  {state.hazmatCertified ? "YES" : "NO"}
                </Typography>
              </Stack>
            </Stack>

            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.info.main, 0.05),
                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600, display: "block", mb: 0.5 }}
              >
                Next Steps
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ lineHeight: 1.4, display: "block" }}
              >
                Upon saving, {selectedUser?.name || "the driver"} will receive
                an invitation email with login credentials for the FleetManager
                Mobile app.
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SecondDriverDialogStep;

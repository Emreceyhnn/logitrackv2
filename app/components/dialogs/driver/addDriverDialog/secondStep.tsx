"use client";

import {
  
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
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState, ChangeEvent } from "react";
import { useFormikContext } from "formik";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import {
  AddDriverDocument,
  DriverFormValues,
  EligibleUser,
} from "@/app/lib/type/driver";
import { getWarehouses } from "@/app/lib/controllers/warehouse";
import { getVehicles } from "@/app/lib/controllers/vehicle";
import { useUser } from "@/app/lib/hooks/useUser";
import { Warehouse, DriverStatus } from "@prisma/client";
import { VehicleStatus } from "@/app/lib/type/enums";
import { VehicleWithRelations } from "@/app/lib/type/vehicle";

import WarehouseIcon from "@mui/icons-material/HomeRepairService";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BadgeIcon from "@mui/icons-material/Badge";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface SecondDriverDialogStepProps {
  setStep: (step: number) => void;
  eligibleUsers: EligibleUser[];
}

const SecondDriverDialogStep = ({
  setStep,
  eligibleUsers,
}: SecondDriverDialogStepProps) => {
  /* -------------------------------- variables ------------------------------- */
  const dict = useDictionary();
  const theme = useTheme();
  const { user } = useUser();
  const { values, errors, touched, setFieldValue, handleBlur, handleChange } = 
    useFormikContext<DriverFormValues>();

  /* --------------------------------- states --------------------------------- */
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [vehicles, setVehicles] = useState<VehicleWithRelations[]>([]);

  /* ------------------------------- lifecycles ------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [wData, vData] = await Promise.all([
          getWarehouses(),
          getVehicles({ status: [VehicleStatus.AVAILABLE] }),
        ]);
        setWarehouses(wData);
        setVehicles(vData);
      } catch (error) {
        console.error("Failed to fetch Step 2 data:", error);
      }
    };
    fetchData();
  }, [user]);

  /* -------------------------------- handlers -------------------------------- */
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocs: AddDriverDocument[] = Array.from(e.target.files).map((file: File) => {
        const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
        return {
          id: crypto.randomUUID(),
          name: file.name,
          type: "OTHER",
          expiryDate: null,
          file: file,
          previewUrl,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          uploadedAt: new Date().toLocaleDateString(),
        };
      });
      setFieldValue("documents", [...values.documents, ...newDocs]);
    }
  };

  const updateDocExpiry = (id: string, date: Dayjs | null) => {
    const updatedDocs = values.documents.map((doc) =>
      doc.id === id ? { ...doc, expiryDate: date ? date.toDate() : null } : doc
    );
    setFieldValue("documents", updatedDocs);
  };

  const removeDoc = (id: string) => {
    const docToRemove = values.documents.find(d => d.id === id);
    if (docToRemove?.previewUrl) {
      URL.revokeObjectURL(docToRemove.previewUrl);
    }
    setFieldValue("documents", values.documents.filter((doc) => doc.id !== id));
  };

  const selectedUser = eligibleUsers.find((u) => u.id === values.userId);

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
                  bgcolor: theme.palette.primary._alpha.main_10,
                  color: theme.palette.primary.main,
                  display: "flex",
                }}
              >
                <WarehouseIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} color="white">
                {dict.drivers.labels.operationalAssignment}
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, display: "block", fontWeight: 500 }}
                >
                  {dict.drivers.fields.homeWarehouse}
                </Typography>
                <CustomTextArea
                  name="homeWareHouseId"
                  placeholder={dict.drivers.fields.homeWarehouse}
                  value={values.homeWareHouseId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.homeWareHouseId && Boolean(errors.homeWareHouseId)}
                  helperText={touched.homeWareHouseId ? (errors.homeWareHouseId as string) : undefined}
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
                  {dict.drivers.labels.vehicleAssignment}
                </Typography>
                <CustomTextArea
                  name="currentVehicleId"
                  placeholder={dict.common.noData}
                  value={values.currentVehicleId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.currentVehicleId && Boolean(errors.currentVehicleId)}
                  helperText={touched.currentVehicleId ? (errors.currentVehicleId as string) : undefined}
                  select
                >
                  <MenuItem value="">{dict.common.noData}</MenuItem>
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
                  bgcolor: theme.palette.primary._alpha.main_10,
                  color: theme.palette.primary.main,
                  display: "flex",
                }}
              >
                <FlashOnIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} color="white">
                {dict.common.settings}
              </Typography>
            </Stack>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block", fontWeight: 500 }}
            >
              {dict.drivers.labels.initialStatus}
            </Typography>

            <Stack direction="row" spacing={2}>
              {[
                {
                  id: "OFF_DUTY",
                  label: dict.drivers.offDuty,
                  icon: <PowerSettingsNewIcon />,
                },
                { id: "ON_JOB", label: dict.drivers.onDuty, icon: <FlashOnIcon /> },
              ].map((status) => (
                <Box
                  key={status.id}
                  onClick={() => setFieldValue("status", status.id as DriverStatus)}
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 3,
                    border: `1px solid ${
                      values.status === status.id
                        ? theme.palette.primary.main
                        : theme.palette.divider_alpha.main_10
                    }`,
                    bgcolor:
                      values.status === status.id
                        ? theme.palette.primary._alpha.main_05
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
                        values.status === status.id
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
                      values.status === status.id ? "white" : "text.secondary"
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
                bgcolor: theme.palette.primary._alpha.main_05,
                display: "flex",
                gap: 2,
              }}
            >
              <InfoOutlinedIcon
                fontSize="small"
                sx={{ color: theme.palette.primary.main, mt: 0.3 }}
              />
              <Typography variant="caption" color="text.secondary">
                {dict.drivers.labels.reviewAssignment}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                variant="body2"
                fontWeight={500}
                color="text.secondary"
              >
                {dict.drivers.fields.hazmat}
              </Typography>
              <Switch
                checked={values.hazmatCertified}
                onChange={(e) =>
                  setFieldValue("hazmatCertified", e.target.checked)
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
                {dict.drivers.fields.languageProficiency}
              </Typography>
              <CustomTextArea
                name="languages"
                placeholder="e.g. EN, TR"
                value={values.languages.join(", ")}
                onChange={(e) =>
                  setFieldValue("languages", 
                    e.target.value
                      .split(",")
                      .map((lang) => lang.trim())
                      .filter(Boolean)
                  )
                }
                onBlur={handleBlur}
              />
            </Stack>
          </Stack>

          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 1,
                  bgcolor: theme.palette.primary._alpha.main_10,
                  color: theme.palette.primary.main,
                  display: "flex",
                }}
              >
                <CloudUploadIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} color="white">
                {dict.drivers.fields.additionalDocs}
              </Typography>
            </Stack>

            <Box
              component="label"
              sx={{
                p: 3,
                borderRadius: 3,
                border: `2px dashed ${theme.palette.divider_alpha.main_20}`,
                bgcolor: theme.palette.background.paper_alpha.main_30,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: theme.palette.primary._alpha.main_50,
                  bgcolor: theme.palette.primary._alpha.main_05,
                },
              }}
            >
              <input type="file" hidden multiple onChange={handleFileUpload} />
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "50%",
                  bgcolor: theme.palette.primary._alpha.main_10,
                  color: theme.palette.primary.main,
                }}
              >
                <CloudUploadIcon />
              </Box>
              <Typography variant="body2" fontWeight={600} color="white">
                {dict.landing.hero.discover}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                PNG, JPG (MAX 10MB)
              </Typography>
            </Box>

            <Stack spacing={1.5}>
                {values.documents.map((doc) => (
                  <Stack
                    key={doc.id}
                    spacing={1.5}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: theme.palette.text.darkBlue._alpha.main_50,
                      border: `1px solid ${theme.palette.divider_alpha.main_10}`,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1,
                          bgcolor: theme.palette.primary._alpha.main_10,
                          color: theme.palette.primary.main,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        {doc.previewUrl ? (
                          <Box
                            component="img"
                            src={doc.previewUrl}
                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <InsertDriveFileIcon fontSize="small" />
                        )}
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
                          {doc.size}
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
                    
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 1, display: "block", fontWeight: 500 }}
                      >
                        {dict.common.date}
                      </Typography>
                      <DatePicker
                        value={doc.expiryDate ? dayjs(doc.expiryDate) : null}
                        onChange={(newValue) => updateDocExpiry(doc.id, newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            placeholder: dict.common.noData,
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: theme.palette.background.paper_alpha.main_10,
                                borderRadius: 1.5,
                                fontSize: "0.8rem",
                                "& fieldset": { borderColor: theme.palette.divider_alpha.main_10 },
                                "&:hover fieldset": { borderColor: theme.palette.primary._alpha.main_20 },
                              },
                              "& .MuiOutlinedInput-input": { color: "white" },
                              "& .MuiIconButton-root": { color: theme.palette.common.white_alpha.main_50 }
                            }
                          }
                        }}
                      />
                    </Box>
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
            border: `1px solid ${theme.palette.divider_alpha.main_10}`,
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
                {dict.drivers.labels.profileSummary}
              </Typography>
              <Button
                size="small"
                onClick={() => setStep(1)}
                sx={{ opacity: 0.7, textTransform: "none" }}
              >
                {dict.common.edit}
              </Button>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: theme.palette.primary._alpha.main_10,
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
                    : dict.common.noData}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {values.licenseType || dict.common.noData}
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ borderColor: theme.palette.divider_alpha.main_05 }} />

            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <LocalShippingIcon
                  fontSize="small"
                  sx={{ color: "text.secondary", mt: 0.3 }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {dict.drivers.fields.phoneNumber}
                  </Typography>
                  <Typography variant="body2" color="white">
                    {values.phone || dict.common.noData}
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
                    {dict.auth.email}
                  </Typography>
                  <Typography variant="body2" color="white" noWrap>
                    {selectedUser?.email || dict.common.noData}
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
                    {dict.drivers.fields.licenseNumber}
                  </Typography>
                  <Typography variant="body2" color="white">
                    {dict.drivers.fields.licenseNumber}: {values.licenseNumber || dict.common.na}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dict.drivers.fields.licenseExpiry}:{" "}
                    {values.licenseExpiry
                      ? new Date(values.licenseExpiry).toLocaleDateString()
                      : dict.drivers.labels.noExpiry}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            <Divider sx={{ borderColor: theme.palette.divider_alpha.main_05 }} />

            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  {dict.drivers.fields.languageProficiency}
                </Typography>
                <Typography variant="caption" color="white" fontWeight={600}>
                  {values.languages.length > 0
                    ? values.languages.join(", ")
                    : dict.common.noData}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  {dict.drivers.fields.hazmat}
                </Typography>
                <Typography
                  variant="caption"
                  color={
                    values.hazmatCertified ? "success.main" : "text.secondary"
                  }
                  fontWeight={600}
                >
                  {values.hazmatCertified ? dict.common.success : dict.common.noData}
                </Typography>
              </Stack>
            </Stack>

            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: theme.palette.info._alpha.main_05,
                border: `1px solid ${theme.palette.info._alpha.main_10}`,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600, display: "block", mb: 0.5 }}
              >
                {dict.drivers.labels.information}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ lineHeight: 1.4, display: "block" }}
              >
                {dict.drivers.labels.verificationDesc}
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SecondDriverDialogStep;

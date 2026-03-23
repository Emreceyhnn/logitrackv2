import {
  alpha,
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import CustomTextArea from "@/app/components/inputs/customTextArea";
import BadgeIcon from "@mui/icons-material/Badge";
import CategoryIcon from "@mui/icons-material/Category";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { EditDriverPageActions, EditDriverStep1 } from "@/app/lib/type/driver";
import { useRef, ChangeEvent } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

interface FirstEditDriverDialogStepProps {
  state: EditDriverStep1;
  actions: EditDriverPageActions;
}

const FirstEditDriverDialogStep = ({
  state,
  actions,
}: FirstEditDriverDialogStepProps) => {
  /* -------------------------------- variables ------------------------------- */
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -------------------------------- handlers -------------------------------- */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      actions.updateStep1({ licencePhoto: e.target.files[0] });
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.updateStep1({ licencePhoto: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Box>
      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography
                variant="body2"
                fontWeight={500}
                color="text.secondary"
              >
                Employee ID (Optional)
              </Typography>
              <CustomTextArea
                name="employeeId"
                placeholder="Leave blank to auto-generate (e.g. EMP-1234)"
                value={state.employeeId}
                onChange={(e) =>
                  actions.updateStep1({ employeeId: e.target.value })
                }
              >
                <BadgeOutlinedIcon fontSize="small" />
              </CustomTextArea>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography
                variant="body2"
                fontWeight={500}
                color="text.secondary"
              >
                Phone Number
              </Typography>
              <CustomTextArea
                name="phone"
                placeholder="e.g. +1 555 123 4567"
                value={state.phone}
                onChange={(e) => actions.updateStep1({ phone: e.target.value })}
              >
                <PhoneIcon fontSize="small" />
              </CustomTextArea>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography
                variant="body2"
                fontWeight={500}
                color="text.secondary"
              >
                License Number
              </Typography>
              <CustomTextArea
                name="licenseNo"
                placeholder="e.g. DL-485920394"
                value={state.licenseNo}
                onChange={(e) =>
                  actions.updateStep1({ licenseNo: e.target.value })
                }
              >
                <BadgeIcon fontSize="small" />
              </CustomTextArea>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography
                variant="body2"
                fontWeight={500}
                color="text.secondary"
              >
                License Class / Type
              </Typography>
              <CustomTextArea
                name="licenseType"
                placeholder="Select class"
                value={state.licenseType}
                onChange={(e) =>
                  actions.updateStep1({ licenseType: e.target.value })
                }
              >
                <CategoryIcon fontSize="small" />
              </CustomTextArea>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <Stack spacing={1.5}>
              <Typography
                variant="body2"
                fontWeight={500}
                color="text.secondary"
              >
                Expiration Date
              </Typography>
              <DatePicker
                value={state.licenseExpiry ? dayjs(state.licenseExpiry) : null}
                onChange={(val) =>
                  actions.updateStep1({
                    licenseExpiry: val ? val.toDate() : null,
                  })
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    placeholder: "Select Date",
                  },
                }}
              />
            </Stack>
          </Grid>
        </Grid>

        <Stack spacing={1.5}>
          <Typography variant="body2" fontWeight={500} color="text.secondary">
            Physical License Scan
          </Typography>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
          />
          <Box
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = theme.palette.primary.main;
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = alpha(
                theme.palette.divider,
                0.2
              );
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = alpha(
                theme.palette.divider,
                0.2
              );
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                actions.updateStep1({ licencePhoto: e.dataTransfer.files[0] });
              }
            }}
            sx={{
              height: 160,
              border: `2px dashed ${alpha(theme.palette.divider, 0.2)}`,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.3),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: alpha(theme.palette.primary.main, 0.5),
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            {!state.licencePhoto ? (
              <>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <CloudUploadIcon color="primary" />
                </Box>
                <Typography variant="body2" fontWeight={600} color="white">
                  Click to upload new license scan or drag and drop
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  PNG, JPG OR HEIC (MAX 10MB)
                </Typography>
              </>
            ) : (
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  p: 2,
                  width: "80%",
                  bgcolor: alpha("#1A202C", 0.5),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    display: "flex",
                  }}
                >
                  <InsertDriveFileIcon />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="white"
                    noWrap
                  >
                    {state.licencePhoto.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(state.licencePhoto.size / (1024 * 1024)).toFixed(2)} MB
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={removeFile}
                  sx={{ color: "text.secondary" }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
            )}
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="flex-start"
          sx={{ pt: 1 }}
        >
          <InfoOutlinedIcon
            sx={{ fontSize: 18, color: theme.palette.primary.main, mt: 0.2 }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ lineHeight: 1.5 }}
          >
            Please ensure all text and the driver&apos;s photo are clearly visible.
            Compliance checks are automated.
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FirstEditDriverDialogStep;

import { Box, Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CustomDialogParams {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  maxWidthData?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

const CustomDialog = (params: CustomDialogParams) => {
  const { open, onClose, children, maxWidthData = "xs" } = params;

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      maxWidth={maxWidthData}
      PaperProps={{
        sx: {
          borderRadius: "8px",
          position: "relative",
          // p: 3,
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 5, right: 5 }}
      >
        <CloseIcon sx={{ fontSize: 24, color: "rgba(255,255,255,0.5)" }} />
      </IconButton>
      <Box>{children}</Box>
    </Dialog>
  );
};

export default CustomDialog;

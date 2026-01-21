"use client";

import CustomDialog from "@/app/components/dialogs/customDialog";
import CustomToast from "@/app/components/toast";
import { Box, Button, Stack } from "@mui/material";
import { useState } from "react";

export default function Playground() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      This is playground page
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        dakmsmdads
      </Button>
      <Stack>
        {/* <CustomDialog open={open} onClose={handleClose}>
          <Stack>askdjans</Stack>
        </CustomDialog> */}
        <CustomToast
          open={open}
          onClose={handleClose}
          type="info"
          message="İşlem başarılı"
        />
      </Stack>
    </Box>
  );
}

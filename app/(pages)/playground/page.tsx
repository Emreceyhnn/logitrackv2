"use client";

import CreateCompanyDialog from "@/app/components/dialogs/company/CreateCompanyDialog";
import { Box } from "@mui/material";

export default function Playground() {
  return (
    <Box>
      <CreateCompanyDialog open={true} onClose={() => {}} />
    </Box>
  );
}

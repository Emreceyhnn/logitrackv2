"use client";

import { Box, Card, Stack, Typography, Button, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import WarningIcon from "@mui/icons-material/Warning";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { formatDisplayDate } from "@/app/lib/utils/date";

import { Dictionary } from "@/app/lib/language/language";

interface ExtendedPalette {
  primary?: {
    _alpha?: Record<string, string>;
  };
}

interface DocumentStatsCardsProps {
  dict: Dictionary;
  dateSettings: { dateFormat: string; timeFormat: string };
  activeCount: number;
  expiringSoonCount: number;
  missingOrExpiredCount: number;
  lastUploadDate: Date;
  onUploadClick: () => void;
}

export default function DocumentStatsCards({ dict, dateSettings, activeCount, expiringSoonCount, missingOrExpiredCount, lastUploadDate, onUploadClick }: DocumentStatsCardsProps) {
  const theme = useTheme();
  const paletteTheme = theme.palette as unknown as ExtendedPalette;

  const cardStyle = { p: 2, borderRadius: "8px", width: "100%", gap: 2, bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", backgroundImage: "none", boxShadow: "none", border: `1px solid ${theme.palette.divider}` };
  const iconBoxStyle = { borderRadius: "8px", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "white" };

  return (
    <Stack spacing={2} sx={{ flexGrow: 1 }}>
      <Stack spacing={2} direction={"row"}>
        <Card sx={cardStyle}>
          <Box sx={{ ...iconBoxStyle, bgcolor: "success.main" }}>
            <CheckCircleIcon sx={{ width: 18, height: 19 }} />
          </Box>
          <Typography sx={{ fontSize: 22, color: "text.secondary" }}>{dict.common.active}</Typography>
          <Typography sx={{ fontSize: 18, marginTop: "auto", color: "text.primary", fontWeight: 800 }}>{activeCount}</Typography>
        </Card>
        <Card sx={cardStyle}>
          <Box sx={{ ...iconBoxStyle, bgcolor: "warning.main" }}>
            <QueryBuilderIcon sx={{ width: 18, height: 19 }} />
          </Box>
          <Typography sx={{ fontSize: 22, color: "text.secondary" }}>{dict.common.expiring}</Typography>
          <Typography sx={{ fontSize: 18, marginTop: "auto", color: "text.primary", fontWeight: 800 }}>{expiringSoonCount}</Typography>
        </Card>
      </Stack>
      <Stack spacing={2} direction={"row"}>
        <Card sx={cardStyle}>
          <Box sx={{ ...iconBoxStyle, bgcolor: "error.main" }}>
            <WarningIcon sx={{ width: 18, height: 19 }} />
          </Box>
          <Typography sx={{ fontSize: 22, color: "text.secondary" }}>{dict.common.missing}</Typography>
          <Typography sx={{ fontSize: 18, marginTop: "auto", color: "text.primary", fontWeight: 800 }}>{missingOrExpiredCount}</Typography>
        </Card>
        <Card sx={cardStyle}>
          <Box sx={{ ...iconBoxStyle, bgcolor: "info.main" }}>
            <FileUploadIcon sx={{ width: 18, height: 19 }} />
          </Box>
          <Typography sx={{ fontSize: 22, color: "text.secondary" }}>{dict.common.upload}</Typography>
          <Typography sx={{ fontSize: 18, marginTop: "auto", color: "text.primary", fontWeight: 800 }}>
            {lastUploadDate.getTime() > 0 ? formatDisplayDate(lastUploadDate.toISOString(), dateSettings) : dict.common.na}
          </Typography>
        </Card>
      </Stack>
      <Button variant="contained" sx={{ borderRadius: "8px", bgcolor: "#246BFD", textTransform: "none", "&:hover": { bgcolor: paletteTheme.primary?._alpha?.main_90 } }} onClick={onUploadClick} startIcon={<FileUploadIcon />}>
        {dict.common.uploadNew}
      </Button>
    </Stack>
  );
}

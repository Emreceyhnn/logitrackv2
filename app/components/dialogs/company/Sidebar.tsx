"use client";

import { Box, Stack, Typography, alpha, useTheme } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import LanguageIcon from "@mui/icons-material/Language";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

interface SidebarProps {
  activeStep: number;
}

export default function Sidebar({ activeStep }: SidebarProps) {
  const theme = useTheme();
  const dict = useDictionary();

  const steps = [
    {
      id: 0,
      label: dict.company.dialogs.steps.branding,
      subtitle: dict.company.branding.title,
      icon: <BusinessIcon />,
    },
    {
      id: 1,
      label: dict.company.dialogs.steps.regional,
      subtitle: dict.company.dialogs.regionalTitle,
      icon: <LanguageIcon />,
    },
  ];

  return (
    <Box
      sx={{
        width: 280,
        bgcolor: alpha(theme.palette.background.paper, 0.5),
        borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        p: 4,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
      }}
    >
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="caption"
          sx={{
            color: "primary.main",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {dict.company.sidebar.currentStep}
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "text.primary", fontWeight: 800 }}
        >
          {dict.company.sidebar.stepProgress
            .replace("{current}", (activeStep + 1).toString())
            .replace("{total}", steps.length.toString())}
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: 4,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            mt: 2,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${((activeStep + 1) / steps.length) * 100}%`,
              height: "100%",
              bgcolor: "primary.main",
              transition: "width 0.4s ease-in-out",
            }}
          />
        </Box>
      </Box>

      <Stack spacing={3}>
        {steps.map((step) => {
          const isActive = step.id === activeStep;
          const isCompleted = step.id < activeStep;

          return (
            <Stack
              key={step.id}
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: isActive
                  ? alpha(theme.palette.primary.main, 0.05)
                  : "transparent",
                border: `1px solid ${isActive ? alpha(theme.palette.primary.main, 0.2) : "transparent"}`,
                transition: "all 0.2s ease",
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: isActive
                    ? "primary.main"
                    : alpha(theme.palette.text.secondary, 0.1),
                  color: isActive ? "white" : "text.secondary",
                }}
              >
                {isCompleted ? (
                  <CheckCircleIcon sx={{ fontSize: 20 }} />
                ) : (
                  step.icon
                )}
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: isActive ? "text.primary" : "text.secondary",
                  }}
                >
                  {step.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", opacity: 0.7 }}
                >
                  {step.subtitle}
                </Typography>
              </Box>
            </Stack>
          );
        })}
      </Stack>

      <Box sx={{ mt: "auto" }}>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mb: 1 }}
        >
          {dict.company.sidebar.loggedInAs}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: "grey.800",
            }}
          />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Emre Ceyhun
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {dict.company.sidebar.primaryAdmin}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

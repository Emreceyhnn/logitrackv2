import { Stack, Box, Typography, useTheme } from "@mui/material";
import { Ico } from "@/app/components/warehouse-worker/Ico";
import type { DriverConsoleState } from "@/app/hooks/useDriverConsoleState";
import { DUTY_ORDER } from "@/app/lib/utils/driverConsoleUi";
import LanguageSwitcher from "../nav/LanguageSwitcher";
import UserAccountNav from "../nav/UserAccountNav";

const DUTY_COLORS: Record<string, { fg: string; bg: string; dot: string }> = {
  ON_JOB: { fg: "#0B0F19", bg: "#34D399", dot: "#34D399" },
  OFF_DUTY: { fg: "#fff", bg: "rgba(255,255,255,0.14)", dot: "#94a3b8" },
  ON_LEAVE: { fg: "#0B0F19", bg: "#f59e0b", dot: "#f59e0b" },
};

export default function DCHeader({ state }: { state: DriverConsoleState }) {
  const theme = useTheme();
  const { dc, driver, licenseWarning, licenseDaysLeft, requestDutyChange } = state;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        height: 78,
        bgcolor: theme.palette.background.sidebar,
        borderBottom: `1px solid ${theme.palette.divider}`,
        px: 3,
        flexShrink: 0,
        gap: 2,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0, flex: 1 }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: 3,
            bgcolor: "rgba(2,132,199,0.12)",
            color: "#0284c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Ico d="M3 21h18M4 21V9l8-4 8 4v12M9 21v-6h6v6" size={24} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography noWrap sx={{ fontSize: 19, fontWeight: 700 }}>
              {driver?.name ?? "—"}
            </Typography>
            {driver?.homeBaseWarehouse && (
              <Box
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  bgcolor: `${theme.palette.primary.main}1f`,
                  px: 1,
                  py: 0.5,
                  borderRadius: 2,
                }}
              >
                {driver.homeBaseWarehouse.code}
              </Box>
            )}
            {licenseWarning && (
              <Box
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#f59e0b",
                  bgcolor: "rgba(245,158,11,0.14)",
                  px: 1,
                  py: 0.5,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Ico d="M12 3 2 20h20L12 3zM12 10v4M12 17h.01" size={12} />
                {dc.dashboard.licenseExpiringSoon.replace("{days}", String(licenseDaysLeft))}
              </Box>
            )}
          </Stack>
          <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary }} noWrap>
            {driver?.homeBaseWarehouse
              ? `${driver.homeBaseWarehouse.name} · ${driver.homeBaseWarehouse.city}`
              : dc.noDriverProfile}
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        spacing={0.75}
        sx={{ bgcolor: "rgba(255,255,255,0.04)", p: 0.5, borderRadius: 3, flexShrink: 0 }}
      >
        {DUTY_ORDER.map((k) => {
          const active = driver?.status === k;
          const colors = DUTY_COLORS[k];
          return (
            <Box
              key={k}
              component="button"
              type="button"
              onClick={() => void requestDutyChange(k)}
              sx={{
                px: 1.75,
                py: 1,
                borderRadius: 2.25,
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                border: "none",
                font: "inherit",
                color: active ? colors?.fg : "rgba(255,255,255,0.55)",
                bgcolor: active ? colors?.bg : "transparent",
                transition: "background-color .15s, color .15s",
              }}
            >
              {dc.duty[k]}
            </Box>
          );
        })}
      </Stack>

      {/* Profile & Language */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 1, flexShrink: 0 }}>
        <LanguageSwitcher />
        <UserAccountNav user={null} />
      </Stack>
    </Stack>
  );
}

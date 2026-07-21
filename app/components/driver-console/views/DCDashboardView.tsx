import { Box, Stack, Typography, Card, Avatar, Button, useTheme } from "@mui/material";
import { Ico } from "@/app/components/warehouse-worker/Ico";
import { formatDuration } from "@/app/lib/utils/driverConsoleUi";
import type { DriverConsoleState } from "@/app/hooks/useDriverConsoleState";

const DUTY_DOT: Record<string, string> = {
  ON_JOB: "#34D399",
  OFF_DUTY: "#94a3b8",
  ON_LEAVE: "#f59e0b",
};

export default function DCDashboardView({ state }: { state: DriverConsoleState }) {
  const theme = useTheme();
  const { dc, driver, activeRoute, kpis, requestDutyChange, markStopArrived, setView } = state;

  const renderKpi = (label: string, color: string, icon: string, value: string, sub: string) => (
    <Card
      sx={{
        flex: 1,
        minWidth: 180,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        p: 2.5,
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg,${color},transparent)`,
        }}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="overline" sx={{ color: theme.palette.text.secondary, fontWeight: 800 }}>
          {label}
        </Typography>
        <Avatar sx={{ bgcolor: `${color}1f`, color, width: 38, height: 38, borderRadius: 2 }}>
          <Ico d={icon} size={19} />
        </Avatar>
      </Stack>
      <Typography sx={{ fontSize: 32, fontWeight: 900, mt: 1.25 }}>{value}</Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", mt: 1.25 }}>
        {sub}
      </Typography>
    </Card>
  );

  return (
    <Stack spacing={2.5}>
      <Card
        sx={{
          borderRadius: 4,
          p: 3,
          background: "linear-gradient(120deg,rgba(56,189,248,0.14),rgba(99,102,241,0.1))",
          border: "1px solid rgba(56,189,248,0.25)",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "center" },
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{ fontWeight: 800, letterSpacing: 0.4, color: "rgba(255,255,255,0.55)" }}
          >
            {dc.dashboard.dutyStatus}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mt: 0.5 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: driver ? DUTY_DOT[driver.status] : "#94a3b8",
              }}
            />
            <Typography sx={{ fontSize: 26, fontWeight: 900 }}>
              {driver ? dc.duty[driver.status] : "—"}
            </Typography>
          </Stack>
        </Box>
        <Stack direction="row" spacing={1.25}>
          {(["ON_JOB", "OFF_DUTY", "ON_LEAVE"] as const).map((k) => {
            const active = driver?.status === k;
            return (
              <Button
                key={k}
                onClick={() => void requestDutyChange(k)}
                sx={{
                  px: 2.75,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 800,
                  textTransform: "none",
                  color: active ? "#0B0F19" : "rgba(255,255,255,0.7)",
                  bgcolor: active
                    ? k === "ON_JOB"
                      ? "#34D399"
                      : k === "ON_LEAVE"
                        ? "#f59e0b"
                        : "rgba(255,255,255,0.14)"
                    : "rgba(255,255,255,0.05)",
                  border: `1px solid ${active ? "transparent" : "rgba(255,255,255,0.14)"}`,
                }}
              >
                {dc.duty[k]}
              </Button>
            );
          })}
        </Stack>
      </Card>

      {activeRoute ? (
        <>
          <Card
            sx={{
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRadius: 3,
              p: 2.5,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { sm: "center" },
              justifyContent: "space-between",
              gap: 3,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography
                variant="overline"
                sx={{ fontWeight: 800, color: theme.palette.text.secondary }}
              >
                {dc.dashboard.todaysActiveRoute}
              </Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 800, mt: 0.75 }}>
                {activeRoute.distanceKm?.toFixed(1) ?? "—"} km · {formatDuration(activeRoute.durationMin)}
              </Typography>
              <Typography sx={{ fontSize: 13, color: theme.palette.text.secondary, mt: 0.5 }}>
                {activeRoute.remainingStopsCount} {dc.dashboard.stopsRemaining}
                {activeRoute.startTime &&
                  ` · ${dc.dashboard.departure} ${new Date(activeRoute.startTime).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`}
              </Typography>
            </Box>
            <Button
              onClick={() => setView("route")}
              sx={{
                px: 2.5,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 800,
                textTransform: "none",
                color: theme.palette.primary.main,
                bgcolor: "rgba(56,189,248,0.1)",
                border: "1px solid rgba(56,189,248,0.3)",
                whiteSpace: "nowrap",
              }}
            >
              {dc.dashboard.viewRoute}
            </Button>
          </Card>

          <Stack direction="row" spacing={2.5} flexWrap="wrap" useFlexGap>
            {renderKpi(
              dc.dashboard.safetyScore,
              theme.palette.kpi.emerald,
              "M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z",
              kpis.safetyScore != null ? String(kpis.safetyScore) : "—",
              dc.dashboard.safetyScoreSub
            )}
            {renderKpi(
              dc.dashboard.efficiencyScore,
              theme.palette.kpi.amber,
              "M3 17l6-6 4 4 8-8M15 7h6v6",
              kpis.efficiencyScore != null ? String(kpis.efficiencyScore) : "—",
              dc.dashboard.efficiencyScoreSub
            )}
            {renderKpi(
              dc.dashboard.rating,
              theme.palette.primary.main,
              "M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7-5.4-4.7 7.1-.6z",
              kpis.rating != null ? kpis.rating.toFixed(1) : "—",
              dc.dashboard.ratingSub
            )}
          </Stack>

          {activeRoute.nextStop && (
            <Card sx={{ bgcolor: theme.palette.background.paper, borderRadius: 3, p: 2.5 }}>
              <Typography
                variant="overline"
                sx={{ fontWeight: 800, color: theme.palette.text.secondary, mb: 1.5, display: "block" }}
              >
                {dc.dashboard.nextStop}
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                flexWrap="wrap"
              >
                <Stack direction="row" alignItems="center" spacing={1.75} sx={{ minWidth: 0 }}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(56,189,248,0.12)",
                      color: theme.palette.primary.main,
                      fontWeight: 900,
                      width: 44,
                      height: 44,
                    }}
                  >
                    {activeRoute.nextStop.sequence}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 700 }} noWrap>
                      {activeRoute.nextStop.address}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  onClick={() => markStopArrived(activeRoute.nextStop!.id, true)}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 800,
                    textTransform: "none",
                    color: "#0B0F19",
                    bgcolor: theme.palette.primary.main,
                    whiteSpace: "nowrap",
                  }}
                >
                  {dc.dashboard.arrived}
                </Button>
              </Stack>
            </Card>
          )}
        </>
      ) : (
        <Card
          sx={{
            bgcolor: theme.palette.background.paper,
            borderRadius: 3,
            p: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 1.75,
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              bgcolor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            <Ico d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11zM12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" size={28} />
          </Avatar>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: theme.palette.text.secondary }}>
            {dc.dashboard.noRouteToday}
          </Typography>
          <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.4)", maxWidth: 360 }}>
            {dc.dashboard.noRouteTodaySub}
          </Typography>
          <Button
            onClick={() => void requestDutyChange("OFF_DUTY")}
            sx={{
              mt: 0.5,
              px: 2.75,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 800,
              textTransform: "none",
              color: "rgba(255,255,255,0.7)",
              bgcolor: "rgba(255,255,255,0.06)",
            }}
          >
            {dc.dashboard.goOffDuty}
          </Button>
        </Card>
      )}
    </Stack>
  );
}

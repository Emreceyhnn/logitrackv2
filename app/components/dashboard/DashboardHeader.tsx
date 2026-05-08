import { Box, Stack, Typography, useTheme } from "@mui/material";
import UserAccountNav from "../nav/UserAccountNav";
import NotificationBell from "../notifications/NotificationBell";
import { useDictionary } from "@/app/lib/language/DictionaryContext";
import { AuthenticatedUser } from "@/app/lib/auth-middleware";

export default function DashboardHeader({
  user,
}: {
  user: AuthenticatedUser | null;
}) {
  const dict = useDictionary();

  return (
    <Box
      component="header"
      sx={{
        px: 4,
        py: 2.6,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: (theme) => theme.palette.background.paper_alpha.main_50,
        backdropFilter: "blur(12px) saturate(150%)",
        borderBottom: "1px solid",
        borderColor: "divider",
        position: "sticky",
        top: 0,
        zIndex: 999,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        {/* Placeholder for Breadcrumbs or Page Title if needed */}
        <Typography
          variant="subtitle2"
          fontWeight={800}
          sx={{
            color: "primary.main",
            bgcolor: (theme) => theme.palette.primary._alpha.main_10,
            px: 1.5,
            py: 0.5,
            borderRadius: 1.5,
            letterSpacing: 1,
            fontSize: "0.7rem",
            textTransform: "uppercase",
          }}
        >
          {dict.dashboard.header.internalConsole}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <NotificationBell user={user} />
        <UserAccountNav user={user} />
      </Stack>
    </Box>
  );
}

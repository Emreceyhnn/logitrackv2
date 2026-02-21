import { Avatar, Button, Stack, Typography } from "@mui/material";
import CustomCard from "./card";
import { DriverWithRelations } from "@/app/lib/type/driver";
import CustomRating from "../rating";
import ChatIcon from "@mui/icons-material/Chat";

const DriverCard = (params: DriverWithRelations | null) => {
  return (
    <CustomCard>
      <Stack spacing={2} p={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={params?.user.avatarUrl || undefined}
            sx={{ width: 54, height: 54 }}
          />
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                {params?.user.name} {params?.user.surname}
              </Typography>
              <CustomRating value={params?.rating || 0} />
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: "rgba(255,255,255,1)",
                  bgcolor: "info.main",
                  px: 1,
                  borderRadius: "3px",
                }}
              >
                {params?.employeeId || "N/A"}
              </Typography>
              {params?.licenseType && (
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 400,
                    color: "text.secondary",
                  }}
                >
                  License: {params.licenseType}
                </Typography>
              )}
            </Stack>
            <Typography
              sx={{ fontSize: 12, fontWeight: 400, color: "text.secondary" }}
            >
              Vehicle: {params?.currentVehicle?.plate || "No Vehicle"}
            </Typography>
          </Stack>
        </Stack>
        <Button
          variant="contained"
          sx={{
            gap: 1,
            alignItems: "center",
            display: "flex",
            textTransform: "none",
          }}
          fullWidth
        >
          <ChatIcon sx={{ width: 18, height: 18 }} />
          Contact Driver
        </Button>
      </Stack>
    </CustomCard>
  );
};

export default DriverCard;

import { Avatar, Button, Stack, Typography } from "@mui/material";
import CustomCard from "./card";
import { DriverWithRelations } from "@/app/lib/type/driver";
import CustomRating from "../rating";
import ChatIcon from "@mui/icons-material/Chat";
import { useDictionary } from "@/app/lib/language/DictionaryContext";

const DriverCard = (params: DriverWithRelations | null) => {
  const dict = useDictionary();

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
                {params?.employeeId || dict.common.na}
              </Typography>
              {params?.licenseType && (
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 400,
                    color: "text.secondary",
                  }}
                >
                  {dict.drivers.card.license.replace(
                    "{type}",
                    params.licenseType
                  )}
                </Typography>
              )}
            </Stack>
            <Typography
              sx={{ fontSize: 12, fontWeight: 400, color: "text.secondary" }}
            >
              {dict.drivers.card.vehicle.replace(
                "{plate}",
                params?.currentVehicle?.plate || dict.drivers.card.noVehicle
              )}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </CustomCard>
  );
};

export default DriverCard;

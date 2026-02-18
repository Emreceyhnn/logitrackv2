import { DriverWithRelations } from "@/app/lib/type/driver";
import { Stack, Typography, Card, Button, Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import StarIcon from "@mui/icons-material/Star";

interface OverviewTabProps {
  driver?: DriverWithRelations;
}

const OverviewTab = ({ driver }: OverviewTabProps) => {
  if (!driver) {
    return <Typography color="text.secondary">No driver selected</Typography>;
  }

  return (
    <Stack
      spacing={2}
      maxHeight={450}
      height={"100%"}
      justifyContent={"space-between"}
    >
      <Stack spacing={2} direction={"row"}>
        <Card
          sx={{
            p: 2,
            gap: 1,
            display: "flex",
            alignItems: "start",
            flexDirection: "column",
            borderRadius: "8px",
            flexGrow: 1,
          }}
        >
          <Typography sx={{ fontSize: 16 }}>Rating</Typography>
          <Typography sx={{ fontSize: 20 }}>
            {driver.rating != null ? driver.rating : "-"} / 5
          </Typography>
          <StarIcon
            sx={{ fontSize: 24, marginTop: "auto", color: "warning.main" }}
          />
        </Card>
        <Card
          sx={{
            p: 2,
            gap: 1,
            display: "flex",
            alignItems: "start",
            flexDirection: "column",
            borderRadius: "8px",
            flexGrow: 1,
          }}
        >
          <Typography sx={{ fontSize: 16 }}>Efficiency Score</Typography>
          <Typography sx={{ fontSize: 20 }}>
            {driver.efficiencyScore != null
              ? `${driver.efficiencyScore}%`
              : "-"}
          </Typography>
          <AccessTimeIcon sx={{ fontSize: 24, marginTop: "auto" }} />
        </Card>
        <Card
          sx={{
            p: 2,
            gap: 1,
            display: "flex",
            alignItems: "start",
            flexDirection: "column",
            borderRadius: "8px",
            flexGrow: 1,
          }}
        >
          <Typography sx={{ fontSize: 16 }}>Safety Score</Typography>
          <Typography sx={{ fontSize: 20 }}>
            {driver.safetyScore != null ? `${driver.safetyScore}%` : "-"}
          </Typography>
          <MedicalServicesIcon sx={{ fontSize: 24, marginTop: "auto" }} />
        </Card>
      </Stack>

      <Stack spacing={2} direction={"row"}>
        {/* Placeholder for future compliance data */}
        <Card
          sx={{
            p: 2,
            gap: 1,
            display: "flex",
            alignItems: "start",
            flexDirection: "column",
            borderRadius: "8px",
            flexGrow: 1,
          }}
        >
          <Typography sx={{ fontSize: 16 }}>License Expiry</Typography>
          <Typography sx={{ fontSize: 20 }}>
            {driver.licenseExpiry
              ? new Date(driver.licenseExpiry).toLocaleDateString()
              : "N/A"}
          </Typography>
        </Card>
        <Card
          sx={{
            p: 2,
            gap: 1,
            display: "flex",
            alignItems: "start",
            flexDirection: "column",
            borderRadius: "8px",
            flexGrow: 1,
          }}
        >
          <Typography sx={{ fontSize: 16 }}>Status</Typography>
          <Typography
            sx={{
              fontSize: 20,
              color:
                driver.status === "ON_JOB" ? "success.main" : "text.secondary",
            }}
          >
            {driver.status.replace("_", " ")}
          </Typography>
        </Card>
      </Stack>

      <Stack spacing={2}>
        {/* Placeholder actions */}
        {/* <Button variant="contained" sx={{ borderRadius: "8px" }}>
          Contact Driver
        </Button>
        <Button variant="outlined" sx={{ borderRadius: "8px" }}>
          View Full History
        </Button> */}
      </Stack>
    </Stack>
  );
};

export default OverviewTab;

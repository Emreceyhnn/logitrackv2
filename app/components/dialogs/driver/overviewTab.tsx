import { Driver } from "@/app/lib/type/DriverType";
import {
    Stack, Typography, Card, Button, Box
} from "@mui/material";


import BadgeIcon from '@mui/icons-material/Badge';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import StarIcon from '@mui/icons-material/Star';


interface OverviewTabProps {
    driver?: Driver;
}

const OverviewTab = ({ driver }: OverviewTabProps) => {
    if (!driver) {
        return <Typography color="text.secondary">No driver selected</Typography>;
    }

    return (
        <Stack spacing={2} maxHeight={450} height={"100%"} justifyContent={"space-between"}>

            <Stack spacing={2} direction={"row"}>
                <Card sx={{ p: 2, gap: 1, display: "flex", alignItems: "start", flexDirection: "column", borderRadius: "8px", flexGrow: 1 }}>
                    <Typography sx={{ fontSize: 16 }}>Rating</Typography>
                    <Typography sx={{ fontSize: 20 }}>{driver.rating.avg} / 5</Typography>
                    <StarIcon sx={{ fontSize: 24, marginTop: "auto", color: "warning.main" }} />
                </Card>
                <Card sx={{ p: 2, gap: 1, display: "flex", alignItems: "start", flexDirection: "column", borderRadius: "8px", flexGrow: 1 }}>
                    <Typography sx={{ fontSize: 16 }}>Working Hours (Today)</Typography>
                    <Typography sx={{ fontSize: 20 }}>{Math.floor(driver.compliance.workingHours.todayMinutes / 60)}h {driver.compliance.workingHours.todayMinutes % 60}m</Typography>
                    <AccessTimeIcon sx={{ fontSize: 24, marginTop: "auto" }} />
                </Card>
                <Card sx={{ p: 2, gap: 1, display: "flex", alignItems: "start", flexDirection: "column", borderRadius: "8px", flexGrow: 1 }}>
                    <Typography sx={{ fontSize: 16 }}>Working Hours (Week)</Typography>
                    <Typography sx={{ fontSize: 20 }}>{Math.floor(driver.compliance.workingHours.weekMinutes / 60)}h {driver.compliance.workingHours.weekMinutes % 60}m</Typography>
                    <AccessTimeIcon sx={{ fontSize: 24, marginTop: "auto" }} />
                </Card>
            </Stack>

            <Stack spacing={2} direction={"row"}>
                <Card sx={{ p: 2, gap: 1, display: "flex", alignItems: "start", flexDirection: "column", borderRadius: "8px", flexGrow: 1 }}>
                    <Typography sx={{ fontSize: 16 }}>Last Medical Check</Typography>
                    <Typography sx={{ fontSize: 20 }}>{driver.compliance.lastMedicalCheck}</Typography>
                    <MedicalServicesIcon sx={{ fontSize: 24, marginTop: "auto" }} />
                </Card>
                <Card sx={{ p: 2, gap: 1, display: "flex", alignItems: "start", flexDirection: "column", borderRadius: "8px", flexGrow: 1 }}>
                    <Typography sx={{ fontSize: 16 }}>Rest Requirement</Typography>
                    <Typography sx={{ fontSize: 20, color: driver.compliance.restRequirement.met ? "success.main" : "error.main" }}>
                        {driver.compliance.restRequirement.met ? "Met" : "Not Met"}
                    </Typography>
                    <Typography sx={{ fontSize: 12 }}>Min Rest: {driver.compliance.restRequirement.minRestMinutes / 60}h</Typography>
                </Card>
            </Stack>


            <Stack spacing={2}>
                <Button variant="contained" sx={{ borderRadius: "8px" }}>Contact Driver</Button>
                <Button variant="outlined" sx={{ borderRadius: "8px" }}>View Full History</Button>
            </Stack>

        </Stack>
    );
};

export default OverviewTab;
